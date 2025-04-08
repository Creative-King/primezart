"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Globe, CreditCard, DollarSign, BarChart3, CheckCircle2, Info } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock account data
const accounts = [
  { id: "acc1", name: "Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "acc2", name: "Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
  { id: "acc3", name: "Investment Portfolio", number: "****2341", balance: 98765.43, type: "investment" },
]

// Mock exchange rates
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 149.82,
  CNY: 7.24,
  INR: 83.12,
}

// Form schema for international transfer
const internationalTransferSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAccount: z.string().min(1, "Account number is required"),
  recipientBank: z.string().min(1, "Bank name is required"),
  swiftCode: z.string().min(8, "Valid SWIFT/BIC code is required"),
  country: z.string().min(1, "Country is required"),
  currency: z.string().min(1, "Currency is required"),
  amount: z.string().refine((val) => {
    const num = Number.parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Please enter a valid amount"),
  purpose: z.string().min(1, "Purpose of transfer is required"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  additionalInstructions: z.string().optional(),
})

export default function InternationalTransfer() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [transferTab, setTransferTab] = useState("new")
  const [conversionRate, setConversionRate] = useState<number | null>(null)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)

  // International transfer form
  const form = useForm<z.infer<typeof internationalTransferSchema>>({
    resolver: zodResolver(internationalTransferSchema),
    defaultValues: {
      fromAccount: "",
      recipientName: "",
      recipientAccount: "",
      recipientBank: "",
      swiftCode: "",
      country: "",
      currency: "",
      amount: "",
      purpose: "",
      recipientAddress: "",
      additionalInstructions: "",
    },
  })

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

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  // Watch for currency and amount changes to calculate conversion
  const watchCurrency = form.watch("currency")
  const watchAmount = form.watch("amount")

  // Update conversion rate when currency changes
  const updateConversionRate = (currency: string) => {
    if (currency && currency in exchangeRates) {
      const rate = exchangeRates[currency as keyof typeof exchangeRates]
      setConversionRate(rate)

      // Update converted amount if amount is available
      const amount = Number.parseFloat(watchAmount)
      if (!isNaN(amount) && amount > 0) {
        setConvertedAmount(amount / rate)
      }
    } else {
      setConversionRate(null)
      setConvertedAmount(null)
    }
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof internationalTransferSchema>) => {
    console.log("International transfer values:", values)

    // In a real app, you would submit this to your backend
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1500)
  }

  // Mock saved recipients
  const savedRecipients = [
    {
      id: "rec1",
      name: "John Smith",
      account: "GB29NWBK60161331926819",
      bank: "Barclays Bank",
      swiftCode: "BARCGB22",
      country: "uk",
      currency: "GBP",
    },
    {
      id: "rec2",
      name: "Maria Garcia",
      account: "ES9121000418450200051332",
      bank: "Santander",
      swiftCode: "BSCHESMM",
      country: "es",
      currency: "EUR",
    },
    {
      id: "rec3",
      name: "Takashi Yamamoto",
      account: "JP3600052000123456789",
      bank: "Mizuho Bank",
      swiftCode: "MHCBJPJT",
      country: "jp",
      currency: "JPY",
    },
  ]

  // Load saved recipient data
  const loadRecipient = (recipientId: string) => {
    const recipient = savedRecipients.find((r) => r.id === recipientId)
    if (recipient) {
      form.setValue("recipientName", recipient.name)
      form.setValue("recipientAccount", recipient.account)
      form.setValue("recipientBank", recipient.bank)
      form.setValue("swiftCode", recipient.swiftCode)
      form.setValue("country", recipient.country)
      form.setValue("currency", recipient.currency)

      // Update conversion rate
      updateConversionRate(recipient.currency)
    }
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
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-[#003366] mb-2">International Transfer Initiated!</h2>
              <p className="text-gray-700 mb-6">
                Your international transfer has been successfully initiated. You will receive a confirmation once the
                transaction is processed.
              </p>
              <div className="flex gap-4 justify-center">
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

  // Enhance the international transfer page with glassmorphism and better styling
  // Update the main container styling
  return (
    <div className="bg-gradient-to-b from-gray-50 to-indigo-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#003366] flex items-center">
            <Globe className="mr-2 h-6 w-6" />
            International Transfer
          </h1>
        </div>

        <Alert className="mb-6 bg-indigo-50 border-indigo-200 text-indigo-800">
          <Info className="h-4 w-4" />
          <AlertDescription>
            International transfers typically take 1-5 business days to complete. This service is provided free of
            charge.
          </AlertDescription>
        </Alert>

        <Tabs value={transferTab} onValueChange={setTransferTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="new" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              New Transfer
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Saved Recipients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>New International Transfer</CardTitle>
                <CardDescription>Send money to accounts in other countries</CardDescription>
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
                              {accounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  <div className="flex items-center">
                                    {getAccountIcon(acc.type)}
                                    <span className="ml-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
                        name="swiftCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SWIFT/BIC Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter SWIFT or BIC code" {...field} />
                            </FormControl>
                            <FormDescription>
                              The SWIFT/BIC code is an 8-11 character code that identifies the bank
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="recipientAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter recipient's full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                                <SelectItem value="uk">United Kingdom</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                                <SelectItem value="de">Germany</SelectItem>
                                <SelectItem value="fr">France</SelectItem>
                                <SelectItem value="jp">Japan</SelectItem>
                                <SelectItem value="cn">China</SelectItem>
                                <SelectItem value="in">India</SelectItem>
                                <SelectItem value="br">Brazil</SelectItem>
                                <SelectItem value="mx">Mexico</SelectItem>
                                <SelectItem value="es">Spain</SelectItem>
                                <SelectItem value="it">Italy</SelectItem>
                                <SelectItem value="sg">Singapore</SelectItem>
                                <SelectItem value="za">South Africa</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transfer Currency</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                updateConversionRate(value)
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                                <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                                <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
                                <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">
                                {watchCurrency ? (watchCurrency === "USD" ? "$" : watchCurrency) : "$"}
                              </span>
                              <Input
                                className="pl-10"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  const amount = Number.parseFloat(e.target.value)
                                  if (!isNaN(amount) && amount > 0 && conversionRate) {
                                    setConvertedAmount(amount / conversionRate)
                                  } else {
                                    setConvertedAmount(null)
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          {conversionRate && convertedAmount && (
                            <FormDescription>
                              Approximately {formatCurrency(convertedAmount)} USD at current exchange rate
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name="additionalInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any special instructions for the transfer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Add a more visually appealing information box */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                      <p className="font-medium mb-1 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Important Information
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>International transfers typically take 1-5 business days to complete</li>
                        <li>International transfers are provided free of charge</li>
                        <li>Exchange rates are determined at the time of processing</li>
                        <li>Please ensure all recipient information is accurate to avoid delays</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        {form.formState.isSubmitting ? "Processing..." : "Submit Transfer"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>Saved Recipients</CardTitle>
                <CardDescription>Select a saved recipient to start a transfer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="border rounded-lg p-4 hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
                      onClick={() => {
                        loadRecipient(recipient.id)
                        setTransferTab("new")
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-indigo-600">{recipient.name}</h3>
                          <p className="text-sm text-gray-600">{recipient.bank}</p>
                          <p className="text-sm text-gray-500">Account: {recipient.account}</p>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {recipient.country.toUpperCase()}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{recipient.currency}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            loadRecipient(recipient.id)
                            setTransferTab("new")
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

