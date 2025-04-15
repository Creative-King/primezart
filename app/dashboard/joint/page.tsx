import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Users, UserPlus, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function JointAccountPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Joint Account Dashboard</h1>
          <p className="text-muted-foreground">Manage your joint account, transactions, and account owners.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/joint/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/joint/add-owner">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Owner
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal: $42,875.20</p>
          </CardContent>
          <CardFooter className="p-2">
            <div className="flex justify-between w-full text-sm">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Deposit</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>Withdraw</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Primary: John Doe</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard/joint/users">
                View All Owners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Transactions in the last 7 days</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard/transactions">
                View Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="owners">Account Owners</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View your most recent account transactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    {i % 2 === 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {i % 2 === 0 ? "Deposit" : "Withdrawal"} - {i % 2 === 0 ? "Jane Doe" : "John Doe"}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(2023, 0, i).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                    {i % 2 === 0 ? "+" : "-"}${(i * 125).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/transactions">
                  View All Transactions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="owners">
          <Card>
            <CardHeader>
              <CardTitle>Account Owners</CardTitle>
              <CardDescription>View and manage all account owners.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["John Doe", "Jane Doe", "Robert Smith"].map((name, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{i === 0 ? "Primary Owner" : "Co-Owner"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/joint/users">
                  Manage Users
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/joint/add-owner">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Owner
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your joint account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  Configure how you receive notifications about account activity.
                </p>
                <Button variant="outline" size="sm">
                  Manage Notifications
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Transaction Limits</h3>
                <p className="text-xs text-muted-foreground">
                  Set daily and monthly transaction limits for all account owners.
                </p>
                <Button variant="outline" size="sm">
                  Set Limits
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Statements</h3>
                <p className="text-xs text-muted-foreground">View and download your account statements.</p>
                <Button variant="outline" size="sm">
                  View Statements
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/settings">
                  Advanced Settings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
