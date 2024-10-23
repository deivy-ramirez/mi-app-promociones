import clientPromise from '../../../lib/mongodb'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, password, dateOfBirth, email, city } = req.body

  const client = await clientPromise
  const db = client.db('myFirstDatabase')

  const existingUser = await db.collection('users').findOne({ username })

  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' })
  }

  const hashedPassword = await hashPassword(password)

  const newUser = {
    username,
    password: hashedPassword,
    dateOfBirth: new Date(dateOfBirth),
    email,
    city,
  }

  await db.collection('users').insertOne(newUser)

  res.status(201).json({ message: 'User created successfully' })
}