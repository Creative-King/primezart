"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Plus,
  ChevronRight,
  DollarSign,
  BarChart3,
  Wallet,
  Building,
  Briefcase,
  Users,
  PiggyBank,
  Globe,
  Lock,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock accounts data
const personalAccounts = [
  {
    id: "acc1",
    name: "Premium Checking",
    number: "****4532",
    balance: 12435.67,
    type: "checking",
    currency: "USD",
    features: ["No monthly fees", "Unlimited transactions"],
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    icon: <CreditCard className="h-6 w-6 text-white" />,
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
    color: "bg-gradient-to-r from-green-500 to-green-600",
    icon: <PiggyBank className="h-6 w-6 text-white" />,
  },
  {
    id: "acc3",
    name: "Investment Account",
    number: "****2341",
    balance: 98765.43,
    type: "investment",
    currency: "USD",
    features: ["Diversified portfolio", "Professional management"],
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    icon: <BarChart3 className="h-6 w-6 text-white" />,
  },
  {
    id: "acc5",
    name: "Cryptocurrency Account",
    number: "****1234",
    balance: 15000.0,
    type: "crypto",
    currency: "USD",
    features: ["Secure storage", "Multiple cryptocurrencies"],
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    icon: <Wallet className="h-6 w-6 text-white" />,
  },
  {
    id: "acc6",
    name: "Offshore Account",
    number: "****5678",
    balance: 250000.0,
    type: "offshore",
    currency: "EUR",
    features: ["Privacy", "Multi-currency support"],
    color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    icon: <Globe className="h-6 w-6 text-white" />,
  },
  {
    id: "acc7",
    name: "Joint Account",
    number: "****9012",
    balance: 28750.45,
    type: "joint",
    currency: "USD",
    features: ["Shared access", "Transparent transactions"],
    color: "bg-gradient-to-r from-pink-500 to-pink-600",
    icon: <Users className="h-6 w-6 text-white" />,
  },
]

const businessAccounts = [
  {
    id: "bacc1",
    name: "Business Checking",
    number: "****8765",
    balance: 45678.9,
    type: "business",
    currency: "USD",
    features: ["Business tools", "Merchant services"],
    color: "bg-gradient-to-r from-blue-700 to-blue-800",
    icon: <Building className="h-6 w-6 text-white" />,
  },
  {
    id: "bacc2",
    name: "Business Savings",
    number: "****4321",
    balance: 125000.0,
    type: "business-savings",
    currency: "USD",
    apy: "2.75%",
    features: ["High yield", "Flexible access"],
    color: "bg-gradient-to-r from-green-700 to-green-800",
    icon: <PiggyBank className="h-6 w-6 text-white" />,
  },
  {
    id: "bacc3",
    name: "Business Investment",
    number: "****9876",
    balance: 350000.0,
    type: "business-investment",
    currency: "USD",
    features: ["Portfolio management", "Growth strategies"],
    color: "bg-gradient-to-r from-purple-700 to-purple-800",
    icon: <BarChart3 className="h-6 w-6 text-white" />,
  },
  {
    id: "bacc4",
    name: "Payroll Account",
    number: "****5432",
    balance: 75000.0,
    type: "payroll",
    currency: "USD",
    features: ["Automated payroll", "Tax management"],
    color: "bg-gradient-to-r from-orange-700 to-orange-800",
    icon: <Briefcase className="h-6 w-6 text-white" />,
  },
  {
    id: "bacc5",
    name: "Business Credit Line",
    number: "****1098",
    balance: 200000.0,
    type: "credit-line",
    currency: "USD",
    features: ["Flexible borrowing", "Competitive rates"],
    color: "bg-gradient-to-r from-red-700 to-red-800",
    icon: <DollarSign className="h-6 w-6 text-white" />,
  },
]

export default function AccountsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [activeTab, setActiveTab] = useState("all")
  const [newAccountDialogOpen, setNewAccountDialogOpen] = useState(false)
  const [accountDetails, setAccountDetails] = useState({
    name: "",
    type: "checking",
    initialDeposit: "",
  })

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

  const handleOpenAccount = () => {
    setNewAccountDialogOpen(true)
  }

  const handleSubmitNewAccount = () => {
    // In a real app, this would submit the request to the backend
    setNewAccountDialogOpen(false)
    alert(`Your request to open a ${accountDetails.type} account has been submitted successfully!`)
  }

  const handleViewAccount = (accountId) => {
    router.push(`/dashboard/accounts/${accountId}`)
  }

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
  }

  // Filter accounts based on account mode and active tab
  const accounts = accountMode === "personal" ? personalAccounts : businessAccounts
  const filteredAccounts =
    activeTab === "all"
      ? accounts
      : accounts.filter(
          (account) =>
            account.type === activeTab ||
            (activeTab === "savings" && account.type === "business-savings") ||
            (activeTab === "investment" && account.type === "business-investment"),
        )

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your banking and investment accounts.</p>
        </div>
        <Button onClick={handleOpenAccount} className="sky-button">
          <Plus className="mr-2 h-4 w-4" /> Open New Account
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          {accountMode === "personal" ? (
            <>
              <TabsTrigger value="joint">Joint</TabsTrigger>
              <TabsTrigger value="offshore">Offshore</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="credit-line">Credit Line</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="overflow-hidden">
                <CardHeader className={`p-4 ${account.color} text-white`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {account.icon}
                      <CardTitle className="ml-2 text-white">{account.name}</CardTitle>
                    </div>
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/80">Account Number: {account.number}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Available Balance</p>
                      <p className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                    </div>
                    {account.apy && (
                      <div className="flex items-center">
                        <Percent className="h-4 w-4 text-green-500 mr-1" />
                        <p className="text-sm text-green-600 font-medium">{account.apy} APY</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      {account.features &&
                        account.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                            <p className="text-sm text-gray-600">{feature}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => handleViewAccount(account.id)}
                  >
                    View Account Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Account Dialog */}
      <Dialog open={newAccountDialogOpen} onOpenChange={setNewAccountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Open New Account</DialogTitle>
            <DialogDescription>Select the type of account you would like to open.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-name" className="text-right">
                Account Name
              </Label>
              <Input
                id="account-name"
                className="col-span-3"
                value={accountDetails.name}
                onChange={(e) => setAccountDetails({ ...accountDetails, name: e.target.value })}
                placeholder="e.g., My Savings Account"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-type" className="text-right">
                Account Type
              </Label>
              <Select
                value={accountDetails.type}
                onValueChange={(value) => setAccountDetails({ ...accountDetails, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountMode === "personal" ? (
                    <>
                      <SelectItem value="checking">Checking Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="investment">Investment Account</SelectItem>
                      <SelectItem value="joint">Joint Account</SelectItem>
                      <SelectItem value="offshore">Offshore Account</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency Account</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="business">Business Checking</SelectItem>
                      <SelectItem value="business-savings">Business Savings</SelectItem>
                      <SelectItem value="business-investment">Business Investment</SelectItem>
                      <SelectItem value="payroll">Payroll Account</SelectItem>
                      <SelectItem value="credit-line">Business Credit Line</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initial-deposit" className="text-right">
                Initial Deposit
              </Label>
              <Input
                id="initial-deposit"
                className="col-span-3"
                value={accountDetails.initialDeposit}
                onChange={(e) => setAccountDetails({ ...accountDetails, initialDeposit: e.target.value })}
                placeholder="Enter amount"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewAccount}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle className="text-blue-800 text-lg">Account Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 text-sm">
            Your accounts are protected by industry-leading security measures. We use advanced encryption and
            multi-factor authentication to keep your financial information safe.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

