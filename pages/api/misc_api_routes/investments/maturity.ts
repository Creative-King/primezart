import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {
    const now = new Date()

    const investments = await prisma.investment.findMany({
      where: { status: 'active' }
    })

    const matured = investments.filter(inv => {
      const endDate = new Date(inv.startDate)
      endDate.setDate(endDate.getDate() + inv.duration)
      return now >= endDate
    })

    for (const inv of matured) {
      await prisma.investment.update({
        where: { id: inv.id },
        data: { status: 'completed' }
      })

      await prisma.user.update({
        where: { id: inv.userId },
        data: {
          balance: {
            increment: inv.amount * 1.2
          }
        }
      })
    }

    res.status(200).json({ message: `${matured.length} investments matured` })
  } catch (err) {
    res.status(500).json({ message: 'Error updating investments' })
  }
}