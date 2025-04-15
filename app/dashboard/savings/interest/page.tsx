"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Percent, ArrowUpRight, Calendar, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FloatingRadialMenu from "@/components/floating-radial-menu"

// Mock data for interest details
const interestData = {
  currentRate: 3.25,
  nextRateChange: "2024-12-15",
  interestEarned: {
    thisMonth: 93.45,
    ytd: 876.32,
    total: 2345.67,
    history: [
      { month: "Jan", amount: 85.32 },
      { month: "Feb", amount: 86.45 },
      { month: "Mar", amount: 87.21 },
      { month: "Apr", amount: 88.76 },
      { month: "May", amount: 89.32 },
      { month: "Jun", amount: 90.15 },
      { month: "Jul", amount: 90.87 },
      { month: "Aug", amount: 91.45 },
      { month: "Sep", amount: 92.1 },
      { month: "Oct", amount: 92.78 },
      { month: "Nov", amount: 93.45 },
      { month: "Dec", amount: 0 },
    ],
  },
  compoundingSchedule: "Daily",
  paymentSchedule: "Monthly",
  nextPaymentDate: "2024-12-01",
  rateHistory: [
    { date: "2024-01-15", rate: 3.0 },
    { date: "2024-04-15", rate: 3.1 },
    { date: "2024-07-15", rate: 3.25 },
  ],
  projections: {
    oneYear: {
      interest: 1105.67,
      balance: 35627.56,
    },
    fiveYears: {
      interest: 5987.34,
      balance: 40509.23,
    },
    tenYears: {
      interest: 13368.56,
      balance: 47890.45,
    },
  },
}

export default function SavingsInterestPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/savings")} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Interest Details</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 pb-24">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Current Interest Rate</CardTitle>
                <CardDescription>Your savings account interest details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="text-4xl font-bold text-green-600 flex items-center">
                    {formatPercentage(interestData.currentRate)}
                    <span className="text-sm ml-2 text-gray-500">APY</span>
                  </div>
                  <div className="ml-4 flex items-center text-green-600 text-sm">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>
                      Increased from{" "}
                      {formatPercentage(interestData.rateHistory[interestData.rateHistory.length - 2].rate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Interest Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Compounding</span>
                        <span className="text-sm font-medium">{interestData.compoundingSchedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Schedule</span>
                        <span className="text-sm font-medium">{interestData.paymentSchedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Next Payment</span>
                        <span className="text-sm font-medium">{formatDate(interestData.nextPaymentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Next Rate Review</span>
                        <span className="text-sm font-medium">{formatDate(interestData.nextRateChange)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Interest Earned</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">This Month</span>
                          <span className="text-green-600 font-medium">
                            {formatCurrency(interestData.interestEarned.thisMonth)}
                          </span>
                        </div>
                        <Progress value={100} max={100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Year to Date</span>
                          <span className="text-green-600 font-medium">
                            {formatCurrency(interestData.interestEarned.ytd)}
                          </span>
                        </div>
                        <Progress value={100} max={100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Total Interest Earned</span>
                          <span className="text-green-600 font-medium">
                            {formatCurrency(interestData.interestEarned.total)}
                          </span>
                        </div>
                        <Progress value={100} max={100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Monthly Interest</CardTitle>
                <CardDescription>Interest earned each month this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-2 h-40">
                  {interestData.interestEarned.history.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex-1 w-full flex items-end">
                        <div
                          className="w-full bg-green-200 rounded-t-sm"
                          style={{
                            height: `${(month.amount / Math.max(...interestData.interestEarned.history.map((m) => m.amount))) * 100}%`,
                            backgroundColor: month.amount > 0 ? "#86efac" : "#f0f0f0",
                          }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Interest Rate History</CardTitle>
                <CardDescription>Changes to your savings account interest rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interestData.rateHistory.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <Percent className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Rate Change</h3>
                          <span className="text-green-600 font-medium">{formatPercentage(item.rate)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Effective Date</span>
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Interest Payment History</CardTitle>
                <CardDescription>Recent interest payments to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interestData.interestEarned.history
                    .slice(0, 6)
                    .reverse()
                    .map(
                      (item, index) =>
                        item.amount > 0 && (
                          <div
                            key={index}
                            className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">Interest Payment</h3>
                                <span className="text-green-600 font-medium">{formatCurrency(item.amount)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{item.month} 2024</span>
                                <span>Monthly Interest</span>
                              </div>
                            </div>
                          </div>
                        ),
                    )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 pt-4">
                <Button variant="outline" className="w-full text-green-600 hover:bg-green-50">
                  View All Payments
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Interest Projections</CardTitle>
                    <CardDescription>Estimated future interest earnings</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Projections are based on your current balance and interest rate. Actual results may vary based
                          on deposits, withdrawals, and rate changes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">1 Year</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Interest Earned</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(interestData.projections.oneYear.interest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Projected Balance</p>
                          <p className="text-lg font-medium">
                            {formatCurrency(interestData.projections.oneYear.balance)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">5 Years</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Interest Earned</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(interestData.projections.fiveYears.interest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Projected Balance</p>
                          <p className="text-lg font-medium">
                            {formatCurrency(interestData.projections.fiveYears.balance)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">10 Years</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Interest Earned</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(interestData.projections.tenYears.interest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Projected Balance</p>
                          <p className="text-lg font-medium">
                            {formatCurrency(interestData.projections.tenYears.balance)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-800 mb-1">Maximize Your Interest</h3>
                      <p className="text-sm text-green-700">
                        Setting up automatic deposits can help you earn more interest over time. Consider increasing
                        your monthly contributions to reach your savings goals faster.
                      </p>
                      <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white">Set Up Auto-Deposit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Menu */}
      <FloatingRadialMenu type="savings" />
    </div>
  )
}
