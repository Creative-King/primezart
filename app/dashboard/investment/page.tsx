"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  PieChart,
  LineChart,
  Bitcoin,
  Wallet,
  Globe,
  Download,
  BarChart3,
  MessageCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import FloatingMenu from "@/components/floating-menu"

// Mock crypto data for the ticker
const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 63245.78, change: 2.4 },
  { symbol: "ETH", name: "Ethereum", price: 3421.56, change: 1.8 },
  { symbol: "SOL", name: "Solana", price: 142.89, change: 5.2 },
  { symbol: "ADA", name: "Cardano", price: 0.58, change: -1.2 },
  { symbol: "DOT", name: "Polkadot", price: 7.82, change: 0.7 },
  { symbol: "AVAX", name: "Avalanche", price: 35.67, change: 3.5 },
  { symbol: "MATIC", name: "Polygon", price: 0.89, change: -0.5 },
  { symbol: "LINK", name: "Chainlink", price: 18.23, change: 2.1 },
  { symbol: "UNI", name: "Uniswap", price: 10.45, change: 1.3 },
  { symbol: "XRP", name: "Ripple", price: 0.52, change: -0.8 },
]

export default function InvestmentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: amount < 1 ? 4 : 2,
      maximumFractionDigits: amount < 1 ? 4 : 2,
    }).format(amount)
  }

  const handleDeposit = () => {
    router.push("/dashboard/investment/deposit")
  }

  const handlePortfolio = () => {
    router.push("/dashboard/investment/portfolio")
  }

  const handleMarkets = () => {
    router.push("/dashboard/investment/stocks")
  }

  const handleInvest = () => {
    router.push("/dashboard/investment/crypto")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Crypto Ticker */}
      <div className="w-full bg-[#003366] text-white py-2 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker">
            {cryptoData.map((crypto, index) => (
              <div key={index} className="ticker-item flex items-center space-x-2">
                <span className="font-semibold">{crypto.symbol}</span>
                <span>{formatCurrency(crypto.price)}</span>
                <span className={crypto.change >= 0 ? "text-green-400" : "text-red-400"}>
                  {crypto.change >= 0 ? "+" : ""}
                  {crypto.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investment Dashboard</h1>
            <p className="text-gray-500">Manage your investment portfolio and track performance</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center" onClick={handlePortfolio}>
              <PieChart className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
            <Button variant="outline" className="flex items-center" onClick={handleMarkets}>
              <LineChart className="h-4 w-4 mr-2" />
              Markets
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center" onClick={handleInvest}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Invest
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-blue-600" />
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$245,678.92</div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+18.7%</span>
                <span className="text-gray-500 ml-1">all time</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Today's Change</span>
                  <div className="flex items-center">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+$2,932.45 (1.2%)</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleDeposit} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Deposit Funds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Bitcoin className="h-5 w-5 mr-2 text-orange-500" />
                Crypto Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$73,421.56</div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+24.3%</span>
                <span className="text-gray-500 ml-1">all time</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Today's Change</span>
                  <div className="flex items-center">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+$1,245.78 (1.7%)</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/investment/crypto")}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Bitcoin className="h-4 w-4 mr-2" />
                Buy Crypto
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                International Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$87,932.45</div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-1">all time</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Today's Change</span>
                  <div className="flex items-center">
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">-$432.67 (0.5%)</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/investment/international")}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Globe className="h-4 w-4 mr-2" />
                International Markets
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Your current investment distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <span>US Stocks</span>
                      </div>
                      <span className="font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                        <span>International Stocks</span>
                      </div>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2 bg-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Bonds</span>
                      </div>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2 bg-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                        <span>Cash & Equivalents</span>
                      </div>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2 bg-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                        <span>Alternative Investments</span>
                      </div>
                      <span className="font-medium">5%</span>
                    </div>
                    <Progress value={5} className="h-2 bg-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Holdings</CardTitle>
                  <CardDescription>Your best performing investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Apple Inc. (AAPL)</div>
                        <div className="text-sm text-gray-500">85 shares • $184.45</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$15,678.45</div>
                        <div className="flex items-center justify-end text-sm text-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          1.8%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Microsoft Corp. (MSFT)</div>
                        <div className="text-sm text-gray-500">42 shares • $346.02</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$14,532.78</div>
                        <div className="flex items-center justify-end text-sm text-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          2.1%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Amazon.com Inc. (AMZN)</div>
                        <div className="text-sm text-gray-500">95 shares • $135.54</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$12,876.34</div>
                        <div className="flex items-center justify-end text-sm text-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          1.5%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Vanguard Total Bond ETF (BND)</div>
                        <div className="text-sm text-gray-500">150 shares • $74.90</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$11,234.56</div>
                        <div className="flex items-center justify-end text-sm text-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          0.3%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Alphabet Inc. (GOOGL)</div>
                        <div className="text-sm text-gray-500">78 shares • $140.87</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$10,987.65</div>
                        <div className="flex items-center justify-end text-sm text-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          1.9%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Your investment returns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">1 Month</div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "24%" }}></div>
                        </div>
                        <span className="text-green-500 font-medium">+2.4%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">3 Months</div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "57%" }}></div>
                        </div>
                        <span className="text-green-500 font-medium">+5.7%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Year to Date</div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                        <span className="text-green-500 font-medium">+12.3%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">1 Year</div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                        <span className="text-green-500 font-medium">+18.7%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">3 Years</div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                        <span className="text-green-500 font-medium">+42.5%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">5 Years</div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                        <span className="text-green-500 font-medium">+76.8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stocks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Portfolio</CardTitle>
                <CardDescription>Your stock holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stock content would go here */}
                  <p className="text-gray-500">Detailed stock information will be displayed here.</p>
                  <Button
                    onClick={() => router.push("/dashboard/investment/stocks")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Stock Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crypto Portfolio</CardTitle>
                <CardDescription>Your cryptocurrency holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Crypto content would go here */}
                  <p className="text-gray-500">Detailed cryptocurrency information will be displayed here.</p>
                  <Button
                    onClick={() => router.push("/dashboard/investment/crypto")}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Bitcoin className="h-4 w-4 mr-2" />
                    View Crypto Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="international" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>International Investments</CardTitle>
                <CardDescription>Your global investment portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* International investments content would go here */}
                  <p className="text-gray-500">Detailed international investment information will be displayed here.</p>
                  <Button
                    onClick={() => router.push("/dashboard/investment/international")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    View International Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="rounded-full p-4 bg-[#001f3f] hover:bg-[#00346b] shadow-lg flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Floating Menu */}
      <FloatingMenu />

      {/* CSS for ticker */}
      <style jsx global>{`
        .ticker-wrap {
          width: 100%;
          overflow: hidden;
          height: 2.5rem;
          background-color: #003366;
          padding-left: 100%;
          box-sizing: content-box;
        }
        .ticker {
          display: inline-block;
          white-space: nowrap;
          padding-right: 100%;
          box-sizing: content-box;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-name: ticker;
          animation-duration: 30s;
        }
        .ticker-item {
          display: inline-block;
          padding: 0 1.5rem;
        }
        @keyframes ticker {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
      `}</style>
    </div>
  )
}
