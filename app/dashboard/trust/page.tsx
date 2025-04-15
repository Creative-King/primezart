"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, DollarSign, AlertCircle, FileText, Users, BarChart3, Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import FloatingRadialMenu from "@/components/floating-radial-menu"

export default function TrustAccountPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [isMobile, setIsMobile] = useState(false)

  // Mock trust account data
  const trustAccount = {
    id: "trust1",
    name: "Family Trust",
    number: "****5678",
    balance: 1250000.0,
    currency: "USD",
    type: "trust",
    creationDate: "2022-05-15",
    trustType: "Revocable Living Trust",
    trustee: "John Doe",
    beneficiaries: [
      { name: "Sarah Doe", relationship: "Spouse", allocation: 50 },
      { name: "Michael Doe", relationship: "Child", allocation: 25 },
      { name: "Emily Doe", relationship: "Child", allocation: 25 },
    ],
    assets: [
      { name: "Cash", value: 250000, allocation: 20 },
      { name: "Stocks", value: 500000, allocation: 40 },
      { name: "Bonds", value: 300000, allocation: 24 },
      { name: "Real Estate", value: 200000, allocation: 16 },
    ],
    documents: [
      { name: "Trust Agreement", date: "2022-05-15", status: "Active" },
      { name: "Amendment 1", date: "2023-01-10", status: "Active" },
      { name: "Annual Report", date: "2023-12-01", status: "Active" },
    ],
    transactions: [
      { id: "tr1", date: "2023-12-15", description: "Dividend Payment", amount: 12500.0, type: "Credit" },
      { id: "tr2", date: "2023-11-30", description: "Property Management Fee", amount: -2500.0, type: "Debit" },
      { id: "tr3", date: "2023-11-15", description: "Bond Interest", amount: 7500.0, type: "Credit" },
      { id: "tr4", date: "2023-10-30", description: "Legal Services", amount: -5000.0, type: "Debit" },
      { id: "tr5", date: "2023-10-15", description: "Stock Dividend", amount: 15000.0, type: "Credit" },
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

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trust Account</h1>
          <p className="text-muted-foreground">Manage your trust assets and beneficiaries</p>
        </div>
      </div>

      {/* Trust Account Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{trustAccount.name}</CardTitle>
              <CardDescription>Account Number: {trustAccount.number}</CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{trustAccount.trustType}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(trustAccount.balance)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trustee</p>
              <p className="font-medium">{trustAccount.trustee}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Beneficiaries</p>
              <p className="font-medium">{trustAccount.beneficiaries.length} People</p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Your annual trust review is scheduled for {new Date().getFullYear() + 1}. Contact your trust officer for
              any changes.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Asset Allocation</h3>
              <div className="space-y-3">
                {trustAccount.assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
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
              <h3 className="font-medium mb-3">Beneficiaries</h3>
              <div className="space-y-3">
                {trustAccount.beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{beneficiary.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{beneficiary.name}</p>
                        <p className="text-xs text-muted-foreground">{beneficiary.relationship}</p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline">{beneficiary.allocation}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Management Tabs */}
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
              <CardDescription>View recent activity in your trust account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trustAccount.transactions.slice(0, 4).map((transaction) => (
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
                    <div className={`font-medium ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "Credit" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/trust/transactions")}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust Documents</CardTitle>
              <CardDescription>Access and manage your trust documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trustAccount.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <FileText className="h-4 w-4 text-blue-600" />
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
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust Settings</CardTitle>
              <CardDescription>Manage your trust preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Beneficiary Management</p>
                      <p className="text-sm text-muted-foreground">Add or modify trust beneficiaries</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Investment Preferences</p>
                      <p className="text-sm text-muted-foreground">Update investment strategy</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Distribution Schedule</p>
                      <p className="text-sm text-muted-foreground">Set up recurring distributions</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <Lock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Access Controls</p>
                      <p className="text-sm text-muted-foreground">Manage who can view trust details</p>
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

      {/* Trust Advisor */}
      <Card>
        <CardHeader>
          <CardTitle>Your Trust Advisor</CardTitle>
          <CardDescription>Contact your dedicated trust advisor for assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Trust Advisor" />
              <AvatarFallback>TA</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-medium">Elizabeth Morgan</h3>
              <p className="text-sm text-muted-foreground mb-2">Senior Trust Officer</p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <p className="text-sm">
                  <span className="text-muted-foreground mr-2">Email:</span>
                  elizabeth.morgan@primezart.com
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground mr-2">Phone:</span>
                  +1 (800) 555-1234 ext. 567
                </p>
              </div>
            </div>
            <Button>Schedule Meeting</Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Radial Menu for Trust Account */}
      <FloatingRadialMenu type="trust" />
    </div>
  )
}
