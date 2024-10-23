import clientPromise from '../../lib/mongodb'
import { verifyToken } from '../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    verifyToken(token)
    const client = await clientPromise
    const db = client.db('myFirstDatabase')

    if (req.method === 'GET') {
      const promotions = await db.collection('promotions').find().toArray()
      return res.status(200).json(promotions)
    }

    if (req.method === 'POST') {
      const { name, description, prize, promotionCode } = req.body
      const newPromotion = {
        name,
        description,
        prize,
        promotionCode,
      }
      await db.collection('promotions').insertOne(newPromotion)
      return res.status(201).json({ message: 'Promotion created successfully' })
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}