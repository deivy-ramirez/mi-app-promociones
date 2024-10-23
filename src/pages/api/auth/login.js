import { connectToDatabase } from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  // Permitir solicitudes POST y OPTIONS (para CORS)
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  // Manejar solicitudes OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  const { promotionId, code } = req.body

  if (!promotionId || !code) {
    return res.status(400).json({ message: 'Se requieren promotionId y code' })
  }

  try {
    const { db } = await connectToDatabase()
    const promotion = await db.collection('promotions').findOne({ _id: new ObjectId(promotionId) })

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' })
    }

    const isWinner = await db.collection('wincode').findOne({ promotionId, code })

    if (isWinner) {
      await db.collection('winners').insertOne({
        promotionId,
        promotionName: promotion.name,
        prize: promotion.prize,
        code,
        date: new Date()
      })

      res.status(200).json({ isWinner: true, message: '¡Felicidades! Has ganado el premio.' })
    } else {
      res.status(200).json({ isWinner: false, message: 'Lo siento, este código no es ganador. ¡Inténtalo de nuevo!' })
    }
  } catch (error) {
    console.error('Error in verify API:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}