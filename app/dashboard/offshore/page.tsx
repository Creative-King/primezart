"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Globe,
  FileText,
  ArrowRight,
  ChevronRight,
  BarChart3,
  DollarSign,
  Lock,
  AlertCircle,
  CreditCard,
  Flag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OffshoreAccountPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  // Mock offshore account data
  const offshoreAccount = {
    id: "offshore1",
    name: "International Wealth Account",
    number: "****9012",
    balances: {
      USD: 1750000.0,
      EUR: 1610000.0,
      GBP: 1382500.0,
      CHF: 1575000.0,
    },
    type: "offshore",
    location: "Cayman Islands",
    creationDate: "2021-08-10",
    accountType: "Multi-Currency Investment",
    accountHolder: "John Doe",
    assets: [
      { name: "Cash & Equivalents", value: 350000, allocation: 20 },
      { name: "Global Equities", value: 700000, allocation: 40 },
      { name: "Fixed Income", value: 437500, allocation: 25 },
      { name: "Alternative Investments", value: 262500, allocation: 15 },
    ],
    documents: [
      { name: "Account Agreement", date: "2021-08-10", status: "Active" },
      { name: "Tax Compliance Certificate", date: "2023-01-15", status: "Active" },
      { name: "Investment Policy Statement", date: "2022-06-20", status: "Active" },
    ],
    transactions: [
      {
        id: "tr1",
        date: "2023-12-10",
        description: "Dividend Payment",
        amount: 18500.0,
        currency: "USD",
        type: "Credit",
      },
      { id: "tr2", date: "2023-11-25", description: "Wire Transfer", amount: 50000.0, currency: "EUR", type: "Credit" },
      { id: "tr3", date: "2023-11-15", description: "Management Fee", amount: -8750.0, currency: "USD", type: "Debit" },
      { id: "tr4", date: "2023-10-30", description: "Bond Interest", amount: 12500.0, currency: "GBP", type: "Credit" },
      {
        id: "tr5",
        date: "2023-10-05",
        description: "Currency Exchange",
        amount: -100000.0,
        currency: "USD",
        type: "Debit",
      },
    ],
    cards: [
      {
        id: "card1",
        type: "Debit",
        name: "Offshore Platinum Debit",
        number: "5459 **** **** 8123",
        expiryDate: "05/27",
        currency: "USD",
        status: "Active",
      },
      {
        id: "card2",
        type: "Debit",
        name: "Offshore Euro Debit",
        number: "5459 **** **** 8124",
        expiryDate: "05/27",
        currency: "EUR",
        status: "Active",
      },
    ],
  }

  useEffect(() => {
    setIsClient(true)

    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      }
    }
  }, [])

  const formatCurrency = (amount, currency = selectedCurrency) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "GBP":
        return "£"
      case "CHF":
        return "CHF"
      default:
        return "$"
    }
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offshore Account</h1>
          <p className="text-muted-foreground">Manage your international wealth portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/offshore/statements")}>
            <FileText className="mr-2 h-4 w-4" /> Statements
          </Button>
          <Button onClick={() => router.push("/dashboard/offshore/manage")}>
            <Globe className="mr-2 h-4 w-4" /> Manage Account
          </Button>
        </div>
      </div>

      {/* Offshore Account Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{offshoreAccount.name}</CardTitle>
              <CardDescription>
                Account Number: {offshoreAccount.number} • Location: {offshoreAccount.location}
              </CardDescription>
            </div>
            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
              <Flag className="h-3 w-3 mr-1" /> {offshoreAccount.accountType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="h-7 w-[70px]">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(offshoreAccount.balances[selectedCurrency])}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Holder</p>
              <p className="font-medium">{offshoreAccount.accountHolder}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opened On</p>
              <p className="font-medium">{formatDate(offshoreAccount.creationDate)}</p>
            </div>
          </div>

          <Alert className="bg-indigo-50 border-indigo-200 text-indigo-800 mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Your offshore account offers enhanced privacy and multi-currency capabilities. Contact your relationship
              manager for tax optimization strategies.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Asset Allocation</h3>
              <div className="space-y-3">
                {offshoreAccount.assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                      <span>{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={asset.allocation} max={100} className="w-24 h-2" />
                      <span className="text-sm">{asset.allocation}%</span>
                      <span className="text-sm text-muted-foreground">{formatCurrency(asset.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Currency Breakdown</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(offshoreAccount.balances).map(([currency, amount]) => (
                  <div key={currency} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{currency}</span>
                      <Badge variant="outline">{getCurrencySymbol(currency)}</Badge>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(amount, currency)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offshore Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offshoreAccount.cards.map((card) => (
          <Card key={card.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{card.name}</CardTitle>
                <Badge className="bg-green-100 text-green-800">{card.status}</Badge>
              </div>
              <CardDescription>
                {card.type} Card • {card.currency}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Card Number</p>
                  <p className="font-medium">{card.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expires</p>
                  <p className="font-medium">{card.expiryDate}</p>
                </div>
                <CreditCard className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Manage Card
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Offshore Management Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View recent activity in your offshore account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offshoreAccount.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "Credit" ? "bg-green-100" : "bg-red-100"} mr-3`}
                      >
                        {transaction.type === "Credit" ? (
                          <DollarSign
                            className={`h-4 w-4 ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                          />
                        ) : (
                          <ArrowRight
                            className={`h-4 w-4 ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`font-medium ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"} mr-2`}
                      >
                        {transaction.type === "Credit" ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
                      </div>
                      <Badge variant="outline">{transaction.currency}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/offshore/transactions")}
              >
                View All Transactions <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offshore Documents</CardTitle>
              <CardDescription>Access and manage your offshore documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offshoreAccount.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-indigo-100 mr-3">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">{document.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={document.status === "Active" ? "default" : "outline"}>{document.status}</Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/offshore/documents")}>
                View All Documents <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offshore Account Settings</CardTitle>
              <CardDescription>Manage your offshore account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <Globe className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Currency Preferences</p>
                      <p className="text-sm text-muted-foreground">Set default currency and exchange preferences</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Investment Strategy</p>
                      <p className="text-sm text-muted-foreground">Update offshore investment preferences</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Card Management</p>
                      <p className="text-sm text-muted-foreground">Manage offshore debit and credit cards</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <Lock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">Configure account privacy and reporting</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Relationship Manager */}
      <Card>
        <CardHeader>
          <CardTitle>Your Offshore Relationship Manager</CardTitle>
          <CardDescription>Contact your dedicated international banking specialist</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Relationship Manager" />
              <AvatarFallback>RM</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-medium">Jonathan Blackwell</h3>
              <p className="text-sm text-muted-foreground mb-2">Senior International Wealth Manager</p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <p className="text-sm">
                  <span className="text-muted-foreground mr-2">Email:</span>
                  jonathan.blackwell@primezart.com
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground mr-2">Phone:</span>
                  +1 (800) 555-9876 ext. 321
                </p>
              </div>
            </div>
            <Button>Schedule Meeting</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

