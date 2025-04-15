"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FloatingMenu from "@/components/floating-menu"
import { RefreshCw, Bell, MessageCircle, Menu, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Mock user data
const userData = {
  name: "Kayla K. Jones",
  firstName: "Kayla",
  accountType: "personal",
  unreadNotifications: 3,
  unreadMessages: 2,
  phone: "+1(940)277-9280",
  email: "kayla.jones@example.com",
  address: "123 Main Street, New York, NY 10001",
  dateOfBirth: "1985-05-15",
  nationality: "American",
  occupation: "Business Owner",
}

// Mock account data
const accountData = {
  id: "acc1",
  name: "Checking",
  number: "719828137131",
  balance: 4638412.32,
  type: "checking",
  currency: "USD",
  features: ["No monthly fees", "Unlimited transactions"],
  accountType: "personal",
  cardNumber: "5459 **** **** 7949",
  cardExpiry: "03/28",
  cardCVV: "***",
}

// Mock transactions data
const transactionsData = [
  {
    id: "t1",
    date: "Nov. 18, 2024",
    description: "Al Jailah Oil fields",
    amount: 853000.0,
    type: "Credit",
    account: "Checking",
    status: "Completed",
    from: "Al Jailah Oil fields",
    to: "",
    accountType: "personal",
    category: "Business Income",
    reference: "INV-2024-11-001",
    notes: "Payment for consulting services",
  },
  {
    id: "t2",
    date: "Nov. 13, 2024",
    description: "T.C Energy",
    amount: -670000.0,
    type: "Debit",
    account: "Checking",
    status: "Completed",
    from: "",
    to: "T.C Energy",
    accountType: "personal",
    category: "Business Expense",
    reference: "PO-2024-11-023",
    notes: "Equipment purchase",
  },
  {
    id: "t3",
    date: "Nov. 13, 2024",
    description: "Pizza Hut",
    amount: -35.0,
    type: "Debit",
    account: "Checking",
    status: "Completed",
    from: "",
    to: "Pizza Hut",
    accountType: "personal",
    category: "Dining",
    reference: "POS-2024-11-13",
    notes: "Dinner with family",
  },
  {
    id: "t4",
    date: "Nov. 4, 2024",
    description: "T.C Energy",
    amount: 850000.0,
    type: "Credit",
    account: "Checking",
    status: "Completed",
    from: "T.C Energy",
    to: "",
    accountType: "personal",
    category: "Business Income",
    reference: "INV-2024-11-002",
    notes: "Project completion payment",
  },
  {
    id: "t5",
    date: "Oct. 19, 2024",
    description: "Cherry Garcia",
    amount: -12500.0,
    type: "Debit",
    account: "Checking",
    status: "Completed",
    from: "",
    to: "Cherry Garcia",
    accountType: "personal",
    category: "Shopping",
    reference: "POS-2024-10-19",
    notes: "Retail purchase",
  },
]

// Mock notifications data
const notificationsData = [
  {
    id: "n1",
    title: "Security Alert",
    message: "Unusual login detected from a new device. Please verify if this was you.",
    date: "2025-03-10T14:30:00",
    read: false,
    type: "alert",
  },
  {
    id: "n2",
    title: "New Feature Available",
    message: "You can now set up automatic payments for your recurring bills.",
    date: "2025-03-09T10:15:00",
    read: false,
    type: "info",
  },
  {
    id: "n3",
    title: "Transfer Completed",
    message: "Your transfer of $1,500.00 to John Smith has been completed successfully.",
    date: "2025-03-08T16:45:00",
    read: false,
    type: "success",
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [flipped, setFlipped] = useState(false)
  const [lastLogin, setLastLogin] = useState("Today, 09:15 AM")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(notificationsData)
  const scrollRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Add this at the beginning of any useEffect that uses localStorage
    if (typeof window === "undefined") return

    // Store account mode in localStorage
    localStorage.setItem("accountMode", accountMode)
  }, [router, accountMode])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatAmount = (amount: number) => {
    if (amount > 0) {
      return `$${amount.toLocaleString()}`
    } else {
      return `-$${Math.abs(amount).toLocaleString()}`
    }
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleSwitchToBusiness = () => {
    setAccountMode("business")
    localStorage.setItem("accountMode", "business")
    router.push("/dashboard/business")
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e8f0f7]">
      {/* Header with Notifications */}
      <div className="bg-[#001f3f] text-white py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Primez<span className="text-[#ffa500]">art</span>
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={toggleNotifications} className="focus:outline-none" aria-label="Notifications">
                <Bell className="h-6 w-6 text-white" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                    <button onClick={toggleNotifications} className="text-gray-500 hover:text-gray-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 ${!notification.read ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-800">{notification.title}</h4>
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className={`text-xs ${!notification.read ? "text-blue-500" : "text-gray-400"}`}
                            >
                              {!notification.read ? "Mark read" : "Read"}
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(notification.date)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <Link
                      href="/dashboard/notifications"
                      className="text-sm text-blue-600 hover:text-blue-800 block text-center"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Account Type Tabs */}
      <div className="bg-[#001f3f] text-white border-t border-blue-800">
        <div className="container mx-auto flex">
          <button className="flex-1 py-3 px-4 text-center font-medium bg-[#001f3f] text-white border-b-2 border-white">
            Personal
          </button>
          <button
            className="flex-1 py-3 px-4 text-center font-medium text-gray-300 hover:text-white"
            onClick={handleSwitchToBusiness}
          >
            Business
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Overview</h2>
        <h3 className="text-xl text-[#0066cc] mb-6">Hello, {userData.name}</h3>

        {/* Update the personal dashboard to make the balance box smaller than the ATM card */}

        {/* Change the balance card width from md:w-2/5 to md:w-1/3 */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Balance Card - Made smaller than ATM card and centered on mobile */}
          <div
            className="bg-white rounded-xl shadow-sm p-4 w-full md:w-1/3 h-auto mx-auto md:mx-0"
            style={{ maxWidth: "300px" }}
          >
            <div className="text-gray-600 text-sm mb-1">Your Total Balance</div>
            <div className="flex items-center justify-between">
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {hideBalance ? "••••••••" : formatCurrency(accountData.balance)}
              </div>
              <button onClick={() => setHideBalance(!hideBalance)} className="text-gray-400 hover:text-gray-600">
                {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <span className="font-medium mr-2">{accountData.name}</span>
              <span className="text-gray-500 mr-1">Acct No:</span>
              <span className="text-[#0066cc]">{accountData.number}</span>
            </div>
          </div>

          {/* Card Display - Larger than balance box */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-center">
              <div className="flip-card" style={{ maxWidth: "360px", width: "100%" }}>
                <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                  {/* Card Front - Gold Card */}
                  <div
                    className="flip-card-front"
                    style={{ background: "linear-gradient(135deg, #f0d080 0%, #deb350 100%)" }}
                  >
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="flex items-center mb-4">
                        <div className="card-chip"></div>
                        <div>
                          <span className="text-gray-800 font-bold text-sm">Primezart</span>
                          <div className="text-gray-700 text-xs font-semibold -mt-1">GOLD STATUS</div>
                        </div>
                        <div className="card-brand ml-auto">
                          <div className="card-brand-circle blue"></div>
                          <div className="card-brand-circle light-blue"></div>
                        </div>
                      </div>

                      <div className="text-xl font-mono text-gray-800 mb-4 truncate">{accountData.cardNumber}</div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-gray-700 text-xs">EXP: {accountData.cardExpiry}</div>
                          <div className="text-gray-700 text-xs">CVV: {accountData.cardCVV}</div>
                        </div>
                        <div className="text-gray-800 font-medium text-sm truncate max-w-[120px]">
                          {userData.name.toUpperCase()}
                        </div>
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-red-500 mr-[-10px]"></div>
                          <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div
                    className="flip-card-back"
                    style={{ background: "linear-gradient(135deg, #deb350 0%, #c9a040 100%)" }}
                  >
                    <div className="magnetic-strip"></div>

                    <div className="mt-4 mb-2 px-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-700 text-xs">Security Code</div>
                        <div className="bg-white text-gray-900 px-2 py-1 rounded font-mono text-sm">
                          {accountData.cardCVV}
                        </div>
                      </div>

                      <div className="text-gray-700 text-xs mb-2">Signature</div>
                      <div className="signature-strip">
                        <span className="text-gray-800 font-serif overflow-hidden text-ellipsis">{userData.name}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-700 px-6">
                      This card is property of Primezart Bank. If found, please return to any Primezart branch.
                    </div>

                    <div className="flip-hint">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">Click the card to flip</div>
          </div>
        </div>

        {/* Transaction History - Horizontally Scrollable with Modal Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-20">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">Swipe left/right to view more or click for details</p>
          </div>
          <div className="overflow-x-auto" ref={scrollRef}>
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-gray-500 text-xs font-medium">Date</th>
                    <th className="py-3 px-4 text-left text-gray-500 text-xs font-medium">Description</th>
                    <th className="py-3 px-4 text-left text-gray-500 text-xs font-medium">Category</th>
                    <th className="py-3 px-4 text-left text-gray-500 text-xs font-medium">Reference</th>
                    <th className="py-3 px-4 text-right text-gray-500 text-xs font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.slice(0, 4).map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <td className="py-3 px-4 text-gray-600 text-sm">{transaction.date}</td>
                      <td className="py-3 px-4 font-medium text-sm">
                        {transaction.type === "Credit" ? transaction.from : transaction.to}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.category === "Business Income"
                              ? "bg-green-100 text-green-800"
                              : transaction.category === "Business Expense"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{transaction.reference}</td>
                      <td
                        className={`py-3 px-4 font-medium text-sm text-right ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "Credit"
                          ? formatAmount(transaction.amount)
                          : formatAmount(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 text-center">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => router.push("/dashboard/transactions")}
            >
              View All Transactions
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="sm:max-w-md">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedTransaction.type === "Credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedTransaction.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedTransaction.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p
                    className={`font-medium ${selectedTransaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                  >
                    {selectedTransaction.type === "Credit"
                      ? formatAmount(selectedTransaction.amount)
                      : formatAmount(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{selectedTransaction.type === "Credit" ? "From" : "To"}</p>
                  <p className="font-medium">
                    {selectedTransaction.type === "Credit" ? selectedTransaction.from : selectedTransaction.to}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedTransaction.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedTransaction.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-sm">{selectedTransaction.notes}</p>
              </div>

              <div className="border-t pt-4 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
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

      {/* Floating Menu Button (Hamburger Icon) */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="rounded-full p-4 bg-[#ff9800] hover:bg-[#f57c00] shadow-lg flex items-center justify-center">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Chat Button (Blue) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="rounded-full p-4 bg-[#001f3f] hover:bg-[#00346b] shadow-lg flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Floating Menu */}
      <FloatingMenu />

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
        
        .flip-card-back {
          transform: rotateY(180deg);
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

// Eye and EyeOff components for the balance visibility toggle
function Eye(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOff(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}
