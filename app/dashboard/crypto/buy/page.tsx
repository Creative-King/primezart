"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, RefreshCw, CreditCard, Wallet, AlertCircle, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import FloatingRadialMenu from "@/components/floating-radial-menu"

// Mock data for crypto prices
const cryptoPrices = {
  BTC: 68542.12,
  ETH: 3452.78,
  SOL: 143.25,
  ADA: 0.58,
  DOT: 7.85,
  LINK: 15.32,
  AVAX: 35.67,
}

export default function CryptoBuyPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cryptoAmount, setCryptoAmount] = useState(0)
  const [usdAmount, setUsdAmount] = useState("")
  const [inputType, setInputType] = useState("usd") // 'usd' or 'crypto'
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [pin, setPin] = useState("")
  const [showPinInput, setShowPinInput] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle amount input changes
  useEffect(() => {
    if (inputType === "usd" && usdAmount) {
      const cryptoValue = Number.parseFloat(usdAmount) / cryptoPrices[selectedCrypto]
      setCryptoAmount(cryptoValue)
    } else if (inputType === "crypto" && cryptoAmount) {
      const usdValue = cryptoAmount * cryptoPrices[selectedCrypto]
      setUsdAmount(usdValue.toFixed(2))
    }
  }, [usdAmount, cryptoAmount, selectedCrypto, inputType])

  // Handle crypto selection change
  useEffect(() => {
    if (inputType === "usd" && usdAmount) {
      const cryptoValue = Number.parseFloat(usdAmount) / cryptoPrices[selectedCrypto]
      setCryptoAmount(cryptoValue)
    } else if (inputType === "crypto" && cryptoAmount) {
      const usdValue = cryptoAmount * cryptoPrices[selectedCrypto]
      setUsdAmount(usdValue.toFixed(2))
    }
  }, [selectedCrypto])

  const handleUsdInputChange = (e) => {
    setInputType("usd")
    setUsdAmount(e.target.value)
    if (e.target.value) {
      const cryptoValue = Number.parseFloat(e.target.value) / cryptoPrices[selectedCrypto]
      setCryptoAmount(cryptoValue)
    } else {
      setCryptoAmount(0)
    }
  }

  const handleCryptoInputChange = (e) => {
    setInputType("crypto")
    setCryptoAmount(Number.parseFloat(e.target.value) || 0)
    if (e.target.value) {
      const usdValue = Number.parseFloat(e.target.value) * cryptoPrices[selectedCrypto]
      setUsdAmount(usdValue.toFixed(2))
    } else {
      setUsdAmount("")
    }
  }

  const handleBuy = () => {
    if (!usdAmount || Number.parseFloat(usdAmount) <= 0) {
      return
    }

    setShowPinInput(true)
  }

  const handleConfirmPin = () => {
    if (pin.length < 4) {
      return
    }

    setShowPinInput(false)
    setIsProcessing(true)

    // Simulate processing steps
    setProcessingStep(1)

    const timer1 = setTimeout(() => {
      setProcessingStep(2)
    }, 1500)

    const timer2 = setTimeout(() => {
      setProcessingStep(3)
    }, 3000)

    const timer3 = setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 4500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatCrypto = (value, symbol) => {
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: symbol === "BTC" ? 8 : 4,
      maximumFractionDigits: symbol === "BTC" ? 8 : 4,
    })} ${symbol}`
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      {/* Header */}
      <div className="border-b border-[#334155] bg-[#1e293b]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/crypto")}
              className="mr-2 text-gray-400 hover:text-white hover:bg-[#334155]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Buy Crypto</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 pb-24">
        {isSuccess ? (
          <Card className="bg-[#1e293b] border-[#334155] max-w-md mx-auto">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Purchase Successful!</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Your crypto purchase has been completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#0f172a] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Amount Purchased</span>
                  <span className="font-medium">{formatCrypto(cryptoAmount, selectedCrypto)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Price</span>
                  <span className="font-medium">{formatCurrency(cryptoPrices[selectedCrypto])}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total Cost</span>
                  <span className="font-medium">{formatCurrency(Number.parseFloat(usdAmount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="font-medium">{paymentMethod === "card" ? "Credit Card" : "Bank Account"}</span>
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                <Info className="h-4 w-4 mr-2" />
                <AlertDescription>Your crypto will be available in your wallet within 5-10 minutes.</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5]"
                onClick={() => router.push("/dashboard/crypto")}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#334155] hover:bg-[#334155] text-white"
                onClick={() => {
                  setIsSuccess(false)
                  setUsdAmount("")
                  setCryptoAmount(0)
                  setSelectedCrypto("BTC")
                  setPaymentMethod("card")
                }}
              >
                Buy More
              </Button>
            </CardFooter>
          </Card>
        ) : isProcessing ? (
          <Card className="bg-[#1e293b] border-[#334155] max-w-md mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-center">Processing Your Purchase</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Please wait while we process your transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div className="flex justify-center">
                <RefreshCw className="h-12 w-12 text-[#6366f1] animate-spin" />
              </div>

              <Progress
                value={processingStep * 33.33}
                max={100}
                className="h-2 bg-[#334155]"
                indicatorClassName="bg-[#6366f1]"
              />

              <div className="space-y-2">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      processingStep >= 1 ? "bg-green-500" : "bg-[#334155]"
                    }`}
                  >
                    {processingStep >= 1 ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs text-gray-400">1</span>
                    )}
                  </div>
                  <span className={processingStep >= 1 ? "text-white" : "text-gray-400"}>
                    Verifying payment information
                  </span>
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      processingStep >= 2 ? "bg-green-500" : "bg-[#334155]"
                    }`}
                  >
                    {processingStep >= 2 ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs text-gray-400">2</span>
                    )}
                  </div>
                  <span className={processingStep >= 2 ? "text-white" : "text-gray-400"}>Processing payment</span>
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      processingStep >= 3 ? "bg-green-500" : "bg-[#334155]"
                    }`}
                  >
                    {processingStep >= 3 ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs text-gray-400">3</span>
                    )}
                  </div>
                  <span className={processingStep >= 3 ? "text-white" : "text-gray-400"}>Acquiring crypto assets</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : showPinInput ? (
          <Card className="bg-[#1e293b] border-[#334155] max-w-md mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Enter Your PIN</CardTitle>
              <CardDescription className="text-gray-400">
                Please enter your PIN to confirm this purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#0f172a] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-medium">{formatCrypto(cryptoAmount, selectedCrypto)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Cost</span>
                  <span className="font-medium">{formatCurrency(Number.parseFloat(usdAmount))}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="pin">Security PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                  className="bg-[#0f172a] border-[#334155] text-white mt-1"
                  placeholder="Enter your PIN"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-[#334155] hover:bg-[#334155] text-white"
                onClick={() => setShowPinInput(false)}
              >
                Cancel
              </Button>
              <Button className="bg-[#6366f1] hover:bg-[#4f46e5]" onClick={handleConfirmPin} disabled={pin.length < 4}>
                Confirm
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-[#1e293b] border-[#334155] max-w-md mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Buy Cryptocurrency</CardTitle>
              <CardDescription className="text-gray-400">
                Purchase crypto with your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="crypto">Select Cryptocurrency</Label>
                <Select defaultValue={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="bg-[#0f172a] border-[#334155] text-white">
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#334155] text-white">
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                    <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                    <SelectItem value="LINK">Chainlink (LINK)</SelectItem>
                    <SelectItem value="AVAX">Avalanche (AVAX)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Current Price: {formatCurrency(cryptoPrices[selectedCrypto])}</span>
                  <span className="text-green-500">24h: +2.34%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usdAmount">You Pay</Label>
                  <div className="relative mt-1">
                    <Input
                      id="usdAmount"
                      type="number"
                      value={usdAmount}
                      onChange={handleUsdInputChange}
                      className="bg-[#0f172a] border-[#334155] text-white pl-8"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cryptoAmount">You Receive</Label>
                  <div className="relative mt-1">
                    <Input
                      id="cryptoAmount"
                      type="number"
                      value={cryptoAmount || ""}
                      onChange={handleCryptoInputChange}
                      className="bg-[#0f172a] border-[#334155] text-white pr-16"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">{selectedCrypto}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Payment Method</Label>
                <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="mt-1">
                  <TabsList className="bg-[#0f172a] border border-[#334155] w-full">
                    <TabsTrigger value="card" className="flex-1 data-[state=active]:bg-[#334155]">
                      <CreditCard className="h-4 w-4 mr-2" /> Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="bank" className="flex-1 data-[state=active]:bg-[#334155]">
                      <Wallet className="h-4 w-4 mr-2" /> Bank Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="mt-2">
                    <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-md mr-3 flex items-center justify-center text-white font-bold">
                            V
                          </div>
                          <div>
                            <p className="text-sm font-medium">Visa ending in 4242</p>
                            <p className="text-xs text-gray-400">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#6366f1] hover:bg-[#334155]">
                          Change
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank" className="mt-2">
                    <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-md mr-3 flex items-center justify-center text-white font-bold">
                            B
                          </div>
                          <div>
                            <p className="text-sm font-medium">Bank of America</p>
                            <p className="text-xs text-gray-400">Checking ****6789</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#6366f1] hover:bg-[#334155]">
                          Change
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Cryptocurrency prices are volatile. Your final amount may vary slightly based on market fluctuations.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5]"
                onClick={handleBuy}
                disabled={!usdAmount || Number.parseFloat(usdAmount) <= 0}
              >
                Buy {selectedCrypto}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Floating Menu */}
      <FloatingRadialMenu type="crypto" />
    </div>
  )
}

