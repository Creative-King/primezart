"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Bell,
  LineChart,
  Wallet,
  Plus,
  BarChart2,
  TrendingUp,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Download,
  Upload,
  Repeat,
} from "lucide-react"
import { Line, Doughnut, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import FloatingRadialMenu from "@/components/floating-radial-menu"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Mock data for crypto portfolio
const cryptoData = {
  totalValue: 28750.45,
  change: 3.25,
  changeAmount: 905.32,
  allocation: [
    { name: "Bitcoin", value: 45, color: "#F7931A" },
    { name: "Ethereum", value: 30, color: "#627EEA" },
    { name: "Solana", value: 10, color: "#00FFA3" },
    { name: "Cardano", value: 8, color: "#0033AD" },
    { name: "Others", value: 7, color: "#6366f1" },
  ],
  performance: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [20000, 19500, 21000, 22500, 21800, 23000, 24500, 25200, 26800, 27500, 28200, 28750],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
}

// Mock data for crypto assets
const cryptoAssets = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: 68542.12,
    change: 2.34,
    holdings: 0.25,
    value: 17135.53,
    allocation: 45,
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: 3452.78,
    change: 1.56,
    holdings: 2.5,
    value: 8631.95,
    allocation: 30,
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    price: 143.25,
    change: 5.67,
    holdings: 20,
    value: 2865.0,
    allocation: 10,
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "ada",
    name: "Cardano",
    symbol: "ADA",
    price: 0.58,
    change: -1.23,
    holdings: 4000,
    value: 2320.0,
    allocation: 8,
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "dot",
    name: "Polkadot",
    symbol: "DOT",
    price: 7.85,
    change: 0.45,
    holdings: 150,
    value: 1177.5,
    allocation: 4,
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "link",
    name: "Chainlink",
    symbol: "LINK",
    price: 15.32,
    change: 3.21,
    holdings: 45,
    value: 689.4,
    allocation: 2,
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "avax",
    name: "Avalanche",
    symbol: "AVAX",
    price: 35.67,
    change: -0.87,
    holdings: 10,
    value: 356.7,
    allocation: 1,
    logo: "/placeholder.svg?height=32&width=32",
  },
]

// Mock data for transactions
const cryptoTransactions = [
  {
    id: "tx1",
    date: "2024-11-20",
    type: "Buy",
    asset: "Bitcoin",
    symbol: "BTC",
    amount: 0.05,
    price: 68542.12,
    total: 3427.11,
    status: "Completed",
  },
  {
    id: "tx2",
    date: "2024-11-18",
    type: "Sell",
    asset: "Ethereum",
    symbol: "ETH",
    amount: 0.5,
    price: 3452.78,
    total: 1726.39,
    status: "Completed",
  },
  {
    id: "tx3",
    date: "2024-11-15",
    type: "Buy",
    asset: "Solana",
    symbol: "SOL",
    amount: 5,
    price: 143.25,
    total: 716.25,
    status: "Completed",
  },
  {
    id: "tx4",
    date: "2024-11-10",
    type: "Transfer",
    asset: "Bitcoin",
    symbol: "BTC",
    amount: 0.1,
    price: 67890.45,
    total: 6789.05,
    status: "Completed",
  },
  {
    id: "tx5",
    date: "2024-11-05",
    type: "Deposit",
    asset: "USD",
    symbol: "USD",
    amount: 5000,
    price: 1,
    total: 5000.0,
    status: "Completed",
  },
]

// Mock data for market overview
const cryptoMarket = [
  {
    id: "btc-market",
    name: "Bitcoin",
    symbol: "BTC",
    price: 68542.12,
    change: 2.34,
    marketCap: "1.32T",
    volume: "45.6B",
    chart: [67500, 67800, 68200, 68100, 68300, 68400, 68542],
  },
  {
    id: "eth-market",
    name: "Ethereum",
    symbol: "ETH",
    price: 3452.78,
    change: 1.56,
    marketCap: "415.8B",
    volume: "18.2B",
    chart: [3400, 3420, 3440, 3430, 3445, 3450, 3452],
  },
  {
    id: "sol-market",
    name: "Solana",
    symbol: "SOL",
    price: 143.25,
    change: 5.67,
    marketCap: "62.5B",
    volume: "5.8B",
    chart: [135, 137, 139, 140, 142, 143, 143.25],
  },
  {
    id: "ada-market",
    name: "Cardano",
    symbol: "ADA",
    price: 0.58,
    change: -1.23,
    marketCap: "20.4B",
    volume: "1.2B",
    chart: [0.59, 0.585, 0.58, 0.575, 0.58, 0.578, 0.58],
  },
]

