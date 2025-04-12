"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  PiggyBank,
  ChevronLeft,
  CreditCard,
  Building,
  Landmark,
  Check,
  Info,
  AlertTriangle,
  Building2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import FloatingMenu from "@/components/floating-menu"

// Mock savings accounts data
const savingsAccounts = [
  {
    id: "sav1",
    name: "High-Yield Savings",
    balance: 15250.75,
    interestRate: 3.5,
    accountNumber: "****5678",
  },
  {
    id: "sav2",
    name: "Emergency Fund",
    balance: 8750.25,
    interestRate: 3.2,
    accountNumber: "****9012",
  },
  {
    id: "sav3",
    name: "Vacation Savings",
    balance: 3450.5,
    interestRate: 3.0,
    accountNumber: "****3456",
  },
]

// Mock funding sources
const fundingSources = [
  {
    id: "src1",
    type: "card",
    name: "Visa Debit",
    lastFour: "4567",
    icon: <CreditCard className="h-5 w-5" />,
    balance: null,
  },
  {
    id: "src2",
    type: "checking",
    name: "Personal Checking",
    lastFour: "7890",
    icon: <Building className="h-5 w-5" />,
    balance: 4250.65,
  },
  {
    id: "src3",
    type: "external",
    name: "External Bank",
    lastFour: "1234",
    icon: <Landmark className="h-5 w-5" />,
    balance: null,
  },
]

