"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FloatingMenu from "@/components/floating-menu"
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Filter,
  UserPlus,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Building2,
  PiggyBank,
} from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// Mock data for joint account
const jointAccountData = {
  balance: 28750.45,
  change: 2.35,
  changeAmount: 658.32,
  owners: [
    { id: "owner1", name: "Kayla Jones", email: "kayla.jones@example.com", role: "Primary" },
    { id: "owner2", name: "Thomas Wilson", email: "thomas.wilson@example.com", role: "Co-owner" },
  ],
  transactions: [
    {
      id: "tx1",
      date: "2024-11-20",
      description: "Grocery Shopping",
      amount: -125.45,
      category: "Food & Dining",
      initiatedBy: "Kayla Jones",
    },
    {
      id: "tx2",
      date: "2024-11-18",
      description: "Utility Bill Payment",
      amount: -210.78,
      category: "Bills & Utilities",
      initiatedBy: "Thomas Wilson",
    },
    {
      id: "tx3",
      date: "2024-11-15",
      description: "Salary Deposit",
      amount: 3500.0,
      category: "Income",
      initiatedBy: "Automatic Transfer",
    },
    {
      id: "tx4",
      date: "2024-11-10",
      description: "Home Insurance",
      amount: -145.5,
      category: "Insurance",
      initiatedBy: "Automatic Payment",
    },
    {
      id: "tx5",
      date: "2024-11-05",
      description: "Dinner at Restaurant",
      amount: -98.75,
      category: "Food & Dining",
      initiatedBy: "Kayla Jones",
    },
  ],
  pendingApprovals: [
    {
      id: "pa1",
      date: "2024-11-21",
      description: "Large Transfer",
      amount: 5000.0,
      requestedBy: "Thomas Wilson",
      status: "Pending Approval",
    },
    {
      id: "pa2",
      date: "2024-11-22",
      description: "New Authorized User",
      amount: null,
      requestedBy: "Thomas Wilson",
      status: "Pending Approval",
      details: "Add Rebecca Martinez as an authorized user",
    },
  ],
  activityHistory: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Balance",
        data: [15000, 16200, 17500, 18900, 20400, 22000, 23500, 24800, 26200, 27500, 28100, 28750],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  spendingByCategory: [
    { category: "Housing", amount: 1250.0, percentage: 35 },
    { category: "Food & Dining", amount: 850.75, percentage: 24 },
    { category: "Transportation", amount: 450.25, percentage: 13 },
    { category: "Entertainment", amount: 350.5, percentage: 10 },
    { category: "Utilities", amount: 320.45, percentage: 9 },
    { category: "Other", amount: 320.0, percentage: 9 },
  ],
}

