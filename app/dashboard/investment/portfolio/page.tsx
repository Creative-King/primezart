"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, Filter, Download, RefreshCw, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock portfolio data
const portfolioData = {
  totalValue: 245678.92,
  totalReturn: 18.7,
  todayChange: 1.2,
  todayChangeAmount: 2932.45,
  allocation: {
    stocks: 65,
    bonds: 20,
    cash: 10,
    alternatives: 5,
  },
  assetClasses: [
    {
      name: "US Stocks",
      value: 98271.57,
      percentage: 40,
      change: 2.3,
      color: "bg-blue-500",
    },
    {
      name: "International Stocks",
      value: 61419.73,
      percentage: 25,
      change: 1.1,
      color: "bg-green-500",
    },
    {
      name: "Bonds",
      value: 49135.78,
      percentage: 20,
      change: 0.4,
      color: "bg-yellow-500",
    },
    {
      name: "Cash & Equivalents",
      value: 24567.89,
      percentage: 10,
      change: 0.1,
      color: "bg-gray-500",
    },
    {
      name: "Alternative Investments",
      value: 12283.95,
      percentage: 5,
      change: 3.2,
      color: "bg-purple-500",
    },
  ],
  topHoldings: [
    {
      name: "Apple Inc.",
      ticker: "AAPL",
      value: 15678.45,
      shares: 85,
      price: 184.45,
      change: 1.8,
      weight: 6.4,
    },
    {
      name: "Microsoft Corp.",
      ticker: "MSFT",
      value: 14532.78,
      shares: 42,
      price: 346.02,
      change: 2.1,
      weight: 5.9,
    },
    {
      name: "Amazon.com Inc.",
      ticker: "AMZN",
      value: 12876.34,
      shares: 95,
      price: 135.54,
      change: 1.5,
      weight: 5.2,
    },
    {
      name: "Vanguard Total Bond Market ETF",
      ticker: "BND",
      value: 11234.56,
      shares: 150,
      price: 74.9,
      change: 0.3,
      weight: 4.6,
    },
    {
      name: "Alphabet Inc.",
      ticker: "GOOGL",
      value: 10987.65,
      shares: 78,
      price: 140.87,
      change: 1.9,
      weight: 4.5,
    },
  ],
  performance: {
    "1M": 2.4,
    "3M": 5.7,
    YTD: 12.3,
    "1Y": 18.7,
    "3Y": 42.5,
    "5Y": 76.8,
    "10Y": 168.4,
  },
  recentActivity: [
    {
      date: "2024-11-20",
      type: "Dividend",
      description: "Dividend Payment - AAPL",
      amount: 125.45,
    },
    {
      date: "2024-11-18",
      type: "Buy",
      description: "Purchased 10 shares of MSFT",
      amount: -3460.2,
    },
    {
      date: "2024-11-15",
      type: "Sell",
      description: "Sold 15 shares of AMZN",
      amount: 2033.1,
    },
    {
      date: "2024-11-10",
      type: "Deposit",
      description: "Deposit to investment account",
      amount: 5000.0,
    },
    {
      date: "2024-11-05",
      type: "Dividend",
      description: "Dividend Payment - VTI",
      amount: 87.32,
    },
  ],
}

export default function PortfolioPage() {
  const [timeframe, setTimeframe] = useState("1Y")

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-gray-500">Manage and track your investment portfolio</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(portfolioData.totalValue)}</div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+{portfolioData.totalReturn}%</span>
                <span className="text-gray-500 ml-1">all time</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Today's Change</span>
                  <div className="flex items-center">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">
                      +{formatCurrency(portfolioData.todayChangeAmount)} ({portfolioData.todayChange}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{portfolioData.allocation.stocks}%</div>
                  <div className="text-sm text-gray-500">Stocks</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{portfolioData.allocation.bonds}%</div>
                  <div className="text-sm text-gray-500">Bonds</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{portfolioData.allocation.cash}%</div>
                  <div className="text-sm text-gray-500">Cash</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{portfolioData.allocation.alternatives}%</div>
                  <div className="text-sm text-gray-500">Alternatives</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1M">1 Month</SelectItem>
                    <SelectItem value="3M">3 Months</SelectItem>
                    <SelectItem value="YTD">Year to Date</SelectItem>
                    <SelectItem value="1Y">1 Year</SelectItem>
                    <SelectItem value="3Y">3 Years</SelectItem>
                    <SelectItem value="5Y">5 Years</SelectItem>
                    <SelectItem value="10Y">10 Years</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">
                    +{portfolioData.performance[timeframe as keyof typeof portfolioData.performance]}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min(100, portfolioData.performance[timeframe as keyof typeof portfolioData.performance])}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Classes</CardTitle>
              <CardDescription>Breakdown of your portfolio by asset class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.assetClasses.map((asset, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${asset.color} mr-2`}></div>
                        <span>{asset.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(asset.value)}</div>
                        <div className="text-sm text-gray-500">{asset.percentage}%</div>
                      </div>
                    </div>
                    <Progress value={asset.percentage} className="h-2 bg-gray-200" indicatorClassName={asset.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Holdings</CardTitle>
                <CardDescription>Your largest investments by value</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.topHoldings.map((holding, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{holding.name}</div>
                      <div className="text-sm text-gray-500">
                        {holding.ticker} • {holding.shares} shares • {formatCurrency(holding.price)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(holding.value)}</div>
                      <div className="flex items-center justify-end text-sm">
                        <span className={holding.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {holding.change >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 inline mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 inline mr-1" />
                          )}
                          {holding.change}%
                        </span>
                        <span className="text-gray-500 ml-2">{holding.weight}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{activity.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()} • {activity.type}
                    </div>
                  </div>
                  <div className={`font-medium ${activity.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {activity.amount >= 0 ? "+" : ""}
                    {formatCurrency(activity.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline">View All Transactions</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
