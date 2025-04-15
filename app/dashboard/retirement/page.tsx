"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Landmark,
  ArrowUpRight,
  Search,
  Bell,
  Menu,
  Activity,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  PieChart,
  BarChart,
  Target,
  Info,
} from "lucide-react"
import { Line, Doughnut } from "react-chartjs-2"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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

// Mock data for retirement account
const retirementData = {
  balance: 320000.0,
  contributions: {
    ytd: 12500.0,
    total: 175000.0,
    employerMatch: 5000.0,
  },
  returns: {
    ytd: 18500.0,
    total: 145000.0,
    percentage: 7.8,
  },
  projections: {
    atRetirement: 1250000.0,
    monthlyIncome: 5200.0,
    retirementAge: 65,
    currentAge: 38,
    currentContribution: 1500.0,
  },
  allocation: [
    { name: "Stocks", value: 70, color: "#6366f1" },
    { name: "Bonds", value: 20, color: "#22c55e" },
    { name: "Cash", value: 5, color: "#3b82f6" },
    { name: "Alternative", value: 5, color: "#f59e0b" },
  ],
  performance: {
    labels: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Account Value",
        data: [120000, 135000, 160000, 155000, 185000, 210000, 250000, 240000, 290000, 320000],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Contributions",
        data: [80000, 95000, 110000, 125000, 140000, 155000, 170000, 185000, 200000, 215000],
        borderColor: "#22c55e",
        backgroundColor: "transparent",
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  },
  holdings: [
    {
      id: "vti",
      name: "Vanguard Total Stock Market ETF",
      symbol: "VTI",
      shares: 350,
      price: 252.87,
      value: 88504.5,
      allocation: 27.7,
      change: 1.2,
    },
    {
      id: "vxus",
      name: "Vanguard Total International Stock ETF",
      symbol: "VXUS",
      shares: 450,
      price: 60.32,
      value: 27144.0,
      allocation: 8.5,
      change: 0.8,
    },
    {
      id: "voo",
      name: "Vanguard S&P 500 ETF",
      symbol: "VOO",
      shares: 200,
      price: 470.12,
      value: 94024.0,
      allocation: 29.4,
      change: 1.5,
    },
    {
      id: "bnd",
      name: "Vanguard Total Bond Market ETF",
      symbol: "BND",
      shares: 400,
      price: 72.45,
      value: 28980.0,
      allocation: 9.1,
      change: -0.3,
    },
    {
      id: "vtip",
      name: "Vanguard Short-Term Inflation-Protected Securities ETF",
      symbol: "VTIP",
      shares: 300,
      price: 47.85,
      value: 14355.0,
      allocation: 4.5,
      change: 0.2,
    },
    {
      id: "vgit",
      name: "Vanguard Intermediate-Term Treasury ETF",
      symbol: "VGIT",
      shares: 250,
      price: 58.32,
      value: 14580.0,
      allocation: 4.6,
      change: -0.1,
    },
    {
      id: "vnq",
      name: "Vanguard Real Estate ETF",
      symbol: "VNQ",
      shares: 150,
      price: 85.67,
      value: 12850.5,
      allocation: 4.0,
      change: 0.9,
    },
  ],
  transactions: [
    {
      id: "tx1",
      date: "2024-11-15",
      description: "Contribution",
      amount: 1500.0,
      type: "contribution",
    },
    {
      id: "tx2",
      date: "2024-11-15",
      description: "Employer Match",
      amount: 750.0,
      type: "contribution",
    },
    {
      id: "tx3",
      date: "2024-11-01",
      description: "Dividend - VTI",
      amount: 320.45,
      type: "dividend",
    },
    {
      id: "tx4",
      date: "2024-10-15",
      description: "Contribution",
      amount: 1500.0,
      type: "contribution",
    },
    {
      id: "tx5",
      date: "2024-10-15",
      description: "Employer Match",
      amount: 750.0,
      type: "contribution",
    },
  ],
}

