"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Send,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  Building2,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"

// Mock business data
const businessData = {
  name: "Kayla's Enterprises LLC",
  accountNumber: "8192-7364-5102",
  balance: 1285750.42,
  creditLine: 500000,
  availableCredit: 425000,
  pendingTransactions: 3,
  lastLogin: "Today, 09:45 AM",
  accountManager: "Thomas Reynolds",
  accountManagerPhone: "+1 (940) 277-9280",
  accountManagerEmail: "treynolds@primezart.com",
}

// Mock transactions data
const transactionsData = [
  {
    id: "t1",
    date: "Nov. 18, 2024",
    description: "Global Logistics Inc.",
    amount: 253000.0,
    type: "Credit",
    account: "Business Checking",
    status: "Completed",
    from: "Global Logistics Inc.",
    to: "",
    category: "Revenue",
    reference: "INV-2024-11-001",
  },
  {
    id: "t2",
    date: "Nov. 15, 2024",
    description: "Office Supplies Ltd.",
    amount: -12450.75,
    type: "Debit",
    account: "Business Checking",
    status: "Completed",
    from: "",
    to: "Office Supplies Ltd.",
    category: "Expenses",
    reference: "PO-2024-11-023",
  },
  {
    id: "t3",
    date: "Nov. 13, 2024",
    description: "Payroll Processing",
    amount: -87500.0,
    type: "Debit",
    account: "Business Checking",
    status: "Completed",
    from: "",
    to: "Payroll System",
    category: "Payroll",
    reference: "PR-2024-11-15",
  },
  {
    id: "t4",
    date: "Nov. 10, 2024",
    description: "Eastwood Contractors",
    amount: 175000.0,
    type: "Credit",
    account: "Business Checking",
    status: "Completed",
    from: "Eastwood Contractors",
    to: "",
    category: "Revenue",
    reference: "INV-2024-11-002",
  },
  {
    id: "t5",
    date: "Nov. 05, 2024",
    description: "Quarterly Tax Payment",
    amount: -68250.0,
    type: "Debit",
    account: "Business Checking",
    status: "Completed",
    from: "",
    to: "Internal Revenue Service",
    category: "Taxes",
    reference: "TAX-2024-Q4",
  },
]

// Business metrics
const businessMetrics = [
  {
    id: "cash-flow",
    label: "Monthly Cash Flow",
    value: 325000,
    change: 12.5,
    trend: "up",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: "revenue",
    label: "Monthly Revenue",
    value: 850000,
    change: 8.3,
    trend: "up",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: "expenses",
    label: "Monthly Expenses",
    value: 525000,
    change: 3.2,
    trend: "up",
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    id: "pending",
    label: "Pending Invoices",
    value: 235000,
    count: 7,
    trend: "neutral",
    icon: <FileText className="h-5 w-5" />,
  },
]

