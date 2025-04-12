"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, DollarSign, Download, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

// Mock joint account data
const jointAccounts = [
  { id: "joint1", name: "Joint Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "joint2", name: "Joint Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
]

// Form schema for withdrawal
const withdrawalSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  withdrawalMethod: z.enum(["cash", "check", "transfer", "wire"]),
  amount: z.string().refine((val) => {
    const num = Number.parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Please enter a valid amount"),
  transferAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  routingNumber: z.string().optional(),
  recipientName: z.string().optional(),
  memo: z.string().optional(),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export default function JointWithdraw() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [withdrawalStatus, setWithdrawalStatus] = useState<"pending" | "approved" | "rejected">("pending")
  const [otpSent, setOtpSent] = useState(false)
  const [authorizingOwners, setAuthorizingOwners] = useState<string[]>([])

  // Withdrawal form
  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      fromAccount: "",
      withdrawalMethod: "cash",
      amount: "",
      transferAccountNumber: "",
      bankName: "",
      routingNumber: "",
      recipientName: "",
      memo: "",
      otp: "",
      termsAccepted: false,
    },
  })

  const watchWithdrawalMethod = form.watch("withdrawalMethod")
  const watchAmount = form.watch("amount")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleGetOtp = () => {
    setOtpSent(true)
    alert("An OTP has been sent to your registered mobile number. For demo purposes, use '123456'.")
  }

  const handleAuthorizeOwner = (ownerName: string) => {
    if (authorizingOwners.includes(ownerName)) {
      setAuthorizingOwners(authorizingOwners.filter((owner) => owner !== ownerName))
    } else {
      setAuthorizingOwners([...authorizingOwners, ownerName])
    }
  }

  const onSubmit = (values: z.infer<typeof withdrawalSchema>) => {
    console.log("Withdrawal values:", values)

    // Check if OTP is valid (for demo purposes, using hardcoded value)
    if (values.otp !== "123456") {
      form.setError("otp", {
        type: "manual",
        message: "Invalid OTP. Please try again.",
      })
      return
    }

    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true)
      // Randomly approve or reject for demo purposes
      setWithdrawalStatus(Math.random() > 0.2 ? "approved" : "rejected")
    }, 1500)
  }

  const selectedAccount = jointAccounts.find((acc) => acc.id === form.getValues("fromAccount"))
  const amountValue = Number.parseFloat(watchAmount || "0")
  const needsAdditionalApproval = amountValue > 5000

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="container mx-auto pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/joint")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Joint Account
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              {withdrawalStatus === "approved" ? (
                <>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Withdrawal Successful</h2>
                  <p className="text-gray-700 mb-4">
                    Your withdrawal of {formatCurrency(Number.parseFloat(form.getValues("amount")))} has been
                    successfully processed.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-green-800 mb-2">Withdrawal Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(Number.parseFloat(form.getValues("amount")))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">From Account:</span>
                        <span className="font-medium">
                          {jointAccounts.find((acc) => acc.id === form.getValues("fromAccount"))?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">{form.getValues("withdrawalMethod")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium">{form.getValues("memo") || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Withdrawal Failed</h2>
                  <p className="text-gray-700 mb-4">
                    We couldn't process your withdrawal at this time. Please try again or contact customer support.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg mb-4 text-left">
                    <h3 className="font-medium text-red-800 mb-2">Possible Reasons</h3>
                    <ul className="list-disc text-sm text-red-700 pl-5 space-y-1">
                      <li>Insufficient funds in the account</li>
                      <li>Withdrawal limit exceeded</li>
                      <li>Joint account restrictions</li>
                      <li>System error during processing</li>
                    </ul>
                  </div>
                </>
              )}

              <div className="flex gap-4 justify-center mt-6">
                <Button onClick={() => router.push("/dashboard/joint")} className="bg-[#003366] hover:bg-[#002244]">
                  Return to Joint Account
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
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/joint")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Joint Account
          </Button>
          <h1 className="text-2xl font-bold text-[#003366]">Withdraw from Joint Account</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Make a Withdrawal</CardTitle>
            <CardDescription>Withdraw funds from your joint account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Withdraw From</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jointAccounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              <div className="flex items-center">
                                {acc.type === "checking" ? (
                                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                                ) : (
                                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                                )}
                                <span>
                                  {acc.name} ({acc.number}) - {formatCurrency(acc.balance)}
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
                  control={form.control}
                  name="withdrawalMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Withdrawal Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal">Cash</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="check" />
                            </FormControl>
                            <FormLabel className="font-normal">Check</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">Bank Transfer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="wire" />
                            </FormControl>
                            <FormLabel className="font-normal">Wire Transfer</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                      <FormDescription>
                        Available balance: {selectedAccount ? formatCurrency(selectedAccount.balance) : "N/A"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchWithdrawalMethod === "transfer" || watchWithdrawalMethod === "wire") && (
                  <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium">Recipient Information</h3>

                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter recipient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="transferAccountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="routingNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Routing Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter routing number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter bank name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {watchWithdrawalMethod === "check" && (
                  <Alert>
                    <Download className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      Checks may be collected in person at a branch or mailed to your registered address.
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memo (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {needsAdditionalApproval && (
                  <div className="border p-4 rounded-md bg-amber-50">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-amber-800 text-sm">Joint Account Authorization Required</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          For withdrawals over $5,000, additional authorization from other joint account holders is
                          required.
                        </p>

                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-amber-800 font-medium">Authorize joint account holders:</p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Checkbox
                                id="auth-john"
                                checked={authorizingOwners.includes("John Doe")}
                                onCheckedChange={() => handleAuthorizeOwner("John Doe")}
                                className="mr-2"
                              />
                              <label htmlFor="auth-john" className="text-sm">
                                John Doe (Primary)
                              </label>
                            </div>
                            <div className="flex items-center">
                              <Checkbox
                                id="auth-jane"
                                checked={authorizingOwners.includes("Jane Doe")}
                                onCheckedChange={() => handleAuthorizeOwner("Jane Doe")}
                                className="mr-2"
                              />
                              <label htmlFor="auth-jane" className="text-sm">
                                Jane Doe
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* OTP Section */}
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password (OTP)</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input placeholder="Enter OTP" {...field} className="flex-1" />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={handleGetOtp}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                            variant="secondary"
                          >
                            Get OTP
                          </Button>
                        </div>
                        <FormDescription>
                          {otpSent
                            ? "An OTP has been sent to your registered mobile number. For demo purposes, use '123456'."
                            : "Click the button to receive a One-Time Password for secure transaction verification."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I confirm this withdrawal information is correct</FormLabel>
                        <FormDescription>
                          By checking this box, you confirm that the information provided is accurate and you authorize
                          this withdrawal from your joint account.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#003366]"
                  disabled={needsAdditionalApproval && authorizingOwners.length < 1}
                >
                  {form.formState.isSubmitting ? "Processing..." : "Submit Withdrawal"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
