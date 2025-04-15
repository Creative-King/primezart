"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownLeft, Globe, AlertCircle, Check, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ReceivePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [receiveMethod, setReceiveMethod] = useState("domestic")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

  // Mock account officers data
  const accountOfficers = [
    {
      id: "ao1",
      name: "Michael Chen",
      position: "Senior Account Officer",
      email: "michael.chen@primezart.com",
      phone: "+1 (800) 555-1234 ext. 101",
      region: "North America",
      avatar: "/placeholder.svg?height=80&width=80",
      bankDetails: {
        bankName: "Primezart Bank",
        accountName: "Primezart Client Trust",
        accountNumber: "8901234567",
        routingNumber: "021000021",
        swift: "PRMZUS33",
        reference: "DEPOSIT-[YOUR ACCOUNT NUMBER]",
      },
    },
    {
      id: "ao2",
      name: "Sophia Rodriguez",
      position: "International Client Manager",
      email: "sophia.rodriguez@primezart.com",
      phone: "+1 (800) 555-1234 ext. 102",
      region: "Europe & Latin America",
      avatar: "/placeholder.svg?height=80&width=80",
      bankDetails: {
        bankName: "Primezart Bank International",
        accountName: "Primezart Global Client Trust",
        accountNumber: "CH93 0076 2011 6238 5295 7",
        swift: "PRMZCHZZ",
        iban: "CH93 0076 2011 6238 5295 7",
        reference: "DEPOSIT-[YOUR ACCOUNT NUMBER]",
      },
    },
    {
      id: "ao3",
      name: "Raj Patel",
      position: "Asia-Pacific Account Manager",
      email: "raj.patel@primezart.com",
      phone: "+1 (800) 555-1234 ext. 103",
      region: "Asia & Pacific",
      avatar: "/placeholder.svg?height=80&width=80",
      bankDetails: {
        bankName: "Primezart Bank Asia",
        accountName: "Primezart APAC Client Trust",
        accountNumber: "HK29 PRMZ 4567 8901 2345",
        swift: "PRMZHKHH",
        iban: "HK29 PRMZ 4567 8901 2345",
        reference: "DEPOSIT-[YOUR ACCOUNT NUMBER]",
      },
    },
    {
      id: "ao4",
      name: "Aisha Mohammed",
      position: "Middle East & Africa Specialist",
      email: "aisha.mohammed@primezart.com",
      phone: "+1 (800) 555-1234 ext. 104",
      region: "Middle East & Africa",
      avatar: "/placeholder.svg?height=80&width=80",
      bankDetails: {
        bankName: "Primezart Bank MENA",
        accountName: "Primezart MEA Client Trust",
        accountNumber: "AE07 0331 2345 6789 0123 456",
        swift: "PRMZAEAD",
        iban: "AE07 0331 2345 6789 0123 456",
        reference: "DEPOSIT-[YOUR ACCOUNT NUMBER]",
      },
    },
  ]

  const [selectedOfficer, setSelectedOfficer] = useState(accountOfficers[0])

  useEffect(() => {
    setIsClient(true)

    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      }

      // Get accounts from localStorage
      const accountsData = localStorage.getItem("accounts")
      if (accountsData) {
        try {
          const parsedAccounts = JSON.parse(accountsData)
          setAccounts(parsedAccounts.filter((acc) => acc.accountType === storedMode))
          if (parsedAccounts.length > 0) {
            setSelectedAccount(parsedAccounts[0].id)
          }
        } catch (e) {
          console.error("Error parsing accounts data", e)
        }
      }
    }
  }, [])

  const handleCopyDetails = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleDownloadDetails = () => {
    // In a real app, this would download a PDF with account details
    alert("Account details downloaded!")
  }

  const handleShareDetails = () => {
    setShareDialogOpen(true)
  }

  const handleSendEmail = () => {
    // Validate email
    if (!recipientEmail || !recipientEmail.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    // In a real app, this would send an email with account details
    setEmailSent(true)
    setTimeout(() => {
      setShareDialogOpen(false)
      setEmailSent(false)
      setRecipientEmail("")
    }, 2000)
  }

  const handleOfficerSelect = (officerId) => {
    const officer = accountOfficers.find((o) => o.id === officerId)
    if (officer) {
      setSelectedOfficer(officer)
    }
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receive Money</h1>
        <p className="text-muted-foreground">Contact your account officer to receive funds from others.</p>
      </div>

      <Tabs defaultValue="domestic" value={receiveMethod} onValueChange={setReceiveMethod} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="domestic" className="flex items-center">
            <ArrowDownLeft className="mr-2 h-4 w-4" /> Domestic Transfer
          </TabsTrigger>
          <TabsTrigger value="international" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" /> International Wire
          </TabsTrigger>
        </TabsList>

        {/* Domestic Transfer Tab */}
        <TabsContent value="domestic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domestic Transfer Details</CardTitle>
              <CardDescription>
                Contact your account officer to receive money from within the United States.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receive-account">Receive to</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - {account.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Your Account Officer</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountOfficers.map((officer) => (
                    <div
                      key={officer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedOfficer.id === officer.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                      onClick={() => handleOfficerSelect(officer.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={officer.avatar} alt={officer.name} />
                          <AvatarFallback>{officer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{officer.name}</p>
                          <p className="text-sm text-muted-foreground">{officer.region}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Account Officer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedOfficer.avatar} alt={selectedOfficer.name} />
                      <AvatarFallback>{selectedOfficer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-medium text-lg">{selectedOfficer.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedOfficer.position}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedOfficer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedOfficer.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Please contact your account officer to receive domestic transfers. They will provide you with the
                  necessary instructions.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Account Number:</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {(selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.number) ||
                        "Select an account"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {(selectedAccount &&
                        accounts
                          .find((acc) => acc.id === selectedAccount)
                          ?.type.charAt(0)
                          .toUpperCase() + accounts.find((acc) => acc.id === selectedAccount)?.type.slice(1)) ||
                        "Select an account"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() =>
                  (window.location.href = `mailto:${selectedOfficer.email}?subject=Receiving%20Funds%20Request&body=Hello%20${selectedOfficer.name},%0A%0AI%20would%20like%20to%20receive%20funds%20to%20my%20account.%0A%0AAccount%20Number:%20${(selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.number) || ""}%0A%0APlease%20provide%20the%20necessary%20instructions.%0A%0AThank%20you.`)
                }
              >
                <Mail className="mr-2 h-4 w-4" /> Contact Officer
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => window.open(`tel:${selectedOfficer.phone.replace(/\s/g, "")}`)}
              >
                <Phone className="mr-2 h-4 w-4" /> Call Officer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* International Wire Tab */}
        <TabsContent value="international" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>International Wire Details</CardTitle>
              <CardDescription>
                Contact your account officer to receive money from outside the United States.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receive-account-intl">Receive to</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - {account.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Your International Account Officer</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountOfficers
                    .filter((o) => o.id !== "ao1")
                    .map((officer) => (
                      <div
                        key={officer.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedOfficer.id === officer.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                        onClick={() => handleOfficerSelect(officer.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={officer.avatar} alt={officer.name} />
                            <AvatarFallback>{officer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{officer.name}</p>
                            <p className="text-sm text-muted-foreground">{officer.region}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your International Account Officer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedOfficer.avatar} alt={selectedOfficer.name} />
                      <AvatarFallback>{selectedOfficer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-medium text-lg">{selectedOfficer.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedOfficer.position}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedOfficer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedOfficer.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  International wire transfers may take 3-5 business days to process and may incur fees from
                  intermediary banks. Contact your account officer for specific instructions.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Account Number:</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {(selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.number) ||
                        "Select an account"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {(selectedAccount &&
                        accounts
                          .find((acc) => acc.id === selectedAccount)
                          ?.type.charAt(0)
                          .toUpperCase() + accounts.find((acc) => acc.id === selectedAccount)?.type.slice(1)) ||
                        "Select an account"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Currency:</span>
                  <div className="flex items-center">
                    <span className="font-medium">USD</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() =>
                  (window.location.href = `mailto:${selectedOfficer.email}?subject=International%20Wire%20Transfer%20Request&body=Hello%20${selectedOfficer.name},%0A%0AI%20would%20like%20to%20receive%20an%20international%20wire%20transfer%20to%20my%20account.%0A%0AAccount%20Number:%20${(selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.number) || ""}%0A%0APlease%20provide%20the%20necessary%20instructions.%0A%0AThank%20you.`)
                }
              >
                <Mail className="mr-2 h-4 w-4" /> Contact Officer
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => window.open(`tel:${selectedOfficer.phone.replace(/\s/g, "")}`)}
              >
                <Phone className="mr-2 h-4 w-4" /> Call Officer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Account Details</DialogTitle>
            <DialogDescription>Send your account details to someone via email.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {emailSent ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">Email sent successfully!</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="recipient-email"
                      placeholder="name@example.com"
                      className="pl-10"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-600">
                    The recipient will receive an email with your{" "}
                    {receiveMethod === "domestic" ? "domestic transfer" : "international wire"} details.
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {!emailSent && (
              <>
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmail}>Send Email</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
