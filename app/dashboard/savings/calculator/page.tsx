"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calculator, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FloatingRadialMenu from "@/components/floating-radial-menu"

export default function SavingsCalculatorPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("goal")

  // Goal-based calculator state
  const [goalAmount, setGoalAmount] = useState(10000)
  const [timeframe, setTimeframe] = useState(36) // months
  const [interestRate, setInterestRate] = useState(3.25)
  const [initialDeposit, setInitialDeposit] = useState(1000)
  const [monthlyContribution, setMonthlyContribution] = useState(0)
  const [goalResults, setGoalResults] = useState({
    requiredMonthly: 0,
    totalContributions: 0,
    totalInterest: 0,
    finalBalance: 0,
  })

  // Regular savings calculator state
  const [regularInitialDeposit, setRegularInitialDeposit] = useState(1000)
  const [regularMonthly, setRegularMonthly] = useState(200)
  const [regularTimeframe, setRegularTimeframe] = useState(60) // months
  const [regularInterestRate, setRegularInterestRate] = useState(3.25)
  const [regularResults, setRegularResults] = useState({
    finalBalance: 0,
    totalContributions: 0,
    totalInterest: 0,
  })

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Calculate initial results
    calculateGoalBasedSavings()
    calculateRegularSavings()
  }, [router])

  // Calculate required monthly contribution to reach goal
  const calculateGoalBasedSavings = () => {
    const monthlyRate = interestRate / 100 / 12
    const numPayments = timeframe

    // Calculate future value of initial deposit
    const futureValueInitial = initialDeposit * Math.pow(1 + monthlyRate, numPayments)

    // Calculate required monthly contribution
    let requiredMonthly = 0
    if (monthlyRate > 0) {
      requiredMonthly = (goalAmount - futureValueInitial) / ((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate)
    } else {
      requiredMonthly = (goalAmount - initialDeposit) / numPayments
    }

    // Ensure monthly contribution is not negative
    requiredMonthly = Math.max(0, requiredMonthly)

    // Calculate total contributions and interest
    const totalContributions = initialDeposit + requiredMonthly * numPayments
    const totalInterest = goalAmount - totalContributions

    setMonthlyContribution(requiredMonthly)
    setGoalResults({
      requiredMonthly,
      totalContributions,
      totalInterest,
      finalBalance: goalAmount,
    })
  }

  // Calculate future value of regular savings
  const calculateRegularSavings = () => {
    const monthlyRate = regularInterestRate / 100 / 12
    const numPayments = regularTimeframe

    // Calculate future value of initial deposit
    const futureValueInitial = regularInitialDeposit * Math.pow(1 + monthlyRate, numPayments)

    // Calculate future value of monthly contributions
    let futureValueMonthly = 0
    if (monthlyRate > 0) {
      futureValueMonthly = regularMonthly * ((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate)
    } else {
      futureValueMonthly = regularMonthly * numPayments
    }

    const finalBalance = futureValueInitial + futureValueMonthly
    const totalContributions = regularInitialDeposit + regularMonthly * numPayments
    const totalInterest = finalBalance - totalContributions

    setRegularResults({
      finalBalance,
      totalContributions,
      totalInterest,
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/savings")} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Savings Calculator</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 pb-24">
        <Tabs defaultValue="goal" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="goal">Goal Calculator</TabsTrigger>
            <TabsTrigger value="regular">Regular Savings</TabsTrigger>
          </TabsList>

          <TabsContent value="goal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Goal-Based Savings Calculator</CardTitle>
                <CardDescription>Calculate how much you need to save monthly to reach your goal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goalAmount">Goal Amount</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="goalAmount"
                          type="number"
                          value={goalAmount}
                          onChange={(e) => setGoalAmount(Number.parseFloat(e.target.value) || 0)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timeframe">Time to Reach Goal (months)</Label>
                      <div className="mt-1">
                        <Input
                          id="timeframe"
                          type="number"
                          value={timeframe}
                          onChange={(e) => setTimeframe(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <Slider
                        value={[timeframe]}
                        min={1}
                        max={120}
                        step={1}
                        onValueChange={(value) => setTimeframe(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 month</span>
                        <span>5 years</span>
                        <span>10 years</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <div className="mt-1">
                        <Input
                          id="interestRate"
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number.parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="initialDeposit">Initial Deposit</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="initialDeposit"
                          type="number"
                          value={initialDeposit}
                          onChange={(e) => setInitialDeposit(Number.parseFloat(e.target.value) || 0)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateGoalBasedSavings} className="w-full bg-green-600 hover:bg-green-700">
                      <Calculator className="mr-2 h-4 w-4" /> Calculate
                    </Button>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-bold text-green-800 mb-4">Results</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-green-700">Required Monthly Contribution</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(goalResults.requiredMonthly)}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-green-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-green-700">Total Contributions</p>
                            <p className="text-lg font-medium">{formatCurrency(goalResults.totalContributions)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700">Total Interest</p>
                            <p className="text-lg font-medium">{formatCurrency(goalResults.totalInterest)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-green-200">
                        <p className="text-sm text-green-700">Final Balance</p>
                        <p className="text-xl font-bold">{formatCurrency(goalResults.finalBalance)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regular" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Regular Savings Calculator</CardTitle>
                <CardDescription>Calculate how much your savings will grow over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="regularInitialDeposit">Initial Deposit</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="regularInitialDeposit"
                          type="number"
                          value={regularInitialDeposit}
                          onChange={(e) => setRegularInitialDeposit(Number.parseFloat(e.target.value) || 0)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="regularMonthly">Monthly Contribution</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="regularMonthly"
                          type="number"
                          value={regularMonthly}
                          onChange={(e) => setRegularMonthly(Number.parseFloat(e.target.value) || 0)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="regularTimeframe">Time Period (months)</Label>
                      <div className="mt-1">
                        <Input
                          id="regularTimeframe"
                          type="number"
                          value={regularTimeframe}
                          onChange={(e) => setRegularTimeframe(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <Slider
                        value={[regularTimeframe]}
                        min={1}
                        max={120}
                        step={1}
                        onValueChange={(value) => setRegularTimeframe(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 month</span>
                        <span>5 years</span>
                        <span>10 years</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="regularInterestRate">Interest Rate (%)</Label>
                      <div className="mt-1">
                        <Input
                          id="regularInterestRate"
                          type="number"
                          value={regularInterestRate}
                          onChange={(e) => setRegularInterestRate(Number.parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateRegularSavings} className="w-full bg-green-600 hover:bg-green-700">
                      <Calculator className="mr-2 h-4 w-4" /> Calculate
                    </Button>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-bold text-green-800 mb-4">Results</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-green-700">Final Balance</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(regularResults.finalBalance)}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-green-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-green-700">Total Contributions</p>
                            <p className="text-lg font-medium">{formatCurrency(regularResults.totalContributions)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700">Total Interest</p>
                            <p className="text-lg font-medium">{formatCurrency(regularResults.totalInterest)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-green-200">
                        <p className="text-sm text-green-700">Growth Breakdown</p>
                        <div className="h-4 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{
                              width: `${(regularResults.totalContributions / regularResults.finalBalance) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>
                            Contributions:{" "}
                            {((regularResults.totalContributions / regularResults.finalBalance) * 100).toFixed(1)}%
                          </span>
                          <span>
                            Interest: {((regularResults.totalInterest / regularResults.finalBalance) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Menu */}
      <FloatingRadialMenu type="savings" />
    </div>
  )
}

