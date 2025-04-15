"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Search, DollarSign, Calendar, FileText, CheckCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define form schema
const formSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  country: z.string().min(1, "Please select a country"),
  bank: z.string().min(1, "Please select a bank"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAccountNumber: z.string().min(1, "Account number is required"),
  swiftCode: z.string().optional(),
  ibanNumber: z.string().optional(),
  sortCode: z.string().optional(),
  bsbCode: z.string().optional(),
  branchCode: z.string().optional(),
  routingNumber: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientCity: z.string().optional(),
  recipientPostalCode: z.string().optional(),
  recipientState: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  transferPurpose: z.string().min(1, "Transfer purpose is required"),
  transferDate: z.string().min(1, "Transfer date is required"),
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

// Mock data for countries with their specific requirements
const countries = [
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    requirements: ["sortCode", "accountNumber"],
    banks: [
      { id: "uk1", name: "Barclays Bank" },
      { id: "uk2", name: "HSBC UK" },
      { id: "uk3", name: "Lloyds Bank" },
      { id: "uk4", name: "NatWest" },
      { id: "uk5", name: "Santander UK" },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    requirements: ["iban", "swiftCode"],
    banks: [
      { id: "de1", name: "Deutsche Bank" },
      { id: "de2", name: "Commerzbank" },
      { id: "de3", name: "DZ Bank" },
      { id: "de4", name: "UniCredit Bank" },
    ],
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    requirements: ["iban", "swiftCode"],
    banks: [
      { id: "fr1", name: "BNP Paribas" },
      { id: "fr2", name: "Crédit Agricole" },
      { id: "fr3", name: "Société Générale" },
      { id: "fr4", name: "BPCE Group" },
    ],
  },
  {
    code: "JP",
    name: "Japan",
    currency: "JPY",
    requirements: ["accountNumber", "branchCode", "swiftCode"],
    banks: [
      { id: "jp1", name: "MUFG Bank" },
      { id: "jp2", name: "Sumitomo Mitsui Banking Corporation" },
      { id: "jp3", name: "Mizuho Bank" },
      { id: "jp4", name: "Japan Post Bank" },
    ],
  },
  {
    code: "CN",
    name: "China",
    currency: "CNY",
    requirements: ["accountNumber", "swiftCode"],
    banks: [
      { id: "cn1", name: "Industrial and Commercial Bank of China" },
      { id: "cn2", name: "China Construction Bank" },
      { id: "cn3", name: "Agricultural Bank of China" },
      { id: "cn4", name: "Bank of China" },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    requirements: ["bsbCode", "accountNumber"],
    banks: [
      { id: "au1", name: "Commonwealth Bank" },
      { id: "au2", name: "Westpac" },
      { id: "au3", name: "ANZ" },
      { id: "au4", name: "National Australia Bank" },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    requirements: ["accountNumber", "routingNumber"],
    banks: [
      { id: "ca1", name: "Royal Bank of Canada" },
      { id: "ca2", name: "TD Canada Trust" },
      { id: "ca3", name: "Scotiabank" },
      { id: "ca4", name: "BMO Bank of Montreal" },
    ],
  },
  {
    code: "IN",
    name: "India",
    currency: "INR",
    requirements: ["accountNumber", "ifscCode"],
    banks: [
      { id: "in1", name: "State Bank of India" },
      { id: "in2", name: "HDFC Bank" },
      { id: "in3", name: "ICICI Bank" },
      { id: "in4", name: "Axis Bank" },
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
    requirements: ["accountNumber", "branchCode", "cpfCnpj"],
    banks: [
      { id: "br1", name: "Banco do Brasil" },
      { id: "br2", name: "Itaú Unibanco" },
      { id: "br3", name: "Bradesco" },
      { id: "br4", name: "Caixa Econômica Federal" },
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    requirements: ["accountNumber", "branchCode"],
    banks: [
      { id: "za1", name: "Standard Bank" },
      { id: "za2", name: "FirstRand Bank" },
      { id: "za3", name: "Absa Group" },
      { id: "za4", name: "Nedbank" },
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    currency: "SGD",
    requirements: ["accountNumber", "swiftCode"],
    banks: [
      { id: "sg1", name: "DBS Bank" },
      { id: "sg2", name: "OCBC Bank" },
      { id: "sg3", name: "United Overseas Bank" },
      { id: "sg4", name: "Standard Chartered Singapore" },
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    currency: "AED",
    requirements: ["iban", "swiftCode"],
    banks: [
      { id: "ae1", name: "Emirates NBD" },
      { id: "ae2", name: "First Abu Dhabi Bank" },
      { id: "ae3", name: "Abu Dhabi Commercial Bank" },
      { id: "ae4", name: "Dubai Islamic Bank" },
    ],
  },
  {
    code: "MX",
    name: "Mexico",
    currency: "MXN",
    requirements: ["clabe", "accountNumber"],
    banks: [
      { id: "mx1", name: "BBVA México" },
      { id: "mx2", name: "Banorte" },
      { id: "mx3", name: "Citibanamex" },
      { id: "mx4", name: "Santander México" },
    ],
  },
  {
    code: "RU",
    name: "Russia",
    currency: "RUB",
    requirements: ["accountNumber", "bik", "correspondentAccount"],
    banks: [
      { id: "ru1", name: "Sberbank" },
      { id: "ru2", name: "VTB Bank" },
      { id: "ru3", name: "Gazprombank" },
      { id: "ru4", name: "Alfa-Bank" },
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    requirements: ["accountNumber", "bankCode"],
    banks: [
      { id: "ng1", name: "Zenith Bank" },
      { id: "ng2", name: "First Bank of Nigeria" },
      { id: "ng3", name: "Guaranty Trust Bank" },
      { id: "ng4", name: "Access Bank" },
    ],
  },
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
  { code: "INR", name: "Indian Rupee" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "ZAR", name: "South African Rand" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "NGN", name: "Nigerian Naira" },
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

export default function InternationalTransferPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [availableBanks, setAvailableBanks] = useState([])
  const [exchangeRate, setExchangeRate] = useState(1)
  const [convertedAmount, setConvertedAmount] = useState("")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: "",
      country: "",
      bank: "",
      recipientName: "",
      recipientAccountNumber: "",
      swiftCode: "",
      ibanNumber: "",
      sortCode: "",
      bsbCode: "",
      branchCode: "",
      routingNumber: "",
      recipientAddress: "",
      recipientCity: "",
      recipientPostalCode: "",
      recipientState: "",
      amount: "",
      currency: "USD",
      transferPurpose: "",
      transferDate: new Date().toISOString().split("T")[0],
      memo: "",
      saveRecipient: false,
      feePaymentOption: "sender",
    },
  })

  const watchCountry = form.watch("country")
  const watchAmount = form.watch("amount")
  const watchCurrency = form.watch("currency")
  const watchFromAccount = form.watch("fromAccount")

  // Filter countries based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = countries.filter((country) => country.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredCountries(filtered)
    } else {
      setFilteredCountries(countries)
    }
  }, [searchQuery])

  // Update selected country and available banks when country changes
  useEffect(() => {
    if (watchCountry) {
      const country = countries.find((c) => c.code === watchCountry)
      setSelectedCountry(country)
      if (country) {
        setAvailableBanks(country.banks)
        form.setValue("currency", country.currency)
      }
    }
  }, [watchCountry, form])

  // Calculate exchange rate and converted amount
  useEffect(() => {
    if (watchAmount && watchCurrency) {
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
        INR: 83.12,
        SGD: 1.35,
        AED: 3.67,
        ZAR: 18.45,
        BRL: 5.17,
        MXN: 17.23,
        RUB: 91.75,
        NGN: 1550.0,
      }

      const rate = mockExchangeRates[watchCurrency] || 1
      setExchangeRate(rate)

      const amount = Number.parseFloat(watchAmount)
      if (!isNaN(amount)) {
        const converted = (amount * rate).toFixed(2)
        setConvertedAmount(converted)
      }
    }
  }, [watchAmount, watchCurrency])

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

  const selectedAccountBalance = accounts.find((acc) => acc.id === watchFromAccount)?.balance || 0

  // Render field based on country requirements
  const renderRequiredFields = () => {
    if (!selectedCountry) return null

    return (
      <div className="space-y-4">
        {selectedCountry.requirements.includes("swiftCode") && (
          <FormField
            control={form.control}
            name="swiftCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SWIFT/BIC Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SWIFT/BIC code" {...field} />
                </FormControl>
                <FormDescription>The bank's SWIFT or BIC code (e.g., AAAABB2L)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("iban") && (
          <FormField
            control={form.control}
            name="ibanNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter IBAN number" {...field} />
                </FormControl>
                <FormDescription>International Bank Account Number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("sortCode") && (
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

        {selectedCountry.requirements.includes("bsbCode") && (
          <FormField
            control={form.control}
            name="bsbCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BSB Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter BSB code (e.g., 123-456)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("branchCode") && (
          <FormField
            control={form.control}
            name="branchCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter branch code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("routingNumber") && (
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
        )}

        {selectedCountry.requirements.includes("ifscCode") && (
          <FormField
            control={form.control}
            name="ifscCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter IFSC code" {...field} />
                </FormControl>
                <FormDescription>Indian Financial System Code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("clabe") && (
          <FormField
            control={form.control}
            name="clabeNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CLABE Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter CLABE number" {...field} />
                </FormControl>
                <FormDescription>Clave Bancaria Estandarizada (18 digits)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("bik") && (
          <FormField
            control={form.control}
            name="bikCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BIK Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter BIK code" {...field} />
                </FormControl>
                <FormDescription>Russian Bank Identification Code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("cpfCnpj") && (
          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="Enter CPF or CNPJ number" {...field} />
                </FormControl>
                <FormDescription>Brazilian tax identification number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCountry.requirements.includes("bankCode") && (
          <FormField
            control={form.control}
            name="bankCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    )
  }

  if (showConfirmation) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <CardTitle className="text-2xl">International Transfer Submitted</CardTitle>
            </div>
            <CardDescription>Your international transfer has been successfully submitted.</CardDescription>
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
                <p className="text-sm text-gray-500">
                  {countries.find((c) => c.code === form.getValues("country"))?.name}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="font-medium text-lg">
                  {formatCurrency(Number.parseFloat(form.getValues("amount")), form.getValues("currency"))}
                </p>
                <p className="text-sm text-gray-500">≈ {formatCurrency(Number.parseFloat(convertedAmount))}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transfer Date</h3>
                <p className="font-medium">{form.getValues("transferDate")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reference Number</h3>
                <p className="font-medium">INT-{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="font-medium text-yellow-600">Pending</p>
                <p className="text-xs text-gray-500">International transfers typically take 2-5 business days</p>
              </div>
            </div>

            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You will receive an email confirmation once the transfer is processed. You can track the status of your
                transfer in the Transaction History.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push("/dashboard/international-transfer")}>Make Another Transfer</Button>
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
        <h1 className="text-2xl font-bold">International Transfer</h1>
        <p className="text-gray-500">Send money to recipients around the world</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>International Transfer Details</CardTitle>
              <CardDescription>Enter the details for your international money transfer</CardDescription>
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

                {watchFromAccount && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      Available Balance: <span className="font-bold">{formatCurrency(selectedAccountBalance)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Recipient Country and Bank Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recipient Country and Bank</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search countries..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                          {filteredCountries.map((country) => (
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

                {selectedCountry && (
                  <FormField
                    control={form.control}
                    name="bank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Bank</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a bank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableBanks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Recipient Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recipient Information</h3>
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipient's full name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name exactly as it appears on the recipient's bank account
                      </FormDescription>
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

                {/* Render country-specific fields */}
                {renderRequiredFields()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipientCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipientPostalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal/ZIP Code (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipientState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state or province" {...field} />
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

                {watchAmount && watchCurrency && watchCurrency !== "USD" && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      Exchange Rate: 1 {watchCurrency} = {(1 / exchangeRate).toFixed(4)} USD
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Converted Amount: {formatCurrency(Number.parseFloat(convertedAmount))}
                    </p>
                  </div>
                )}

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

                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message to Recipient (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                          <Textarea
                            placeholder="Add a message for the recipient"
                            className="pl-10 min-h-[100px]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>This message will be included with the transfer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Transfer Summary */}
              {watchFromAccount && watchAmount && selectedCountry && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-medium">Transfer Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">From:</div>
                    <div>{accounts.find((acc) => acc.id === watchFromAccount)?.name}</div>

                    <div className="text-gray-500">To:</div>
                    <div>{form.getValues("recipientName") || "Not specified"}</div>

                    <div className="text-gray-500">Recipient Country:</div>
                    <div>{selectedCountry.name}</div>

                    <div className="text-gray-500">Amount:</div>
                    <div className="font-medium">
                      {watchAmount ? formatCurrency(Number.parseFloat(watchAmount), watchCurrency) : "Not specified"}
                    </div>

                    <div className="text-gray-500">Date:</div>
                    <div>{form.getValues("transferDate")}</div>

                    <div className="text-gray-500">Fee Payment:</div>
                    <div>
                      {form.getValues("feePaymentOption") === "sender"
                        ? "You pay all fees"
                        : form.getValues("feePaymentOption") === "recipient"
                          ? "Recipient pays all fees"
                          : "Shared fees"}
                    </div>

                    <div className="text-gray-500">Estimated Delivery:</div>
                    <div>2-5 business days</div>
                  </div>
                </div>
              )}

              {/* Compliance Notice */}
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  International transfers are subject to compliance checks and may require additional verification.
                  Large transfers may be subject to additional documentation requirements.
                </AlertDescription>
              </Alert>
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
