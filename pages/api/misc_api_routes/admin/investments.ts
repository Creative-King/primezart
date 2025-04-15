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

    const admin = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'Not authorized' })

    const investments = await prisma.investment.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { startDate: 'desc' }
    })

    res.status(200).json(investments)
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}