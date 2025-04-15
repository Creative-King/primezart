import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  PiggyBank,
  Repeat,
  Shield,
} from "lucide-react"

export default function CheckingDashboard() {
  // Mock data
  const accountDetails = {
    accountNumber: "****4567",
    routingNumber: "021000021",
    balance: "$25,450.00",
    availableBalance: "$24,950.00",
    pendingTransactions: "$500.00",
    monthlySpending: 65, // percentage of monthly budget
    savingsGoal: 42, // percentage of savings goal
  }

  const recentTransactions = [
    {
      id: 1,
      merchant: "Whole Foods Market",
      amount: "-$89.74",
      date: "Today",
      category: "Groceries",
      status: "Completed",
    },
    { id: 2, merchant: "Amazon.com", amount: "-$129.99", date: "Yesterday", category: "Shopping", status: "Completed" },
    { id: 3, merchant: "Starbucks", amount: "-$5.45", date: "Yesterday", category: "Dining", status: "Completed" },
    {
      id: 4,
      merchant: "Salary Deposit",
      amount: "+$3,250.00",
      date: "Mar 15",
      category: "Income",
      status: "Completed",
    },
    { id: 5, merchant: "Netflix", amount: "-$14.99", date: "Mar 14", category: "Entertainment", status: "Completed" },
  ]

  const upcomingPayments = [
    { id: 1, payee: "Rent", amount: "$1,850.00", dueDate: "Apr 1", status: "Scheduled", recurring: true },
    { id: 2, payee: "Car Loan", amount: "$450.00", dueDate: "Apr 5", status: "Scheduled", recurring: true },
    { id: 3, payee: "Electric Bill", amount: "$95.32", dueDate: "Apr 10", status: "Scheduled", recurring: true },
  ]

  const accountFeatures = [
    {
      title: "Instant Transfers",
      description: "Send money instantly to friends and family",
      icon: <ArrowRight className="h-5 w-5 text-primary" />,
      action: "Transfer Now",
    },
    {
      title: "Bill Pay",
      description: "Pay bills automatically or on demand",
      icon: <FileText className="h-5 w-5 text-primary" />,
      action: "Pay Bills",
    },
    {
      title: "Savings Goals",
      description: "Set up automatic transfers to reach your goals",
      icon: <PiggyBank className="h-5 w-5 text-primary" />,
      action: "Create Goal",
    },
    {
      title: "Card Management",
      description: "Manage your debit card settings and security",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      action: "Manage Card",
    },
  ]

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Premium Checking</h1>
          <p className="text-muted-foreground">Account ending in {accountDetails.accountNumber}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Transfer Money
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your current balance and spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">{accountDetails.balance}</p>
                <div className="mt-2 flex items-center text-sm">
                  <p className="text-muted-foreground">Available: {accountDetails.availableBalance}</p>
                  <span className="mx-2">•</span>
                  <p className="text-muted-foreground">Pending: {accountDetails.pendingTransactions}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm">Monthly Spending</p>
                    <p className="text-sm font-medium">{accountDetails.monthlySpending}%</p>
                  </div>
                  <Progress value={accountDetails.monthlySpending} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm">Savings Goal</p>
                    <p className="text-sm font-medium">{accountDetails.savingsGoal}%</p>
                  </div>
                  <Progress value={accountDetails.savingsGoal} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-sm">
              <p className="font-medium">Account Details</p>
              <p className="text-muted-foreground">Routing: {accountDetails.routingNumber}</p>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Statements
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  {feature.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Link href="/dashboard/transactions">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    View All <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${transaction.amount.includes("+") ? "bg-green-100" : "bg-primary/10"}`}
                      >
                        {transaction.amount.includes("+") ? (
                          <ArrowUpRight
                            className={`h-4 w-4 ${transaction.amount.includes("+") ? "text-green-600" : "text-primary"}`}
                          />
                        ) : (
                          <ArrowRight
                            className={`h-4 w-4 ${transaction.amount.includes("+") ? "text-green-600" : "text-primary"}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.merchant}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{transaction.date}</span>
                          <span className="mx-1">•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount.includes("+") ? "text-green-600" : ""}`}>
                        {transaction.amount}
                      </p>
                      <Badge variant="outline" className="text-xs font-normal">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Payments</CardTitle>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Manage <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.payee}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Due: {payment.dueDate}</span>
                          {payment.recurring && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="flex items-center">
                                <Repeat className="h-3 w-3 mr-1" /> Recurring
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{payment.amount}</p>
                      <Badge variant="outline" className="text-xs font-normal">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">Schedule New Payment</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Premium Benefits</CardTitle>
            <CardDescription>Exclusive benefits for Premium Checking customers</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Fee-Free ATM Access</h3>
              <p className="text-sm text-muted-foreground">Access over 60,000 ATMs worldwide with no fees</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Overdraft Protection</h3>
              <p className="text-sm text-muted-foreground">Automatic coverage up to $1,000 with no fees</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Premium Concierge</h3>
              <p className="text-sm text-muted-foreground">24/7 dedicated customer service line</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Travel Benefits</h3>
              <p className="text-sm text-muted-foreground">No foreign transaction fees and travel insurance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Your spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Spending Breakdown</h3>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Dining</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <Progress value={28} className="h-1.5" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Shopping</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <Progress value={35} className="h-1.5" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Transportation</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <Progress value={15} className="h-1.5" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Utilities</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
                <Progress value={22} className="h-1.5" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full">
              View Detailed Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
