"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock account data
const accounts = [
  { id: "acc1", name: "Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "acc2", name: "Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
  { id: "acc3", name: "Investment Portfolio", number: "****2341", balance: 98765.43, type: "investment" },
]

// Form schema for transfer
const transferSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  accountNumber: z.string().min(1, "Account number is required"),
  amount: z.string().refine((val) => {
    const num = Number.parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Please enter a valid amount"),
  description: z.string().optional(),
  accountName: z.string().min(1, "Account name is required"),
  routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9, "Routing number must be 9 digits"),
  bankAddress: z.string().min(1, "Bank address is required"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
})

export default function Transfer() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [account, setAccount] = useState<any>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [transferStatus, setTransferStatus] = useState<"pending" | "approved" | "rejected">("pending")

  // Transfer form
  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccount: accountId,
      accountNumber: "",
      amount: "",
      description: "",
      accountName: "",
      routingNumber: "",
      bankAddress: "",
      otp: "",
    },
  })

  // Update the useEffect to properly handle the account data
  useEffect(() => {
    // Find the account
    const foundAccount = accounts.find((a) => a.id === accountId)
    if (foundAccount) {
      setAccount(foundAccount)
      form.setValue("fromAccount", accountId)
    } else {
      // Account not found, redirect to dashboard
      router.push("/dashboard")
    }
  }, [accountId, router, form])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleGetOtp = () => {
    // In a real app, this would send an OTP to the user's email or phone
    setIsOtpSent(true)
    alert("An OTP has been sent to your registered email address.")
  }

  const onSubmit = (values: z.infer<typeof transferSchema>) => {
    console.log("Transfer values:", values)

    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true)
      setTransferStatus("approved")
    }, 1500)
  }

  if (!account) {
    return <div className="container mx-auto pt-6">Loading...</div>
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 p-6">
        <div className="container mx-auto pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm border-white/30 text-white rounded-lg">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-2">Transfer Successful</h2>

              <p className="mb-4">
                You have successfully transferred {formatCurrency(Number.parseFloat(form.getValues("amount")))} to{" "}
                {form.getValues("accountName")}.
              </p>

              <div className="bg-white/10 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-medium mb-2">Transfer Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{formatCurrency(Number.parseFloat(form.getValues("amount")))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span>{form.getValues("accountName")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span>****{form.getValues("accountNumber").slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span>{form.getValues("description") || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="mb-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-4xl font-bold text-white mb-8">Transfer</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fromAccount"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white backdrop-blur-sm h-14">
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <div className="flex justify-between w-full">
                            <span>{acc.name}</span>
                            <span className="text-right">{formatCurrency(acc.balance)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Account Number"
                      {...field}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Amount"
                      {...field}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Description (Optional)"
                      {...field}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Account Name"
                      {...field}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Routing Number"
                      {...field}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Bank Address"
                      {...field}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter OTP"
                        {...field}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm h-14"
                      />
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={handleGetOtp}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-14 px-6"
              >
                Get OTP
              </Button>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 mt-6">
              Transfer
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
