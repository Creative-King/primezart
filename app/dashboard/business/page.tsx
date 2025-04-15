"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  RefreshCw,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  DollarSign,
  Bell,
  MessageCircle,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import FloatingRadialMenu from "@/components/floating-radial-menu"

// Mock business data
const businessData = {
  name: "Kayla's Enterprises LLC",
  accountNumber: "8192-7364-5102",
  balance: 1285750.42,
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
    notes: "Payment for logistics services",
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
    notes: "Quarterly office supplies order",
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
    notes: "Bi-weekly payroll for 15 employees",
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
    notes: "Phase 2 project completion payment",
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
    notes: "Q4 estimated tax payment",
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
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      } else {
        localStorage.setItem("accountMode", "business")
      }
    }
  }, [router])

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

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleSwitchToPersonal = () => {
    setAccountMode("personal")
    localStorage.setItem("accountMode", "personal")
    router.push("/dashboard")
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-800">
      {/* Header with Notifications */}
      <div className="bg-[#001f3f] text-white py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Primez<span className="text-[#ffa500]">art</span>
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Account Type Tabs */}
      <div className="bg-[#001f3f] text-white border-t border-blue-800">
        <div className="container mx-auto flex">
          <button
            className="flex-1 py-3 px-4 text-center font-medium text-gray-300 hover:text-white"
            onClick={handleSwitchToPersonal}
          >
            Personal
          </button>
          <button className="flex-1 py-3 px-4 text-center font-medium bg-[#001f3f] text-white border-b-2 border-white">
            Business
          </button>
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Balance Card - Made smaller than ATM card and centered on mobile */}
          <div className="md:col-span-3 mx-auto md:mx-0" style={{ maxWidth: "300px" }}>
            <Card className="bg-white rounded-xl shadow-sm p-4 w-full h-auto">
              <div className="text-gray-600 text-sm mb-1">Your Total Balance</div>
              <div className="flex items-center justify-between">
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {hideBalance ? "••••••••" : formatCurrency(businessData.balance)}
                </div>
                <button onClick={() => setHideBalance(!hideBalance)} className="text-gray-400 hover:text-gray-600">
                  {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <span className="font-medium mr-2">Business Account</span>
                <span className="text-gray-500 mr-1">Acct No:</span>
                <span className="text-[#0066cc]">{businessData.accountNumber}</span>
              </div>
            </Card>
          </div>

          {/* ATM Card - Made larger than balance box */}
          <div className="md:col-span-9">
            <div className="flex justify-center">
              <div className="flip-card" style={{ maxWidth: "360px", width: "100%" }}>
                <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`} onClick={handleFlipCard}>
                  {/* Card Front */}
                  <div className="flip-card-front business p-6">
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
                    <div className="text-xl font-mono text-white mb-6 card-number overflow-hidden text-ellipsis">
                      4539 •••• •••• 6123
                    </div>

                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">Card Holder</div>
                        <div className="text-white text-sm card-holder-name truncate max-w-[150px]">
                          {businessData.name}
                        </div>
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

                    <div className="mt-4 mb-2 px-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-400 text-xs">Security Code</div>
                        <div className="bg-white text-gray-900 px-2 py-1 rounded font-mono text-sm">***</div>
                      </div>

                      <div className="text-gray-400 text-xs mb-2">Signature</div>
                      <div className="signature-strip">
                        <span className="text-gray-800 font-serif truncate">{businessData.name}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400 px-6 pb-6">
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
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
          {businessMetrics.map((metric) => (
            <Card key={metric.id} className="bg-white border-gray-200 text-gray-800 business-metric-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">{metric.label}</h3>
                  <div className="p-2 rounded-full bg-gray-700">{metric.icon}</div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xl md:text-2xl font-bold break-words">
                      {metric.value ? formatCurrency(metric.value) : metric.count}
                    </p>
                    {metric.change && (
                      <div
                        className={`flex items-center text-xs ${
                          metric.trend === "up"
                            ? "text-green-400"
                            : metric.trend === "down"
                              ? "text-red-400"
                              : "text-gray-400"
                        }`}
                      >
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : metric.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        ) : null}
                        <span>{metric.change}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction History with Modal Details */}
        <Card className="bg-white border-gray-200 text-gray-800 shadow-sm overflow-hidden mb-20">
          <CardHeader className="pb-2 border-b border-gray-200 flex flex-row justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              onClick={() => router.push("/dashboard/transactions")}
            >
              <Clock className="h-4 w-4 mr-1" /> View All
            </Button>
          </CardHeader>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pb-2">
            <table className="w-full min-w-[800px] business-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-500 text-xs md:text-sm">Date</th>
                  <th className="py-3 px-4 text-left text-gray-500 text-xs md:text-sm">Description</th>
                  <th className="py-3 px-4 text-left text-gray-500 text-xs md:text-sm">Reference</th>
                  <th className="py-3 px-4 text-left text-gray-500 text-xs md:text-sm">Category</th>
                  <th className="py-3 px-4 text-right text-gray-500 text-xs md:text-sm">Amount</th>
                  <th className="py-3 px-4 text-right text-gray-500 text-xs md:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.slice(0, 4).map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <td className="py-3 px-4 text-gray-300 text-xs md:text-sm">{transaction.date}</td>
                    <td className="py-3 px-4 font-medium text-xs md:text-sm">
                      {transaction.type === "Credit" ? transaction.from : transaction.to}
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs md:text-sm">{transaction.reference}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.category === "Revenue"
                            ? "bg-green-900/30 text-green-400"
                            : transaction.category === "Expenses"
                              ? "bg-red-900/30 text-red-400"
                              : transaction.category === "Payroll"
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium text-xs md:text-sm ${
                        transaction.type === "Credit" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {transaction.type === "Credit"
                        ? formatCurrency(transaction.amount)
                        : formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="sm:max-w-md bg-white text-gray-800 border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedTransaction.type === "Credit"
                      ? "bg-green-900/30 text-green-400"
                      : "bg-red-900/30 text-red-400"
                  }`}
                >
                  {selectedTransaction.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium text-white">{selectedTransaction.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p
                    className={`font-medium ${selectedTransaction.type === "Credit" ? "text-green-400" : "text-red-400"}`}
                  >
                    {selectedTransaction.type === "Credit"
                      ? formatAmount(selectedTransaction.amount)
                      : formatAmount(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{selectedTransaction.type === "Credit" ? "From" : "To"}</p>
                  <p className="font-medium text-white">
                    {selectedTransaction.type === "Credit" ? selectedTransaction.from : selectedTransaction.to}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="font-medium text-white">{selectedTransaction.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Reference</p>
                  <p className="font-medium text-white">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium text-white">{selectedTransaction.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Notes</p>
                <p className="text-sm text-gray-300">{selectedTransaction.notes}</p>
              </div>

              <div className="border-t border-gray-700 pt-4 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-800"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                  Download Receipt
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Chat Button (Blue) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="rounded-full p-4 bg-[#001f3f] hover:bg-[#00346b] shadow-lg flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Floating Radial Menu */}
      <FloatingRadialMenu type="business" />

      {/* Add custom CSS for the card */}
      <style jsx global>{`
        .flip-card {
          perspective: 1000px;
          height: 200px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: left;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          border-radius: 16px;
        }
        
        .is-flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
        }
        
        .flip-card-front {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
          color: white;
        }
        
        .flip-card-front.business {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        }
        
        .flip-card-back {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
          color: white;
          transform: rotateY(180deg);
        }
        
        .flip-card-back.business {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        }
        
        .card-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
          border-radius: 5px;
          margin-right: 10px;
          position: relative;
          overflow: hidden;
        }
        
        .card-chip::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 3px;
          right: 3px;
          height: 7px;
          background: rgba(0, 0, 0, 0.1);
          transform: translateY(-50%);
        }
        
        .card-chip::after {
          content: "";
          position: absolute;
          top: 3px;
          bottom: 3px;
          left: 50%;
          width: 7px;
          background: rgba(0, 0, 0, 0.1);
          transform: translateX(-50%);
        }
        
        .card-brand {
          display: flex;
        }
        
        .card-brand-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        
        .card-brand-circle.blue {
          background-color: #0052cc;
          opacity: 0.8;
        }
        
        .card-brand-circle.light-blue {
          background-color: #00b8d9;
          opacity: 0.8;
          margin-left: -12px;
        }
        
        .magnetic-strip {
          width: 100%;
          height: 50px;
          background-color: #111827;
          margin: 20px 0;
        }
        
        .signature-strip {
          height: 40px;
          background-color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          margin: 0 12px;
        }
        
        .card-number {
          letter-spacing: 2px;
        }
        
        .circuit-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          opacity: 0.1;
        }
        
        .circuit-line {
          position: absolute;
        }
        
        .flip-hint {
          position: absolute;
          right: 12px;
          bottom: 12px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}
