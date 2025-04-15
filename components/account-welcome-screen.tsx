"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, CreditCard, DollarSign, BarChart3, Briefcase, Users, Shield, Clock, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccountWelcomeScreenProps {
  accountType: string
  accountName: string
  accountNumber: string
  balance: number
  currency: string
  onComplete: () => void
}

export default function AccountWelcomeScreen({
  accountType,
  accountName,
  accountNumber,
  balance,
  currency,
  onComplete,
}: AccountWelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for exit animation to complete
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  }

  const getAccountIcon = () => {
    switch (accountType) {
      case "checking":
        return <CreditCard className="h-16 w-16 text-white" />
      case "savings":
        return <DollarSign className="h-16 w-16 text-white" />
      case "investment":
        return <BarChart3 className="h-16 w-16 text-white" />
      case "business":
        return <Briefcase className="h-16 w-16 text-white" />
      case "joint":
        return <Users className="h-16 w-16 text-white" />
      case "trust":
        return <Shield className="h-16 w-16 text-white" />
      case "retirement":
        return <Clock className="h-16 w-16 text-white" />
      case "offshore":
        return <Landmark className="h-16 w-16 text-white" />
      default:
        return <CreditCard className="h-16 w-16 text-white" />
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#001a33] to-[#003366]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="rounded-full bg-[#00366680] p-6">{getAccountIcon()}</div>
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Welcome to Your {accountName}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-gray-300 mb-8"
        >
          Account Number: {accountNumber}
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-3xl font-bold text-[#fbbf24] mb-10"
        >
          {formatCurrency(balance)}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            onClick={onComplete}
            className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#003366] font-bold px-6 py-2 rounded-lg text-lg"
          >
            Continue to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
