"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PiggyBank, ArrowUpRight, Filter, Users, Building2, Plus, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import FloatingRadialMenu from "@/components/floating-radial-menu"

// Mock data for savings account
const savingsData = {
  balance: 34521.89,
  interestRate: 3.25,
  interestEarned: {
    thisMonth: 93.45,
    ytd: 876.32,
    total: 2345.67,
  },
  projectedGrowth: {
    oneYear: 35650.12,
    fiveYears: 40532.76,
    tenYears: 47890.45,
  },
  savingsGoals: [
    {
      id: "goal1",
      name: "Emergency Fund",
      target: 10000,
      current: 8500,
      deadline: "2024-12-31",
      color: "#22c55e",
    },
    {
      id: "goal2",
      name: "Vacation",
      target: 5000,
      current: 2750,
      deadline: "2025-06-30",
      color: "#6366f1",
    },
    {
      id: "goal3",
      name: "New Car",
      target: 25000,
      current: 12500,
      deadline: "2026-01-15",
      color: "#f59e0b",
    },
    {
      id: "goal4",
      name: "Home Down Payment",
      target: 50000,
      current: 15000,
      deadline: "2027-05-20",
      color: "#ec4899",
    },
  ],
  transactions: [
    {
      id: "tx1",
      date: "2024-11-20",
      description: "Deposit",
      amount: 1000.0,
      type: "credit",
    },
    {
      id: "tx2",
      date: "2024-11-15",
      description: "Interest Payment",
      amount: 93.45,
      type: "credit",
    },
    {
      id: "tx3",
      date: "2024-11-10",
      description: "Transfer to Checking",
      amount: -500.0,
      type: "debit",
    },
    {
      id: "tx4",
      date: "2024-11-05",
      description: "Automatic Savings",
      amount: 250.0,
      type: "credit",
    },
    {
      id: "tx5",
      date: "2024-11-01",
      description: "Deposit",
      amount: 750.0,
      type: "credit",
    },
  ],
}

export default function SavingsDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Store account mode in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accountMode", "savings")
    }
  }, [router])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Calculate percentage for progress bars
  const calculatePercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  // Calculate days remaining for goals
  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
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
            <Link href="/dashboard/savings" className="flex items-center text-green-600 font-medium">
              <PiggyBank className="h-5 w-5 mr-2" />
              <span>Savings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Savings Dashboard</h1>
          <p className="text-gray-600">Manage your savings and track your progress toward financial goals.</p>
        </div>

        {/* Savings Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Savings Goals</CardTitle>
                  <CardDescription>Track your progress toward financial goals</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300">
                  <Plus size={16} className="mr-2" /> Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end mb-4">
                <div className="text-3xl font-bold">
                  {hideBalance ? "••••••••" : formatCurrency(savingsData.balance)}
                </div>
                <div className="ml-3 flex items-center text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span className="font-medium">+{formatPercentage(savingsData.interestRate)} APY</span>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {savingsData.savingsGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Target size={16} className="mr-2 text-gray-500" />
                        <span className="font-medium">{goal.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">{calculateDaysRemaining(goal.deadline)} days left</div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{formatCurrency(goal.current)}</span>
                      <span>{formatCurrency(goal.target)}</span>
                    </div>
                    <Progress
                      value={calculatePercentage(goal.current, goal.target)}
                      max={100}
                      className="h-2 bg-gray-100"
                      indicatorClassName={`bg-[${goal.color}]`}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{calculatePercentage(goal.current, goal.target)}% complete</span>
                      <span>{formatCurrency(goal.target - goal.current)} to go</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Interest Summary</CardTitle>
              <CardDescription>Interest earned on your savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">This Month</span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(savingsData.interestEarned.thisMonth)}
                    </span>
                  </div>
                  <Progress value={100} max={100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Year to Date</span>
                    <span className="text-green-600 font-medium">{formatCurrency(savingsData.interestEarned.ytd)}</span>
                  </div>
                  <Progress value={100} max={100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Total Interest Earned</span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(savingsData.interestEarned.total)}
                    </span>
                  </div>
                  <Progress value={100} max={100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Projected Growth</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500">1 Year</p>
                      <p className="font-medium text-sm">{formatCurrency(savingsData.projectedGrowth.oneYear)}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500">5 Years</p>
                      <p className="font-medium text-sm">{formatCurrency(savingsData.projectedGrowth.fiveYears)}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500">10 Years</p>
                      <p className="font-medium text-sm">{formatCurrency(savingsData.projectedGrowth.tenYears)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <Button variant="outline" className="border-gray-300">
              <Filter size={16} className="mr-2" /> Filter
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {savingsData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.description}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                            transaction.type === "credit" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-200">
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingRadialMenu type="savings" />
    </div>
  )
}

