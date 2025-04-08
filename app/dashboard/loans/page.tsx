"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign, Home, Car, Briefcase, GraduationCap, Calculator, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function LoansPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("explore")
  const [loanAmount, setLoanAmount] = useState(50000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(5.99)
  const [calculatedPayment, setCalculatedPayment] = useState(966.28)

  // Mock loan data
  const activeLoans = [
    {
      id: "loan1",
      type: "Mortgage",
      amount: 320000,
      remaining: 295000,
      rate: 4.25,
      payment: 1574.35,
      nextPayment: "2023-10-15",
      progress: 8,
    },
    {
      id: "loan2",
      type: "Auto Loan",
      amount: 35000,
      remaining: 22450.75,
      rate: 3.99,
      payment: 648.33,
      nextPayment: "2023-10-05",
      progress: 36,
    },
  ]

  // Loan types
  const loanTypes = [
    {
      id: "mortgage",
      name: "Mortgage",
      description: "Finance your dream home",
      icon: <Home className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
      minAmount: 100000,
      maxAmount: 1000000,
      rates: "3.99% - 5.49%",
      terms: "15 - 30 years",
    },
    {
      id: "auto",
      name: "Auto Loan",
      description: "Finance your next vehicle",
      icon: <Car className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
      minAmount: 5000,
      maxAmount: 100000,
      rates: "3.49% - 6.99%",
      terms: "2 - 7 years",
    },
    {
      id: "personal",
      name: "Personal Loan",
      description: "For your personal needs",
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-100",
      minAmount: 1000,
      maxAmount: 50000,
      rates: "5.99% - 15.99%",
      terms: "1 - 7 years",
    },
    {
      id: "business",
      name: "Business Loan",
      description: "Grow your business",
      icon: <Briefcase className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-100",
      minAmount: 10000,
      maxAmount: 500000,
      rates: "4.99% - 12.99%",
      terms: "1 - 10 years",
    },
    {
      id: "education",
      name: "Education Loan",
      description: "Invest in your education",
      icon: <GraduationCap className="h-5 w-5 text-indigo-600" />,
      color: "bg-indigo-100",
      minAmount: 5000,
      maxAmount: 100000,
      rates: "3.99% - 7.99%",
      terms: "5 - 15 years",
    },
  ]

  const calculatePayment = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12
    // Calculate monthly payment using the loan formula
    const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm))
    setCalculatedPayment(Number.parseFloat(payment.toFixed(2)))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1f36]">Loans & Financing</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explore">Explore Loans</TabsTrigger>
            <TabsTrigger value="active">Active Loans</TabsTrigger>
            <TabsTrigger value="calculator">Loan Calculator</TabsTrigger>
          </TabsList>

          {/* Explore Loans */}
          <TabsContent value="explore">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Loan Options</CardTitle>
                  <CardDescription>Explore our competitive loan products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loanTypes.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <div className={`p-4 ${loan.color} rounded-full h-16 w-16 flex items-center justify-center`}>
                        {loan.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{loan.name}</h3>
                        <p className="text-gray-600 mb-2">{loan.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Amount Range</p>
                            <p className="font-medium">
                              {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Interest Rates</p>
                            <p className="font-medium">{loan.rates}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Terms</p>
                            <p className="font-medium">{loan.terms}</p>
                          </div>
                          <div className="flex items-end">
                            <Button className="w-full md:w-auto">Apply Now</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Offers</CardTitle>
                  <CardDescription>Limited-time loan promotions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="bg-indigo-600 mb-2">Limited Time</Badge>
                        <h3 className="text-lg font-semibold">First-Time Homebuyer Special</h3>
                        <p className="text-gray-600">Reduced rates and closing costs for first-time homebuyers</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">3.75% APR</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Offer ends December 31, 2023</p>
                      <Button size="sm">Learn More</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="bg-purple-600 mb-2">New</Badge>
                        <h3 className="text-lg font-semibold">Small Business Growth Loan</h3>
                        <p className="text-gray-600">No payments for the first 3 months</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">4.99% APR</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">For qualified business owners</p>
                      <Button size="sm">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Loans */}
          <TabsContent value="active">
            {activeLoans.length > 0 ? (
              <div className="grid gap-6">
                {activeLoans.map((loan) => (
                  <Card key={loan.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>{loan.type}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <CardDescription>Account #{loan.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Original Amount</p>
                          <p className="font-semibold text-lg">{formatCurrency(loan.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Remaining Balance</p>
                          <p className="font-semibold text-lg">{formatCurrency(loan.remaining)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="font-semibold text-lg">{loan.rate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Monthly Payment</p>
                          <p className="font-semibold text-lg">{formatCurrency(loan.payment)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">Loan Progress</p>
                          <p className="text-sm font-medium">{loan.progress}% Paid</p>
                        </div>
                        <Progress value={loan.progress} className="h-2" />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Next Payment Due</p>
                          <p className="text-lg font-semibold">{formatDate(loan.nextPayment)}</p>
                        </div>
                        <Button>Make Payment</Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button variant="outline">Payment History</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Info className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Loans</h3>
                  <p className="text-gray-500 text-center mb-6">You don't have any active loans at the moment.</p>
                  <Button onClick={() => setActiveTab("explore")}>Explore Loan Options</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Loan Calculator */}
          <TabsContent value="calculator">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Loan Calculator
                  </CardTitle>
                  <CardDescription>Estimate your monthly payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                    </div>
                    <Slider
                      id="loanAmount"
                      min={1000}
                      max={500000}
                      step={1000}
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatCurrency(1000)}</span>
                      <span>{formatCurrency(500000)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="loanTerm">Loan Term (months)</Label>
                      <span className="text-sm font-medium">
                        {loanTerm} months ({Math.floor(loanTerm / 12)} years)
                      </span>
                    </div>
                    <Slider
                      id="loanTerm"
                      min={12}
                      max={360}
                      step={12}
                      value={[loanTerm]}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 year</span>
                      <span>30 years</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <span className="text-sm font-medium">{interestRate}%</span>
                    </div>
                    <Slider
                      id="interestRate"
                      min={1}
                      max={20}
                      step={0.01}
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  <Button onClick={calculatePayment} className="w-full">
                    Calculate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Based on your inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-lg text-center">
                    <p className="text-sm text-indigo-600 mb-1">Estimated Monthly Payment</p>
                    <p className="text-4xl font-bold text-indigo-700">{formatCurrency(calculatedPayment)}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Loan Amount</p>
                      <p className="font-medium">{formatCurrency(loanAmount)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Loan Term</p>
                      <p className="font-medium">
                        {loanTerm} months ({Math.floor(loanTerm / 12)} years)
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-medium">{interestRate}%</p>
                    </div>
                    <div className="flex justify-between border-t pt-4">
                      <p className="text-gray-500">Total Interest</p>
                      <p className="font-medium">{formatCurrency(calculatedPayment * loanTerm - loanAmount)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Total Payment</p>
                      <p className="font-medium">{formatCurrency(calculatedPayment * loanTerm)}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" className="mr-2">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      <Info className="h-4 w-4 mr-2" />
                      Talk to an Advisor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

