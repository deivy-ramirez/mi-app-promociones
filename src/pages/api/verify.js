import { connectToDatabase } from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyToken } from '../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const user = await verifyToken(req)
  if (!user) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const { promotionId, code } = req.body

  try {
    const { db } = await connectToDatabase('myFirstDatabase')
    const promotion = await db.collection('promotions').findOne({ _id: new ObjectId(promotionId) })

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' })
    }

    // Aquí debes implementar la lógica para verificar si el código es ganador
    // Este es un ejemplo simple, deberías adaptarlo a tu lógica de negocio
    const isWinner = await db.collection('wincode').findOne({ promotionId, code })

    if (isWinner) {
      // Registra al ganador
      await db.collection('winners').insertOne({
        userId: user._id,
        username: user.username,
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
    console.error('Error verifying code:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}