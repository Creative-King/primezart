"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Clock,
  Globe,
  AlertTriangle,
  Info,
  Shield,
} from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock account data
const accounts = [
  { id: "acc1", name: "Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "acc2", name: "Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
  { id: "acc3", name: "Investment Portfolio", number: "****2341", balance: 98765.43, type: "investment" },
]

// Mock user data
const userData = {
  accountType: "business", // Can be "personal", "business", etc.
}

// Form schema for domestic transfer
const domesticTransferSchema = z
  .object({
    fromAccount: z.string().min(1, "Please select an account"),
    toAccount: z.string().min(1, "Please select a destination"),
    transferType: z.enum(["own", "other"]),
    recipientName: z.string().optional(),
    recipientAccount: z.string().optional(),
    recipientBank: z.string().optional(),
    amount: z.string().refine((val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    }, "Please enter a valid amount"),
    memo: z.string().optional(),
    scheduleTransfer: z.boolean().default(false),
    transferDate: z.string().optional(),
    transferFrequency: z.enum(["once", "weekly", "biweekly", "monthly", "quarterly", "annually"]).optional(),
    endDate: z.string().optional(),
    numberOfTransfers: z.string().optional(),
    endOption: z.enum(["never", "afterDate", "afterOccurrences"]).optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN cannot exceed 6 digits"),
  })
  .refine(
    (data) => {
      // If transferring to another account, require recipient details
      if (data.transferType === "other") {
        return !!data.recipientName && !!data.recipientAccount && !!data.recipientBank
      }
      return true
    },
    {
      message: "Recipient details are required for external transfers",
      path: ["recipientName"],
    },
  )
  .refine(
    (data) => {
      // If scheduling a transfer, require date and frequency
      if (data.scheduleTransfer) {
        return !!data.transferDate && !!data.transferFrequency
      }
      return true
    },
    {
      message: "Date and frequency are required for scheduled transfers",
      path: ["transferDate"],
    },
  )

// Form schema for international transfer
const internationalTransferSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAccount: z.string().min(1, "Account number is required"),
  recipientBank: z.string().min(1, "Bank name is required"),
  swiftCode: z.string().min(8, "Valid SWIFT/BIC code is required"),
  country: z.enum(["US", "GB", "FR", "DE", "JP", "CN", "SG", "AU", "CA"], "Please select a valid country"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  recipientCity: z.string().min(1, "City is required"),
  recipientPostalCode: z.string().min(1, "Postal code is required"),
  intermediaryBank: z.string().optional(),
  intermediarySwiftCode: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  amount: z.string().refine((val) => {
    const num = Number.parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Please enter a valid amount"),
  purpose: z.string().min(1, "Purpose of transfer is required"),
  additionalDetails: z.string().optional(),
  complianceDeclaration: z.boolean().refine((val) => val === true, {
    message: "You must confirm this declaration",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN cannot exceed 6 digits"),
})

export default function Transfer() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [account, setAccount] = useState<any>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [transferType, setTransferType] = useState("domestic")
  const [transferStatus, setTransferStatus] = useState<"pending" | "approved" | "rejected">("pending")
  const [showScheduleOptions, setShowScheduleOptions] = useState(false)
  const [endOption, setEndOption] = useState<"never" | "afterDate" | "afterOccurrences">("never")

  // Domestic transfer form
  const domesticForm = useForm<z.infer<typeof domesticTransferSchema>>({
    resolver: zodResolver(domesticTransferSchema),
    defaultValues: {
      fromAccount: accountId,
      toAccount: "",
      transferType: "own",
      recipientName: "",
      recipientAccount: "",
      recipientBank: "",
      amount: "",
      memo: "",
      scheduleTransfer: false,
      transferDate: "",
      transferFrequency: "once",
      endDate: "",
      numberOfTransfers: "",
      endOption: "never",
      termsAccepted: false,
      pin: "",
    },
  })

  // International transfer form
  const internationalForm = useForm<z.infer<typeof internationalTransferSchema>>({
    resolver: zodResolver(internationalTransferSchema),
    defaultValues: {
      fromAccount: accountId,
      recipientName: "",
      recipientAccount: "",
      recipientBank: "",
      swiftCode: "",
      country: "US",
      recipientAddress: "",
      recipientCity: "",
      recipientPostalCode: "",
      intermediaryBank: "",
      intermediarySwiftCode: "",
      currency: "USD",
      amount: "",
      purpose: "",
      additionalDetails: "",
      complianceDeclaration: false,
      termsAccepted: false,
      pin: "",
    },
  })

  // Update the useEffect to properly handle the account data
  useEffect(() => {
    // Find the account
    const foundAccount = accounts.find((a) => a.id === accountId)
    if (foundAccount) {
      setAccount(foundAccount)

      // Set the from account in both forms
      domesticForm.setValue("fromAccount", accountId)
      internationalForm.setValue("fromAccount", accountId)
    } else {
      // Account not found, redirect to dashboard
      router.push("/dashboard")
    }
  }, [accountId, router, domesticForm, internationalForm])

  // Watch for schedule transfer changes
  useEffect(() => {
    const subscription = domesticForm.watch((value, { name }) => {
      if (name === "scheduleTransfer") {
        setShowScheduleOptions(!!value.scheduleTransfer)
      }
    })
    return () => subscription.unsubscribe()
  }, [domesticForm.watch])

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-5 w-5 text-[#003366]" />
      case "savings":
        return <DollarSign className="h-5 w-5 text-[#003366]" />
      case "investment":
        return <BarChart3 className="h-5 w-5 text-[#003366]" />
      default:
        return <CreditCard className="h-5 w-5 text-[#003366]" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Fix the onDomesticSubmit function to properly handle form submission
  const onDomesticSubmit = (values: z.infer<typeof domesticTransferSchema>) => {
    console.log("Domestic transfer values:", values)

    // In a real app, you would validate the PIN against the stored PIN
    const storedPIN = localStorage.getItem("userPIN") || "1234" // Default for demo

    if (values.pin !== storedPIN) {
      alert("Invalid PIN. Please try again.")
      return
    }

    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true)
      setTransferStatus("pending")
    }, 1500)
  }

  // Fix the onInternationalSubmit function to properly handle form submission
  const onInternationalSubmit = (values: z.infer<typeof internationalTransferSchema>) => {
    console.log("International transfer values:", values)

    // In a real app, you would validate the PIN against the stored PIN
    const storedPIN = localStorage.getItem("userPIN") || "1234" // Default for demo

    if (values.pin !== storedPIN) {
      alert("Invalid PIN. Please try again.")
      return
    }

    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true)
      setTransferStatus("pending")
    }, 1500)
  }

  // Function to simulate admin actions (in a real app this would be done by an admin user)
  const handleAdminAction = (action: "approve" | "reject") => {
    setTransferStatus(action === "approve" ? "approved" : "rejected")
  }

  if (!account) {
    return <div className="container mx-auto pt-6">Loading...</div>
  }

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="container mx-auto pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              {transferStatus === "pending" && (
                <>
                  <Clock className="mx-auto h-16 w-16 text-amber-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Transfer Pending Approval</h2>
                  <p className="text-gray-700 mb-4">
                    Your transfer request has been submitted and is waiting for admin approval. You will receive a
                    notification once the transfer is approved or rejected.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                      <li>Our team will review your transfer request within 24 hours</li>
                      <li>You'll receive an email confirmation when the transfer is approved</li>
                      <li>Funds will be debited from your account after approval</li>
                      <li>You can check the status of your transfer in the Transaction History</li>
                    </ol>
                  </div>
                </>
              )}

              {transferStatus === "approved" && (
                <>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Transfer Approved</h2>
                  <p className="text-gray-700 mb-4">
                    {domesticForm.watch("scheduleTransfer")
                      ? "Your scheduled transfer has been set up successfully."
                      : "Your transfer has been approved and is being processed. The funds will be transferred according to your instructions."}
                  </p>

                  {domesticForm.watch("scheduleTransfer") && (
                    <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-4">
                      <h3 className="font-medium text-green-800 mb-2">Scheduled Transfer Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">First Transfer Date:</span>
                          <span className="font-medium">{domesticForm.watch("transferDate")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{domesticForm.watch("transferFrequency")}</span>
                        </div>
                        {domesticForm.watch("endOption") === "afterDate" && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">End Date:</span>
                            <span className="font-medium">{domesticForm.watch("endDate")}</span>
                          </div>
                        )}
                        {domesticForm.watch("endOption") === "afterOccurrences" && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Number of Transfers:</span>
                            <span className="font-medium">{domesticForm.watch("numberOfTransfers")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {transferStatus === "rejected" && (
                <>
                  <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Transfer Rejected</h2>
                  <p className="text-gray-700 mb-6">
                    Your transfer request has been rejected. Please contact customer support for more information.
                  </p>
                </>
              )}

              <div className="bg-blue-50 p-3 rounded-md mb-4 text-left">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Transfers are usually processed within 24 hours. If you need immediate
                  assistance, please contact support.
                </p>
              </div>

              {/* For demo purposes only - in a real app, these buttons would only be visible to admin users */}
              {transferStatus === "pending" && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-500 mb-3">Admin Actions (Demo Only)</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => handleAdminAction("approve")} className="bg-green-600 hover:bg-green-700">
                      Approve Transfer
                    </Button>
                    <Button onClick={() => handleAdminAction("reject")} className="bg-red-600 hover:bg-red-700">
                      Reject Transfer
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center mt-6">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-[#003366] hover:bg-[#002244] text-white"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mr-4 p-2"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#003366]">Transfer Money</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              {getAccountIcon(account.type)}
              <div className="ml-2">
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>Available Balance: {formatCurrency(account.balance)}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={transferType} onValueChange={setTransferType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="domestic">Domestic Transfer</TabsTrigger>
            {userData.accountType === "business" && (
              <TabsTrigger value="international">International Transfer</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="domestic">
            <Card>
              <CardHeader>
                <CardTitle>Domestic Transfer</CardTitle>
                <CardDescription>Transfer money between your accounts or to other domestic accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...domesticForm}>
                  <form onSubmit={domesticForm.handleSubmit(onDomesticSubmit)} className="space-y-6">
                    <FormField
                      control={domesticForm.control}
                      name="fromAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Account</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  <div className="flex items-center">
                                    {getAccountIcon(acc.type)}
                                    <span className="ml-2">
                                      {acc.name} ({acc.number})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={domesticForm.control}
                      name="transferType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Transfer To</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="own" />
                                </FormControl>
                                <FormLabel className="font-normal">My Accounts</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">Someone Else</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {domesticForm.watch("transferType") === "own" ? (
                      <FormField
                        control={domesticForm.control}
                        name="toAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To Account</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select destination account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accounts
                                  .filter((acc) => acc.id !== domesticForm.watch("fromAccount"))
                                  .map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                      <div className="flex items-center">
                                        {getAccountIcon(acc.type)}
                                        <span className="ml-2">
                                          {acc.name} ({acc.number})
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <>
                        <FormField
                          control={domesticForm.control}
                          name="recipientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter recipient's full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={domesticForm.control}
                          name="recipientAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={domesticForm.control}
                          name="recipientBank"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Bank</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select bank" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="chase">Chase Bank</SelectItem>
                                  <SelectItem value="bofa">Bank of America</SelectItem>
                                  <SelectItem value="wells">Wells Fargo</SelectItem>
                                  <SelectItem value="citi">Citibank</SelectItem>
                                  <SelectItem value="other">Other Bank</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={domesticForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input className="pl-7" placeholder="0.00" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Available balance: {formatCurrency(account.balance)}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={domesticForm.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Add a note" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={domesticForm.control}
                      name="scheduleTransfer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Schedule this transfer</FormLabel>
                            <FormDescription>Set up a one-time or recurring transfer</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {showScheduleOptions && (
                      <div className="space-y-4 rounded-md border p-4 bg-gray-50">
                        <FormField
                          control={domesticForm.control}
                          name="transferDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Transfer Date</FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormControl>
                                      <div className="relative">
                                        <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                                        <Info className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 cursor-help" />
                                      </div>
                                    </FormControl>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p className="w-80 text-xs">
                                      Select the date when you want the first transfer to occur. The date must be today
                                      or in the future.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={domesticForm.control}
                          name="transferFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="once">One time</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="biweekly">Every two weeks</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="quarterly">Quarterly</SelectItem>
                                  <SelectItem value="annually">Annually</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {domesticForm.watch("transferFrequency") !== "once" && (
                          <>
                            <FormField
                              control={domesticForm.control}
                              name="endOption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Recurrence</FormLabel>
                                  <RadioGroup
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      setEndOption(value as "never" | "afterDate" | "afterOccurrences")
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="never" />
                                      </FormControl>
                                      <FormLabel className="font-normal">Never</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="afterDate" />
                                      </FormControl>
                                      <FormLabel className="font-normal">After End Date</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="afterOccurrences" />
                                      </FormControl>
                                      <FormLabel className="font-normal">After Number of Occurrences</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {endOption === "afterDate" && (
                              <FormField
                                control={domesticForm.control}
                                name="endDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="date"
                                        {...field}
                                        min={
                                          domesticForm.watch("transferDate")
                                            ? new Date(domesticForm.watch("transferDate")).toISOString().split("T")[0]
                                            : new Date().toISOString().split("T")[0]
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            {endOption === "afterOccurrences" && (
                              <FormField
                                control={domesticForm.control}
                                name="numberOfTransfers"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Number of Transfers</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="1" max="100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </>
                        )}

                        <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
                          <h4 className="font-medium">Scheduled Transfer Information</h4>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Funds will be reserved for scheduled transfers on the day of processing</li>
                            <li>You can modify or cancel scheduled transfers before the processing date</li>
                            <li>You'll be notified via email before each scheduled transaction</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={domesticForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="rounded-md border p-4 bg-blue-50 max-h-40 overflow-y-auto">
                            <h3 className="font-medium text-blue-800 mb-2">Transfer Terms and Conditions</h3>
                            <div className="text-sm text-blue-700 space-y-2">
                              <p>By accepting these terms, you confirm that:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>The information provided is accurate and complete</li>
                                <li>You authorize this transfer from your account</li>
                                <li>You understand that transfers may take 1-3 business days to complete</li>
                                <li>International transfers may incur additional fees from intermediary banks</li>
                                <li>Currency conversion rates are determined at the time of processing</li>
                                <li>You are not using this transfer for illegal purposes</li>
                              </ul>
                              <p className="mt-2">
                                <a href="#" className="underline hover:text-blue-900">
                                  View full terms and conditions
                                </a>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I agree to the terms and conditions</FormLabel>
                              <FormDescription>
                                By checking this box, you confirm that you have read and agree to the transfer terms and
                                conditions above.
                              </FormDescription>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center p-4 bg-blue-50 rounded-md">
                      <Shield className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-800">
                        Your transfer is protected by our secure banking protocols and will require admin approval
                        before processing.
                      </p>
                    </div>

                    <FormField
                      control={domesticForm.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction PIN</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your PIN" {...field} maxLength={6} />
                          </FormControl>
                          <FormDescription>Enter your secure PIN to authorize this transfer</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-[#003366]">
                      {domesticForm.formState.isSubmitting ? "Processing..." : "Continue"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="international">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  International Transfer
                </CardTitle>
                <CardDescription>Send money to accounts in other countries</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...internationalForm}>
                  <form onSubmit={internationalForm.handleSubmit(onInternationalSubmit)} className="space-y-6">
                    <FormField
                      control={internationalForm.control}
                      name="fromAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Account</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  <div className="flex items-center">
                                    {getAccountIcon(acc.type)}
                                    <span className="ml-2">
                                      {acc.name} ({acc.number})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={internationalForm.control}
                        name="recipientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter recipient's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={internationalForm.control}
                        name="recipientAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Account/IBAN</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter account number or IBAN" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={internationalForm.control}
                        name="recipientBank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Bank</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter bank name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={internationalForm.control}
                        name="swiftCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center">
                                SWIFT/BIC Code
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="w-80 text-xs">
                                        A SWIFT/BIC code is an 8-11 character code that identifies your recipient's
                                        bank. Ask your recipient for this code or contact their bank.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter SWIFT or BIC code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={internationalForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="GB">United Kingdom</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="JP">Japan</SelectItem>
                                <SelectItem value="CN">China</SelectItem>
                                <SelectItem value="SG">Singapore</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={internationalForm.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transfer Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                                <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                                <SelectItem value="CHF">Swiss Franc (CHF)</SelectItem>
                                <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
                                <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Note: Exchange rates are applied at the time of processing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={internationalForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input className="pl-7" placeholder="0.00" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Available balance: {formatCurrency(account.balance)}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={internationalForm.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose of Transfer</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="family">Family Support</SelectItem>
                              <SelectItem value="business">Business Payment</SelectItem>
                              <SelectItem value="education">Education Expenses</SelectItem>
                              <SelectItem value="property">Property Purchase</SelectItem>
                              <SelectItem value="investment">Investment</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={internationalForm.control}
                      name="additionalDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional information that may help process this transfer"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200 mt-4">
                      <h3 className="font-medium text-gray-700 mb-1">Recipient Address Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={internationalForm.control}
                          name="recipientAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={internationalForm.control}
                            name="recipientCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={internationalForm.control}
                            name="recipientPostalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal/ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter postal code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200 mt-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-700 mb-1">Intermediary Bank Information (Optional)</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="w-80 text-xs">
                                Some international transfers require an intermediary bank to complete the transaction.
                                This information may be provided by the recipient or their bank.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={internationalForm.control}
                          name="intermediaryBank"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Intermediary Bank (if required)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter intermediary bank name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={internationalForm.control}
                          name="intermediarySwiftCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Intermediary SWIFT/BIC Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter intermediary SWIFT/BIC code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={internationalForm.control}
                      name="complianceDeclaration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-blue-50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Compliance Declaration</FormLabel>
                            <FormDescription>
                              I confirm that this transfer complies with all applicable laws and regulations, including
                              international anti-money laundering and counter-terrorism financing requirements. I
                              declare that the funds being sent are from legitimate sources and are not related to any
                              illegal activities.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={internationalForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I agree to the terms and conditions</FormLabel>
                            <FormDescription>
                              By checking this box, you confirm that the information provided is accurate and you
                              authorize this international transfer.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                      <p className="font-medium mb-1">International Transfer Information</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>International transfers typically take 1-5 business days to complete</li>
                        <li>International transfers are provided free of charge</li>
                        <li>Exchange rates are determined at the time of processing</li>
                        <li>All international transfers require admin approval</li>
                      </ul>
                    </div>

                    <FormField
                      control={internationalForm.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction PIN</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your PIN" {...field} maxLength={6} />
                          </FormControl>
                          <FormDescription>Enter your secure PIN to authorize this transfer</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-[#003366]">
                      {internationalForm.formState.isSubmitting ? "Processing..." : "Continue"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

