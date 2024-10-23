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

export function verifyToken(token) {
  try {
    return verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}