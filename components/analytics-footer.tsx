"use client"

import { useEffect, useState } from "react"
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, InfoIcon, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface AnalyticsFooterProps {
  accountType: string
}

export function AnalyticsFooter({ accountType }: AnalyticsFooterProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Personal account data
  const personalAnalytics = {
    monthlyIncome: 7850.0,
    monthlySpending: 5432.67,
    savingsRate: 30.8,
    monthOverMonthChange: 3.2,
    categorizedSpending: [
      { category: "Housing", amount: 1800, percentage: 33.1 },
      { category: "Food", amount: 850, percentage: 15.6 },
      { category: "Transportation", amount: 420, percentage: 7.7 },
      { category: "Utilities", amount: 380, percentage: 7.0 },
      { category: "Entertainment", amount: 560, percentage: 10.3 },
      { category: "Others", amount: 1422.67, percentage: 26.3 },
    ],
    savingsGoal: { current: 34500, target: 50000, percentage: 69 },
  }

  // Business account data
  const businessAnalytics = {
    monthlyRevenue: 87500.0,
    monthlyExpenses: 64350.75,
    profitMargin: 26.5,
    monthOverMonthChange: 4.8,
    categorizedExpenses: [
      { category: "Payroll", amount: 32500, percentage: 50.5 },
      { category: "Inventory", amount: 12300, percentage: 19.1 },
      { category: "Marketing", amount: 7800, percentage: 12.1 },
      { category: "Rent", amount: 5500, percentage: 8.6 },
      { category: "Utilities", amount: 2200, percentage: 3.4 },
      { category: "Others", amount: 4050.75, percentage: 6.3 },
    ],
    revenueGoal: { current: 820000, target: 1000000, percentage: 82 },
  }

  const data = accountType === "personal" ? personalAnalytics : businessAnalytics

  // Early return to prevent hydration errors
  if (!isClient) return null

  return (
    <div className="border-t border-gray-200 bg-gray-50 py-4 mt-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Monthly Summary */}
          <div className="md:col-span-4">
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  {accountType === "personal" ? "Monthly Summary" : "Business Performance"}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          {accountType === "personal"
                            ? "Summary of your monthly income and spending patterns"
                            : "Overview of your business financial performance"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {accountType === "personal" ? "Monthly Income" : "Monthly Revenue"}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(accountType === "personal" ? data.monthlyIncome : data.monthlyRevenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {accountType === "personal" ? "Monthly Spending" : "Monthly Expenses"}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(accountType === "personal" ? data.monthlySpending : data.monthlyExpenses)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-medium">
                      {accountType === "personal" ? "Savings Rate" : "Profit Margin"}
                    </span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {accountType === "personal" ? data.savingsRate : data.profitMargin}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Month-over-Month</span>
                    <span
                      className={`text-sm font-medium flex items-center ${
                        data.monthOverMonthChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {data.monthOverMonthChange >= 0 ? (
                        <TrendingUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(data.monthOverMonthChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spending/Expense Categories */}
          <div className="md:col-span-4">
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  {accountType === "personal" ? "Spending Categories" : "Expense Breakdown"}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          {accountType === "personal"
                            ? "Breakdown of your spending by category"
                            : "Analysis of your business expenses by category"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>

                <div className="space-y-2">
                  {(accountType === "personal" ? data.categorizedSpending : data.categorizedExpenses)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.category}</span>
                            <span className="font-medium">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <PieChart className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">
                      {accountType === "personal" ? "Top spending: " : "Top expense: "}
                      <span className="font-medium">
                        {(accountType === "personal" ? data.categorizedSpending : data.categorizedExpenses)[0].category}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs font-medium">
                    {(accountType === "personal" ? data.categorizedSpending : data.categorizedExpenses)[0].percentage}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Goals */}
          <div className="md:col-span-4">
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  {accountType === "personal" ? "Savings Goal" : "Revenue Goal"}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          {accountType === "personal"
                            ? "Progress towards your savings target"
                            : "Progress towards your annual revenue target"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center">
                        <DollarSignIcon className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium">
                          {accountType === "personal" ? "Emergency Fund" : "Annual Target"}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {accountType === "personal" ? data.savingsGoal.percentage : data.revenueGoal.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${accountType === "personal" ? data.savingsGoal.percentage : data.revenueGoal.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">
                      {formatCurrency(accountType === "personal" ? data.savingsGoal.current : data.revenueGoal.current)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">
                      {formatCurrency(accountType === "personal" ? data.savingsGoal.target : data.revenueGoal.target)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-xs text-muted-foreground">Projected completion</span>
                    </div>
                    <span className="text-xs font-medium">
                      {accountType === "personal" ? "September 2025" : "November 2025"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

