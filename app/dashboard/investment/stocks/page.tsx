"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, Search, RefreshCw, Info, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock stocks data
const stocksData = [
  {
    id: "aapl",
    name: "Apple Inc.",
    ticker: "AAPL",
    price: 184.45,
    change: 1.8,
    marketCap: 2870000000000,
    pe: 30.5,
    dividend: 0.6,
    sector: "Technology",
    logo: "🍎",
  },
  {
    id: "msft",
    name: "Microsoft Corp.",
    ticker: "MSFT",
    price: 346.02,
    change: 2.1,
    marketCap: 2580000000000,
    pe: 34.2,
    dividend: 0.8,
    sector: "Technology",
    logo: "🪟",
  },
  {
    id: "amzn",
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    price: 135.54,
    change: 1.5,
    marketCap: 1390000000000,
    pe: 58.7,
    dividend: 0,
    sector: "Consumer Cyclical",
    logo: "📦",
  },
  {
    id: "googl",
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    price: 140.87,
    change: 1.9,
    marketCap: 1770000000000,
    pe: 25.3,
    dividend: 0,
    sector: "Technology",
    logo: "🔍",
  },
  {
    id: "meta",
    name: "Meta Platforms Inc.",
    ticker: "META",
    price: 485.39,
    change: 0.7,
    marketCap: 1240000000000,
    pe: 26.1,
    dividend: 0,
    sector: "Technology",
    logo: "👤",
  },
  {
    id: "tsla",
    name: "Tesla Inc.",
    ticker: "TSLA",
    price: 175.34,
    change: -2.3,
    marketCap: 557000000000,
    pe: 47.8,
    dividend: 0,
    sector: "Consumer Cyclical",
    logo: "🚗",
  },
  {
    id: "jpm",
    name: "JPMorgan Chase & Co.",
    ticker: "JPM",
    price: 198.47,
    change: 0.5,
    marketCap: 573000000000,
    pe: 12.1,
    dividend: 2.4,
    sector: "Financial Services",
    logo: "🏦",
  },
  {
    id: "v",
    name: "Visa Inc.",
    ticker: "V",
    price: 275.96,
    change: 0.3,
    marketCap: 560000000000,
    pe: 30.7,
    dividend: 0.8,
    sector: "Financial Services",
    logo: "💳",
  },
]

export default function StockBuyingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedStock, setSelectedStock] = useState("aapl")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [orderType, setOrderType] = useState("market")

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: amount < 1 ? 2 : 2,
      maximumFractionDigits: amount < 1 ? 2 : 2,
    }).format(amount)
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(2) + "T"
    }
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B"
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M"
    }
    return num.toString()
  }

  // Filter stocks by search term and sector
  const filteredStocks = stocksData.filter(
    (stock) =>
      (stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSector === "all" || stock.sector === selectedSector),
  )

  // Calculate shares based on USD input
  const calculateShares = () => {
    if (!purchaseAmount) return "0"
    const stock = stocksData.find((s) => s.id === selectedStock)
    if (!stock) return "0"

    const shares = Number.parseFloat(purchaseAmount) / stock.price
    return shares.toFixed(4)
  }

  // Get selected stock data
  const getSelectedStock = () => {
    return stocksData.find((s) => s.id === selectedStock) || stocksData[0]
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Buying</h1>
            <p className="text-gray-500">Purchase stocks for your investment portfolio</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Prices
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Portfolio</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Stocks</CardTitle>
                <CardDescription>Buy stocks with your investment account funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Stock</label>
                  <Select defaultValue={selectedStock} onValueChange={setSelectedStock}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stocksData.map((stock) => (
                        <SelectItem key={stock.id} value={stock.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{stock.logo}</span>
                            <span>
                              {stock.name} ({stock.ticker})
                            </span>
                            <span className="ml-auto text-sm text-gray-500">{formatCurrency(stock.price)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                    <Select defaultValue={orderType} onValueChange={setOrderType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                        <SelectItem value="stop">Stop Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {orderType !== "market" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Limit Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <Input placeholder="0.00" className="pl-7" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shares ({getSelectedStock().ticker})
                    </label>
                    <div className="relative">
                      <Input type="text" readOnly value={calculateShares()} className="bg-gray-50" />
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700 text-sm">
                    Stock prices are subject to market volatility. Your investment may lose value. Please review our
                    risk disclosure before investing.
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Buy {getSelectedStock().ticker}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>Current stock market data</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search stocks..."
                      className="pl-9 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Financial Services">Financial Services</SelectItem>
                      <SelectItem value="Consumer Cyclical">Consumer Cyclical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-500 text-sm">Stock</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Price</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Change</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Market Cap</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">P/E</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Dividend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStocks.map((stock) => (
                        <tr
                          key={stock.id}
                          className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedStock(stock.id)}
                        >
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{stock.logo}</span>
                              <div>
                                <div className="font-medium">{stock.name}</div>
                                <div className="text-xs text-gray-500">
                                  {stock.ticker} • {stock.sector}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 font-medium">{formatCurrency(stock.price)}</td>
                          <td className="text-right py-3">
                            <span className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change}%
                            </span>
                          </td>
                          <td className="text-right py-3 text-gray-700">{formatNumber(stock.marketCap)}</td>
                          <td className="text-right py-3 text-gray-700">{stock.pe.toFixed(1)}</td>
                          <td className="text-right py-3 text-gray-700">{stock.dividend}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected Stock</CardTitle>
                <CardDescription>
                  {getSelectedStock().name} ({getSelectedStock().ticker})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getSelectedStock().logo}</span>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(getSelectedStock().price)}</div>
                      <div
                        className={`flex items-center ${getSelectedStock().change >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {getSelectedStock().change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {getSelectedStock().change >= 0 ? "+" : ""}
                        {getSelectedStock().change}% today
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Cap</span>
                    <span className="font-medium">{formatNumber(getSelectedStock().marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">P/E Ratio</span>
                    <span className="font-medium">{getSelectedStock().pe.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dividend Yield</span>
                    <span className="font-medium">{getSelectedStock().dividend}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sector</span>
                    <span className="font-medium">{getSelectedStock().sector}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" className="flex-1">
                    <LineChart className="h-4 w-4 mr-2" />
                    Chart
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Available Cash</span>
                    <span className="font-medium">{formatCurrency(34521.89)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Buying Power</span>
                    <span className="font-medium">{formatCurrency(34521.89)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Pending Orders</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-medium mb-1">S&P 500</h3>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">5,123.45</span>
                      <span className="text-green-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        0.8%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">NASDAQ</h3>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">16,789.32</span>
                      <span className="text-green-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">DOW JONES</h3>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">38,654.21</span>
                      <span className="text-green-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        0.5%
                      </span>
                    </div>
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
