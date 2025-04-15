"use client"

import { useState, useEffect } from "react"
import { Users, CreditCard, DollarSign, AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import AdminNotificationSound from "@/components/admin/admin-notification-sound"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const { toast } = useToast()
  const [showNotification, setShowNotification] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 1254,
    activeUsers: 987,
    pendingApprovals: 3,
    totalTransactions: 8765,
    pendingTransactions: 5,
    revenue: 1245678.9,
    growth: 12.5,
  })

  // Simulate receiving a new notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true)
      toast({
        title: "New User Registration",
        description: "Sarah Johnson has registered and is awaiting approval",
        variant: "default",
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast])

  // Chart data
  const transactionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Transactions",
        data: [65, 59, 80, 81, 56, 55, 70, 75, 80, 85, 90, 100],
        borderColor: "#3366CC",
        backgroundColor: "rgba(51, 102, 204, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const userActivityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Active Users",
        data: [150, 230, 180, 290, 200, 120, 160],
        backgroundColor: "#4CAF50",
      },
      {
        label: "New Registrations",
        data: [20, 25, 18, 30, 22, 15, 17],
        backgroundColor: "#2196F3",
      },
    ],
  }

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", status: "active", date: "2023-03-12" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", status: "pending", date: "2023-03-12" },
    { id: 3, name: "Michael Brown", email: "michael.b@example.com", status: "pending", date: "2023-03-11" },
    { id: 4, name: "Emma Wilson", email: "emma.w@example.com", status: "active", date: "2023-03-10" },
    { id: 5, name: "James Smith", email: "james.s@example.com", status: "pending", date: "2023-03-10" },
  ]

  const recentTransactions = [
    { id: 1, user: "John Doe", type: "Transfer", amount: 1500.0, status: "completed", date: "2023-03-12" },
    { id: 2, name: "Sarah Johnson", type: "Withdrawal", amount: 500.0, status: "pending", date: "2023-03-12" },
    { id: 3, name: "Michael Brown", type: "Deposit", amount: 2000.0, status: "completed", date: "2023-03-11" },
    { id: 4, name: "Emma Wilson", type: "Transfer", amount: 750.0, status: "pending", date: "2023-03-10" },
    { id: 5, name: "James Smith", type: "Withdrawal", amount: 300.0, status: "completed", date: "2023-03-10" },
  ]

  const handleApprove = (id: number) => {
    toast({
      title: "User Approved",
      description: `User ID ${id} has been approved successfully.`,
      variant: "default",
    })
  }

  const handleReject = (id: number) => {
    toast({
      title: "User Rejected",
      description: `User ID ${id} has been rejected.`,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {showNotification && <AdminNotificationSound />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here's an overview of your system.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button>Download Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500 font-medium">Action required</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingTransactions} pending transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> {stats.growth}%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>Transaction volume over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                data={transactionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Weekly user activity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={userActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>{stats.pendingApprovals} users awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Name</th>
                      <th className="text-left py-3 px-2 font-medium">Email</th>
                      <th className="text-left py-3 px-2 font-medium">Status</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-right py-3 px-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-2">{user.name}</td>
                        <td className="py-3 px-2">{user.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant={user.status === "active" ? "default" : "outline"}>
                            {user.status === "active" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">{user.date}</td>
                        <td className="py-3 px-2 text-right">
                          {user.status === "pending" ? (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleApprove(user.id)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(user.id)}>
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Users
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>{stats.pendingTransactions} transactions awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">User</th>
                      <th className="text-left py-3 px-2 font-medium">Type</th>
                      <th className="text-left py-3 px-2 font-medium">Amount</th>
                      <th className="text-left py-3 px-2 font-medium">Status</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-right py-3 px-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3 px-2">{transaction.user || transaction.name}</td>
                        <td className="py-3 px-2">{transaction.type}</td>
                        <td className="py-3 px-2">${transaction.amount.toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                            {transaction.status === "completed" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">{transaction.date}</td>
                        <td className="py-3 px-2 text-right">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
