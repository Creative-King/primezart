"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Search, DollarSign, Calendar, FileText, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define form schema
const formSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  recipientType: z.enum(["existing", "new"]),
  recipient: z.string().optional(),
  recipientName: z.string().min(1, "Recipient name is required").optional(),
  recipientBank: z.string().min(1, "Bank name is required").optional(),
  recipientAccountNumber: z.string().min(5, "Account number is required").optional(),
  recipientRoutingNumber: z.string().min(9, "Routing number is required").optional(),
  amount: z.string().min(1, "Amount is required"),
  transferDate: z.string().min(1, "Transfer date is required"),
  transferFrequency: z.string().default("once"),
  memo: z.string().optional(),
  saveRecipient: z.boolean().default(false),
})

// Mock data for accounts
const accounts = [
  { id: "acc1", name: "Checking Account", number: "****1234", balance: 4638412.32 },
  { id: "acc2", name: "Savings Account", number: "****5678", balance: 250000.0 },
  { id: "acc3", name: "Investment Account", number: "****9012", balance: 1500000.0 },
]

// Mock data for recipients
const recipients = [
  { id: "rec1", name: "John Smith", bank: "Chase Bank", accountNumber: "****5678", routingNumber: "021000021" },
  { id: "rec2", name: "Sarah Johnson", bank: "Bank of America", accountNumber: "****1234", routingNumber: "026009593" },
  { id: "rec3", name: "Michael Brown", bank: "Wells Fargo", accountNumber: "****9012", routingNumber: "121000248" },
]

export default function DomesticTransferPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecipients, setFilteredRecipients] = useState(recipients)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: "",
      recipientType: "existing",
      recipient: "",
      recipientName: "",
      recipientBank: "",
      recipientAccountNumber: "",
      recipientRoutingNumber: "",
      amount: "",
      transferDate: new Date().toISOString().split("T")[0],
      transferFrequency: "once",
      memo: "",
      saveRecipient: false,
    },
  })

  const recipientType = form.watch("recipientType")
  const selectedRecipient = form.watch("recipient")
  const fromAccount = form.watch("fromAccount")
  const amount = form.watch("amount")

  // Filter recipients based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = recipients.filter(
        (recipient) =>
          recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipient.bank.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRecipients(filtered)
    } else {
      setFilteredRecipients(recipients)
    }
  }, [searchQuery])

  // Update form when recipient is selected
  useEffect(() => {
    if (recipientType === "existing" && selectedRecipient) {
      const recipient = recipients.find((r) => r.id === selectedRecipient)
      if (recipient) {
        form.setValue("recipientName", recipient.name)
        form.setValue("recipientBank", recipient.bank)
        form.setValue("recipientAccountNumber", recipient.accountNumber)
        form.setValue("recipientRoutingNumber", recipient.routingNumber)
      }
    }
  }, [recipientType, selectedRecipient, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call here
      console.log("Form values:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show confirmation
      setShowConfirmation(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const selectedAccountBalance = accounts.find((acc) => acc.id === fromAccount)?.balance || 0

  if (showConfirmation) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <CardTitle className="text-2xl">Transfer Successful</CardTitle>
            </div>
            <CardDescription>Your transfer has been successfully submitted.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">From Account</h3>
                <p className="font-medium">
                  {accounts.find((acc) => acc.id === form.getValues("fromAccount"))?.name} (
                  {accounts.find((acc) => acc.id === form.getValues("fromAccount"))?.number})
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">To Recipient</h3>
                <p className="font-medium">{form.getValues("recipientName")}</p>
                <p className="text-sm text-gray-500">{form.getValues("recipientBank")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="font-medium text-lg">{formatCurrency(Number.parseFloat(form.getValues("amount")))}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transfer Date</h3>
                <p className="font-medium">{form.getValues("transferDate")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reference Number</h3>
                <p className="font-medium">TRF-{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="font-medium text-green-600">Processed</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push("/dashboard/transfer")}>Make Another Transfer</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBackToDashboard} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Domestic Transfer</h1>
        <p className="text-gray-500">Transfer money to accounts within the United States</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the details for your domestic transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Account Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">From Account</h3>
                <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} ({account.number}) - {formatCurrency(account.balance)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fromAccount && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      Available Balance: <span className="font-bold">{formatCurrency(selectedAccountBalance)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Recipient Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recipient Information</h3>
                <Tabs
                  defaultValue="existing"
                  onValueChange={(value) => form.setValue("recipientType", value as "existing" | "new")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Existing Recipient</TabsTrigger>
                    <TabsTrigger value="new">New Recipient</TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing" className="space-y-4 pt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Search recipients..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Recipient</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a recipient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredRecipients.map((recipient) => (
                                <SelectItem key={recipient.id} value={recipient.id}>
                                  {recipient.name} - {recipient.bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="new" className="space-y-4 pt-4">
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
                    <FormField
                      control={form.control}
                      name="recipientBank"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="recipientAccountNumber"
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
                        name="recipientRoutingNumber"
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
                      name="saveRecipient"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Save this recipient for future transfers</FormLabel>
                            <FormDescription>This will add the recipient to your saved recipients list</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Transfer Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Transfer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <Input placeholder="0.00" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transferDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transfer Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="transferFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transfer Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="once">One-time transfer</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memo / Note (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                          <Textarea
                            placeholder="Add a note for this transfer"
                            className="pl-10 min-h-[100px]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This note is for your reference only and won't be sent to the recipient
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Transfer Summary */}
              {fromAccount && amount && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-medium">Transfer Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">From:</div>
                    <div>{accounts.find((acc) => acc.id === fromAccount)?.name}</div>

                    <div className="text-gray-500">To:</div>
                    <div>{form.getValues("recipientName") || "Not specified"}</div>

                    <div className="text-gray-500">Amount:</div>
                    <div className="font-medium">
                      {amount ? formatCurrency(Number.parseFloat(amount)) : "Not specified"}
                    </div>

                    <div className="text-gray-500">Date:</div>
                    <div>{form.getValues("transferDate")}</div>

                    <div className="text-gray-500">Frequency:</div>
                    <div>
                      {form.getValues("transferFrequency") === "once"
                        ? "One-time transfer"
                        : form.getValues("transferFrequency") === "weekly"
                          ? "Weekly"
                          : form.getValues("transferFrequency") === "biweekly"
                            ? "Bi-weekly"
                            : "Monthly"}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBackToDashboard}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Submit Transfer"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