// Mock data for news
const cryptoNews = [
  {
    id: "news1",
    title: "Bitcoin Surpasses $68,000 as Institutional Adoption Grows",
    source: "CoinDesk",
    time: "2 hours ago",
    image: "/placeholder.svg?height=60&width=80",
  },
  {
    id: "news2",
    title: "Ethereum Upgrade Expected to Reduce Gas Fees by 30%",
    source: "CryptoNews",
    time: "4 hours ago",
    image: "/placeholder.svg?height=60&width=80",
  },
  {
    id: "news3",
    title: "Solana Network Achieves New Transaction Speed Record",
    source: "Decrypt",
    time: "6 hours ago",
    image: "/placeholder.svg?height=60&width=80",
  },
  {
    id: "news4",
    title: "Regulatory Clarity for Crypto Expected in Q1 2025",
    source: "Bloomberg Crypto",
    time: "8 hours ago",
    image: "/placeholder.svg?height=60&width=80",
  },
]

// Mock data for watchlist
const watchlistCoins = [
  {
    id: "bnb",
    name: "Binance Coin",
    symbol: "BNB",
    price: 612.45,
    change: 1.23,
    marketCap: "95.2B",
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    price: 0.58,
    change: 0.75,
    marketCap: "31.5B",
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "doge",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.12,
    change: -2.34,
    marketCap: "16.8B",
    logo: "/placeholder.svg?height=24&width=24",
  },
]

