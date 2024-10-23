import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'

export async function hashPassword(password) {
  return await hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword)
}

export function createToken(payload) {
  return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export function verifyToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth header missing or incorrect:', authHeader)
    throw new Error('Invalid token')
  }
  const token = authHeader.split(' ')[1]
  console.log('Token:', token)
  try {
    const decoded = verify(token, process.env.JWT_SECRET)
    console.log('Token decodificado:', decoded)
    return decoded
  } catch (error) {
    console.error('Error verificando el token:', error)
    throw new Error('Invalid token')
  }
}