export default function RetirementDashboard() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [timeRange, setTimeRange] = useState("10Y")
  const [isClient, setIsClient] = useState(false)
  const [contributionAmount, setContributionAmount] = useState(retirementData.projections.currentContribution)
  const [retirementAge, setRetirementAge] = useState(retirementData.projections.retirementAge)
  const [projectedAmount, setProjectedAmount] = useState(retirementData.projections.atRetirement)
  const [projectedIncome, setProjectedIncome] = useState(retirementData.projections.monthlyIncome)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Simple projection calculation (in a real app this would be more sophisticated)
    const yearsToRetirement = retirementAge - retirementData.projections.currentAge
    const monthlyContribution = contributionAmount
    const annualContribution = monthlyContribution * 12
    const employerMatch = annualContribution * 0.5 // Assuming 50% match
    const totalAnnualContribution = annualContribution + employerMatch

    // Very simplified calculation
    const projectedBalance =
      retirementData.balance * Math.pow(1.07, yearsToRetirement) +
      totalAnnualContribution * ((Math.pow(1.07, yearsToRetirement) - 1) / 0.07)

    setProjectedAmount(projectedBalance)
    setProjectedIncome((projectedBalance * 0.04) / 12) // 4% withdrawal rule
  }, [contributionAmount, retirementAge])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyWithCents = (value: number) => {
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

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#64748b",
          font: {
            size: 12,
          },
        },
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

  // Pie chart data
  const pieChartData = {
    labels: retirementData.allocation.map((item) => item.name),
    datasets: [
      {
        data: retirementData.allocation.map((item) => item.value),
        backgroundColor: retirementData.allocation.map((item) => item.color),
        borderWidth: 0,
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
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            return `${label}: ${value}%`
          },
        },
      },
    },
    cutout: "60%",
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white h-full flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200 fixed lg:relative z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${!isSidebarOpen && "justify-center w-full"}`}>
            {isSidebarOpen ? (
              <div className="text-xl font-bold">
                <span className="text-[#003366]">Primez</span>
                <span className="text-orange-500">art</span>
              </div>
            ) : (
              <div className="text-xl font-bold">
                <span className="text-orange-500">P</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700 lg:block hidden"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <div
              className={`flex items-center p-3 rounded-lg bg-orange-50 text-orange-600 cursor-pointer ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <Landmark size={20} />
              {isSidebarOpen && <span className="ml-3 font-medium">Retirement</span>}
            </div>
          </div>

          <div className="px-3 space-y-1">
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                !isSidebarOpen && "justify-center"
              }`}
              onClick={() => router.push("/dashboard")}
            >
              <Wallet size={20} className="text-gray-500" />
              {isSidebarOpen && <span className="ml-3">Accounts</span>}
            </div>
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <PieChart size={20} className="text-gray-500" />
              {isSidebarOpen && <span className="ml-3">Investments</span>}
            </div>
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <Target size={20} className="text-gray-500" />
              {isSidebarOpen && <span className="ml-3">Goals</span>}
            </div>
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <Activity size={20} className="text-gray-500" />
              {isSidebarOpen && <span className="ml-3">Performance</span>}
            </div>
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <BarChart size={20} className="text-gray-500" />
              {isSidebarOpen && <span className="ml-3">Projections</span>}
            </div>
          </div>

          {isSidebarOpen && (
            <div className="mt-8 px-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Info size={16} className="text-orange-500" />
                  <span className="ml-2 font-medium">Retirement Tip</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Increasing your contribution by just 1% can significantly impact your retirement savings over time.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Increase Contribution</Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <Settings size={20} className="text-gray-500" />
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </div>
          <div
            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => router.push("/")}
          >
            <LogOut size={20} className="text-gray-500" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-500 hover:text-gray-700 mr-4 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search investments..."
                  className="pl-10 border-gray-300 w-64 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                  1
                </span>
              </button>
              <Select defaultValue="usd">
                <SelectTrigger className="w-[90px] border-gray-300 focus:ring-orange-500 focus:border-orange-500">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-orange-500 text-white">KJ</AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium">Kayla Jones</p>
                  <p className="text-xs text-gray-500">401(k) Account</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Retirement Dashboard</h1>
            <p className="text-gray-600">Track and manage your retirement savings and investments.</p>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Balance</CardTitle>
                <CardDescription>Total retirement savings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(retirementData.balance)}</div>
                <div className="mt-2 flex items-center text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span className="font-medium">{formatPercentage(retirementData.returns.percentage)} YTD</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">YTD Return</p>
                    <p className="font-medium">{formatCurrency(retirementData.returns.ytd)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">YTD Contributions</p>
                    <p className="font-medium">{formatCurrency(retirementData.contributions.ytd)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contributions</CardTitle>
                <CardDescription>Your deposits and employer match</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(retirementData.contributions.total)}</div>
                <div className="mt-2 text-gray-600">
                  <span>Total contributions to date</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Your Contributions</p>
                    <p className="font-medium">
                      {formatCurrency(retirementData.contributions.total - retirementData.contributions.employerMatch)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Employer Match</p>
                    <p className="font-medium">{formatCurrency(retirementData.contributions.employerMatch)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Investment Growth</CardTitle>
                <CardDescription>Returns on your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(retirementData.returns.total)}</div>
                <div className="mt-2 text-gray-600">
                  <span>Total earnings from investments</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">YTD Return</p>
                    <p className="font-medium">{formatCurrency(retirementData.returns.ytd)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Return Rate</p>
                    <p className="font-medium">{formatPercentage(retirementData.returns.percentage)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart and Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Account Performance</CardTitle>
                    <CardDescription>Historical growth of your retirement account</CardDescription>
                  </div>
                  <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[100px] border-gray-300">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1Y">1Y</SelectItem>
                      <SelectItem value="3Y">3Y</SelectItem>
                      <SelectItem value="5Y">5Y</SelectItem>
                      <SelectItem value="10Y">10Y</SelectItem>
                      <SelectItem value="ALL">ALL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={retirementData.performance} options={lineChartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Asset Allocation</CardTitle>
                <CardDescription>Current investment mix</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 mb-4">
                  <Doughnut data={pieChartData} options={pieChartOptions} />
                </div>
                <div className="space-y-3">
                  {retirementData.allocation.map((item, index) => (
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
          </div>

          {/* Retirement Projections */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Retirement Projections</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Adjust Your Plan</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Monthly Contribution</label>
                          <span className="text-sm font-medium">{formatCurrencyWithCents(contributionAmount)}</span>
                        </div>
                        <Slider
                          value={[contributionAmount]}
                          min={500}
                          max={5000}
                          step={100}
                          onValueChange={(value) => setContributionAmount(value[0])}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>$500</span>
                          <span>$5,000</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Retirement Age</label>
                          <span className="text-sm font-medium">{retirementAge} years</span>
                        </div>
                        <Slider
                          value={[retirementAge]}
                          min={55}
                          max={75}
                          step={1}
                          onValueChange={(value) => setRetirementAge(value[0])}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>55</span>
                          <span>75</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Projected Retirement Savings</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">At Retirement ({retirementAge} years old)</span>
                        <span className="font-medium text-lg">{formatCurrency(projectedAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Monthly Income</span>
                        <span className="font-medium text-lg">{formatCurrency(projectedIncome)}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        These projections are estimates based on your current contribution and a 7% annual return.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {retirementData.transactions.slice(0, 4).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.type === "contribution" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50"
                onClick={() => router.push("/dashboard/transactions")}
              >
                View All Transactions
              </Button>
            </div>
          </div>

          {/* Investment Holdings */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Investment Holdings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {retirementData.holdings.map((holding) => (
                    <tr key={holding.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.shares}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrencyWithCents(holding.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrencyWithCents(holding.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.allocation}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(holding.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