export default function JointAccountDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [timeRange, setTimeRange] = useState("1M")
  const [hideBalance, setHideBalance] = useState(false)
  const [lastLogin, setLastLogin] = useState("Today, 09:15 AM")

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Store account mode in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accountMode", "joint")
    }
  }, [router])

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 4,
      },
    },
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Personal</span>
            </Link>
            <Link
              href="/dashboard/business"
              className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
            >
              <Building2 className="h-5 w-5 mr-2" />
              <span>Business</span>
            </Link>
            <Link href="/dashboard/joint" className="flex items-center text-indigo-600 font-medium">
              <Users className="h-5 w-5 mr-2" />
              <span>Joint</span>
            </Link>
            <Link
              href="/dashboard/savings"
              className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
            >
              <PiggyBank className="h-5 w-5 mr-2" />
              <span>Savings</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">Last login: {lastLogin}</div>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button
              onClick={handleLogout}
              className="text-gray-500 font-medium flex items-center hover:text-blue-600 transition-colors"
            >
              Sign Out <span className="ml-1">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Joint Account Dashboard</h1>
          <p className="text-gray-600">Manage your shared finances with transparency and control.</p>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Account Overview</CardTitle>
                  <CardDescription>Joint checking account</CardDescription>
                </div>
                <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[100px] border-gray-300">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1W">1W</SelectItem>
                    <SelectItem value="1M">1M</SelectItem>
                    <SelectItem value="3M">3M</SelectItem>
                    <SelectItem value="6M">6M</SelectItem>
                    <SelectItem value="1Y">1Y</SelectItem>
                    <SelectItem value="ALL">ALL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end mb-4">
                <div className="flex items-center">
                  <div className="text-3xl font-bold">
                    {hideBalance ? "••••••••" : formatCurrency(jointAccountData.balance)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHideBalance(!hideBalance)}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div
                  className={`ml-3 flex items-center ${
                    jointAccountData.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {jointAccountData.change >= 0 ? (
                    <ArrowUpRight size={16} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="mr-1" />
                  )}
                  <span className="font-medium">{formatPercentage(jointAccountData.change)}</span>
                  <span className="ml-1 text-sm text-gray-400">({formatCurrency(jointAccountData.changeAmount)})</span>
                </div>
              </div>
              <div className="h-64">
                <Line data={jointAccountData.activityHistory} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Account Owners</CardTitle>
              <CardDescription>People with access to this account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jointAccountData.owners.map((owner) => (
                  <div key={owner.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={owner.name} />
                        <AvatarFallback className="bg-indigo-500 text-white">
                          {owner.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{owner.name}</p>
                        <p className="text-xs text-gray-500">{owner.email}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        owner.role === "Primary" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {owner.role}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 border-indigo-500 text-indigo-600 hover:bg-indigo-50" variant="outline">
                <UserPlus size={16} className="mr-2" /> Add Account Owner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        {jointAccountData.pendingApprovals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Approvals</h2>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {jointAccountData.pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <AlertCircle size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">{approval.description}</p>
                          <p className="text-sm text-gray-600">
                            Requested by {approval.requestedBy} on {formatDate(approval.date)}
                          </p>
                          {approval.details && <p className="text-xs text-gray-500 mt-1">{approval.details}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {approval.amount !== null && (
                          <p className="font-medium mr-4">{formatCurrency(approval.amount)}</p>
                        )}
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">
                          <Check size={16} className="mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 h-8">
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Transactions and Spending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Recent Transactions</CardTitle>
                  <Button variant="outline" className="border-gray-300">
                    <Filter size={16} className="mr-2" /> Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="pb-2 font-medium text-gray-500 text-sm">Date</th>
                        <th className="pb-2 font-medium text-gray-500 text-sm">Description</th>
                        <th className="pb-2 font-medium text-gray-500 text-sm">Category</th>
                        <th className="pb-2 font-medium text-gray-500 text-sm">Initiated By</th>
                        <th className="pb-2 font-medium text-gray-500 text-sm text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jointAccountData.transactions.slice(0, 4).map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 text-sm text-gray-500">{formatDate(transaction.date)}</td>
                          <td className="py-3 font-medium">{transaction.description}</td>
                          <td className="py-3 text-sm">
                            <Badge className="bg-gray-100 text-gray-800 font-normal">{transaction.category}</Badge>
                          </td>
                          <td className="py-3 text-sm text-gray-500">{transaction.initiatedBy}</td>
                          <td
                            className={`py-3 font-medium text-right ${
                              transaction.amount >= 0 ? "text-green-600" : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pt-4 text-center border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                    onClick={() => router.push("/dashboard/transactions")}
                  >
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Spending by Category</CardTitle>
                <CardDescription>Your spending habits this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jointAccountData.spendingByCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2 bg-indigo-500"></div>
                        <p className="font-medium">{category.category}</p>
                      </div>
                      <p className="text-sm text-gray-500">{category.percentage}%</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 border-indigo-500 text-indigo-600 hover:bg-indigo-50" variant="outline">
                  <BarChart3 size={16} className="mr-2" /> View Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingMenu />
    </div>
  )
}