export default function CryptoDashboard() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("1M")
  const [isClient, setIsClient] = useState(false)
  const [isValueVisible, setIsValueVisible] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobile, setIsMobile] = useState(false)

  // Add PIN validation to Buy, Swap, Send, and Receive buttons
  // First, add state for PIN modal:
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [currentAction, setCurrentAction] = useState("")

  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatCrypto = (value: number, symbol: string) => {
    return `${value.toLocaleString(undefined, { minimumFractionDigits: symbol === "BTC" ? 8 : 4, maximumFractionDigits: symbol === "BTC" ? 8 : 4 })} ${symbol}`
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
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
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `Value: ${formatCurrency(context.raw)}`
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
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
          },
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          callback: (value: any) => formatCurrency(value),
          font: {
            size: 10,
          },
        },
        border: {
          dash: [4, 4],
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        hitRadius: 6,
        hoverBackgroundColor: "#fff",
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
  }

  // Pie chart data
  const pieChartData = {
    labels: cryptoData.allocation.map((item) => item.name),
    datasets: [
      {
        data: cryptoData.allocation.map((item) => item.value),
        backgroundColor: cryptoData.allocation.map((item) => item.color),
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  }

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            return `${label}: ${value}%`
          },
        },
      },
    },
    cutout: "70%",
  }

  // Bar chart data
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Profit/Loss",
        data: [1200, -800, 2500, 1800, -500, 3000],
        backgroundColor: (context: any) => {
          const value = context.dataset.data[context.dataIndex]
          return value >= 0 ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.8)"
        },
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            return `${value >= 0 ? "Profit" : "Loss"}: ${formatCurrency(Math.abs(value))}`
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
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          callback: (value: any) => formatCurrency(value),
          font: {
            size: 10,
          },
        },
        border: {
          dash: [4, 4],
        },
      },
    },
  }

  // Mini line chart options
  const miniLineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
  }

  // Add this function to handle crypto actions:
  const handleCryptoAction = (action) => {
    setCurrentAction(action)
    setPin("")
    setPinError("")
    setShowPinModal(true)
  }

  // Add this function to validate PIN:
  const validatePin = () => {
    // In a real app, you would validate the PIN against the stored PIN
    const storedPIN = localStorage.getItem("userPIN") || "1234" // Default for demo

    if (pin !== storedPIN) {
      setPinError("Invalid PIN. Please try again.")
      return false
    }

    // PIN is valid, close modal and proceed with action
    setShowPinModal(false)

    // Here you would implement the actual action based on currentAction
    console.log(`Proceeding with ${currentAction} action`)

    // Show success message or redirect
    return true
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-[#1e293b] border-b border-[#334155] py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                <span className="text-white">Primez</span>
                <span className="text-[#6366f1]">art</span>
                <span className="text-xs ml-2 text-gray-400">Crypto</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  3
                </span>
              </button>
              <Select defaultValue="usd">
                <SelectTrigger className="w-[90px] bg-[#0f172a] border-[#334155] focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#334155] text-white">
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="btc">BTC</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-[#6366f1]">KJ</AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium">Kayla Jones</p>
                  <p className="text-xs text-gray-400">Crypto Trader</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Crypto Price Ticker */}
        <div className="bg-[#1e293b] border-b border-[#334155] py-2 px-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {cryptoMarket.concat(cryptoMarket).map((crypto, index) => (
              <div key={`${crypto.id}-${index}`} className="flex items-center mx-4">
                <span className="font-medium">{crypto.symbol}</span>
                <span className="ml-2">{formatCurrency(crypto.price)}</span>
                <span className={`ml-2 flex items-center ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {crypto.change >= 0 ? (
                    <ArrowUpRight size={14} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-1" />
                  )}
                  {formatPercentage(crypto.change)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0f172a] p-4 pb-24">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Crypto Dashboard</h1>
              <p className="text-gray-400">Track, trade, and manage your cryptocurrency portfolio</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white w-full"
                onClick={() => handleCryptoAction("Buy")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Buy Crypto
              </Button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#1e293b] border-[#334155] col-span-3">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Portfolio Value</CardTitle>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold">
                        {isValueVisible ? formatCurrency(cryptoData.totalValue) : "••••••"}
                      </div>
                      <button
                        onClick={() => setIsValueVisible(!isValueVisible)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        {isValueVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <div
                        className={`ml-3 flex items-center ${
                          cryptoData.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {cryptoData.change >= 0 ? (
                          <ArrowUpRight size={16} className="mr-1" />
                        ) : (
                          <ArrowDownRight size={16} className="mr-1" />
                        )}
                        <span className="font-medium">{formatPercentage(cryptoData.change)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-[#334155] mr-2"
                    >
                      <RefreshCw size={14} />
                    </Button>
                    <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[100px] bg-[#0f172a] border-[#334155]">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e293b] border-[#334155] text-white">
                        <SelectItem value="1D">1D</SelectItem>
                        <SelectItem value="1W">1W</SelectItem>
                        <SelectItem value="1M">1M</SelectItem>
                        <SelectItem value="3M">3M</SelectItem>
                        <SelectItem value="1Y">1Y</SelectItem>
                        <SelectItem value="ALL">ALL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={cryptoData.performance} options={lineChartOptions} />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-[#334155] hover:bg-[#475569]">1D</Badge>
                  <Badge className="bg-[#334155] hover:bg-[#475569]">1W</Badge>
                  <Badge className="bg-[#6366f1] hover:bg-[#4f46e5]">1M</Badge>
                  <Badge className="bg-[#334155] hover:bg-[#475569]">3M</Badge>
                  <Badge className="bg-[#334155] hover:bg-[#475569]">1Y</Badge>
                  <Badge className="bg-[#334155] hover:bg-[#475569]">ALL</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border-[#334155]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                    onClick={() => handleCryptoAction("Buy")}
                  >
                    <Plus size={14} className="mr-2" /> Buy Crypto
                  </Button>
                  <Button
                    className="w-full bg-[#334155] hover:bg-[#475569] text-white"
                    onClick={() => handleCryptoAction("Swap")}
                  >
                    <Repeat size={14} className="mr-2" /> Swap
                  </Button>
                  <Button
                    className="w-full bg-[#334155] hover:bg-[#475569] text-white"
                    onClick={() => handleCryptoAction("Send")}
                  >
                    <Upload size={14} className="mr-2" /> Send
                  </Button>
                  <Button
                    className="w-full bg-[#334155] hover:bg-[#475569] text-white"
                    onClick={() => handleCryptoAction("Receive")}
                  >
                    <Download size={14} className="mr-2" /> Receive
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="bg-[#1e293b] border-[#334155]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#6366f1]">
                <BarChart2 size={16} className="mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-[#6366f1]">
                <Wallet size={16} className="mr-2" /> Assets
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-[#6366f1]">
                <TrendingUp size={16} className="mr-2" /> Performance
              </TabsTrigger>
              <TabsTrigger value="markets" className="data-[state=active]:bg-[#6366f1]">
                <LineChart size={16} className="mr-2" /> Markets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-[#1e293b] border-[#334155]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Asset Allocation</CardTitle>
                    <CardDescription className="text-gray-400">Distribution by cryptocurrency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 mb-4">
                      <Doughnut data={pieChartData} options={pieChartOptions} />
                    </div>
                    <div className="space-y-3">
                      {cryptoData.allocation.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-[#334155]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Profit/Loss</CardTitle>
                    <CardDescription className="text-gray-400">Last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-[#334155]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">Watchlist</CardTitle>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                        <Plus size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchlistCoins.map((coin) => (
                        <div key={coin.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center mr-2 overflow-hidden">
                              <img src={coin.logo || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-medium">{coin.name}</p>
                              <p className="text-xs text-gray-400">{coin.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(coin.price)}</p>
                            <p className={`text-xs ${coin.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {formatPercentage(coin.change)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full border-[#334155] hover:bg-[#334155] text-white">
                        View All Markets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <Card className="bg-[#1e293b] border-[#334155]">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Recent Transactions</CardTitle>
                        <Button variant="ghost" className="text-[#6366f1] hover:text-[#4f46e5] hover:bg-[#334155]">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b border-[#334155]">
                              <th className="pb-2 font-medium text-gray-400 text-sm">Type</th>
                              <th className="pb-2 font-medium text-gray-400 text-sm">Asset</th>
                              <th className="pb-2 font-medium text-gray-400 text-sm">Amount</th>
                              <th className="pb-2 font-medium text-gray-400 text-sm">Price</th>
                              <th className="pb-2 font-medium text-gray-400 text-sm">Date</th>
                              <th className="pb-2 font-medium text-gray-400 text-sm">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cryptoTransactions.slice(0, 4).map((transaction) => (
                              <tr key={transaction.id} className="border-b border-[#334155] hover:bg-[#0f172a]/50">
                                <td className="py-3">
                                  <Badge
                                    className={`${
                                      transaction.type === "Buy"
                                        ? "bg-green-500/20 text-green-500"
                                        : transaction.type === "Sell"
                                          ? "bg-red-500/20 text-red-500"
                                          : transaction.type === "Transfer"
                                            ? "bg-blue-500/20 text-blue-500"
                                            : "bg-purple-500/20 text-purple-500"
                                    }`}
                                  >
                                    {transaction.type}
                                  </Badge>
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <span className="font-medium">{transaction.asset}</span>
                                    <span className="text-xs text-gray-400 ml-1">({transaction.symbol})</span>
                                  </div>
                                </td>
                                <td className="py-3 font-medium">
                                  {transaction.amount} {transaction.symbol}
                                </td>
                                <td className="py-3">{formatCurrency(transaction.price)}</td>
                                <td className="py-3 text-gray-400">{formatDate(transaction.date)}</td>
                                <td className="py-3">
                                  <Badge className="bg-green-500/20 text-green-500">{transaction.status}</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-[#1e293b] border-[#334155]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Crypto News</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cryptoNews.map((news) => (
                          <div
                            key={news.id}
                            className="flex items-start border-b border-[#334155] pb-4 last:border-0 last:pb-0"
                          >
                            <div className="w-16 h-12 rounded-lg bg-[#334155] overflow-hidden mr-3 flex-shrink-0">
                              <img
                                src={news.image || "/placeholder.svg"}
                                alt={news.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm mb-1 line-clamp-2">{news.title}</h3>
                              <div className="flex items-center text-xs text-gray-400">
                                <span>{news.source}</span>
                                <span className="mx-2">•</span>
                                <span className="flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {news.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full border-[#334155] hover:bg-[#334155] text-white">
                          <ExternalLink size={14} className="mr-2" /> View All News
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Other tab contents would go here */}
          </Tabs>
        </main>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Enter PIN</h3>
            <p className="text-gray-400 mb-4">Please enter your PIN to authorize this {currentAction} transaction.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Transaction PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setPinError("")
                }}
                maxLength={6}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-md p-2 text-white"
                placeholder="Enter your PIN"
              />
              {pinError && <p className="text-sm text-red-500 mt-1">{pinError}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-[#334155] hover:bg-[#475569] rounded-md text-white"
                onClick={() => setShowPinModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] rounded-md text-white" onClick={validatePin}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Radial Menu specific for Crypto */}
      <FloatingRadialMenu type="crypto" />
    </div>
  )
}
