"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, DollarSign, Send, CheckCircle2, AlertCircle, Users } from "lucide-react"
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

// Mock joint account data
const jointAccounts = [
  { id: "joint1", name: "Joint Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "joint2", name: "Joint Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
]

// Mock joint account owners
const jointOwners = [
  { id: "owner1", name: "John Doe", email: "john.doe@example.com", isPrimary: true },
  { id: "owner2", name: "Jane Doe", email: "jane.doe@example.com", isPrimary: false },
  { id: "owner3", name: "Robert Smith", email: "robert.smith@example.com", isPrimary: false },
]

// Form schema for transfer
const transferSchema = z
  .object({
    fromAccount: z.string().min(1, "Please select an account"),
    transferType: z.enum(["internal", "external", "owner"]),
    toAccount: z.string().optional(),
    toOwner: z.string().optional(),
    externalAccountNumber: z.string().optional(),
    externalRoutingNumber: z.string().optional(),
    externalBankName: z.string().optional(),
    externalAccountName: z.string().optional(),
    amount: z.string().refine((val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    }, "Please enter a valid amount"),
    memo: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      if (data.transferType === "internal") {
        return !!data.toAccount
      }
      if (data.transferType === "owner") {
        return !!data.toOwner
      }
      if (data.transferType === "external") {
        return (
          !!data.externalAccountNumber &&
          !!data.externalRoutingNumber &&
          !!data.externalBankName &&
          !!data.externalAccountName
        )
      }
      return true
    },
    {
      message: "Please fill in all required fields for the selected transfer type",
      path: ["transferType"],
    },
  )

export default function JointTransfer() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [transferStatus, setTransferStatus] = useState<"pending" | "approved" | "rejected">("pending")

  // Transfer form
  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccount: "",
      transferType: "internal",
      toAccount: "",
      toOwner: "",
      externalAccountNumber: "",
      externalRoutingNumber: "",
      externalBankName: "",
      externalAccountName: "",
      amount: "",
      memo: "",
      termsAccepted: false,
    },
  })

  const watchTransferType = form.watch("transferType")
  const watchFromAccount = form.watch("fromAccount")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const onSubmit = (values: z.infer<typeof transferSchema>) => {
    console.log("Transfer values:", values)

    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true)
      setTransferStatus("approved")
    }, 1500)
  }

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
              {transferStatus === "approved" ? (
                <>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Transfer Successful</h2>
                  <p className="text-gray-700 mb-4">
                    Your transfer of {formatCurrency(Number.parseFloat(form.getValues("amount")))} has been successfully
                    processed.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-green-800 mb-2">Transfer Details</h3>
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
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium">
                          {form.getValues("transferType") === "internal"
                            ? jointAccounts.find((acc) => acc.id === form.getValues("toAccount"))?.name
                            : form.getValues("transferType") === "owner"
                              ? jointOwners.find((owner) => owner.id === form.getValues("toOwner"))?.name
                              : form.getValues("externalAccountName")}
                        </span>
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
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Transfer Failed</h2>
                  <p className="text-gray-700 mb-4">
                    We couldn't process your transfer at this time. Please try again or contact customer support.
                  </p>
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
          <h1 className="text-2xl font-bold text-[#003366]">Transfer from Joint Account</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Make a Transfer</CardTitle>
            <CardDescription>Transfer funds from your joint account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
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
                              <RadioGroupItem value="internal" />
                            </FormControl>
                            <FormLabel className="font-normal">Another Joint Account</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="owner" />
                            </FormControl>
                            <FormLabel className="font-normal">Joint Account Owner</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="external" />
                            </FormControl>
                            <FormLabel className="font-normal">External Account</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchTransferType === "internal" && (
                  <FormField
                    control={form.control}
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
                            {jointAccounts
                              .filter((acc) => acc.id !== watchFromAccount)
                              .map((acc) => (
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
                )}

                {watchTransferType === "owner" && (
                  <FormField
                    control={form.control}
                    name="toOwner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Owner</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account owner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jointOwners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id}>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-indigo-600" />
                                  <span>
                                    {owner.name} {owner.isPrimary ? "(Primary)" : ""} - {owner.email}
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
                )}

                {watchTransferType === "external" && (
                  <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium">External Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="externalAccountNumber"
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
                        name="externalRoutingNumber"
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
                      name="externalBankName"
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

                    <FormField
                      control={form.control}
                      name="externalAccountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter account holder name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

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
                        Available balance:{" "}
                        {formatCurrency(jointAccounts.find((acc) => acc.id === watchFromAccount)?.balance || 0)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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

                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <Send className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-sm">Transfer Information</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {watchTransferType === "internal" &&
                          "Transfers between joint accounts are processed immediately."}
                        {watchTransferType === "owner" &&
                          "Transfers to joint account owners typically take 1-2 business days to process."}
                        {watchTransferType === "external" &&
                          "External transfers may take 1-3 business days to complete."}
                      </p>
                    </div>
                  </div>
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
                        <FormLabel>I confirm this transfer information is correct</FormLabel>
                        <FormDescription>
                          By checking this box, you confirm that the information provided is accurate and you authorize
                          this transfer from your joint account.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-[#003366]">
                  {form.formState.isSubmitting ? "Processing..." : "Submit Transfer"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