export default function AddFundsToSavings() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [lastLogin, setLastLogin] = useState("Today, 09:15 AM")
  const [step, setStep] = useState(1)
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedSource, setSelectedSource] = useState("")
  const [amount, setAmount] = useState("")
  const [frequency, setFrequency] = useState("one-time")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [confirmationNumber, setConfirmationNumber] = useState("")

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Store account mode in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accountMode", "savings")
    }

    // Set default values
    if (savingsAccounts.length > 0) {
      setSelectedAccount(savingsAccounts[0].id)
    }
    if (fundingSources.length > 0) {
      setSelectedSource(fundingSources[0].id)
    }

    // Set default start date to today
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    setStartDate(formattedDate)

    // Set default end date to 1 year from now
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    setEndDate(nextYear.toISOString().split('T')[0])
  }, [router])

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedAccount) {
      newErrors.account = "Please select a savings account"({})

    if (!selectedAccount) {
      newErrors.account = "Please select a savings account"
    }

    if (!selectedSource) {
      newErrors.source = "Please select a funding source"
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else if (Number(amount) < 10) {
      newErrors.amount = "Minimum deposit amount is $10"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (frequency !== "one-time") {
      if (!startDate) {
        newErrors.startDate = "Please select a start date"
      }
      
      if (!endDate) {
        newErrors.endDate = "Please select an end date"
      } else if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    setIsProcessing(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      // Generate a random confirmation number
      const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
      setConfirmationNumber(`DEP${randomNum}`)
    }, 1500)
  }

  const handleFinish = () => {
    router.push("/dashboard/savings")
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  const getSelectedAccount = () => {
    return savingsAccounts.find(acc => acc.id === selectedAccount)
  }

  const getSelectedSource = () => {
    return fundingSources.find(src => src.id === selectedSource)
  }

  const getFrequencyLabel = () => {
    switch (frequency) {
      case "one-time": return "One-time deposit"
      case "weekly": return "Weekly"
      case "bi-weekly": return "Bi-weekly"
      case "monthly": return "Monthly"
      default: return frequency
    }
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Personal</span>
            </Link>
            <Link
              href="/dashboard/business"
              className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
            >
              <Building2 className="h-5 w-5 mr-2" />
              <span>Business</span>
            </Link>
            <Link
              href="/dashboard/joint"
              className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Joint</span>
            </Link>
            <Link href="/dashboard/savings" className="flex items-center text-emerald-600 font-medium">
              <PiggyBank className="h-5 w-5 mr-2" />
              <span>Savings</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">Last login: {lastLogin}</div>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button
              onClick={handleLogout}
              className="text-gray-500 font-medium flex items-center hover:text-blue-600 transition-colors"
            >
              Sign Out <span className="ml-1">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 p-0 h-8 w-8"
            onClick={() => router.push("/dashboard/savings")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Add Funds to Savings</h1>
        </div>

        {!isComplete ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <PiggyBank className="h-4 w-4 text-emerald-600" />
                </div>
                <CardTitle>Add Funds to Your Savings</CardTitle>
              </div>
              <CardDescription>
                Deposit money into your savings account to reach your financial goals faster.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step Indicator */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Account & Amount</span>
                </div>
                <div className="w-12 h-px bg-gray-300 mx-2"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Schedule</span>
                </div>
                <div className="w-12 h-px bg-gray-300 mx-2"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Review</span>
                </div>
              </div>

              {/* Step 1: Account & Amount */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="savings-account">Select Savings Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger id="savings-account" className={errors.account ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a savings account" />
                      </SelectTrigger>
                      <SelectContent>
                        {savingsAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{account.name}</span>
                              <span className="text-gray-500 text-sm">{formatCurrency(account.balance)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.account && <p className="text-xs text-red-500">{errors.account}</p>}
                    
                    {selectedAccount && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{getSelectedAccount()?.name}</p>
                            <p className="text-xs text-gray-500">Account: {getSelectedAccount()?.accountNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(getSelectedAccount()?.balance || 0)}</p>
                            <p className="text-xs text-emerald-600">{getSelectedAccount()?.interestRate}% APY</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="funding-source">Select Funding Source</Label>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger id="funding-source" className={errors.source ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a funding source" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            <div className="flex items-center">
                              {source.icon}
                              <span className="ml-2">{source.name} (****{source.lastFour})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
                    
                    {selectedSource && getSelectedSource()?.balance !== null && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getSelectedSource()?.icon}
                            <div className="ml-2">
                              <p className="font-medium">{getSelectedSource()?.name}</p>
                              <p className="text-xs text-gray-500">****{getSelectedSource()?.lastFour}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(getSelectedSource()?.balance || 0)}</p>
                            <p className="text-xs text-gray-500">Available Balance</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => {
                          // Only allow numbers and decimal point
                          const value = e.target.value.replace(/[^0-9.]/g, '')
                          // Ensure only one decimal point
                          const parts = value.split('.')
                          if (parts.length > 2) {
                            return
                          }
                          // Limit to 2 decimal places
                          if (parts[1] && parts[1].length > 2) {
                            return
                          }
                          setAmount(value)
                          if (errors.amount) {
                            setErrors({ ...errors, amount: "" })
                          }
                        }}
                        className={`pl-7 ${errors.amount ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Savings Tip</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Regular deposits, even small ones, can significantly grow your savings over time thanks to compound interest.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Deposit Frequency</h3>
                    <RadioGroup value={frequency} onValueChange={setFrequency}>
                      <div className="flex items-start space-x-2 p-3 rounded-md border border-gray-200 bg-gray-50">
                        <RadioGroupItem value="one-time" id="one-time" className="mt-1" />
                        <div>
                          <Label htmlFor="one-time" className="font-medium">One-time Deposit</Label>
                          <p className="text-sm text-gray-500">
                            Make a single deposit to your savings account.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-3 rounded-md border border-gray-200 bg-gray-50">
                        <RadioGroupItem value="weekly" id="weekly" className="mt-1" />
                        <div>
                          <Label htmlFor="weekly" className="font-medium">Weekly</Label>
                          <p className="text-sm text-gray-500">
                            Deposit the same amount every week.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-3 rounded-md border border-gray-200 bg-gray-50">
                        <RadioGroupItem value="bi-weekly" id="bi-weekly" className="mt-1" />
                        <div>
                          <Label htmlFor="bi-weekly" className="font-medium">Bi-weekly</Label>
                          <p className="text-sm text-gray-500">
                            Deposit the same amount every two weeks.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-3 rounded-md border border-gray-200 bg-gray-50">
                        <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
                        <div>
                          <Label htmlFor="monthly" className="font-medium">Monthly</Label>
                          <p className="text-sm text-gray-500">
                            Deposit the same amount every month.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {frequency !== "one-time" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={errors.startDate ? "border-red-500" : ""}
                          />
                          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date (Optional)</Label>
                          <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={errors.endDate ? "border-red-500" : ""}
                          />
                          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
                        </div>
                      </div>
                      
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800">Automatic Transfers</AlertTitle>
                        <AlertDescription className="text-amber-700">
                          Make sure to maintain sufficient funds in your source account to avoid failed transfers.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="Add a note for this deposit"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Add a personal note to help you track this deposit.</p>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="rounded-md border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-medium">Deposit Details</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <div className="flex items-center mt-1">
                            {getSelectedSource()?.icon}
                            <p className="font-medium ml-2">
                              {getSelectedSource()?.name} (****{getSelectedSource()?.lastFour})
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-medium mt-1">{getSelectedAccount()?.name}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium text-lg mt-1">{formatCurrency(Number(amount) || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Frequency</p>
                          <p className="font-medium mt-1">{getFrequencyLabel()}</p>
                        </div>
                      </div>
                      
                      {frequency !== "one-time" && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="font-medium mt-1">{new Date(startDate).toLocaleDateString()}</p>
                            </div>
                            {endDate && (
                              <div>
                                <p className="text-sm text-gray-500">End Date</p>
                                <p className="font-medium mt-1">{new Date(endDate).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      
                      {note && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm text-gray-500">Note</p>
                            <p className="font-medium mt-1">{note}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Alert className="bg-emerald-50 border-emerald-200">
                    <Info className="h-4 w-4 text-emerald-600" />
                    <AlertTitle className="text-emerald-800">Deposit Information</AlertTitle>
                    <AlertDescription className="text-emerald-700">
                      {frequency === "one-time" 
                        ? "Your deposit will be processed immediately. Funds will be available according to our standard processing times."
                        : "Your recurring deposit will be set up according to the schedule above. You can modify or cancel this at any time."}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 pt-4">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={() => router.push("/dashboard/savings")}>
                  Cancel
                </Button>
              )}
              
              {step < 3 ? (
                <Button onClick={handleNextStep} className="bg-emerald-600 hover:bg-emerald-700">
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isProcessing ? "Processing..." : "Confirm Deposit"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Deposit Successful</CardTitle>
              <CardDescription>
                {frequency === "one-time" 
                  ? `Your deposit of ${formatCurrency(Number(amount))} has been initiated.`
                  : `Your recurring deposit of ${formatCurrency(Number(amount))} has been scheduled.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Confirmation Details</h3>
                  <Badge className="bg-emerald-100 text-emerald-800">Success</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Confirmation Number:</span>
                    <span className="font-medium">{confirmationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">{formatCurrency(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">To Account:</span>
                    <span className="font-medium">{getSelectedAccount()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">From:</span>
                    <span className="font-medium">{getSelectedSource()?.name} (****{getSelectedSource()?.lastFour})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="font-medium">{getFrequencyLabel()}</span>
                  </div>
                  {frequency !== "one-time" && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Schedule:</span>
                      <span className="font-medium">
                        {new Date(startDate).toLocaleDateString()}
                        {endDate && ` to ${new Date(endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time:</span>
                    <span className="font-medium">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-md bg-blue-50 border border-blue-200">
                <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  {frequency === "one-time" 
                    ? "Your deposit is being processed. Funds will typically be available within 1-2 business days."
                    : "Your first recurring deposit will be processed on the start date you selected."}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-200 pt-4">
              <Button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-700">
                Return to Savings Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Floating Menu */}
      <FloatingMenu />
    </div>
  )
}
