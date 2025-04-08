"use client"

import { useState, useEffect } from "react"
import {
  AlertCircleIcon,
  GlobeIcon,
  ChevronDownIcon,
  CheckIcon,
  SearchIcon,
  ShieldIcon,
  CreditCardIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TwoFactorVerification } from "./two-factor-auth"

// Mock account data
const mockAccounts = [
  {
    id: "acc1",
    name: "Premium Checking",
    number: "****4532",
    balance: 12435.67,
    type: "checking",
    currency: "USD",
  },
  {
    id: "acc2",
    name: "Premium Savings",
    number: "****7890",
    balance: 34521.89,
    type: "savings",
    currency: "USD",
  },
  {
    id: "acc3",
    name: "Euro Account",
    number: "****5321",
    balance: 15320.44,
    type: "checking",
    currency: "EUR",
  },
  {
    id: "acc4",
    name: "British Pound Account",
    number: "****1234",
    balance: 8762.5,
    type: "checking",
    currency: "GBP",
  },
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
  SGD: 1.34,
  AED: 3.67,
  CHF: 0.89,
  MXN: 17.05,
  BRL: 5.05,
}

// Mock frequent beneficiaries
const frequentBeneficiaries = [
  {
    id: "ben1",
    name: "John Smith",
    accountNumber: "DE89370400440532013000",
    bank: "Deutsche Bank",
    country: "Germany",
    currency: "EUR",
  },
  {
    id: "ben2",
    name: "Sarah Johnson",
    accountNumber: "GB29NWBK60161331926819",
    bank: "Barclays",
    country: "United Kingdom",
    currency: "GBP",
  },
  {
    id: "ben3",
    name: "Tech Solutions Ltd",
    accountNumber: "CH9300762011623852957",
    bank: "Credit Suisse",
    country: "Switzerland",
    currency: "CHF",
  },
]

