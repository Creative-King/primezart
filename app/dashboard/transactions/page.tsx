"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Search, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Mock transaction data
const allTransactions = [
  {
    id: 1,
    date: "2025-03-14",
    description: "Salary Deposit",
    amount: 3500.0,
    type: "Credit",
    category: "Income",
    account: "Savings",
  },
  {
    id: 2,
    date: "2025-03-12",
    description: "Grocery Store",
    amount: -125.45,
    type: "Debit",
    category: "Groceries",
    account: "Current",
  },
  {
    id: 3,
    date: "2025-03-10",
    description: "Netflix Subscription",
    amount: -14.99,
    type: "Debit",
    category: "Entertainment",
    account: "Current",
  },
  {
    id: 4,
    date: "2025-03-08",
    description: "Transfer to Savings",
    amount: -500.0,
    type: "Debit",
    category: "Transfer",
    account: "Current",
  },
  {
    id: 5,
    date: "2025-03-08",
    description: "Transfer from Current",
    amount: 500.0,
    type: "Credit",
    category: "Transfer",
    account: "Savings",
  },
  {
    id: 6,
    date: "2025-03-05",
    description: "Electric Bill",
    amount: -85.32,
    type: "Debit",
    category: "Utilities",
    account: "Current",
  },
  {
    id: 7,
    date: "2025-03-03",
    description: "Restaurant",
    amount: -62.5,
    type: "Debit",
    category: "Dining",
    account: "Current",
  },
  {
    id: 8,
    date: "2025-03-01",
    description: "Interest Payment",
    amount: 12.45,
    type: "Credit",
    category: "Interest",
    account: "Savings",
  },
  {
    id: 9,
    date: "2025-02-28",
    description: "Gas Station",
    amount: -45.0,
    type: "Debit",
    category: "Transportation",
    account: "Current",
  },
  {
    id: 10,
    date: "2025-02-25",
    description: "Online Shopping",
    amount: -78.99,
    type: "Debit",
    category: "Shopping",
    account: "Current",
  },
  {
    id: 11,
    date: "2025-02-22",
    description: "Dividend Payment",
    amount: 150.0,
    type: "Credit",
    category: "Investment",
    account: "Savings",
  },
  {
    id: 12,
    date: "2025-02-20",
    description: "Mobile Phone Bill",
    amount: -55.0,
    type: "Debit",
    category: "Utilities",
    account: "Current",
  },
  {
    id: 13,
    date: "2025-02-18",
    description: "ATM Withdrawal",
    amount: -200.0,
    type: "Debit",
    category: "Cash",
    account: "Current",
  },
  {
    id: 14,
    date: "2025-02-15",
    description: "Salary Deposit",
    amount: 3500.0,
    type: "Credit",
    category: "Income",
    account: "Savings",
  },
  {
    id: 15,
    date: "2025-02-12",
    description: "Insurance Premium",
    amount: -125.0,
    type: "Debit",
    category: "Insurance",
    account: "Current",
  },
]

export default function TransactionsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [transactions, setTransactions] = useState(allTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState("all")
  const [filterAccount, setFilterAccount] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    // Apply filters
    let filtered = [...allTransactions]

    if (searchQuery) {
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    if (filterAccount !== "all") {
      filtered = filtered.filter((t) => t.account === filterAccount)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory)
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date)
        const fromDate = new Date(dateRange.from)
        const toDate = new Date(dateRange.to)
        return transactionDate >= fromDate && transactionDate <= toDate
      })
    }

    setTransactions(filtered)
    setCurrentPage(1)
  }, [searchQuery, filterType, filterAccount, filterCategory, dateRange])

  const paginatedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterAccount("all")
    setFilterCategory("all")
    setDateRange({ from: "", to: "" })
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-[#003366]">Transaction History</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                  <SelectItem value="Debit">Debit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAccount} onValueChange={setFilterAccount}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Dining">Dining</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[130px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm">From</label>
                          <Input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm">To</label>
                          <Input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setDateRange({ from: "", to: "" })}>Reset</Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {paginatedTransactions.length > 0 ? (
                <>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Date</th>
                          <th className="py-3 px-4 text-left font-medium">Description</th>
                          <th className="py-3 px-4 text-left font-medium">Category</th>
                          <th className="py-3 px-4 text-left font-medium">Account</th>
                          <th className="py-3 px-4 text-right font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                            <td className="py-3 px-4">{transaction.description}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{transaction.category}</Badge>
                            </td>
                            <td className="py-3 px-4">{transaction.account}</td>
                            <td
                              className={`py-3 px-4 text-right font-medium ${
                                transaction.type === "Credit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "Credit" ? "+" : ""}
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No transactions found matching your filters.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              {/* Similar content for income transactions */}
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Switch to the "All Transactions" tab and filter by type "Credit" to see income transactions.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              {/* Similar content for expense transactions */}
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Switch to the "All Transactions" tab and filter by type "Debit" to see expense transactions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

