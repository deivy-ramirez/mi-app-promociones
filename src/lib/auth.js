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
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      reject(new Error('No Authorization header'));
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      reject(new Error('No token provided'));
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        reject(new Error('Invalid token'));
        return;
      }
      resolve(decoded);
    });
  });
}