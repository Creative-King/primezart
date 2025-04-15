"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  CreditCard,
  DollarSign,
  BarChart3,
  ArrowUpDown,
  Eye,
  EyeOff,
} from "lucide-react"
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
} from "chart.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AccountWelcomeScreen from "@/components/account-welcome-screen"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Mock account data
const accounts = [
  {
    id: "acc1",
    name: "Premium Checking",
    number: "****4532",
    balance: 12435.67,
    type: "checking",
    currency: "USD",
    features: ["No monthly fees", "Unlimited transactions"],
  },
  {
    id: "acc2",
    name: "Premium Savings",
    number: "****7890",
    balance: 34521.89,
    type: "savings",
    currency: "USD",
    apy: "3.25%",
    features: ["High interest rate", "No minimum balance"],
  },
  {
    id: "acc3",
    name: "Investment Account",
    number: "****2341",
    balance: 98765.43,
    type: "investment",
    currency: "USD",
    features: ["Diversified portfolio", "Professional management"],
  },
  {
    id: "acc4",
    name: "Business Account",
    number: "****8765",
    balance: 45678.9,
    type: "business",
    currency: "USD",
    features: ["Business tools", "Merchant services"],
  },
  {
    id: "acc5",
    name: "Cryptocurrency Account",
    number: "****1234",
    balance: 15000.0,
    type: "crypto",
    currency: "USD",
    features: ["Secure storage", "Multiple cryptocurrencies"],
  },
  {
    id: "acc6",
    name: "Offshore Account",
    number: "****5678",
    balance: 250000.0,
    type: "offshore",
    currency: "EUR",
    features: ["Privacy", "Multi-currency support"],
  },
  {
    id: "acc7",
    name: "Joint Account",
    number: "****9012",
    balance: 28750.45,
    type: "joint",
    currency: "USD",
    features: ["Shared access", "Transparent transactions"],
  },
  {
    id: "acc8",
    name: "Trust Account",
    number: "****3456",
    balance: 175000.0,
    type: "trust",
    currency: "USD",
    features: ["Asset protection", "Estate planning"],
  },
  {
    id: "acc9",
    name: "Retirement Account",
    number: "****7890",
    balance: 320000.0,
    type: "retirement",
    currency: "USD",
    features: ["Tax advantages", "Long-term growth"],
  },
]

// Mock transactions
const generateTransactions = (accountId: string, count: number) => {
  const categories = [
    "Groceries",
    "Dining",
    "Shopping",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Income",
    "Transfer",
  ]
  const merchants = {
    Groceries: ["Whole Foods", "Trader Joe's", "Safeway", "Kroger", "Publix"],
    Dining: ["Starbucks", "Chipotle", "Olive Garden", "McDonald's", "Local Restaurant"],
    Shopping: ["Amazon", "Target", "Walmart", "Best Buy", "Macy's"],
    Transportation: ["Uber", "Lyft", "Gas Station", "Public Transit", "Airline"],
    Utilities: ["Electric Company", "Water Service", "Internet Provider", "Phone Bill", "Gas Company"],
    Entertainment: ["Netflix", "Movie Theater", "Concert Tickets", "Spotify", "App Store"],
    Income: ["Salary Deposit", "Dividend Payment", "Interest Credit", "Refund", "Bonus"],
    Transfer: ["Transfer to Savings", "Transfer from Checking", "External Transfer", "Wire Transfer", "Zelle Payment"],
  }

  const transactions = []
  const today = new Date()

  for (let i = 0; i < count; i++) {
    const daysAgo = i
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)

    const category = categories[Math.floor(Math.random() * categories.length)]
    const merchantList = merchants[category as keyof typeof merchants]
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)]

    const isIncome = category === "Income" || (category === "Transfer" && merchant.includes("from"))
    const amount = isIncome
      ? Math.round(Math.random() * 2000 + 500) / 100
      : -Math.round(Math.random() * 15000 + 100) / 100

    transactions.push({
      id: `tx-${accountId}-${i}`,
      date: date.toISOString().split("T")[0],
      description: merchant,
      category,
      amount,
      pending: i < 2 && !isIncome ? Math.random() > 0.7 : false,
    })
  }

  return transactions
}

