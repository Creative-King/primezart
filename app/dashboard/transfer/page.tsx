"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, ArrowRight, Check, ArrowLeft, CreditCard, Building, Globe, BanknoteIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TransferPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [transferType, setTransferType] = useState("local")
  const [progress, setProgress] = useState(25)
  const [accounts, setAccounts] = useState([])
  const [amount, setAmount] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedAccountFrom, setSelectedAccountFrom] = useState("")
  const [recentRecipients, setRecentRecipients] = useState([])
  const [processing, setProcessing] = useState(false)
  const [successful, setSuccessful] = useState(false)
  const [transferReference, setTransferReference] = useState("")
  const [transferFee, setTransferFee] = useState(0)

  // Initialize state for transfer date
  const [scheduledDate, setScheduledDate] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Add PIN validation to the form
  // Add this state for PIN:
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")

  // Mock recent recipients data
  const mockRecentRecipients = [
    {
      id: 1,
      name: "John Smith",
      accountNumber: "****1234",
      bank: "Chase Bank",
      avatar: "JS",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      accountNumber: "****5678",
      bank: "Bank of America",
      avatar: "SJ",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      accountNumber: "****9012",
      bank: "Wells Fargo",
      avatar: "MR",
    },
    {
      id: 4,
      name: "Emily Chen",
      accountNumber: "****3456",
      bank: "Citibank",
      avatar: "EC",
    },
  ]

  useEffect(() => {
    setIsClient(true)
    setRecentRecipients(mockRecentRecipients)

    // Get account information from localStorage
    if (typeof window !== "undefined") {
      try {
        const accountsData = localStorage.getItem("accounts")
        if (accountsData) {
          const parsedAccounts = JSON.parse(accountsData)
          // Get account mode (personal or business)
          const accountMode = localStorage.getItem("accountMode") || "personal"
          // Filter accounts based on the account mode
          const filteredAccounts = parsedAccounts.filter((acc) => acc.accountType === accountMode)
          setAccounts(filteredAccounts)
          if (filteredAccounts.length > 0) {
            setSelectedAccountFrom(filteredAccounts[0].id)
          }
        }
      } catch (e) {
        console.error("Error loading accounts", e)
      }
    }
  }, [])

  // Handle step changes
  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    if (currentStep === 3 && !validateStep3()) return

    // Validate PIN before final confirmation
    if (currentStep === 3) {
      const storedPIN = localStorage.getItem("userPIN") || "1234" // Default for demo
      if (pin !== storedPIN) {
        setPinError("Invalid PIN. Please try again.")
        return
      }
    }

    const newStep = currentStep + 1
    setCurrentStep(newStep)

    // Update progress bar
    if (newStep === 2) setProgress(50)
    if (newStep === 3) setProgress(75)
    if (newStep === 4) setProgress(100)

    // For the confirmation step, simulate processing
    if (newStep === 4) {
      setProcessing(true)
      // Generate a reference number
      setTransferReference(`TRF${Math.floor(100000 + Math.random() * 900000)}`)

      // Simulate processing delay
      setTimeout(() => {
        setProcessing(false)
        setSuccessful(true)

        // Update account balance if transfer is successful
        if (selectedAccountFrom && amount) {
          const updatedAccounts = accounts.map((acc) => {
            if (acc.id === selectedAccountFrom) {
              return {
                ...acc,
                balance: acc.balance - Number.parseFloat(amount) - transferFee,
              }
            }
            return acc
          })
          setAccounts(updatedAccounts)

          // Save updated accounts to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("accounts", JSON.stringify(updatedAccounts))
          }
        }
      }, 3000)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)

      // Update progress bar
      if (newStep === 1) setProgress(25)
      if (newStep === 2) setProgress(50)
      if (newStep === 3) setProgress(75)
    }
  }

  // Validate steps
  const validateStep1 = () => {
    if (!selectedAccountFrom) {
      alert("Please select an account to transfer from")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return false
    }

    // Check if the selected account has sufficient funds
    const selectedAccount = accounts.find((acc) => acc.id === selectedAccountFrom)
    if (selectedAccount && Number.parseFloat(amount) + transferFee > selectedAccount.balance) {
      alert("Insufficient funds in the selected account")
      return false
    }

    return true
  }

  const validateStep3 = () => {
    if (!recipientName) {
      alert("Please enter the recipient's name")
      return false
    }
    if (!accountNumber) {
      alert("Please enter the recipient's account number")
      return false
    }
    if (transferType === "international" && !routingNumber) {
      alert("Please enter the routing/SWIFT code")
      return false
    }
    if (!bankName) {
      alert("Please enter the bank name")
      return false
    }
    if (isScheduled && !scheduledDate) {
      alert("Please select a date for your scheduled transfer")
      return false
    }
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions to proceed")
      return false
    }

    return true
  }

  // Handle transfer type change
  const handleTransferTypeChange = (type) => {
    setTransferType(type)

    // Check if international transfer is selected and user is not on business account
    if (type === "international") {
      const accountMode = localStorage.getItem("accountMode") || "personal"
      if (accountMode !== "business") {
        alert("International transfers are only available for business accounts. Please switch to a business account.")
        setTransferType("local")
        return
      }
    }

    // Set transfer fee to 0 (removing fees)
    setTransferFee(0)
  }

  // Handle recipient selection
  const handleSelectRecipient = (recipient) => {
    setRecipientName(recipient.name)
    setAccountNumber(recipient.accountNumber)
    setBankName(recipient.bank)
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  // Get selected account details
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountFrom)

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 mr-2 flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          <span className="ml-1">Back</span>
        </button>
      </div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex justify-between text-sm">
          <span className={currentStep >= 1 ? "font-medium text-blue-700" : "text-gray-500"}>Select Account</span>
          <span className={currentStep >= 2 ? "font-medium text-blue-700" : "text-gray-500"}>Amount</span>
          <span className={currentStep >= 3 ? "font-medium text-blue-700" : "text-gray-500"}>Recipient</span>
          <span className={currentStep >= 4 ? "font-medium text-blue-700" : "text-gray-500"}>Confirmation</span>
        </div>
      </div>

      {/* Step 1: Select Account */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Transfer Money
            </CardTitle>
            <CardDescription>Select the account you want to transfer from and the transfer type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Source Account Selection */}
            <div className="space-y-4">
              <Label>From Account</Label>
              {accounts.length > 0 ? (
                <RadioGroup value={selectedAccountFrom} onValueChange={setSelectedAccountFrom}>
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={account.id} id={account.id} />
                      <Label
                        htmlFor={account.id}
                        className="flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-gray-500">{account.number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(account.balance)}</p>
                          <Badge variant="outline">{account.type}</Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                  <p className="text-gray-500">No accounts available for transfer</p>
                </div>
              )}
            </div>

            {/* Transfer Type Selection */}
            <div className="space-y-4">
              <Label>Transfer Type</Label>
              <Tabs defaultValue="local" onValueChange={handleTransferTypeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="local" className="flex flex-col py-2">
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span>Same Bank</span>
                  </TabsTrigger>
                  <TabsTrigger value="interbank" className="flex flex-col py-2">
                    <Building className="h-5 w-5 mb-1" />
                    <span>Other Banks</span>
                  </TabsTrigger>
                  <TabsTrigger value="international" className="flex flex-col py-2">
                    <Globe className="h-5 w-5 mb-1" />
                    <span>International</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="local" className="pt-4">
                  <p className="text-sm text-gray-600">
                    Transfer to another account within our bank. No fees apply and transfers are typically instant.
                  </p>
                </TabsContent>
                <TabsContent value="interbank" className="pt-4">
                  <p className="text-sm text-gray-600">
                    Transfer to an account at another bank. A small fee of $2.50 applies and transfers may take 1-2
                    business days.
                  </p>
                </TabsContent>
                <TabsContent value="international" className="pt-4">
                  <p className="text-sm text-gray-600">
                    Send money internationally. Fees apply ($25.00) and transfers may take 3-5 business days depending
                    on the destination.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleNextStep} disabled={accounts.length === 0}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Amount */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Amount</CardTitle>
            <CardDescription>Enter the amount you want to transfer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BanknoteIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-gray-500">
                Available balance: {selectedAccount ? formatCurrency(selectedAccount.balance) : "N/A"}
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this transfer for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNextStep}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Recipient */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Recipient Details</CardTitle>
            <CardDescription>Enter the recipient's banking information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recent Recipients */}
            {recentRecipients.length > 0 && (
              <div className="space-y-4">
                <Label>Recent Recipients</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {recentRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className={`flex flex-col items-center text-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition ${
                        recipientName === recipient.name ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectRecipient(recipient)}
                    >
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarFallback>{recipient.avatar}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">{recipient.name}</p>
                      <p className="text-xs text-gray-500">{recipient.bank}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient Information Form */}
            <div className="space-y-4">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="Full name as it appears on the account"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {transferType === "international" && (
              <div className="space-y-4">
                <Label htmlFor="routingNumber">Routing/SWIFT Code</Label>
                <Input
                  id="routingNumber"
                  placeholder="Enter routing or SWIFT code"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  For international transfers, please ensure you enter the correct SWIFT/BIC code.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            {/* Scheduled Transfer Option */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="scheduleTransfer"
                  checked={isScheduled}
                  onChange={() => setIsScheduled(!isScheduled)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="scheduleTransfer" className="cursor-pointer">
                  Schedule this transfer for a future date
                </Label>
              </div>

              {isScheduled && (
                <div className="ml-6 mt-2">
                  <Label htmlFor="scheduleDate">Transfer Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="inline-block h-3 w-3 mr-1" />
                    Scheduled transfers will be processed at the beginning of the selected day.
                  </p>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="termsAndConditions"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="termsAndConditions" className="cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    terms and conditions
                  </a>{" "}
                  governing this transfer
                </Label>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                By proceeding, you confirm that the recipient details are correct and you authorize this transfer.
              </p>
            </div>

            {/* Add this PIN input field before the continue button: */}
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
              <p className="text-xs text-gray-500">Enter your secure PIN to authorize this transfer</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <Button onClick={handleNextStep}>
              Review Transfer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              {processing ? (
                <span>Processing Transfer...</span>
              ) : successful ? (
                <>
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  Transfer Successful
                </>
              ) : (
                <>Confirm Transfer</>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {processing ? (
                <span>Please wait while we process your transfer</span>
              ) : successful ? (
                <span>Your transfer has been completed successfully</span>
              ) : (
                <span>Review and confirm your transfer details</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {processing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Please do not close this window</p>
              </div>
            ) : successful ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                  <p className="text-green-800 font-medium">Reference Number: {transferReference}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {isScheduled
                      ? `Your transfer has been scheduled for ${scheduledDate}`
                      : "Your transfer has been processed successfully"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">From Account</span>
                    <span className="font-medium">
                      {selectedAccount?.name} ({selectedAccount?.number})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">To</span>
                    <span className="font-medium">
                      {recipientName} - {bankName}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium">{formatCurrency(Number.parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold">{formatCurrency(Number.parseFloat(amount))}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-gray-500">Description</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">
                      {isScheduled
                        ? scheduledDate
                        : new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Transfer Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer amount</span>
                      <span className="font-medium">{formatCurrency(Number.parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">{formatCurrency(Number.parseFloat(amount))}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">From Account</span>
                    <span className="font-medium">
                      {selectedAccount?.name} ({selectedAccount?.number})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">To</span>
                    <span className="font-medium">
                      {recipientName} - {bankName}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">Account Number</span>
                    <span className="font-medium">{accountNumber}</span>
                  </div>
                  {routingNumber && (
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-gray-500">Routing/SWIFT</span>
                      <span className="font-medium">{routingNumber}</span>
                    </div>
                  )}
                  {description && (
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-gray-500">Description</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  )}
                  {isScheduled && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scheduled Date</span>
                      <span className="font-medium">{scheduledDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className={`${successful ? "justify-center" : "justify-between"}`}>
            {successful ? (
              <div className="flex flex-col space-y-3 w-full">
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  Return to Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCurrentStep(1)
                    setProgress(25)
                    setAmount("")
                    setRecipientName("")
                    setAccountNumber("")
                    setBankName("")
                    setRoutingNumber("")
                    setDescription("")
                    setIsScheduled(false)
                    setScheduledDate("")
                    setAcceptedTerms(false)
                    setSuccessful(false)
                    setPin("")
                    setPinError("")
                  }}
                >
                  Make Another Transfer
                </Button>
              </div>
            ) : processing ? null : (
              <>
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
                <Button onClick={handleNextStep}>
                  Confirm Transfer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

