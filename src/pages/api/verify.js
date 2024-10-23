import { connectToDatabase } from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyToken } from '../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  //const token = req.headers.authorization?.split(' ')[1]

  //if (!token) {
    //return res.status(401).json({ message: 'Not authenticated' })
  //}

  try {
    //const user = await verifyToken(req)
    //verifyToken(token)
    const { promotionId, code } = req.body

    const { db } = await connectToDatabase()
    const promotion = await db.collection('promotions').findOne({ _id: new ObjectId(promotionId) })

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' })
    }

    const isWinner = await db.collection('wincode').findOne({ promotionId, code })

    if (isWinner) {
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
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}