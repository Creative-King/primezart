import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export default async function handler(req, res) {
  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ error: 'No token' })

  try {
    const token = authorization.split(' ')[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)

    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { fullName: true, location: true }
      })
      return res.status(200).json(user)
    }

    if (req.method === 'POST') {
      const { fullName, location } = req.body
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { fullName, location }
      })
      return res.status(200).json({ message: 'Profile updated' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}