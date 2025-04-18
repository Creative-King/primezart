import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

interface DecodedToken {
  role: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ message: 'No token' })

  try {
    const token = authorization.split(' ')[1]
    const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

    const users = await prisma.user.findMany()
    res.status(200).json({ users })
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}