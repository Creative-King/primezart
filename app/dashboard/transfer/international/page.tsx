"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function InternationalTransferPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fromAccount: "",
    accountNumber: "",
    amount: "",
    currency: "USD",
    description: "",
    accountName: "",
    swiftCode: "",
    bankName: "",
    bankAddress: "",
    recipientAddress: "",
    transferPurpose: "",
    otp: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transferComplete, setTransferComplete] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetOTP = () => {
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      setIsSubmitting(true)
      // Simulate transfer processing
      setTimeout(() => {
        setIsSubmitting(false)
        setTransferComplete(true)
      }, 2000)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      router.back()
    }
  }

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "SGD", name: "Singapore Dollar" },
  ]

  if (transferComplete) {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Card className="w-full">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-xl font-semibold">Transfer Complete</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">International Transfer Successful</h2>
            <p className="text-gray-600 text-center mb-4">
              Your transfer of {formData.amount} {formData.currency} to {formData.accountName} has been processed
              successfully.
            </p>
            <div className="w-full bg-gray-100 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium">INTL-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">2-3 business days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push("/dashboard/transfer")}>New Transfer</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="w-full">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl font-semibold">International Transfer</CardTitle>
          <CardDescription className="text-blue-100">
            {step === 1 ? "Enter recipient details" : "Confirm and authenticate"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            {step === 1 ? (
              <>
                <div className="mb-4">
                  <Label htmlFor="fromAccount">From Account</Label>
                  <Select
                    value={formData.fromAccount}
                    onValueChange={(value) => handleSelectChange("fromAccount", value)}
                  >
                    <SelectTrigger id="fromAccount">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account - $24,562.00</SelectItem>
                      <SelectItem value="savings">Savings Account - $128,750.00</SelectItem>
                      <SelectItem value="business">Business Account - $345,921.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      type="number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="accountName">Recipient Name</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="Enter recipient name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="accountNumber">Account Number / IBAN</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number or IBAN"
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            SWIFT/BIC code is an 8-11 character code that identifies your recipient's bank in
                            international transfers.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="swiftCode"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    placeholder="Enter SWIFT/BIC code"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea
                    id="bankAddress"
                    name="bankAddress"
                    value={formData.bankAddress}
                    onChange={handleChange}
                    placeholder="Enter bank address"
                    rows={2}
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="recipientAddress">Recipient Address</Label>
                  <Textarea
                    id="recipientAddress"
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    placeholder="Enter recipient address"
                    rows={2}
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="transferPurpose">Purpose of Transfer</Label>
                  <Select
                    value={formData.transferPurpose}
                    onValueChange={(value) => handleSelectChange("transferPurpose", value)}
                  >
                    <SelectTrigger id="transferPurpose">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Support</SelectItem>
                      <SelectItem value="business">Business Payment</SelectItem>
                      <SelectItem value="property">Property Purchase</SelectItem>
                      <SelectItem value="education">Education Fees</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    rows={2}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Transfer Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">
                        {formData.fromAccount === "checking"
                          ? "Checking Account"
                          : formData.fromAccount === "savings"
                            ? "Savings Account"
                            : "Business Account"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">{formData.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">{formData.accountNumber.replace(/(.{4})/g, "$1 ").trim()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-blue-600">
                        {formData.amount} {formData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium">{formData.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SWIFT/BIC:</span>
                      <span className="font-medium">{formData.swiftCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-medium">
                        {formData.transferPurpose === "family"
                          ? "Family Support"
                          : formData.transferPurpose === "business"
                            ? "Business Payment"
                            : formData.transferPurpose === "property"
                              ? "Property Purchase"
                              : formData.transferPurpose === "education"
                                ? "Education Fees"
                                : formData.transferPurpose === "investment"
                                  ? "Investment"
                                  : "Other"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-6">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">International Transfer Notice</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        International transfers typically take 2-3 business days to complete. Additional fees may be
                        charged by intermediary or recipient banks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="otp">One-Time Password (OTP)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter OTP"
                      className="flex-1"
                      required
                    />
                    <Button type="button" variant="outline" onClick={handleGetOTP} disabled={otpSent}>
                      {otpSent ? "Sent" : "Get OTP"}
                    </Button>
                  </div>
                  {otpSent && (
                    <p className="text-sm text-green-600 mt-1">OTP has been sent to your registered mobile number.</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Processing
                </span>
              ) : step === 1 ? (
                <span className="flex items-center">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              ) : (
                "Transfer"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
