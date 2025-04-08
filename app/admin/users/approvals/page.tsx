"use client"

import type React from "react"

import { useState } from "react"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Clock,
  User,
  Mail,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for pending approvals
const pendingUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    dateApplied: "2023-03-12",
    accountType: "Premium Checking",
    idVerified: true,
    addressVerified: true,
    phoneVerified: true,
    riskScore: "Low",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael.b@example.com",
    dateApplied: "2023-03-11",
    accountType: "Premium Savings",
    idVerified: true,
    addressVerified: false,
    phoneVerified: true,
    riskScore: "Medium",
  },
  {
    id: 3,
    name: "James Smith",
    email: "james.s@example.com",
    dateApplied: "2023-03-10",
    accountType: "Business Account",
    idVerified: true,
    addressVerified: true,
    phoneVerified: false,
    riskScore: "Medium",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    dateApplied: "2023-03-09",
    accountType: "Investment Account",
    idVerified: false,
    addressVerified: true,
    phoneVerified: true,
    riskScore: "High",
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.l@example.com",
    dateApplied: "2023-03-08",
    accountType: "Premium Checking",
    idVerified: true,
    addressVerified: true,
    phoneVerified: true,
    riskScore: "Low",
  },
]

export default function UserApprovals() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(pendingUsers)
  const [filterRisk, setFilterRisk] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setFilteredUsers(
        pendingUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredUsers(pendingUsers)
    }
  }

  const handleFilterChange = (value: string) => {
    setFilterRisk(value)
    if (value === "all") {
      setFilteredUsers(pendingUsers)
    } else {
      setFilteredUsers(pendingUsers.filter((user) => user.riskScore.toLowerCase() === value.toLowerCase()))
    }
  }

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleApproveUser = (user: any) => {
    setSelectedUser(user)
    setApproveDialogOpen(true)
  }

  const handleRejectUser = (user: any) => {
    setSelectedUser(user)
    setRejectDialogOpen(true)
  }

  const confirmApprove = () => {
    toast({
      title: "User Approved",
      description: `${selectedUser.name}'s account has been approved successfully.`,
      variant: "default",
    })
    setApproveDialogOpen(false)
    // In a real app, you would update the user status in the database
    setFilteredUsers(filteredUsers.filter((user) => user.id !== selectedUser.id))
  }

  const confirmReject = () => {
    toast({
      title: "User Rejected",
      description: `${selectedUser.name}'s account has been rejected.`,
      variant: "destructive",
    })
    setRejectDialogOpen(false)
    // In a real app, you would update the user status in the database
    setFilteredUsers(filteredUsers.filter((user) => user.id !== selectedUser.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve new user registrations.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>User Approval Queue</CardTitle>
              <CardDescription>{filteredUsers.length} users awaiting approval</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </form>
              <Select value={filterRisk} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by risk" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Name</th>
                  <th className="text-left py-3 px-2 font-medium">Email</th>
                  <th className="text-left py-3 px-2 font-medium">Date Applied</th>
                  <th className="text-left py-3 px-2 font-medium">Account Type</th>
                  <th className="text-left py-3 px-2 font-medium">Risk Score</th>
                  <th className="text-left py-3 px-2 font-medium">Verification</th>
                  <th className="text-right py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 px-2">{user.name}</td>
                      <td className="py-3 px-2">{user.email}</td>
                      <td className="py-3 px-2">{user.dateApplied}</td>
                      <td className="py-3 px-2">{user.accountType}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            user.riskScore === "Low"
                              ? "default"
                              : user.riskScore === "Medium"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {user.riskScore}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-1">
                          <Badge variant={user.idVerified ? "default" : "destructive"} className="text-xs">
                            ID
                          </Badge>
                          <Badge variant={user.addressVerified ? "default" : "destructive"} className="text-xs">
                            Address
                          </Badge>
                          <Badge variant={user.phoneVerified ? "default" : "destructive"} className="text-xs">
                            Phone
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button size="sm" onClick={() => handleApproveUser(user)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user)}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No pending approvals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Review user information before making a decision</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="account">Account Details</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Full Name</h4>
                        <p>{selectedUser.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Email Address</h4>
                        <p>{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Date Applied</h4>
                        <p>{selectedUser.dateApplied}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Risk Score</h4>
                        <Badge
                          variant={
                            selectedUser.riskScore === "Low"
                              ? "default"
                              : selectedUser.riskScore === "Medium"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {selectedUser.riskScore}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Address Information</h4>
                    <p>123 Main Street, Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Account Type</h4>
                        <p>{selectedUser.accountType}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Employment Status</h4>
                        <p>Employed Full-Time</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Financial Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Income</p>
                        <p>$75,000 - $100,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Source of Funds</p>
                        <p>Employment</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="verification" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">ID Verification</h4>
                        <Badge variant={selectedUser.idVerified ? "default" : "destructive"}>
                          {selectedUser.idVerified ? "Verified" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">ID Document</p>
                      <div className="bg-muted h-32 rounded-md flex items-center justify-center">
                        <Eye className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Address Verification</h4>
                        <Badge variant={selectedUser.addressVerified ? "default" : "destructive"}>
                          {selectedUser.addressVerified ? "Verified" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Proof of Address</p>
                      <div className="bg-muted h-32 rounded-md flex items-center justify-center">
                        <Eye className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Phone Verification</h4>
                        <Badge variant={selectedUser.phoneVerified ? "default" : "destructive"}>
                          {selectedUser.phoneVerified ? "Verified" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Phone Number</p>
                      <p>+1 (555) 123-4567</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Clock className="h-4 w-4 mr-1" /> Send Verification Code
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Verification Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.riskScore === "High" ? (
                        <span className="text-red-500">
                          High risk score due to inconsistent information. Manual review required.
                        </span>
                      ) : selectedUser.riskScore === "Medium" ? (
                        <span className="text-amber-500">
                          Some verification checks failed. Additional documentation may be required.
                        </span>
                      ) : (
                        <span className="text-green-500">All verification checks passed. No issues detected.</span>
                      )}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-end">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setViewDialogOpen(false)
                  handleApproveUser(selectedUser)
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setViewDialogOpen(false)
                  handleRejectUser(selectedUser)
                }}
              >
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve User Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve User</DialogTitle>
            <DialogDescription>Are you sure you want to approve this user's account?</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Account Type:</span>
                  <span className="text-sm font-medium">{selectedUser.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Date Applied:</span>
                  <span className="text-sm font-medium">{selectedUser.dateApplied}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risk Score:</span>
                  <span className="text-sm font-medium">{selectedUser.riskScore}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approving this user will create their account and send them a welcome email with login instructions.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject User Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this user's account application.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Select onValueChange={setRejectReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rejection reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incomplete">Incomplete Information</SelectItem>
                    <SelectItem value="verification">Failed Verification</SelectItem>
                    <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                    <SelectItem value="duplicate">Duplicate Application</SelectItem>
                    <SelectItem value="other">Other Reason</SelectItem>
                  </SelectContent>
                </Select>

                <Input placeholder="Additional comments (optional)" />

                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Rejecting this user will notify them via email and they will need to reapply with corrected
                    information.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectReason}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

