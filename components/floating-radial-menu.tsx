"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  HomeIcon,
  Activity,
  CreditCard,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  RefreshCw,
  Upload,
  Download,
  Wallet,
  FileText,
  BarChart2,
  Users,
  Shield,
  Target,
  Calculator,
  ArrowUpRight,
  Percent,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type FloatingRadialMenuProps = {
  type?: "crypto" | "trust" | "business" | "personal" | "savings"
}

export default function FloatingRadialMenu({ type = "personal" }: FloatingRadialMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Close the menu when a navigation action is performed
  const handleNavigate = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  const handleLogout = () => {
    setIsOpen(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn")
    }
    router.push("/login")
  }

  // Define menu items based on account type
  const menuItems = (() => {
    switch (type) {
      case "crypto":
        return [
          {
            icon: <HomeIcon className="h-5 w-5" />,
            label: "Dashboard",
            action: () => handleNavigate("/dashboard/crypto"),
          },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Transactions",
            action: () => handleNavigate("/dashboard/transactions"),
          },
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Buy Crypto",
            action: () => handleNavigate("/dashboard/crypto/buy"),
          },
          {
            icon: <Upload className="h-5 w-5" />,
            label: "Send",
            action: () => handleNavigate("/dashboard/crypto/send"),
          },
          {
            icon: <RefreshCw className="h-5 w-5" />,
            label: "Swap",
            action: () => handleNavigate("/dashboard/crypto/swap"),
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Receive",
            action: () => handleNavigate("/dashboard/crypto/receive"),
          },
          {
            icon: <Wallet className="h-5 w-5" />,
            label: "Wallet",
            action: () => handleNavigate("/dashboard/crypto/wallet"),
          },
          {
            icon: <Settings className="h-5 w-5" />,
            label: "Settings",
            action: () => handleNavigate("/dashboard/settings"),
          },
          { icon: <LogOut className="h-5 w-5" />, label: "Logout", action: handleLogout },
        ]
      case "trust":
        return [
          {
            icon: <HomeIcon className="h-5 w-5" />,
            label: "Dashboard",
            action: () => handleNavigate("/dashboard/trust"),
          },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Transactions",
            action: () => handleNavigate("/dashboard/trust/transactions"),
          },
          {
            icon: <FileText className="h-5 w-5" />,
            label: "Documents",
            action: () => handleNavigate("/dashboard/trust/documents"),
          },
          {
            icon: <Shield className="h-5 w-5" />,
            label: "Manage Trust",
            action: () => handleNavigate("/dashboard/trust/manage"),
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Deposit",
            action: () => handleNavigate("/dashboard/deposit"),
          },
          {
            icon: <Users className="h-5 w-5" />,
            label: "Beneficiaries",
            action: () => handleNavigate("/dashboard/trust/beneficiaries"),
          },
          {
            icon: <BarChart2 className="h-5 w-5" />,
            label: "Investments",
            action: () => handleNavigate("/dashboard/trust/investments"),
          },
          {
            icon: <Settings className="h-5 w-5" />,
            label: "Settings",
            action: () => handleNavigate("/dashboard/settings"),
          },
          { icon: <LogOut className="h-5 w-5" />, label: "Logout", action: handleLogout },
        ]
      case "business":
        return [
          {
            icon: <HomeIcon className="h-5 w-5" />,
            label: "Dashboard",
            action: () => handleNavigate("/dashboard/business"),
          },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Transactions",
            action: () => handleNavigate("/dashboard/transactions"),
          },
          {
            icon: <Upload className="h-5 w-5" />,
            label: "Transfer",
            action: () => handleNavigate("/dashboard/transfer"),
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Deposit",
            action: () => handleNavigate("/dashboard/deposit"),
          },
          {
            icon: <CreditCard className="h-5 w-5" />,
            label: "Cards",
            action: () => handleNavigate("/dashboard/cards"),
          },
          {
            icon: <DollarSign className="h-5 w-5" />,
            label: "Loans",
            action: () => handleNavigate("/dashboard/loans"),
          },
          {
            icon: <Settings className="h-5 w-5" />,
            label: "Settings",
            action: () => handleNavigate("/dashboard/settings"),
          },
          { icon: <LogOut className="h-5 w-5" />, label: "Logout", action: handleLogout },
        ]
      case "savings":
        return [
          {
            icon: <HomeIcon className="h-5 w-5" />,
            label: "Dashboard",
            action: () => handleNavigate("/dashboard/savings"),
          },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Transactions",
            action: () => handleNavigate("/dashboard/transactions"),
          },
          {
            icon: <Target className="h-5 w-5" />,
            label: "Goals",
            action: () => handleNavigate("/dashboard/savings/goals"),
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Deposit",
            action: () => handleNavigate("/dashboard/deposit"),
          },
          {
            icon: <Percent className="h-5 w-5" />,
            label: "Interest",
            action: () => handleNavigate("/dashboard/savings/interest"),
          },
          {
            icon: <Calculator className="h-5 w-5" />,
            label: "Calculator",
            action: () => handleNavigate("/dashboard/savings/calculator"),
          },
          {
            icon: <ArrowUpRight className="h-5 w-5" />,
            label: "Transfers",
            action: () => handleNavigate("/dashboard/transfer"),
          },
          {
            icon: <Settings className="h-5 w-5" />,
            label: "Settings",
            action: () => handleNavigate("/dashboard/settings"),
          },
          { icon: <LogOut className="h-5 w-5" />, label: "Logout", action: handleLogout },
        ]
      default: // personal
        return [
          { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", action: () => handleNavigate("/dashboard") },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Transactions",
            action: () => handleNavigate("/dashboard/transactions"),
          },
          {
            icon: <Upload className="h-5 w-5" />,
            label: "Transfer",
            action: () => handleNavigate("/dashboard/transfer"),
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Deposit",
            action: () => handleNavigate("/dashboard/deposit"),
          },
          {
            icon: <CreditCard className="h-5 w-5" />,
            label: "Cards",
            action: () => handleNavigate("/dashboard/cards"),
          },
          {
            icon: <Settings className="h-5 w-5" />,
            label: "Settings",
            action: () => handleNavigate("/dashboard/settings"),
          },
          { icon: <LogOut className="h-5 w-5" />, label: "Logout", action: handleLogout },
        ]
    }
  })()

  // Get background color based on account type
  const getMenuStyle = () => {
    switch (type) {
      case "crypto":
        return {
          base: "bg-[#6366f1] hover:bg-[#4f46e5]",
          expanded: "bg-[#1e293b] border-[#334155]",
          items: "bg-[#0f172a] hover:bg-[#334155] text-white",
        }
      case "trust":
        return {
          base: "bg-blue-600 hover:bg-blue-700",
          expanded: "bg-white border-gray-200",
          items: "bg-blue-50 hover:bg-blue-100 text-blue-800",
        }
      case "business":
        return {
          base: "bg-[#ff9800] hover:bg-[#f57c00]",
          expanded: "bg-gray-800 border-gray-700",
          items: "bg-gray-700 hover:bg-gray-600 text-white",
        }
      case "savings":
        return {
          base: "bg-green-600 hover:bg-green-700",
          expanded: "bg-white border-gray-200",
          items: "bg-green-50 hover:bg-green-100 text-green-800",
        }
      default: // personal
        return {
          base: "bg-[#001f3f] hover:bg-[#00346b]",
          expanded: "bg-white border-gray-200",
          items: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        }
    }
  }

  const styles = getMenuStyle()

  if (!isClient) return null

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Main Button */}
      <button
        onClick={toggleMenu}
        className={`rounded-full p-4 ${styles.base} shadow-lg flex items-center justify-center transition-all duration-300`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Radial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-20 left-0 p-4 rounded-lg shadow-lg ${styles.expanded} border w-64`}
          >
            <div className="grid grid-cols-3 gap-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={item.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg ${styles.items} transition-colors`}
                >
                  {item.icon}
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
