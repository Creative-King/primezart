"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  Download,
  Send,
  PieChart,
  RefreshCw,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Clock,
  DollarSign,
  Globe,
  Zap,
  Bitcoin,
  MessageCircle,
  Menu,
  CreditCard,
  ChevronRight,
  Info,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import FloatingMenu from "@/components/floating-menu"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// Mock crypto data
const cryptoData = {
  totalValue: 98765.43,
  totalReturn: 12.8,
  todayChange: 3.2,
  allocation: [
    { name: "Bitcoin (BTC)", value: 45, color: "bg-orange-500" },
    { name: "Ethereum (ETH)", value: 30, color: "bg-indigo-500" },
    { name: "Solana (SOL)", value: 15, color: "bg-purple-500" },
    { name: "Cardano (ADA)", value: 5, color: "bg-blue-500" },
    { name: "Other", value: 5, color: "bg-gray-500" },
  ],
  assets: [
    {
      name: "Bitcoin",
      ticker: "BTC",
      amount: 0.8,
      price: 59250.75,
      value: 47400.6,
      change: 2.7,
      color: "text-green-600",
      icon: <Bitcoin className="h-5 w-5 text-orange-500" />,
    },
    {
      name: "Ethereum",
      ticker: "ETH",
      amount: 12.5,
      price: 2352.84,
      value: 29410.5,
      change: 4.1,
      color: "text-green-600",
      icon: <Zap className="h-5 w-5 text-indigo-500" />,
    },
    {
      name: "Solana",
      ticker: "SOL",
      amount: 125,
      price: 118.74,
      value: 14842.5,
      change: 5.2,
      color: "text-green-600",
      icon: <Globe className="h-5 w-5 text-purple-500" />,
    },
    {
      name: "Cardano",
      ticker: "ADA",
      amount: 3250,
      price: 0.152,
      value: 4940.0,
      change: -1.8,
      color: "text-red-600",
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Polkadot",
      ticker: "DOT",
      amount: 85,
      price: 7.24,
      value: 615.4,
      change: -0.9,
      color: "text-red-600",
      icon: <Globe className="h-5 w-5 text-pink-500" />,
    },
  ],
  performance: [
    { period: "1D", return: 3.2 },
    { period: "1W", return: 1.2 },
    { period: "1M", return: 8.5 },
    { period: "3M", return: 15.4 },
    { period: "YTD", return: 22.7 },
    { period: "1Y", return: 42.8 },
    { period: "3Y", return: 352.5 },
    { period: "5Y", return: 754.2 },
  ],
  marketData: [
    { name: "BTC/USD", price: 59250.75, change: 2.7, volume: "14.2B", market: "Binance" },
    { name: "ETH/USD", price: 2352.84, change: 4.1, volume: "8.4B", market: "Coinbase" },
    { name: "SOL/USD", price: 118.74, change: 5.2, volume: "3.1B", market: "Kraken" },
    { name: "ADA/USD", price: 0.152, change: -1.8, volume: "780M", market: "Binance" },
    { name: "DOT/USD", price: 7.24, change: -0.9, volume: "450M", market: "KuCoin" },
  ],
  dailyPerformanceData: {
    labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [97500, 97800, 98200, 98100, 98600, 98900, 99100, 98765.43],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
}

// Mock transactions data
const transactionsData = [
  {
    id: "tx1",
    date: "2024-11-20",
    description: "Buy Bitcoin",
    amount: 0.05,
    value: 2962.54,
    type: "Buy",
    status: "Completed",
  },
  {
    id: "tx2",
    date: "2024-11-18",
    description: "Sell Ethereum",
    amount: 2.5,
    value: 5882.1,
    type: "Sell",
    status: "Completed",
  },
  {
    id: "tx3",
    date: "2024-11-15",
    description: "Buy Solana",
    amount: 25,
    value: 2968.5,
    type: "Buy",
    status: "Completed",
  },
  {
    id: "tx4",
    date: "2024-11-10",
    description: "Deposit USD",
    amount: 5000,
    value: 5000.0,
    type: "Deposit",
    status: "Completed",
  },
  {
    id: "tx5",
    date: "2024-11-05",
    description: "Buy Cardano",
    amount: 1000,
    value: 152.0,
    type: "Buy",
    status: "Completed",
  },
  {
    id: "tx6",
    date: "2024-11-01",
    description: "Withdraw USD",
    amount: 2000,
    value: 2000.0,
    type: "Withdraw",
    status: "Completed",
  },
]

// Investment plans data
const investmentPlans = [
  {
    id: "plan1",
    name: "Conservative Growth",
    description: "Low-risk investment with stable returns",
    riskLevel: "Low",
    expectedReturn: "4-6% annually",
    minInvestment: 5000,
    duration: "1-3 years",
    allocation: [
      { asset: "Bonds", percentage: 60 },
      { asset: "Blue-chip Stocks", percentage: 30 },
      { asset: "Cash Equivalents", percentage: 10 },
    ],
  },
  {
    id: "plan2",
    name: "Balanced Portfolio",
    description: "Moderate risk with balanced growth potential",
    riskLevel: "Medium",
    expectedReturn: "7-9% annually",
    minInvestment: 10000,
    duration: "3-5 years",
    allocation: [
      { asset: "Stocks", percentage: 50 },
      { asset: "Bonds", percentage: 30 },
      { asset: "Real Estate", percentage: 15 },
      { asset: "Cash", percentage: 5 },
    ],
  },
  {
    id: "plan3",
    name: "Growth Maximizer",
    description: "Higher risk with significant growth potential",
    riskLevel: "High",
    expectedReturn: "10-15% annually",
    minInvestment: 25000,
    duration: "5+ years",
    allocation: [
      { asset: "Growth Stocks", percentage: 70 },
      { asset: "International Equities", percentage: 20 },
      { asset: "Bonds", percentage: 10 },
    ],
  },
  {
    id: "plan4",
    name: "Crypto Innovator",
    description: "High-risk crypto-focused investment strategy",
    riskLevel: "Very High",
    expectedReturn: "15-25% annually",
    minInvestment: 10000,
    duration: "5+ years",
    allocation: [
      { asset: "Bitcoin", percentage: 40 },
      { asset: "Ethereum", percentage: 30 },
      { asset: "Altcoins", percentage: 20 },
      { asset: "Stablecoins", percentage: 10 },
    ],
  },
]

export default function InvestmentDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("investment")
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [timeFrame, setTimeFrame] = useState("1W")
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [showInvestmentDialog, setShowInvestmentDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      } else {
        localStorage.setItem("accountMode", "investment")
      }

      // Get accounts from localStorage
      const accountsData = localStorage.getItem("accounts")
      if (accountsData) {
        try {
          const parsedAccounts = JSON.parse(accountsData)
          const investmentAccounts = parsedAccounts.filter(
            (acc) => acc.type === "investment" && acc.accountType === storedMode,
          )
          setAccounts(investmentAccounts)
          if (investmentAccounts.length > 0) {
            setSelectedAccount(investmentAccounts[0].id)
          }
        } catch (e) {
          console.error("Error parsing accounts data", e)
        }
      }
    }
  }, [])

  const handleDeposit = () => {
    router.push("/dashboard/deposit")
  }

  const handleSend = () => {
    router.push("/dashboard/transfer")
  }

  const handleReceive = () => {
    router.push("/dashboard/receive")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Chart options for daily performance
  const dailyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
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
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
          callback: (value) => formatCurrency(value),
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 2,
        hoverRadius: 4,
      },
    },
  }

  // Toggle action menu
  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu)
  }

  const openInvestmentDialog = () => {
    setShowInvestmentDialog(true)
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
  }

  const handleInvestmentSubmit = () => {
    // Validate PIN
    const storedPIN = localStorage.getItem("userPIN") || "1234" // Default for demo

    if (!pin) {
      setPinError("PIN is required")
      return
    }

    if (pin !== storedPIN) {
      setPinError("Invalid PIN. Please try again.")
      return
    }

    if (!investmentAmount || isNaN(Number(investmentAmount)) || Number(investmentAmount) <= 0) {
      return
    }

    // Show confirmation dialog
    setShowConfirmDialog(true)
  }

  const handleConfirmInvestment = () => {
    // In a real app, this would process the investment
    setShowConfirmDialog(false)
    setShowInvestmentDialog(false)

    // Reset form
    setSelectedPlan(null)
    setInvestmentAmount("")
    setPin("")
    setPinError("")

    // Show success message or redirect
    alert("Investment successfully processed!")
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      {/* Dark mode header with crypto price ticker */}
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <div className="flex items-center space-x-8 min-w-max">
          {cryptoData.marketData.map((coin, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-white font-medium">{coin.name}</span>
              <span className="text-white font-bold">{formatCurrency(coin.price).replace("$", "")}</span>
              <span className={coin.change > 0 ? "text-green-400" : "text-red-400"}>
                {coin.change > 0 ? (
                  <ArrowUp className="inline h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 mr-1" />
                )}
                {Math.abs(coin.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-300">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{formatCurrency(cryptoData.totalValue)}</p>
              <div className="flex items-center">
                <p className="text-sm font-medium text-green-400">+{cryptoData.totalReturn}% all time</p>
                <TrendingUp className="ml-1 h-4 w-4 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg md:col-span-2">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle>Daily Performance</CardTitle>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[100px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Today</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-green-400">+{cryptoData.todayChange}%</p>
                  <TrendingUp className="ml-2 h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(cryptoData.totalValue)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-2xl font-bold text-gray-300">$26.9B</p>
              </div>
            </div>
            {/* Daily Performance Chart */}
            <div className="h-40 mt-4">
              <Line data={cryptoData.dailyPerformanceData} options={dailyChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Options Section */}
      <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Investment Options</span>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={openInvestmentDialog}>
              <DollarSign className="mr-2 h-4 w-4" /> Invest Now
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Choose from our curated investment plans to grow your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentPlans.slice(0, 2).map((plan) => (
              <Card key={plan.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <p className="text-gray-400">Risk Level</p>
                      <p className="font-medium">{plan.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Expected Return</p>
                      <p className="font-medium text-green-400">{plan.expectedReturn}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Min Investment</p>
                      <p className="font-medium">{formatCurrency(plan.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className="font-medium">{plan.duration}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-indigo-600 text-indigo-400 hover:bg-indigo-900"
                    onClick={() => {
                      setSelectedPlan(plan)
                      setShowInvestmentDialog(true)
                    }}
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button
            variant="link"
            className="text-indigo-400 hover:text-indigo-300 mt-4 mx-auto block"
            onClick={openInvestmentDialog}
          >
            View All Investment Plans <ChevronRight className="h-4 w-4 ml-1 inline" />
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="bg-gray-800 text-gray-400">
          <TabsTrigger value="assets" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Assets
          </TabsTrigger>
          <TabsTrigger value="allocation" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Allocation
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="markets" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Markets
          </TabsTrigger>
        </TabsList>

        {/* Assets Tab */}
        <TabsContent value="assets">
          <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Your Crypto Assets</span>
                <Button size="sm" variant="outline" className="border-indigo-600 text-indigo-400">
                  <RefreshCw className="mr-2 h-3 w-3" /> Refresh
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-400">Live prices from major exchanges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Asset</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Holdings</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Value</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">24h</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.assets.map((asset, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {asset.icon}
                            <div className="ml-3">
                              <p className="font-medium text-white">{asset.name}</p>
                              <p className="text-gray-400 text-sm">{asset.ticker}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-medium">
                            {asset.amount} {asset.ticker}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">{formatCurrency(asset.price)}</td>
                        <td className="py-4 px-4 text-right font-bold">{formatCurrency(asset.value)}</td>
                        <td className={`py-4 px-4 text-right ${asset.color}`}>
                          {asset.change > 0 ? "+" : ""}
                          {asset.change}%
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-400">
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-400">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-400">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation">
          <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription className="text-gray-400">Distribution of your crypto portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center">
                  <div className="relative h-48 w-48 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 rounded-full flex items-center justify-center">
                    <div className="absolute h-32 w-32 bg-[#1a1a2e] rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-lg font-medium z-10">Crypto Mix</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {cryptoData.allocation.map((asset, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{asset.name}</span>
                        <span className="text-sm font-medium">{asset.value}%</span>
                      </div>
                      <Progress value={asset.value} className={asset.color} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Historical Performance</CardTitle>
              <CardDescription className="text-gray-400">Track your portfolio's performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chart placeholder */}
              <div className="h-64 flex items-center justify-center mb-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-md">
                <PieChart className="h-24 w-24 text-indigo-300 opacity-50" />
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {cryptoData.performance.map((period, index) => (
                  <div key={index} className="text-center p-2 rounded-md bg-gray-800 hover:bg-gray-700">
                    <p className="text-sm font-medium">{period.period}</p>
                    <p className={period.return >= 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                      {period.return > 0 ? "+" : ""}
                      {period.return}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-indigo-600 text-indigo-400">
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Markets Tab */}
        <TabsContent value="markets">
          <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Crypto Markets</CardTitle>
              <CardDescription className="text-gray-400">Latest market data from major exchanges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Pair</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">24h Change</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">24h Volume</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Exchange</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.marketData.map((market, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-4 font-medium">{market.name}</td>
                        <td className="py-4 px-4 text-right font-medium">{formatCurrency(market.price)}</td>
                        <td className={`py-4 px-4 text-right ${market.change > 0 ? "text-green-400" : "text-red-400"}`}>
                          {market.change > 0 ? "+" : ""}
                          {market.change}%
                        </td>
                        <td className="py-4 px-4 text-right">{market.volume}</td>
                        <td className="py-4 px-4 text-right">{market.market}</td>
                        <td className="py-4 px-4 text-right">
                          <Button size="sm" variant="outline" className="border-indigo-600 text-indigo-400">
                            Trade
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Latest Transactions */}
      <Card className="bg-[#1a1a2e] text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
            <Button
              size="sm"
              variant="outline"
              className="border-indigo-600 text-indigo-400"
              onClick={() => router.push("/dashboard/transactions")}
            >
              <Clock className="mr-2 h-3 w-3" /> View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Description</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Value</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.slice(0, 4).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-300">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`${
                          transaction.type === "Buy"
                            ? "bg-green-900 text-green-400"
                            : transaction.type === "Sell"
                              ? "bg-red-900 text-red-400"
                              : "bg-blue-900 text-blue-400"
                        }`}
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{transaction.description}</td>
                    <td className="py-3 px-4 text-right">{transaction.amount}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(transaction.value)}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge className="bg-emerald-900 text-emerald-400">{transaction.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Investment Dialog */}
      <Dialog open={showInvestmentDialog} onOpenChange={setShowInvestmentDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Investment Plans</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select an investment plan and specify the amount you wish to invest
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto py-4">
            {investmentPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors cursor-pointer ${
                  selectedPlan?.id === plan.id ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {plan.name}
                    {selectedPlan?.id === plan.id && <Check className="h-5 w-5 text-indigo-400" />}
                  </CardTitle>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <p className="text-gray-300">Risk Level</p>
                      <p className="font-medium">{plan.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Expected Return</p>
                      <p className="font-medium text-green-400">{plan.expectedReturn}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Min Investment</p>
                      <p className="font-medium">{formatCurrency(plan.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Duration</p>
                      <p className="font-medium">{plan.duration}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-300 mb-2">Asset Allocation</p>
                    <div className="space-y-2">
                      {plan.allocation.map((asset, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span>{asset.asset}</span>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-600 rounded-full mr-2">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${asset.percentage}%` }}
                              ></div>
                            </div>
                            <span>{asset.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPlan && (
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Selected Plan: {selectedPlan.name}</h3>
                <Badge className="bg-indigo-900 text-indigo-300">
                  Min: {formatCurrency(selectedPlan.minInvestment)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Investment Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                    <Input
                      className="pl-7 bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter amount"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>
                  {investmentAmount && Number(investmentAmount) < selectedPlan.minInvestment && (
                    <p className="text-red-400 text-xs mt-1">
                      Amount must be at least {formatCurrency(selectedPlan.minInvestment)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Transaction PIN</label>
                  <Input
                    className="bg-gray-700 border-gray-600 text-white"
                    type="password"
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value)
                      setPinError("")
                    }}
                    maxLength={6}
                  />
                  {pinError && <p className="text-red-400 text-xs mt-1">{pinError}</p>}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowInvestmentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleInvestmentSubmit}
              disabled={
                !selectedPlan || !investmentAmount || Number(investmentAmount) < (selectedPlan?.minInvestment || 0)
              }
            >
              Confirm Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Investment Plan:</span>
                  <span className="font-medium">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount:</span>
                  <span className="font-medium">{formatCurrency(Number(investmentAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Expected Return:</span>
                  <span className="font-medium text-green-400">{selectedPlan?.expectedReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration:</span>
                  <span className="font-medium">{selectedPlan?.duration}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" />
                <div className="text-sm text-indigo-300">
                  <p className="font-medium mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your investment will be processed immediately</li>
                    <li>Funds will be allocated according to the plan's asset allocation</li>
                    <li>You can monitor your investment performance in your dashboard</li>
                    <li>Early withdrawal may be subject to fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirmInvestment}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Menu Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          <button
            onClick={toggleActionMenu}
            className="rounded-full p-4 bg-indigo-600 hover:bg-indigo-700 shadow-lg flex items-center justify-center"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>

          {/* Action Menu */}
          {showActionMenu && (
            <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-3 w-56">
              <div className="space-y-2">
                <button className="flex items-center w-full p-2 text-left rounded-md hover:bg-gray-100 text-gray-700">
                  <Bitcoin className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Buy Crypto</span>
                </button>
                <button className="flex items-center w-full p-2 text-left rounded-md hover:bg-gray-100 text-gray-700">
                  <Send className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Transfer</span>
                </button>
                <button className="flex items-center w-full p-2 text-left rounded-md hover:bg-gray-100 text-gray-700">
                  <Download className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Deposit</span>
                </button>
                <button className="flex items-center w-full p-2 text-left rounded-md hover:bg-gray-100 text-gray-700">
                  <Globe className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>International Transfers</span>
                </button>
                <button className="flex items-center w-full p-2 text-left rounded-md hover:bg-gray-100 text-gray-700">
                  <CreditCard className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Stock Buying</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="rounded-full p-4 bg-[#001f3f] hover:bg-[#00346b] shadow-lg flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Floating Menu */}
      <FloatingMenu />
    </div>
  )
}

