"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home,
  CreditCard,
  Send,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  Bell,
  Globe,
  Users,
  Bitcoin,
  Download,
  ArrowDownLeft,
  Scale,
} from "lucide-react"

export default function GlassmorphismMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const router = useRouter()

  useEffect(() => {
    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      }
    }

    // Add event listener for account mode changes
    const handleAccountModeChange = (e) => {
      if (e.key === "accountMode") {
        setAccountMode(e.newValue)
      }
    }

    window.addEventListener("storage", handleAccountModeChange)
    return () => window.removeEventListener("storage", handleAccountModeChange)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleNavigation = (path) => {
    // Check for investment page access
    if (path === "/dashboard/investment") {
      // Get account mode from localStorage
      const mode = localStorage.getItem("accountMode") || "personal"

      // Check if user has investment account by looking at localStorage
      const accountsData = localStorage.getItem("accounts")
      let hasInvestmentAccount = false

      if (accountsData) {
        try {
          const accounts = JSON.parse(accountsData)
          hasInvestmentAccount = accounts.some((acc) => acc.type === "investment" && acc.accountType === mode)
        } catch (e) {
          console.error("Error parsing accounts data", e)
        }
      }

      if (!hasInvestmentAccount) {
        alert(`You need to open an investment account to access this feature.`)
        setIsOpen(false)
        return
      }
    }

    router.push(path)
    setIsOpen(false)
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn")
      router.push("/")
    }
  }

  // Banking features for grid display
  const menuFeatures = [
    { title: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
    { title: "Accounts", icon: <Wallet className="h-5 w-5" />, path: "/dashboard/accounts" },
    { title: "Cards", icon: <CreditCard className="h-5 w-5" />, path: "/dashboard/cards" },
    { title: "Deposit", icon: <Download className="h-5 w-5" />, path: "/dashboard/deposit" },
    { title: "Transfer", icon: <Send className="h-5 w-5" />, path: "/dashboard/transfer" },
    { title: "Receive", icon: <ArrowDownLeft className="h-5 w-5" />, path: "/dashboard/receive" },
    { title: "Loans", icon: <DollarSign className="h-5 w-5" />, path: "/dashboard/loans" },
    { title: "Investments", icon: <BarChart3 className="h-5 w-5" />, path: "/dashboard/investment" },
    { title: "Notifications", icon: <Bell className="h-5 w-5" />, path: "/dashboard/notifications" },
    { title: "Legal Assistance", icon: <Scale className="h-5 w-5" />, path: "/dashboard/legal-assistance" },
    ...(accountMode === "business"
      ? [
          { title: "International", icon: <Globe className="h-5 w-5" />, path: "/dashboard/international-transfer" },
          { title: "Crypto Transfer", icon: <Bitcoin className="h-5 w-5" />, path: "/dashboard/crypto" },
        ]
      : []),
    { title: "Third Party Access", icon: <Users className="h-5 w-5" />, path: "/dashboard/third-party-accounts" },
    { title: "Settings", icon: <Settings className="h-5 w-5" />, path: "/dashboard/settings" },
  ]

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full sky-gold-bg text-[#003366] shadow-lg hover:bg-[#e6b800] transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Menu Content */}
      <div
        className={`fixed bottom-0 left-0 w-full sm:w-96 bg-white z-40 rounded-t-3xl shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Menu</h2>

          {/* Grid Layout for Menu Items */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {menuFeatures.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={toggleMenu}
              >
                <div className="w-10 h-10 rounded-full bg-[#f0f5ff] flex items-center justify-center mb-2">
                  <div className="text-[#003366]">{item.icon}</div>
                </div>
                <span className="text-xs text-center font-medium">{item.title}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

