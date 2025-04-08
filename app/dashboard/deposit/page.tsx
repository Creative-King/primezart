"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building, Bitcoin, Check, DollarSign, AlertCircle, Mail, Phone, Copy } from "lucide-react"
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

export default function DepositPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [depositMethod, setDepositMethod] = useState("bank")
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [depositReference, setDepositReference] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [processingDeposit, setProcessingDeposit] = useState(false)

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

  // Mock crypto deposit addresses
  const cryptoAddresses = {
    BTC: {
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      qrCode: "/placeholder.svg?height=150&width=150",
      memo: "Not required",
    },
    ETH: {
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      qrCode: "/placeholder.svg?height=150&width=150",
      memo: "Not required",
    },
    USDT: {
      address: "TJRyWwGs2PiLLn4mKX8uu7nkd3ygL9tTJN",
      qrCode: "/placeholder.svg?height=150&width=150",
      memo: "Not required",
    },
    XRP: {
      address: "rLHzPsX6oXkzU2qL12kHCH8G8cnZv1rBJh",
      qrCode: "/placeholder.svg?height=150&width=150",
      memo: "123456789",
    },
  }

  const [selectedOfficer, setSelectedOfficer] = useState(accountOfficers[0])
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")

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

  const handleDeposit = () => {
    // Validate input
    if (
      !selectedAccount ||
      !depositAmount ||
      isNaN(Number.parseFloat(depositAmount)) ||
      Number.parseFloat(depositAmount) <= 0
    ) {
      alert("Please enter a valid deposit amount and select an account")
      return
    }

    // Validate PIN
    const storedPIN = localStorage.getItem("userPIN") || "1234" // Default for demo
    if (pin !== storedPIN) {
      setPinError("Invalid PIN. Please try again.")
      return
    }

    // Show processing state
    setProcessingDeposit(true)

    // Generate reference number
    const reference = `DEP${Math.floor(100000000 + Math.random() * 900000000)}`
    setDepositReference(reference)

    // Simulate processing delay
    setTimeout(() => {
      setProcessingDeposit(false)
      // Show success dialog
      setSuccessDialogOpen(true)
    }, 1500)

    // In a real app, this would make an API call to process the deposit
  }

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false)

    // Reset form
    setDepositAmount("")

    // Redirect to accounts page
    router.push("/dashboard/accounts")
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
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
        <h1 className="text-2xl font-bold tracking-tight">Deposit Funds</h1>
        <p className="text-muted-foreground">Select your account and deposit method to proceed.</p>
      </div>

      <Tabs defaultValue="bank" value={depositMethod} onValueChange={setDepositMethod} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-2 w-full">
          <TabsTrigger value="bank" className="flex items-center">
            <Building className="mr-2 h-4 w-4" /> Bank Transfer
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center">
            <Bitcoin className="mr-2 h-4 w-4" /> Crypto Deposit
          </TabsTrigger>
        </TabsList>

        {/* Bank Transfer Tab */}
        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Transfer</CardTitle>
              <CardDescription>Deposit funds via bank transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-account">Deposit to</Label>
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
                  Please use the following bank details to make your deposit. Include your account number in the
                  reference field.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{selectedOfficer.bankDetails.bankName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() => handleCopyToClipboard(selectedOfficer.bankDetails.bankName)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Name:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{selectedOfficer.bankDetails.accountName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() => handleCopyToClipboard(selectedOfficer.bankDetails.accountName)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{selectedOfficer.bankDetails.accountNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() => handleCopyToClipboard(selectedOfficer.bankDetails.accountNumber)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {selectedOfficer.bankDetails.routingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Routing Number:</span>
                    <div className="flex items-center">
                      <span className="font-medium">{selectedOfficer.bankDetails.routingNumber}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => handleCopyToClipboard(selectedOfficer.bankDetails.routingNumber)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">SWIFT/BIC:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{selectedOfficer.bankDetails.swift}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() => handleCopyToClipboard(selectedOfficer.bankDetails.swift)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {selectedOfficer.bankDetails.iban && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">IBAN:</span>
                    <div className="flex items-center">
                      <span className="font-medium">{selectedOfficer.bankDetails.iban}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => handleCopyToClipboard(selectedOfficer.bankDetails.iban)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {selectedOfficer.bankDetails.reference.replace(
                        "[YOUR ACCOUNT NUMBER]",
                        (selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.number) ||
                          "YOUR ACCOUNT NUMBER",
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() =>
                        handleCopyToClipboard(
                          selectedOfficer.bankDetails.reference.replace(
                            "[YOUR ACCOUNT NUMBER]",
                            (selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.number) ||
                              "YOUR ACCOUNT NUMBER",
                          ),
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Deposit</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    className="pl-10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="pin">Transaction PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value)
                    setPinError("")
                  }}
                  maxLength={6}
                />
                {pinError && <p className="text-sm text-red-500">{pinError}</p>}
                <p className="text-xs text-gray-500">Enter your secure PIN to authorize this deposit</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full" onClick={handleDeposit} disabled={processingDeposit}>
                {processingDeposit ? "Processing..." : "Confirm Deposit"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Crypto Deposit Tab */}
        <TabsContent value="crypto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrency Deposit</CardTitle>
              <CardDescription>Deposit cryptocurrency to your account using admin-provided addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-account-crypto">Deposit to</Label>
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
                <Label htmlFor="crypto-type">Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="XRP">Ripple (XRP)</SelectItem>
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

              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Only send {selectedCrypto} to this address. Sending any other cryptocurrency may result in permanent
                  loss.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-center mb-2">
                    <h3 className="font-medium">{selectedCrypto} Deposit Address</h3>
                    <p className="text-sm text-muted-foreground">Provided by Primezart Admin</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <img
                      src={cryptoAddresses[selectedCrypto].qrCode || "/placeholder.svg"}
                      alt={`${selectedCrypto} QR Code`}
                      className="h-32 w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Input value={cryptoAddresses[selectedCrypto].address} readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(cryptoAddresses[selectedCrypto].address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {cryptoAddresses[selectedCrypto].memo !== "Not required" && (
                    <div className="w-full">
                      <Label className="text-sm">Memo/Tag (Required)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={cryptoAddresses[selectedCrypto].memo} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(cryptoAddresses[selectedCrypto].memo)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {copySuccess && (
                    <div className="text-green-600 flex items-center gap-1 text-sm">
                      <Check className="h-4 w-4" /> Copied to clipboard
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crypto-amount">Estimated Deposit Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="crypto-amount"
                    placeholder="Enter amount"
                    className="pl-10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="pin">Transaction PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value)
                    setPinError("")
                  }}
                  maxLength={6}
                />
                {pinError && <p className="text-sm text-red-500">{pinError}</p>}
                <p className="text-xs text-gray-500">Enter your secure PIN to authorize this deposit</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full" onClick={handleDeposit} disabled={processingDeposit}>
                {processingDeposit ? "Processing..." : "Confirm Deposit"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Initiated</DialogTitle>
            <DialogDescription>Your deposit request has been successfully initiated.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Reference Number:</span>
                <span className="font-medium">{depositReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">${depositAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account:</span>
                <span className="font-medium">
                  {(selectedAccount && accounts.find((acc) => acc.id === selectedAccount)?.name) || "Selected Account"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-medium">{depositMethod === "bank" ? "Bank Transfer" : "Cryptocurrency"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-amber-600">Pending</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong>{" "}
                {depositMethod === "bank"
                  ? "Bank transfers typically take 1-3 business days to process."
                  : "Cryptocurrency deposits require network confirmations and may take 30-60 minutes to appear in your account."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSuccessClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

