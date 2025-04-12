"use client"

import { useState } from "react"
import { Globe, ArrowUpRight, Search, Filter, Download, RefreshCw, Info, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Mock international markets data
const marketsData = [
  {
    id: "us",
    name: "United States",
    index: "S&P 500",
    value: 5123.45,
    change: 0.8,
    ytdReturn: 12.4,
    currency: "USD",
    flag: "🇺🇸",
  },
  {
    id: "eu",
    name: "Europe",
    index: "STOXX 600",
    value: 498.76,
    change: 0.3,
    ytdReturn: 8.7,
    currency: "EUR",
    flag: "🇪🇺",
  },
  {
    id: "uk",
    name: "United Kingdom",
    index: "FTSE 100",
    value: 7654.32,
    change: -0.2,
    ytdReturn: 5.3,
    currency: "GBP",
    flag: "🇬🇧",
  },
  {
    id: "jp",
    name: "Japan",
    index: "Nikkei 225",
    value: 38765.43,
    change: 1.5,
    ytdReturn: 15.8,
    currency: "JPY",
    flag: "🇯🇵",
  },
  {
    id: "cn",
    name: "China",
    index: "Shanghai Composite",
    value: 3245.67,
    change: -0.7,
    ytdReturn: -3.2,
    currency: "CNY",
    flag: "🇨🇳",
  },
  {
    id: "in",
    name: "India",
    index: "SENSEX",
    value: 72345.67,
    change: 1.2,
    ytdReturn: 10.5,
    currency: "INR",
    flag: "🇮🇳",
  },
  {
    id: "br",
    name: "Brazil",
    index: "Bovespa",
    value: 125678.9,
    change: -0.5,
    ytdReturn: 7.8,
    currency: "BRL",
    flag: "🇧🇷",
  },
  {
    id: "au",
    name: "Australia",
    index: "ASX 200",
    value: 7654.32,
    change: 0.6,
    ytdReturn: 9.2,
    currency: "AUD",
    flag: "🇦🇺",
  },
]

// User's international holdings
const userInternationalHoldings = [
  {
    id: "vea",
    name: "Vanguard FTSE Developed Markets ETF",
    ticker: "VEA",
    shares: 250,
    price: 48.76,
    value: 12190.0,
    change: 0.5,
    regions: ["Europe", "Asia", "Australia"],
  },
  {
    id: "vwo",
    name: "Vanguard FTSE Emerging Markets ETF",
    ticker: "VWO",
    shares: 200,
    price: 42.35,
    value: 8470.0,
    change: -0.3,
    regions: ["China", "India", "Brazil", "South Africa"],
  },
  {
    id: "ezu",
    name: "iShares MSCI Eurozone ETF",
    ticker: "EZU",
    shares: 150,
    price: 47.89,
    value: 7183.5,
    change: 0.2,
    regions: ["Europe"],
  },
  {
    id: "ewj",
    name: "iShares MSCI Japan ETF",
    ticker: "EWJ",
    shares: 100,
    price: 67.54,
    value: 6754.0,
    change: 1.3,
    regions: ["Japan"],
  },
]

export default function InternationalPage() {
  const [activeTab, setActiveTab] = useState("markets")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Filter markets by search term
  const filteredMarkets = marketsData.filter(
    (market) =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.index.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter holdings by region
  const filteredHoldings =
    selectedRegion === "all"
      ? userInternationalHoldings
      : userInternationalHoldings.filter((holding) =>
          holding.regions.some((region) => region.toLowerCase() === selectedRegion.toLowerCase()),
        )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">International Investments</h1>
            <p className="text-gray-500">Diversify your portfolio with global markets</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Invest Globally
            </Button>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            International investments are subject to currency exchange risk, political risk, and different regulatory
            environments. Consider consulting with an advisor before investing.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="markets" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="markets">Global Markets</TabsTrigger>
            <TabsTrigger value="portfolio">Your Holdings</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search markets..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Global Market Indices</CardTitle>
                <CardDescription>Performance of major international markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-500 text-sm">Market</th>
                        <th className="text-left py-2 font-medium text-gray-500 text-sm">Index</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Value</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Daily Change</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">YTD Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMarkets.map((market) => (
                        <tr key={market.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{market.flag}</span>
                              <div className="font-medium">{market.name}</div>
                            </div>
                          </td>
                          <td className="py-3 text-gray-700">{market.index}</td>
                          <td className="text-right py-3 font-medium">
                            {formatCurrency(market.value, market.currency)}
                          </td>
                          <td className="text-right py-3">
                            <span className={market.change >= 0 ? "text-green-500" : "text-red-500"}>
                              {market.change >= 0 ? "+" : ""}
                              {market.change}%
                            </span>
                          </td>
                          <td className="text-right py-3">
                            <span className={market.ytdReturn >= 0 ? "text-green-500" : "text-red-500"}>
                              {market.ytdReturn >= 0 ? "+" : ""}
                              {market.ytdReturn}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select defaultValue={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="brazil">Brazil</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                View Allocation
              </Button>
              <Button variant="outline" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total International Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(userInternationalHoldings.reduce((acc, curr) => acc + curr.value, 0))}
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+9.7%</span>
                    <span className="text-gray-500 ml-1">YTD</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Portfolio Allocation</span>
                      <span className="font-medium">35.8%</span>
                    </div>
                    <Progress value={35.8} className="h-2 bg-gray-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Regional Exposure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Europe</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />

                    <div className="flex justify-between text-sm">
                      <span>Asia-Pacific</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />

                    <div className="flex justify-between text-sm">
                      <span>Emerging Markets</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2 bg-gray-200" indicatorClassName="bg-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Currency Exposure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>EUR</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />

                    <div className="flex justify-between text-sm">
                      <span>JPY</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />

                    <div className="flex justify-between text-sm">
                      <span>GBP</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2 bg-gray-200" indicatorClassName="bg-purple-500" />

                    <div className="flex justify-between text-sm">
                      <span>Other</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2 bg-gray-200" indicatorClassName="bg-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your International Holdings</CardTitle>
                <CardDescription>Current international investments in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHoldings.map((holding) => (
                    <div
                      key={holding.id}
                      className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{holding.name}</div>
                        <div className="text-sm text-gray-500">
                          {holding.ticker} • {holding.shares} shares • {formatCurrency(holding.price)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Regions: {holding.regions.join(", ")}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(holding.value)}</div>
                        <div className={`text-sm ${holding.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {holding.change >= 0 ? "+" : ""}
                          {holding.change}% today
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  View All International Investments
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Opportunities</CardTitle>
                <CardDescription>Recommended international investments based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-500">
                    Explore international investment opportunities tailored to your risk profile and goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
