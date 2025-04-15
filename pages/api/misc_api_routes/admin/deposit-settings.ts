import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export default async function handler(req, res) {
  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ message: 'No token' })

  try {
    const token = authorization.split(' ')[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

    if (req.method === 'GET') {
      const settings = await prisma.depositSettings.findMany()
      return res.status(200).json(settings)
    }

    if (req.method === 'POST') {
      const { type, label, address, barcodeUrl } = req.body

      const newSetting = await prisma.depositSettings.create({
        data: {
          type,
          label,
          address,
          barcodeUrl
        }
      })

      return res.status(201).json(newSetting)
    }

    if (req.method === 'PUT') {
      const { id, ...data } = req.body
      const updated = await prisma.depositSettings.update({
        where: { id },
        data
      })

      return res.status(200).json(updated)
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}