export default function BusinessDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("business")
  const [flipped, setFlipped] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      } else {
        localStorage.setItem("accountMode", "business")
      }
    }
  }, [])

  const handleDeposit = () => {
    router.push("/dashboard/deposit")
  }

  const handleSend = () => {
    router.push("/dashboard/transfer")
  }

  const handleReceive = () => {
    router.push("/dashboard/receive")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatAmount = (amount) => {
    if (amount > 0) {
      return `$${amount.toLocaleString()}`
    } else {
      return `-$${Math.abs(amount).toLocaleString()}`
    }
  }

  const handleFlipCard = () => {
    setFlipped(!flipped)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard/business" className="flex items-center text-white font-medium">
              <Building2 className="h-5 w-5 mr-2 text-blue-400" />
              <span>Business</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center text-gray-400 font-medium hover:text-white transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Personal</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">Last login: {businessData.lastLogin}</div>
            <div className="h-4 w-px bg-gray-700 mx-2"></div>
            <a href={`tel:${businessData.accountManagerPhone}`} className="text-blue-400 font-medium flex items-center">
              <span className="mr-2">📞</span> Support
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-300 font-medium flex items-center hover:text-white transition-colors"
            >
              Sign Out <span className="ml-1">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-0">{businessData.name}</h1>
          <div className="flex items-center text-sm text-gray-400">
            <span className="mr-2">Account Manager:</span>
            <span className="text-blue-400">{businessData.accountManager}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Balance Card - Made smaller */}
          <div className="md:col-span-3">
            <Card className="bg-gray-800 border-gray-700 text-white shadow-xl overflow-hidden h-full">
              <CardHeader className="pb-2 border-b border-gray-700">
                <CardTitle className="flex justify-between items-center text-base">
                  <span>Business Account</span>
                  <button onClick={() => setHideBalance(!hideBalance)} className="text-gray-400 hover:text-white">
                    {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Available Balance</p>
                    <p className="text-2xl font-bold mt-1">
                      {hideBalance ? "••••••••" : formatCurrency(businessData.balance)}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="mr-2">Account No:</span>
                    <span className="text-blue-400 font-mono">{businessData.accountNumber}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <div className="flex flex-wrap gap-2 w-full">
                  <Button onClick={handleDeposit} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="mr-1 h-3 w-3" /> Deposit
                  </Button>
                  <Button
                    onClick={handleSend}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Send className="mr-1 h-3 w-3" /> Send
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* ATM Card - Made smaller with proper spacing */}
          <div className="md:col-span-6">
            <div className="flex justify-center">
              <div className="flip-card" style={{ maxWidth: "360px" }}>
                <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`} onClick={handleFlipCard}>
                  {/* Card Front */}
                  <div className="flip-card-front business">
                    <div className="flex items-center mb-4">
                      <div className="card-chip"></div>
                      <div>
                        <span className="text-white font-bold text-sm">Primezart</span>
                        <div className="text-blue-300 text-xs font-semibold -mt-1">BUSINESS PLATINUM</div>
                      </div>
                      <div className="card-brand ml-auto">
                        <div className="card-brand-circle blue"></div>
                        <div className="card-brand-circle light-blue"></div>
                      </div>
                    </div>

                    <div className="text-gray-400 text-xs mb-1">Card Number</div>
                    <div className="text-xl font-mono text-white mb-6 card-number">4539 •••• •••• 6123</div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">Card Holder</div>
                        <div className="text-white text-sm card-holder-name">{businessData.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">Expires</div>
                        <div className="text-white text-sm">05/27</div>
                      </div>
                    </div>

                    {/* Circuit pattern overlay */}
                    <div className="circuit-pattern">
                      <div
                        className="circuit-line"
                        style={{ top: "25%", left: "10%", width: "80%", height: "1px", backgroundColor: "#3b82f6" }}
                      ></div>
                      <div
                        className="circuit-line"
                        style={{ top: "50%", left: "10%", width: "80%", height: "1px", backgroundColor: "#3b82f6" }}
                      ></div>
                      <div
                        className="circuit-line"
                        style={{ top: "75%", left: "10%", width: "80%", height: "1px", backgroundColor: "#3b82f6" }}
                      ></div>
                      <div
                        className="circuit-line"
                        style={{ left: "25%", top: "10%", width: "1px", height: "80%", backgroundColor: "#3b82f6" }}
                      ></div>
                      <div
                        className="circuit-line"
                        style={{ left: "50%", top: "10%", width: "1px", height: "80%", backgroundColor: "#3b82f6" }}
                      ></div>
                      <div
                        className="circuit-line"
                        style={{ left: "75%", top: "10%", width: "1px", height: "80%", backgroundColor: "#3b82f6" }}
                      ></div>
                    </div>

                    <div className="flip-hint">
                      <RefreshCw className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="flip-card-back business">
                    <div className="magnetic-strip"></div>

                    <div className="mt-4 mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-400 text-xs">Security Code</div>
                        <div className="bg-white text-gray-900 px-2 py-1 rounded font-mono text-sm">***</div>
                      </div>

                      <div className="text-gray-400 text-xs mb-2">Signature</div>
                      <div className="signature-strip">
                        <span className="text-gray-800 font-serif">{businessData.name}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                      This card is property of Primezart Bank. If found, please return to any Primezart branch.
                    </div>

                    <div className="flip-hint">
                      <RefreshCw className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">Click the card to flip</div>
          </div>

          {/* Credit Line Card */}
          <div className="md:col-span-3">
            <Card className="bg-gray-800 border-gray-700 text-white h-full shadow-xl">
              <CardHeader className="pb-2 border-b border-gray-700">
                <CardTitle className="text-base">Business Credit Line</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Available Credit</p>
                    <p className="text-2xl font-bold mt-1">
                      {hideBalance ? "••••••••" : formatCurrency(businessData.availableCredit)}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="mr-2">Credit Limit:</span>
                    <span className="text-blue-400">{formatCurrency(businessData.creditLine)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <div className="flex flex-wrap gap-2 w-full">
                  <Button
                    onClick={() => router.push("/dashboard/credit/draw")}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="mr-1 h-3 w-3" /> Draw Funds
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {businessMetrics.map((metric) => (
            <Card key={metric.id} className="bg-gray-800 border-gray-700 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-400 text-sm">{metric.label}</div>
                  <div
                    className={`p-1.5 rounded-full ${
                      metric.trend === "up"
                        ? "bg-green-900/30 text-green-400"
                        : metric.trend === "down"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-blue-900/30 text-blue-400"
                    }`}
                  >
                    {metric.icon}
                  </div>
                </div>
                <div className="text-xl font-bold">{formatCurrency(metric.value)}</div>
                {metric.change && (
                  <div
                    className={`text-xs mt-1 ${
                      metric.trend === "up"
                        ? "text-green-400"
                        : metric.trend === "down"
                          ? "text-red-400"
                          : "text-blue-400"
                    }`}
                  >
                    {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "•"} {metric.change}% from last month
                  </div>
                )}
                {metric.count && (
                  <div className="text-xs mt-1 text-gray-400">
                    {metric.count} {metric.count === 1 ? "item" : "items"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/transactions")}
              className="text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white"
            >
              View All
            </Button>
          </div>
          <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactionsData.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm text-gray-300">{transaction.date}</td>
                      <td className="px-4 py-3 text-sm text-white">{transaction.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{transaction.category}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-400">{transaction.reference}</td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-medium ${
                          transaction.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatAmount(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { BusinessDashboard }
