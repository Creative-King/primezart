"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, CreditCard, DollarSign, Globe, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OpenAccountPage() {
  const router = useRouter()
  const [accountType, setAccountType] = useState("savings")
  const [currency, setCurrency] = useState("USD")
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit form
      router.push("/dashboard?success=account-opened")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-[#003366]">Open New Account</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-[#003366] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : 1}
                </div>
                <span className="text-sm mt-2">Account Type</span>
              </div>

              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div
                  className={`h-full ${step >= 2 ? "bg-[#003366]" : "bg-gray-200"}`}
                  style={{ width: step >= 2 ? "100%" : "0%" }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-[#003366] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 2 ? <Check className="h-5 w-5" /> : 2}
                </div>
                <span className="text-sm mt-2">Details</span>
              </div>

              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div
                  className={`h-full ${step >= 3 ? "bg-[#003366]" : "bg-gray-200"}`}
                  style={{ width: step >= 3 ? "100%" : "0%" }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-[#003366] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 3 ? <Check className="h-5 w-5" /> : 3}
                </div>
                <span className="text-sm mt-2">Confirm</span>
              </div>
            </div>
          </div>

          {/* Step 1: Account Type */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#003366] mb-6">Select Account Type</h2>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal">Personal Account</TabsTrigger>
                  <TabsTrigger value="business">Business Account</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className={`cursor-pointer border-2 transition-all ${
                        accountType === "savings" ? "border-[#003366]" : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setAccountType("savings")}
                    >
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">Savings Account</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> 2.5% Annual Interest
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> No Monthly Fees
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Online Banking
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer border-2 transition-all ${
                        accountType === "current" ? "border-[#003366]" : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setAccountType("current")}
                    >
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Current Account</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Overdraft Protection
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Free Debit Card
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Unlimited Transactions
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer border-2 transition-all ${
                        accountType === "dom" ? "border-[#003366]" : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setAccountType("dom")}
                    >
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                          <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Domiciliary Account</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Multi-Currency Support
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> International Transfers
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Competitive Exchange Rates
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="business">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className={`cursor-pointer border-2 transition-all ${
                        accountType === "business-current"
                          ? "border-[#003366]"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setAccountType("business-current")}
                    >
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Business Current</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Business Debit Cards
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Payroll Services
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Business Online Banking
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer border-2 transition-all ${
                        accountType === "business-savings"
                          ? "border-[#003366]"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setAccountType("business-savings")}
                    >
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">Business Savings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> 3.0% Annual Interest
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Tiered Interest Rates
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Liquidity Management
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer border-2 transition-all ${
                        accountType === "business-dom" ? "border-[#003366]" : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setAccountType("business-dom")}
                    >
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                          <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Business Domiciliary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> International Business
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Trade Finance
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" /> Foreign Exchange Services
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} className="bg-[#003366]">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#003366] mb-6">Account Details</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input id="account-name" placeholder="Enter account name" className="mt-1" />
                  </div>

                  {accountType.includes("dom") && (
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger id="currency" className="mt-1">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                          <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                          <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Initial Deposit</Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input type="text" placeholder="0.00" className="pl-7" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum deposit: $100 for Savings, $500 for Current, $1000 for Domiciliary
                  </p>
                </div>

                <div>
                  <Label>Source of Funds</Label>
                  <RadioGroup defaultValue="salary" className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salary" id="salary" />
                      <Label htmlFor="salary">Salary/Income</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="savings" id="savings" />
                      <Label htmlFor="savings">Existing Savings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="investment" id="investment" />
                      <Label htmlFor="investment">Investment Returns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Important Information</p>
                    <p className="mt-1">
                      By opening this account, you agree to our terms and conditions. Your account will be activated
                      within 24 hours after verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-[#003366]">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#003366] mb-6">Confirm Your Application</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-4">Account Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Type:</span>
                      <span className="font-medium">
                        {accountType
                          .replace("-", " ")
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    </div>

                    {accountType.includes("dom") && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{currency}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Initial Deposit:</span>
                      <span className="font-medium">$1,000.00</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Source of Funds:</span>
                      <span className="font-medium">Salary/Income</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium">24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Benefits of Your New Account</p>
                      <ul className="mt-2 space-y-1 text-sm text-green-700">
                        {accountType.includes("savings") && (
                          <>
                            <li>• Competitive interest rates to grow your savings</li>
                            <li>• No monthly maintenance fees</li>
                            <li>• 24/7 online and mobile banking access</li>
                          </>
                        )}
                        {accountType.includes("current") && (
                          <>
                            <li>• Free debit card with contactless payment</li>
                            <li>• Unlimited transactions with no hidden fees</li>
                            <li>• Overdraft protection available</li>
                          </>
                        )}
                        {accountType.includes("dom") && (
                          <>
                            <li>• Hold and manage multiple currencies</li>
                            <li>• Competitive foreign exchange rates</li>
                            <li>• International wire transfers</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="terms" type="checkbox" className="h-4 w-4 text-[#003366] border-gray-300 rounded" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I confirm that the information provided is correct and I agree to the{" "}
                      <a href="#" className="text-[#003366] underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#003366] underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-[#003366]">
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
