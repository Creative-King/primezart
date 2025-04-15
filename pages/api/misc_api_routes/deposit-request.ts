import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ message: 'No token' })

  try {
    const token = authorization.split(' ')[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)

    const { amount, method } = req.body
    const parsedAmount = parseFloat(amount)

    if (!method || isNaN(parsedAmount)) return res.status(400).json({ message: 'Invalid input' })

    await prisma.notification.create({
      data: {
        title: 'Deposit Request',
        message: `User requested to deposit $${parsedAmount} via ${method}`,
        type: 'deposit'
      }
    })

    res.status(200).json({ message: 'Deposit request sent' })
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}