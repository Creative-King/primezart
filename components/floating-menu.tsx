"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Menu,
  X,
  Home,
  CreditCard,
  Send,
  Wallet,
  BarChart3,
  Settings,
  DollarSign,
  Bell,
  Globe,
  Bitcoin,
  Download,
  ArrowDownLeft,
  Briefcase,
  PiggyBank,
  User,
  Link,
  Shield,
  Clock,
  FileText,
  Landmark,
  ChevronLeft,
  Sparkles,
  Scale,
  Target,
  Percent,
  UserPlus,
  Activity,
  PieChart,
  BarChart,
  Plus,
  Repeat,
  Upload,
  Zap,
  LineChart,
  Users,
  ArrowLeftRight,
  LayoutGrid,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

// Account types with their icons and features
const accountTypes = [
  {
    id: "business",
    label: "Business Account",
    icon: <Briefcase className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard/business" },
      { id: "cards", label: "Cards", icon: <CreditCard className="h-5 w-5" />, href: "/dashboard/cards" },
      { id: "transfer", label: "Transfer", icon: <Send className="h-5 w-5" />, href: "/dashboard/transfer" },
      { id: "deposit", label: "Deposit", icon: <Download className="h-5 w-5" />, href: "/dashboard/deposit" },
      { id: "receive", label: "Receive", icon: <ArrowDownLeft className="h-5 w-5" />, href: "/dashboard/receive" },
      {
        id: "international",
        label: "International",
        icon: <Globe className="h-5 w-5" />,
        href: "/dashboard/international-transfer",
      },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      {
        id: "third-party",
        label: "Third-Party",
        icon: <Link className="h-5 w-5" />,
        href: "/dashboard/business/third-party",
      },
    ],
  },
  {
    id: "investment",
    label: "Investment Account",
    icon: <BarChart3 className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard/investment" },
      {
        id: "portfolio",
        label: "Portfolio",
        icon: <PieChart className="h-5 w-5" />,
        href: "/dashboard/investment/portfolio",
      },
      {
        id: "deposit",
        label: "Deposit",
        icon: <Download className="h-5 w-5" />,
        href: "/dashboard/investment/deposit",
      },
      {
        id: "international",
        label: "International",
        icon: <Globe className="h-5 w-5" />,
        href: "/dashboard/investment/international",
      },
      {
        id: "crypto",
        label: "Buy Crypto",
        icon: <Bitcoin className="h-5 w-5" />,
        href: "/dashboard/investment/crypto",
      },
      {
        id: "stocks",
        label: "Stock Buying",
        icon: <BarChart className="h-5 w-5" />,
        href: "/dashboard/investment/stocks",
      },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      {
        id: "third-party",
        label: "Third-Party",
        icon: <Link className="h-5 w-5" />,
        href: "/dashboard/investment/third-party",
      },
    ],
  },
  {
    id: "personal",
    label: "Personal Account",
    icon: <User className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard" },
      { id: "cards", label: "Cards", icon: <CreditCard className="h-5 w-5" />, href: "/dashboard/cards" },
      { id: "transfer", label: "Transfer", icon: <Send className="h-5 w-5" />, href: "/dashboard/transfer" },
      { id: "deposit", label: "Deposit", icon: <Download className="h-5 w-5" />, href: "/dashboard/deposit" },
      { id: "loans", label: "Loans", icon: <Landmark className="h-5 w-5" />, href: "/dashboard/loans" },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="h-5 w-5" />,
        href: "/dashboard/notifications",
      },
      { id: "security", label: "Security", icon: <Shield className="h-5 w-5" />, href: "/dashboard/security" },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      {
        id: "third-party",
        label: "Third-Party",
        icon: <Link className="h-5 w-5" />,
        href: "/dashboard/third-party-accounts",
      },
      { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
    ],
  },
  {
    id: "savings",
    label: "Savings Account",
    icon: <PiggyBank className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard/savings" },
      { id: "transfer", label: "Transfer", icon: <Send className="h-5 w-5" />, href: "/dashboard/transfer" },
      { id: "deposit", label: "Deposit", icon: <Download className="h-5 w-5" />, href: "/dashboard/deposit" },
      {
        id: "add-funds",
        label: "Add Funds",
        icon: <Plus className="h-5 w-5" />,
        href: "/dashboard/savings/add-funds",
      },
      {
        id: "goals",
        label: "Savings Goals",
        icon: <Target className="h-5 w-5" />,
        href: "/dashboard/savings/goals",
      },
      {
        id: "interest",
        label: "Interest Rates",
        icon: <Percent className="h-5 w-5" />,
        href: "/dashboard/savings/interest",
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: <Clock className="h-5 w-5" />,
        href: "/dashboard/transactions",
      },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
    ],
  },
  {
    id: "joint",
    label: "Joint Account",
    icon: <Users className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard/joint" },
      { id: "transfer", label: "Transfer", icon: <Send className="h-5 w-5" />, href: "/dashboard/transfer" },
      { id: "deposit", label: "Deposit", icon: <Download className="h-5 w-5" />, href: "/dashboard/deposit" },
      {
        id: "manage-users",
        label: "Manage Users",
        icon: <UserPlus className="h-5 w-5" />,
        href: "/dashboard/joint/users",
      },
      {
        id: "add-owner",
        label: "Add Owner",
        icon: <UserPlus className="h-5 w-5" />,
        href: "/dashboard/joint/add-owner",
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: <Clock className="h-5 w-5" />,
        href: "/dashboard/transactions",
      },
      {
        id: "statements",
        label: "Statements",
        icon: <FileText className="h-5 w-5" />,
        href: "/dashboard/joint/statements",
      },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
    ],
  },
  {
    id: "retirement",
    label: "Retirement Account",
    icon: <Landmark className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard/retirement" },
      {
        id: "portfolio",
        label: "Portfolio",
        icon: <PieChart className="h-5 w-5" />,
        href: "/dashboard/retirement/portfolio",
      },
      {
        id: "contributions",
        label: "Contributions",
        icon: <DollarSign className="h-5 w-5" />,
        href: "/dashboard/retirement/contributions",
      },
      {
        id: "performance",
        label: "Performance",
        icon: <Activity className="h-5 w-5" />,
        href: "/dashboard/retirement/performance",
      },
      {
        id: "projections",
        label: "Projections",
        icon: <BarChart className="h-5 w-5" />,
        href: "/dashboard/retirement/projections",
      },
      { id: "transfer", label: "Transfer", icon: <Send className="h-5 w-5" />, href: "/dashboard/transfer" },
      { id: "deposit", label: "Deposit", icon: <Download className="h-5 w-5" />, href: "/dashboard/deposit" },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
    ],
  },
  {
    id: "crypto",
    label: "Crypto Account",
    icon: <Bitcoin className="h-5 w-5" />,
    features: [
      { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/dashboard/crypto" },
      {
        id: "portfolio",
        label: "Portfolio",
        icon: <Wallet className="h-5 w-5" />,
        href: "/dashboard/crypto/portfolio",
      },
      {
        id: "buy",
        label: "Buy Crypto",
        icon: <Plus className="h-5 w-5" />,
        href: "/dashboard/crypto/buy",
      },
      {
        id: "swap",
        label: "Swap",
        icon: <Repeat className="h-5 w-5" />,
        href: "/dashboard/crypto/swap",
      },
      {
        id: "send",
        label: "Send",
        icon: <Upload className="h-5 w-5" />,
        href: "/dashboard/crypto/send",
      },
      {
        id: "receive",
        label: "Receive",
        icon: <Download className="h-5 w-5" />,
        href: "/dashboard/crypto/receive",
      },
      {
        id: "staking",
        label: "Staking",
        icon: <Zap className="h-5 w-5" />,
        href: "/dashboard/crypto/staking",
      },
      {
        id: "markets",
        label: "Markets",
        icon: <LineChart className="h-5 w-5" />,
        href: "/dashboard/crypto/markets",
      },
      {
        id: "legal",
        label: "Legal Assistance",
        icon: <Scale className="h-5 w-5" />,
        href: "/dashboard/legal-assistance",
      },
      { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
    ],
  },
]

// For the personal account menu items, remove the accounts icon
const personalMenuItems = [
  { icon: "home", label: "Dashboard", href: "/dashboard" },
  { icon: "credit-card", label: "Cards", href: "/dashboard/cards" },
  { icon: "send", label: "Transfer", href: "/dashboard/transfer" },
  { icon: "download", label: "Deposit", href: "/dashboard/deposit" },
  { icon: "inbox", label: "Receive", href: "/dashboard/receive" },
  { icon: "bar-chart-2", label: "Investments", href: "/dashboard/investment" },
  { icon: "shield", label: "Security", href: "/dashboard/security" },
  { icon: "settings", label: "Settings", href: "/dashboard/settings" },
]

// For the business account menu items, remove invoicing, payroll, and accounts icon
const businessMenuItems = [
  { icon: "home", label: "Dashboard", href: "/dashboard/business" },
  { icon: "credit-card", label: "Cards", href: "/dashboard/cards" },
  { icon: "send", label: "Transfer", href: "/dashboard/transfer" },
  { icon: "download", label: "Deposit", href: "/dashboard/deposit" },
  { icon: "inbox", label: "Receive", href: "/dashboard/receive" },
  { icon: "bar-chart-2", label: "Investments", href: "/dashboard/investment" },
  { icon: "shield", label: "Security", href: "/dashboard/security" },
  { icon: "settings", label: "Settings", href: "/dashboard/settings" },
]

export default function FloatingMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  const [switchingAccount, setSwitchingAccount] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Detect current account type from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode") || "personal"
      setCurrentAccount(storedMode)
    }
  }, [])

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSwitchingAccount(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setSwitchingAccount(false)
    }
  }

  const handleFeatureSelect = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const handleSwitchAccount = () => {
    setSwitchingAccount(true)
  }

  const handleAccountSelect = (accountId: string) => {
    setCurrentAccount(accountId)
    setSwitchingAccount(false)

    // Store the selected account mode in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accountMode", accountId)
    }

    // Navigate to the appropriate dashboard
    const accountType = accountTypes.find((acc) => acc.id === accountId)
    if (accountType && accountType.features.length > 0) {
      const dashboardFeature = accountType.features.find((f) => f.id === "dashboard")
      if (dashboardFeature) {
        router.push(dashboardFeature.href)
      }
    }
  }

  // Get current account data
  const currentAccountData = accountTypes.find((acc) => acc.id === currentAccount)

  // Get appropriate button color based on account type
  const getButtonColor = () => {
    if (!currentAccount) return "bg-blue-600 hover:bg-blue-700"

    switch (currentAccount) {
      case "business":
        return "bg-blue-700 hover:bg-blue-800"
      case "investment":
        return "bg-green-600 hover:bg-green-700"
      case "personal":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "crypto":
        return "bg-orange-500 hover:bg-orange-600"
      case "retirement":
        return "bg-purple-600 hover:bg-purple-700"
      case "joint":
        return "bg-indigo-600 hover:bg-indigo-700"
      case "savings":
        return "bg-emerald-600 hover:bg-emerald-700"
      default:
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  // Get appropriate icon color for features based on feature type
  const getFeatureColor = (featureId: string) => {
    switch (featureId) {
      case "international":
        return "bg-blue-100 text-blue-600"
      case "third-party":
        return "bg-purple-100 text-purple-600"
      case "security":
        return "bg-red-100 text-red-600"
      case "crypto":
        return "bg-yellow-100 text-yellow-600"
      case "deposit":
      case "receive":
      case "add-funds":
        return "bg-green-100 text-green-600"
      case "transfer":
      case "withdraw":
      case "send":
        return "bg-orange-100 text-orange-600"
      case "stocks":
        return "bg-cyan-100 text-cyan-600"
      case "manage-users":
      case "add-owner":
        return "bg-indigo-100 text-indigo-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const renderMenuItems = () => {
    const isPersonalOrBusiness = pathname.includes("/dashboard/checking") || pathname.includes("/dashboard/business")
    const isJointAccount = pathname.includes("/dashboard/joint")

    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          onClick={() => router.push("/dashboard/transfer")}
        >
          <ArrowLeftRight className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          onClick={() => router.push("/dashboard/deposit")}
        >
          <PiggyBank className="h-5 w-5" />
        </Button>
        {isPersonalOrBusiness && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => router.push("/dashboard/cards")}
          >
            <CreditCard className="h-5 w-5" />
          </Button>
        )}
        {!isJointAccount && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => router.push("/dashboard/accounts")}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          onClick={() => router.push("/dashboard/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-50" ref={menuRef}>
      {/* Main Floating Button */}
      <motion.button
        onClick={toggleMenu}
        className={`rounded-full p-4 shadow-lg flex items-center justify-center ${
          isOpen ? "bg-red-500 hover:bg-red-600" : getButtonColor()
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : currentAccountData ? (
          <div className="h-6 w-6 text-white">{currentAccountData.icon}</div>
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </motion.button>

      {/* Expanded Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 left-0 bg-white rounded-xl shadow-xl overflow-hidden"
            style={{ width: "320px" }}
          >
            {switchingAccount ? (
              // Account selection view
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setSwitchingAccount(false)}
                    className="p-2 rounded-full hover:bg-gray-100 mr-2"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800">Switch Account</h3>
                </div>
                <div className="space-y-2">
                  {accountTypes.map((account) => (
                    <motion.button
                      key={account.id}
                      onClick={() => handleAccountSelect(account.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition-colors ${
                        currentAccount === account.id ? "bg-gray-100" : ""
                      }`}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            account.id === "business"
                              ? "bg-blue-100"
                              : account.id === "investment"
                                ? "bg-green-100"
                                : account.id === "crypto"
                                  ? "bg-orange-100"
                                  : account.id === "retirement"
                                    ? "bg-purple-100"
                                    : account.id === "joint"
                                      ? "bg-indigo-100"
                                      : account.id === "savings"
                                        ? "bg-emerald-100"
                                        : "bg-yellow-100"
                          } flex items-center justify-center mr-3`}
                        >
                          <div
                            className={`${
                              account.id === "business"
                                ? "text-blue-600"
                                : account.id === "investment"
                                  ? "text-green-600"
                                  : account.id === "crypto"
                                    ? "text-orange-600"
                                    : account.id === "retirement"
                                      ? "text-purple-600"
                                      : account.id === "joint"
                                        ? "text-indigo-600"
                                        : account.id === "savings"
                                          ? "text-emerald-600"
                                          : "text-yellow-600"
                            }`}
                          >
                            {account.icon}
                          </div>
                        </div>
                        <span className="font-medium text-gray-700">{account.label}</span>
                      </div>
                      {currentAccount === account.id && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              // Features for current account
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{currentAccountData?.label || "Dashboard"}</h3>
                  <button
                    onClick={handleSwitchAccount}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Switch Account
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {currentAccountData?.features.map((feature) => (
                    <motion.button
                      key={feature.id}
                      onClick={() => handleFeatureSelect(feature.href)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getFeatureColor(feature.id)}`}
                      >
                        {feature.icon}
                      </div>
                      <span className="text-xs text-center font-medium text-gray-700">{feature.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
