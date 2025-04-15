"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Search, Building, DollarSign, Calendar, FileText, CheckCircle, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define form schema
const formSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  transferType: z.enum(["domestic", "international"]),
  recipientType: z.enum(["existing", "new"]),
  recipient: z.string().optional(),
  recipientName: z.string().min(1, "Recipient name is required").optional(),
  recipientBank: z.string().min(1, "Bank name is required").optional(),
  recipientAccountNumber: z.string().min(5, "Account number is required").optional(),
  recipientRoutingNumber: z.string().min(9, "Routing number is required").optional(),
  country: z.string().optional(),
  swiftCode: z.string().optional(),
  ibanNumber: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().default("USD"),
  transferDate: z.string().min(1, "Transfer date is required"),
  transferFrequency: z.string().default("once"),
  transferPurpose: z.string().optional(),
  memo: z.string().optional(),
  saveRecipient: z.boolean().default(false),
  feePaymentOption: z.enum(["sender", "recipient", "shared"]).default("sender"),
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

// Mock data for countries
const countries = [
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
]

// Mock data for currencies
const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
]

// Mock data for transfer purposes
const transferPurposes = [
  { id: "family", name: "Family Support" },
  { id: "business", name: "Business Payment" },
  { id: "education", name: "Education Fees" },
  { id: "medical", name: "Medical Expenses" },
  { id: "property", name: "Property Purchase" },
  { id: "travel", name: "Travel Expenses" },
  { id: "investment", name: "Investment" },
  { id: "other", name: "Other" },
]

export default function TransferPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecipients, setFilteredRecipients] = useState(recipients)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [convertedAmount, setConvertedAmount] = useState("")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: "",
      transferType: "domestic",
      recipientType: "existing",
      recipient: "",
      recipientName: "",
      recipientBank: "",
      recipientAccountNumber: "",
      recipientRoutingNumber: "",
      country: "",
      swiftCode: "",
      ibanNumber: "",
      amount: "",
      currency: "USD",
      transferDate: new Date().toISOString().split("T")[0],
      transferFrequency: "once",
      transferPurpose: "",
      memo: "",
      saveRecipient: false,
      feePaymentOption: "sender",
    },
  })

  const transferType = form.watch("transferType")
  const recipientType = form.watch("recipientType")
  const selectedRecipient = form.watch("recipient")
  const fromAccount = form.watch("fromAccount")
  const amount = form.watch("amount")
  const currency = form.watch("currency")
  const country = form.watch("country")

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

  // Calculate exchange rate and converted amount
  useEffect(() => {
    if (amount && currency && currency !== "USD") {
      // In a real app, you would fetch the exchange rate from an API
      // For demo purposes, we'll use a mock exchange rate
      const mockExchangeRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 150.25,
        AUD: 1.52,
        CAD: 1.37,
        CHF: 0.89,
        CNY: 7.24,
      }

      const rate = mockExchangeRates[currency] || 1
      setExchangeRate(rate)

      const amountValue = Number.parseFloat(amount)
      if (!isNaN(amountValue)) {
        const converted = (amountValue * rate).toFixed(2)
        setConvertedAmount(converted)
      }
    }
  }, [amount, currency])

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

  const formatCurrency = (amount: number, currencyCode = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
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
                <p className="font-medium text-lg">
                  {formatCurrency(Number.parseFloat(form.getValues("amount")), form.getValues("currency"))}
                </p>
                {form.getValues("currency") !== "USD" && (
                  <p className="text-sm text-gray-500">≈ {formatCurrency(Number.parseFloat(convertedAmount))}</p>
                )}
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
                <p className="font-medium text-green-600">{transferType === "domestic" ? "Processed" : "Pending"}</p>
                {transferType === "international" && (
                  <p className="text-xs text-gray-500">International transfers typically take 2-5 business days</p>
                )}
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
        <h1 className="text-2xl font-bold">Money Transfer</h1>
        <p className="text-gray-500">Transfer money to domestic or international accounts</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the details for your money transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transfer Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Transfer Type</h3>
                <FormField
                  control={form.control}
                  name="transferType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Tabs
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value as "domestic" | "international")}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="domestic" className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Domestic Transfer
                            </TabsTrigger>
                            <TabsTrigger value="international" className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              International Transfer
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

                    {transferType === "domestic" ? (
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
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Country</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      {country.name}
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
                        {country && (
                          <>
                            {["DE", "FR", "AE"].includes(country) && (
                              <FormField
                                control={form.control}
                                name="ibanNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>IBAN Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter IBAN number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            {["GB"].includes(country) && (
                              <FormField
                                control={form.control}
                                name="sortCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sort Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter sort code (e.g., 12-34-56)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            <FormField
                              control={form.control}
                              name="swiftCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SWIFT/BIC Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter SWIFT/BIC code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </>
                    )}

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
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.code} - {currency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {amount && currency && currency !== "USD" && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      Exchange Rate: 1 {currency} = {(1 / exchangeRate).toFixed(4)} USD
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Converted Amount: {formatCurrency(Number.parseFloat(convertedAmount))}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {transferType === "international" && (
                  <FormField
                    control={form.control}
                    name="transferPurpose"
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
                            {transferPurposes.map((purpose) => (
                              <SelectItem key={purpose.id} value={purpose.id}>
                                {purpose.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Required for regulatory compliance</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {transferType === "international" && (
                  <FormField
                    control={form.control}
                    name="feePaymentOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fee Payment Option</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sender" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                I will pay all fees (recipient receives full amount)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="recipient" />
                              </FormControl>
                              <FormLabel className="font-normal">Recipient pays all fees</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="shared" />
                              </FormControl>
                              <FormLabel className="font-normal">Share fees (recommended)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                        {transferType === "domestic"
                          ? "This note is for your reference only and won't be sent to the recipient"
                          : "This message will be included with the transfer"}
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
                      {amount ? formatCurrency(Number.parseFloat(amount), currency) : "Not specified"}
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

                    {transferType === "international" && (
                      <>
                        <div className="text-gray-500">Estimated Delivery:</div>
                        <div>2-5 business days</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Compliance Notice for International Transfers */}
              {transferType === "international" && (
                <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertDescription>
                    International transfers are subject to compliance checks and may require additional verification.
                    Large transfers may be subject to additional documentation requirements.
                  </AlertDescription>
                </Alert>
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
