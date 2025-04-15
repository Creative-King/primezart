import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ message: 'No token provided' })

  try {
    const token = authorization.split(' ')[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const { title, message } = req.body

    if (!title || !message) return res.status(400).json({ message: 'All fields required' })

    await prisma.formSubmission.create({
      data: {
        userId: decoded.userId,
        title,
        message
      }
    })

    res.status(201).json({ message: 'Form submitted successfully' })
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}