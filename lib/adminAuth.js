import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function getAdminFromRequest(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  return verifyAdminToken(token)
}

