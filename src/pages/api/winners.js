import clientPromise from '../../lib/mongodb'
import { verifyToken } from '../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  //const token = req.headers.authorization?.split(' ')[1]

  //if (!token) {
    //return res.status(401).json({ message: 'Not authenticated' })
  //}

  try {
    //verifyToken(token)
    const client = await clientPromise
    const db = client.db('myFirstDatabase')

    if (req.method === 'GET') {
      const winners = await db.collection('winners').find().toArray()
      return res.status(200).json(winners)
    }

    if (req.method === 'POST') {
      const { username, prize, promotionCode } = req.body
      const newWinner = {
        username,
        prize,
        promotionCode,
      }
      await db.collection('winners').insertOne(newWinner)
      return res.status(201).json({ message: 'Winner added successfully' })
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}