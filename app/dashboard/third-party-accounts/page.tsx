"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Edit, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock third-party accounts data
const initialThirdPartyAccounts = [
  {
    id: "tp1",
    name: "John Smith",
    email: "john.smith@example.com",
    accessLevel: "view",
    status: "active",
    lastAccess: "2024-11-15",
    accounts: ["acc1", "acc2"],
  },
  {
    id: "tp2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    accessLevel: "limited",
    status: "pending",
    lastAccess: "Never",
    accounts: ["acc1"],
  },
  {
    id: "tp3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    accessLevel: "full",
    status: "inactive",
    lastAccess: "2024-10-20",
    accounts: ["acc1", "acc2", "acc3"],
  },
]

// Mock account data
const accounts = [
  { id: "acc1", name: "Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "acc2", name: "Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
  { id: "acc3", name: "Investment Portfolio", number: "****2341", balance: 98765.43, type: "investment" },
]

export default function ThirdPartyAccountsPage() {
  const router = useRouter()
  const [thirdPartyAccounts, setThirdPartyAccounts] = useState(initialThirdPartyAccounts)
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  // Form states
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newAccessLevel, setNewAccessLevel] = useState("view")
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  const filteredAccounts =
    activeTab === "all" ? thirdPartyAccounts : thirdPartyAccounts.filter((account) => account.status === activeTab)

  const handleAddAccount = () => {
    if (!newName || !newEmail || !newAccessLevel || selectedAccounts.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    const newAccount = {
      id: `tp${thirdPartyAccounts.length + 1}`,
      name: newName,
      email: newEmail,
      accessLevel: newAccessLevel,
      status: "pending",
      lastAccess: "Never",
      accounts: selectedAccounts,
    }

    setThirdPartyAccounts([...thirdPartyAccounts, newAccount])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditAccount = () => {
    if (!selectedAccount) return

    setThirdPartyAccounts(
      thirdPartyAccounts.map((account) =>
        account.id === selectedAccount
          ? {
              ...account,
              name: newName,
              email: newEmail,
              accessLevel: newAccessLevel,
              accounts: selectedAccounts,
            }
          : account,
      ),
    )

    resetForm()
    setIsEditDialogOpen(false)
    setSelectedAccount(null)
  }

  const handleDeleteAccount = (id: string) => {
    setThirdPartyAccounts(thirdPartyAccounts.filter((account) => account.id !== id))
  }

  const handleEditClick = (account: any) => {
    setSelectedAccount(account.id)
    setNewName(account.name)
    setNewEmail(account.email)
    setNewAccessLevel(account.accessLevel)
    setSelectedAccounts(account.accounts)
    setIsEditDialogOpen(true)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setThirdPartyAccounts(
      thirdPartyAccounts.map((account) => (account.id === id ? { ...account, status: newStatus } : account)),
    )
  }

  const resetForm = () => {
    setNewName("")
    setNewEmail("")
    setNewAccessLevel("view")
    setSelectedAccounts([])
  }

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case "view":
        return <Badge className="bg-blue-100 text-blue-800">View Only</Badge>
      case "limited":
        return <Badge className="bg-yellow-100 text-yellow-800">Limited Access</Badge>
      case "full":
        return <Badge className="bg-purple-100 text-purple-800">Full Access</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-[#003366]">Third-Party Access</h1>
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#003366] hover:bg-[#002244] text-white">
            <Plus className="h-4 w-4 mr-2" /> Add New Access
          </Button>
        </div>

        <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Manage Account Access</AlertTitle>
          <AlertDescription>
            Third-party access allows you to grant limited or full access to your accounts to trusted individuals or
            organizations. All access is monitored and can be revoked at any time.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <Card key={account.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>{account.email}</CardDescription>
                    </div>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditClick(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Access Level:</span>
                      {getAccessLevelBadge(account.accessLevel)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status:</span>
                      {getStatusBadge(account.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Last Access:</span>
                      <span className="text-sm">{account.lastAccess}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Accessible Accounts:</span>
                      <div className="space-y-1">
                        {account.accounts.map((accId) => {
                          const acc = accounts.find((a) => a.id === accId)
                          return acc ? (
                            <div key={accId} className="text-sm bg-gray-100 p-2 rounded-md">
                              {acc.name} ({acc.number})
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Active</span>
                    <Switch
                      checked={account.status === "active"}
                      onCheckedChange={(checked) => handleStatusChange(account.id, checked ? "active" : "inactive")}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Activity Log
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Third-Party Access</h3>
              <p className="text-gray-500 mb-4">You haven't granted access to any third parties yet.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#003366]">
                <Plus className="h-4 w-4 mr-2" /> Add New Access
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Access Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Third-Party Access</DialogTitle>
            <DialogDescription>
              Grant access to your accounts to a trusted individual or organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select value={newAccessLevel} onValueChange={setNewAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Accounts</Label>
              <div className="space-y-2 border rounded-md p-3">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={account.id}
                      checked={selectedAccounts.includes(account.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts([...selectedAccounts, account.id])
                        } else {
                          setSelectedAccounts(selectedAccounts.filter((id) => id !== account.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={account.id} className="text-sm">
                      {account.name} ({account.number})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAccount} className="bg-[#003366]">
              Add Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Access Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Third-Party Access</DialogTitle>
            <DialogDescription>Modify access settings for this third party.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-accessLevel">Access Level</Label>
              <Select value={newAccessLevel} onValueChange={setNewAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Accounts</Label>
              <div className="space-y-2 border rounded-md p-3">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${account.id}`}
                      checked={selectedAccounts.includes(account.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts([...selectedAccounts, account.id])
                        } else {
                          setSelectedAccounts(selectedAccounts.filter((id) => id !== account.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`edit-${account.id}`} className="text-sm">
                      {account.name} ({account.number})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsEditDialogOpen(false)
                setSelectedAccount(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAccount} className="bg-[#003366]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