export function InternationalBankingCard() {
  const [activeTab, setActiveTab] = useState("swift")
  const [sourceAccount, setSourceAccount] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientBank, setRecipientBank] = useState("")
  const [recipientCountry, setRecipientCountry] = useState("")
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("")
  const [recipientSwiftCode, setRecipientSwiftCode] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [transferCurrency, setTransferCurrency] = useState("USD")
  const [transferReason, setTransferReason] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [conversionRate, setConversionRate] = useState<number | null>(null)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [searchBeneficiary, setSearchBeneficiary] = useState("")
  const [showBeneficiarySearch, setShowBeneficiarySearch] = useState(false)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null)
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false)
  const [acknowledgeCharges, setAcknowledgeCharges] = useState(false)
  const [showTwoFactorVerification, setShowTwoFactorVerification] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Intermediary bank fields for SWIFT
  const [useIntermediaryBank, setUseIntermediaryBank] = useState(false)
  const [intermediaryBankName, setIntermediaryBankName] = useState("")
  const [intermediarySwiftCode, setIntermediarySwiftCode] = useState("")

  // SEPA-specific fields
  const [isSepaUrgent, setIsSepaUrgent] = useState(false)
  const [includeRemittanceInfo, setIncludeRemittanceInfo] = useState(false)
  const [remittanceInfo, setRemittanceInfo] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Format currency
  const formatCurrency = (value: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Update conversion rate and converted amount when currency changes
  useEffect(() => {
    if (transferCurrency && transferCurrency in exchangeRates) {
      const rate = exchangeRates[transferCurrency as keyof typeof exchangeRates]
      setConversionRate(rate)

      if (transferAmount && !isNaN(Number(transferAmount))) {
        setConvertedAmount(Number(transferAmount) / rate)
      } else {
        setConvertedAmount(null)
      }
    } else {
      setConversionRate(null)
      setConvertedAmount(null)
    }
  }, [transferCurrency, transferAmount])

  // Handle beneficiary selection
  const handleSelectBeneficiary = (id: string) => {
    const beneficiary = frequentBeneficiaries.find((b) => b.id === id)
    if (beneficiary) {
      setSelectedBeneficiary(id)
      setRecipientName(beneficiary.name)
      setRecipientAccountNumber(beneficiary.accountNumber)
      setRecipientBank(beneficiary.bank)
      setRecipientCountry(beneficiary.country)
      setTransferCurrency(beneficiary.currency)
      setShowBeneficiarySearch(false)

      // Set SWIFT code based on the bank (in a real app, this would be stored with the beneficiary)
      if (beneficiary.bank === "Deutsche Bank") {
        setRecipientSwiftCode("DEUTDEFFXXX")
      } else if (beneficiary.bank === "Barclays") {
        setRecipientSwiftCode("BARCGB22XXX")
      } else if (beneficiary.bank === "Credit Suisse") {
        setRecipientSwiftCode("CRESCHZZ80A")
      }
    }
  }

  // Filter beneficiaries based on search term
  const filteredBeneficiaries = frequentBeneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
      b.bank.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
      b.country.toLowerCase().includes(searchBeneficiary.toLowerCase()),
  )

  // Handle submit - Different validations based on transfer type
  const handleSubmit = () => {
    // Reset error state
    setShowError(false)
    setErrorMessage("")

    // Common validations
    if (!sourceAccount || !transferAmount || !recipientName || !transferCurrency) {
      setShowError(true)
      setErrorMessage("Please fill in all required fields")
      return
    }

    if (isNaN(Number(transferAmount)) || Number(transferAmount) <= 0) {
      setShowError(true)
      setErrorMessage("Please enter a valid amount")
      return
    }

    // SWIFT specific validations
    if (
      activeTab === "swift" &&
      (!recipientSwiftCode || !recipientAccountNumber || !recipientBank || !recipientCountry)
    ) {
      setShowError(true)
      setErrorMessage("Please provide all recipient bank details for SWIFT transfer")
      return
    }

    // SEPA specific validations
    if (activeTab === "sepa" && !recipientAccountNumber.match(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/)) {
      setShowError(true)
      setErrorMessage("Please enter a valid IBAN for SEPA transfer")
      return
    }

    // If intermediary bank is used, validate those fields
    if (activeTab === "swift" && useIntermediaryBank && (!intermediaryBankName || !intermediarySwiftCode)) {
      setShowError(true)
      setErrorMessage("Please provide intermediary bank details")
      return
    }

    // Check acknowledgement
    if (!acknowledgeCharges) {
      setShowError(true)
      setErrorMessage("Please acknowledge the fees and charges")
      return
    }

    // All validations passed, show confirmation dialog
    setShowConfirmation(true)
  }

  // Handle confirmation
  const handleConfirmTransfer = () => {
    setIsProcessing(true)
    setShowError(false)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setShowConfirmation(false)
      setShowSuccess(true)

      // Reset form after success (in real app, would happen after success response from API)
      setTimeout(() => {
        setShowSuccess(false)
        setTransferAmount("")
        setRecipientName("")
        setRecipientBank("")
        setRecipientCountry("")
        setRecipientAccountNumber("")
        setRecipientSwiftCode("")
        setTransferReason("")
        setSelectedBeneficiary(null)
        setSaveAsBeneficiary(false)
        setAcknowledgeCharges(false)
        setUseIntermediaryBank(false)
        setIntermediaryBankName("")
        setIntermediarySwiftCode("")
        setIsSepaUrgent(false)
        setIncludeRemittanceInfo(false)
        setRemittanceInfo("")
      }, 3000)
    }, 2000)
  }

  // Get selected account data
  const selectedAccount = mockAccounts.find((acc) => acc.id === sourceAccount)

  // Early return to prevent hydration errors
  if (!isClient) return null

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>International Transfers</CardTitle>
          <CardDescription>Send money securely worldwide using SWIFT or SEPA</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="swift">
                <GlobeIcon className="h-4 w-4 mr-2" />
                SWIFT Transfer
              </TabsTrigger>
              <TabsTrigger value="sepa">
                <CreditCardIcon className="h-4 w-4 mr-2" />
                SEPA Transfer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swift">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">SWIFT International Transfer</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          SWIFT transfers can be used to send money internationally to any bank worldwide. Typically
                          takes 1-5 business days and may incur fees from both sending and receiving banks.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div>
                  <label className="text-sm font-medium">From Account</label>
                  <Select value={sourceAccount} onValueChange={setSourceAccount}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {account.name} ({account.number})
                            </span>
                            <span>{formatCurrency(account.balance, account.currency)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Recipient</label>
                    <div className="relative">
                      <Input
                        className="mt-1.5 pr-10"
                        placeholder="Enter recipient name or select from list"
                        value={recipientName}
                        onChange={(e) => {
                          setRecipientName(e.target.value)
                          setSelectedBeneficiary(null)
                        }}
                        onFocus={() => setShowBeneficiarySearch(true)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-[calc(50%-16px)]"
                        onClick={() => setShowBeneficiarySearch(!showBeneficiarySearch)}
                      >
                        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>

                    {showBeneficiarySearch && (
                      <div className="relative mt-1">
                        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-8"
                                placeholder="Search beneficiaries"
                                value={searchBeneficiary}
                                onChange={(e) => setSearchBeneficiary(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto">
                            {filteredBeneficiaries.length > 0 ? (
                              filteredBeneficiaries.map((beneficiary) => (
                                <div
                                  key={beneficiary.id}
                                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                    selectedBeneficiary === beneficiary.id ? "bg-blue-50" : ""
                                  }`}
                                  onClick={() => handleSelectBeneficiary(beneficiary.id)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{beneficiary.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {beneficiary.bank} • {beneficiary.country}
                                      </p>
                                    </div>
                                    {selectedBeneficiary === beneficiary.id && (
                                      <CheckIcon className="h-4 w-4 text-blue-600" />
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No matching beneficiaries found
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Recipient Bank</label>
                    <Input
                      className="mt-1.5"
                      placeholder="Enter bank name"
                      value={recipientBank}
                      onChange={(e) => setRecipientBank(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Recipient Country</label>
                    <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Spain">Spain</SelectItem>
                        <SelectItem value="Italy">Italy</SelectItem>
                        <SelectItem value="Switzerland">Switzerland</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                        <SelectItem value="China">China</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Account Number/IBAN</label>
                    <Input
                      className="mt-1.5"
                      placeholder="Enter account number or IBAN"
                      value={recipientAccountNumber}
                      onChange={(e) => setRecipientAccountNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">SWIFT/BIC Code</label>
                    <Input
                      className="mt-1.5"
                      placeholder="ABCDUS33XXX"
                      value={recipientSwiftCode}
                      onChange={(e) => setRecipientSwiftCode(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="intermediaryBank"
                      checked={useIntermediaryBank}
                      onCheckedChange={(checked) => {
                        setUseIntermediaryBank(checked === true)
                      }}
                    />
                    <label
                      htmlFor="intermediaryBank"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use intermediary bank
                    </label>
                  </div>

                  {useIntermediaryBank && (
                    <div className="pl-6 space-y-4 mt-2">
                      <div>
                        <label className="text-sm font-medium">Intermediary Bank Name</label>
                        <Input
                          className="mt-1.5"
                          placeholder="Enter intermediary bank name"
                          value={intermediaryBankName}
                          onChange={(e) => setIntermediaryBankName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Intermediary Bank SWIFT/BIC</label>
                        <Input
                          className="mt-1.5"
                          placeholder="ABCDUS33XXX"
                          value={intermediarySwiftCode}
                          onChange={(e) => setIntermediarySwiftCode(e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <div className="flex mt-1.5">
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "")
                          setTransferAmount(value)
                        }}
                        className="rounded-r-none"
                      />
                      <Select value={transferCurrency} onValueChange={setTransferCurrency}>
                        <SelectTrigger className="w-24 rounded-l-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="CHF">CHF</SelectItem>
                          <SelectItem value="CNY">CNY</SelectItem>
                          <SelectItem value="SGD">SGD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAccount &&
                      transferAmount &&
                      transferCurrency &&
                      selectedAccount.currency !== transferCurrency && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Exchange rate: 1 {selectedAccount.currency} ={" "}
                          {(
                            (1 / exchangeRates[transferCurrency as keyof typeof exchangeRates]) *
                            exchangeRates[selectedAccount.currency as keyof typeof exchangeRates]
                          ).toFixed(4)}{" "}
                          {transferCurrency}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Reason for Transfer</label>
                    <Select value={transferReason} onValueChange={setTransferReason}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family Support</SelectItem>
                        <SelectItem value="goods">Payment for Goods</SelectItem>
                        <SelectItem value="services">Payment for Services</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="property">Property Purchase</SelectItem>
                        <SelectItem value="education">Education Fees</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAsBeneficiary"
                    checked={saveAsBeneficiary}
                    onCheckedChange={(checked) => {
                      setSaveAsBeneficiary(checked === true)
                    }}
                  />
                  <Label htmlFor="saveAsBeneficiary">Save recipient as beneficiary</Label>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acknowledgeCharges"
                      checked={acknowledgeCharges}
                      onCheckedChange={(checked) => {
                        setAcknowledgeCharges(checked === true)
                      }}
                    />
                    <Label htmlFor="acknowledgeCharges">
                      I acknowledge that SWIFT transfers may incur fees up to $50 from both sending and receiving banks
                    </Label>
                  </div>
                </div>

                {showError && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sepa">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">SEPA Transfer</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          SEPA transfers can only be used for EUR transfers within the SEPA zone (EU/EEA countries).
                          Standard SEPA transfers take 1 business day, while SEPA Instant is processed within seconds.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div>
                  <label className="text-sm font-medium">From Account</label>
                  <Select value={sourceAccount} onValueChange={setSourceAccount}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {account.name} ({account.number})
                            </span>
                            <span>{formatCurrency(account.balance, account.currency)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Recipient</label>
                    <div className="relative">
                      <Input
                        className="mt-1.5 pr-10"
                        placeholder="Enter recipient name or select from list"
                        value={recipientName}
                        onChange={(e) => {
                          setRecipientName(e.target.value)
                          setSelectedBeneficiary(null)
                        }}
                        onFocus={() => setShowBeneficiarySearch(true)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-[calc(50%-16px)]"
                        onClick={() => setShowBeneficiarySearch(!showBeneficiarySearch)}
                      >
                        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>

                    {showBeneficiarySearch && (
                      <div className="relative mt-1">
                        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-8"
                                placeholder="Search beneficiaries"
                                value={searchBeneficiary}
                                onChange={(e) => setSearchBeneficiary(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto">
                            {filteredBeneficiaries.length > 0 ? (
                              filteredBeneficiaries.map((beneficiary) => (
                                <div
                                  key={beneficiary.id}
                                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                    selectedBeneficiary === beneficiary.id ? "bg-blue-50" : ""
                                  }`}
                                  onClick={() => handleSelectBeneficiary(beneficiary.id)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{beneficiary.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {beneficiary.bank} • {beneficiary.country}
                                      </p>
                                    </div>
                                    {selectedBeneficiary === beneficiary.id && (
                                      <CheckIcon className="h-4 w-4 text-blue-600" />
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No matching beneficiaries found
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">IBAN</label>
                  <Input
                    className="mt-1.5"
                    placeholder="E.g., DE89370400440532013000"
                    value={recipientAccountNumber}
                    onChange={(e) => setRecipientAccountNumber(e.target.value.toUpperCase())}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the recipient's International Bank Account Number
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Amount (EUR)</label>
                  <div className="relative mt-1.5">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                    <Input
                      type="text"
                      className="pl-7"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "")
                        setTransferAmount(value)
                      }}
                    />
                  </div>

                  {selectedAccount && selectedAccount.currency !== "EUR" && transferAmount && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Exchange rate: 1 {selectedAccount.currency} ={" "}
                      {(
                        (1 / exchangeRates["EUR"]) *
                        exchangeRates[selectedAccount.currency as keyof typeof exchangeRates]
                      ).toFixed(4)}{" "}
                      EUR
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sepaUrgent"
                      checked={isSepaUrgent}
                      onCheckedChange={(checked) => {
                        setIsSepaUrgent(checked === true)
                      }}
                    />
                    <div className="flex items-center">
                      <Label htmlFor="sepaUrgent" className="mr-2">
                        SEPA Instant Transfer
                      </Label>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        +€5.00
                      </Badge>
                    </div>
                  </div>

                  {isSepaUrgent && (
                    <p className="text-xs text-muted-foreground pl-6">
                      SEPA Instant transfers are processed within seconds, 24/7/365.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Reason for Transfer</label>
                  <Select value={transferReason} onValueChange={setTransferReason}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Support</SelectItem>
                      <SelectItem value="goods">Payment for Goods</SelectItem>
                      <SelectItem value="services">Payment for Services</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="property">Property Purchase</SelectItem>
                      <SelectItem value="education">Education Fees</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeRemittance"
                      checked={includeRemittanceInfo}
                      onCheckedChange={(checked) => {
                        setIncludeRemittanceInfo(checked === true)
                      }}
                    />
                    <Label htmlFor="includeRemittance">Include remittance information</Label>
                  </div>

                  {includeRemittanceInfo && (
                    <div className="pl-6">
                      <Input
                        placeholder="E.g., Invoice #12345"
                        value={remittanceInfo}
                        onChange={(e) => setRemittanceInfo(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This information will be included with the transfer
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAsBeneficiary"
                    checked={saveAsBeneficiary}
                    onCheckedChange={(checked) => {
                      setSaveAsBeneficiary(checked === true)
                    }}
                  />
                  <Label htmlFor="saveAsBeneficiary">Save recipient as beneficiary</Label>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acknowledgeCharges"
                      checked={acknowledgeCharges}
                      onCheckedChange={(checked) => {
                        setAcknowledgeCharges(checked === true)
                      }}
                    />
                    <Label htmlFor="acknowledgeCharges">
                      I acknowledge the fee of {isSepaUrgent ? "€5.00" : "€0.50"} for this SEPA transfer
                    </Label>
                  </div>
                </div>

                {showError && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm">
            <p className="font-medium">Fees:</p>
            <p className="text-muted-foreground">
              {activeTab === "swift" ? "SWIFT: $25.00" : isSepaUrgent ? "SEPA Instant: €5.00" : "SEPA: €0.50"}
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={!acknowledgeCharges}>
            {activeTab === "swift" ? "Continue with SWIFT Transfer" : "Continue with SEPA Transfer"}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>Please review the details before proceeding</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <div className="font-medium">
                  {selectedAccount?.name} ({selectedAccount?.number})
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <div className="font-medium">{recipientName}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{activeTab === "swift" ? "Account/IBAN" : "IBAN"}</span>
                <div className="font-medium font-mono text-sm">{recipientAccountNumber}</div>
              </div>

              {activeTab === "swift" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">SWIFT/BIC</span>
                    <div className="font-medium font-mono text-sm">{recipientSwiftCode}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bank</span>
                    <div className="font-medium">
                      {recipientBank}, {recipientCountry}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Amount</span>
                <div>
                  <div className="font-medium text-right">
                    {transferCurrency === "EUR" ? "€" : transferCurrency === "GBP" ? "£" : "$"}
                    {Number(transferAmount).toFixed(2)} {transferCurrency}
                  </div>
                  {selectedAccount && selectedAccount.currency !== transferCurrency && (
                    <div className="text-sm text-muted-foreground">
                      Converted from{" "}
                      {formatCurrency(
                        (Number(transferAmount) *
                          exchangeRates[selectedAccount.currency as keyof typeof exchangeRates]) /
                          exchangeRates[transferCurrency as keyof typeof exchangeRates],
                        selectedAccount.currency,
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fee</span>
                <div className="font-medium">{activeTab === "swift" ? "$25.00" : isSepaUrgent ? "€5.00" : "€0.50"}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transfer Type</span>
                <Badge variant="outline" className="font-medium bg-blue-50 text-blue-700">
                  {activeTab === "swift" ? "SWIFT" : isSepaUrgent ? "SEPA Instant" : "SEPA"}
                </Badge>
              </div>

              <Alert className="mt-2 bg-amber-50 text-amber-800 border-amber-200">
                <ShieldIcon className="h-4 w-4" />
                <AlertDescription>This transaction requires two-factor authentication.</AlertDescription>
              </Alert>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConfirmation(false)
                setShowTwoFactorVerification(true)
              }}
            >
              Continue with 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two-factor verification dialog */}
      <TwoFactorVerification
        open={showTwoFactorVerification}
        onOpenChange={setShowTwoFactorVerification}
        onVerified={() => {
          handleConfirmTransfer()
        }}
      />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Initiated</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center mb-2">
              Your {activeTab === "swift" ? "SWIFT" : isSepaUrgent ? "SEPA Instant" : "SEPA"} transfer has been
              initiated successfully.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Reference: {activeTab === "swift" ? "SW" : "SP"}
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>

            <div className="w-full mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expected arrival</span>
                <span className="font-medium">
                  {activeTab === "swift"
                    ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
                    : isSepaUrgent
                      ? "Within minutes"
                      : new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