// Generate chart data
const generateChartData = (accountId: string, period: string) => {
  let days = 30
  if (period === "3m") days = 90
  if (period === "6m") days = 180
  if (period === "1y") days = 365

  const labels = []
  const data = []

  const today = new Date()
  let balance = accounts.find((a) => a.id === accountId)?.balance || 10000

  // Work backwards from today
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

    // Add some randomness to the balance for the chart
    const dailyChange = (Math.random() - 0.5) * 200
    balance = Math.max(0, balance - dailyChange)
    data.push(balance)
  }

  return {
    labels,
    datasets: [
      {
        label: "Balance",
        data,
        borderColor: "#003366",
        backgroundColor: "rgba(0, 51, 102, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }
}

export default function AccountDetails() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [account, setAccount] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [chartData, setChartData] = useState<any>(null)
  const [chartPeriod, setChartPeriod] = useState("1m")
  const [hideBalance, setHideBalance] = useState(false)
  const [transactionFilter, setTransactionFilter] = useState("all")
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Find the account
    const foundAccount = accounts.find((a) => a.id === accountId)
    if (foundAccount) {
      setAccount(foundAccount)

      // Generate transactions
      setTransactions(generateTransactions(accountId, 50))

      // Generate chart data
      setChartData(generateChartData(accountId, chartPeriod))
    } else {
      // Account not found, redirect to dashboard
      router.push("/dashboard")
    }
  }, [accountId, router, chartPeriod])

  const getAccountIcon = () => {
    switch (account?.type) {
      case "checking":
        return <CreditCard className="h-6 w-6 text-[#003366]" />
      case "savings":
        return <DollarSign className="h-6 w-6 text-[#003366]" />
      case "investment":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      case "business":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      case "crypto":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      case "offshore":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      case "joint":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      case "trust":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      case "retirement":
        return <BarChart3 className="h-6 w-6 text-[#003366]" />
      default:
        return <CreditCard className="h-6 w-6 text-[#003366]" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: account?.currency || "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (transactionFilter === "all") return true
    if (transactionFilter === "pending") return tx.pending
    if (transactionFilter === "deposits") return tx.amount > 0
    if (transactionFilter === "withdrawals") return tx.amount < 0
    return true
  })

  if (!account) {
    return <div className="container mx-auto pt-6">Loading...</div>
  }

  if (showWelcome) {
    return (
      <AccountWelcomeScreen
        accountType={account.type}
        accountName={account.name}
        accountNumber={account.number}
        balance={account.balance}
        currency={account.currency}
        onComplete={() => setShowWelcome(false)}
      />
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#003366]">{account.name}</h1>
        </div>

        {/* Account Overview */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {getAccountIcon()}
                <div className="ml-2">
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription>Account Number: {account.number}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setHideBalance(!hideBalance)} className="h-8 w-8 p-0">
                {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-3xl font-bold">{hideBalance ? "••••••" : formatCurrency(account.balance)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-xl font-semibold">{hideBalance ? "••••••" : formatCurrency(account.balance)}</p>
              </div>
              <div>
                {account.type === "savings" && (
                  <>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-xl font-semibold">{account.apy}% APY</p>
                  </>
                )}
                {account.type === "investment" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold text-green-600" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "checking" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "business" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "crypto" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "offshore" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "joint" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "trust" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
                {account.type === "retirement" && (
                  <>
                    <p className="text-sm text-gray-500">Features</p>
                    {account.features &&
                      account.features.map((feature: string) => (
                        <p className="text-sm font-semibold" key={feature}>
                          {feature}
                        </p>
                      ))}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button onClick={() => router.push(`/dashboard/transfer/${account.id}`)} className="bg-[#003366]">
                <ArrowUpDown className="mr-2 h-4 w-4" /> Transfer Money
              </Button>
              <Button variant="outline" onClick={() => router.push(`/dashboard/statements?account=${account.id}`)}>
                <Download className="mr-2 h-4 w-4" /> Download Statement
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="balance">Balance History</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                      <SelectTrigger className="w-[180px] h-8">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="pending">Pending Only</SelectItem>
                        <SelectItem value="deposits">Deposits Only</SelectItem>
                        <SelectItem value="withdrawals">Withdrawals Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="space-y-1 min-w-[800px]">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction, index) => (
                        <div
                          key={transaction.id}
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } ${transaction.pending ? "opacity-70" : ""}`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                transaction.amount > 0 ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {transaction.amount > 0 ? (
                                <DollarSign className="h-5 w-5 text-green-600" />
                              ) : (
                                <CreditCard className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(transaction.date)}
                                {transaction.pending && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-gray-800"}`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No transactions found</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Balance History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={chartPeriod} onValueChange={setChartPeriod}>
                      <SelectTrigger className="w-[180px] h-8">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Last Month</SelectItem>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {chartData && (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => formatCurrency(context.parsed.y),
                            },
                          },
                        },
                        scales: {
                          y: {
                            ticks: {
                              callback: (value) => formatCurrency(value as number),
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
