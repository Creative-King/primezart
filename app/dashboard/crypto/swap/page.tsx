"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowDown, RefreshCw, CheckCircle2, Info, AlertTriangle, Loader2, BarChart3 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Mock crypto assets data
const cryptoAssets = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", balance: 0.5432, usdValue: 32592.0, icon: "₿" },
  { id: "eth", name: "Ethereum", symbol: "ETH", balance: 4.2156, usdValue: 8431.2, icon: "Ξ" },
  { id: "usdt", name: "Tether", symbol: "USDT", balance: 5000.0, usdValue: 5000.0, icon: "₮" },
  { id: "usdc", name: "USD Coin", symbol: "USDC", balance: 3500.0, usdValue: 3500.0, icon: "₵" },
  { id: "bnb", name: "Binance Coin", symbol: "BNB", balance: 12.345, usdValue: 3703.5, icon: "BNB" },
  { id: "sol", name: "Solana", symbol: "SOL", balance: 45.678, usdValue: 4111.02, icon: "◎" },
  { id: "ada", name: "Cardano", symbol: "ADA", balance: 2500.0, usdValue: 1250.0, icon: "₳" },
  { id: "xrp", name: "XRP", symbol: "XRP", balance: 10000.0, usdValue: 5000.0, icon: "✕" },
]

// Mock exchange rates between crypto assets
const exchangeRates: Record<string, Record<string, number>> = {
  btc: {
    eth: 15.5,
    usdt: 60000,
    usdc: 60000,
    bnb: 150,
    sol: 600,
    ada: 25000,
    xrp: 120000,
  },
  eth: {
    btc: 0.0645,
    usdt: 3800,
    usdc: 3800,
    bnb: 9.5,
    sol: 38,
    ada: 1600,
    xrp: 7600,
  },
  usdt: {
    btc: 0.0000166,
    eth: 0.000263,
    usdc: 1,
    bnb: 0.0025,
    sol: 0.01,
    ada: 0.42,
    xrp: 2,
  },
  usdc: {
    btc: 0.0000166,
    eth: 0.000263,
    usdt: 1,
    bnb: 0.0025,
    sol: 0.01,
    ada: 0.42,
    xrp: 2,
  },
  bnb: {
    btc: 0.00667,
    eth: 0.105,
    usdt: 400,
    usdc: 400,
    sol: 4,
    ada: 168,
    xrp: 800,
  },
  sol: {
    btc: 0.00167,
    eth: 0.0263,
    usdt: 100,
    usdc: 100,
    bnb: 0.25,
    ada: 42,
    xrp: 200,
  },
  ada: {
    btc: 0.00004,
    eth: 0.000625,
    usdt: 2.38,
    usdc: 2.38,
    bnb: 0.00595,
    sol: 0.0238,
    xrp: 4.76,
  },
  xrp: {
    btc: 0.00000833,
    eth: 0.000132,
    usdt: 0.5,
    usdc: 0.5,
    bnb: 0.00125,
    sol: 0.005,
    ada: 0.21,
  },
}

// Form schema for crypto swap
const cryptoSwapSchema = z.object({
  fromAsset: z.string().min(1, "Please select an asset"),
  toAsset: z.string().min(1, "Please select an asset"),
  fromAmount: z.string().refine((val) => {
    const num = Number.parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Please enter a valid amount"),
  slippage: z.string().default("0.5"),
})

export default function CryptoSwap() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFromAsset, setSelectedFromAsset] = useState<(typeof cryptoAssets)[0] | null>(null)
  const [selectedToAsset, setSelectedToAsset] = useState<(typeof cryptoAssets)[0] | null>(null)
  const [toAmount, setToAmount] = useState<string>("")
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [showChart, setShowChart] = useState(false)
  const [priceImpact, setPriceImpact] = useState<number>(0)
  const [swapFee, setSwapFee] = useState<number>(0)

  // Crypto swap form
  const form = useForm<z.infer<typeof cryptoSwapSchema>>({
    resolver: zodResolver(cryptoSwapSchema),
    defaultValues: {
      fromAsset: "",
      toAsset: "",
      fromAmount: "",
      slippage: "0.5",
    },
  })

  // Watch for asset and amount changes
  const watchFromAsset = form.watch("fromAsset")
  const watchToAsset = form.watch("toAsset")
  const watchFromAmount = form.watch("fromAmount")
  const watchSlippage = form.watch("slippage")

  // Update selected assets when they change
  useEffect(() => {
    const fromAsset = cryptoAssets.find((a) => a.id === watchFromAsset)
    if (fromAsset) {
      setSelectedFromAsset(fromAsset)
    }

    const toAsset = cryptoAssets.find((a) => a.id === watchToAsset)
    if (toAsset) {
      setSelectedToAsset(toAsset)
    }

    // Update exchange rate if both assets are selected
    if (watchFromAsset && watchToAsset) {
      const rate = exchangeRates[watchFromAsset]?.[watchToAsset]
      setExchangeRate(rate || null)

      // Calculate price impact (simulated)
      const amount = Number.parseFloat(watchFromAmount || "0")
      if (amount > 0) {
        // Simulate higher price impact for larger amounts
        const impact = Math.min((amount / (fromAsset?.balance || 100)) * 2, 5)
        setPriceImpact(impact)

        // Calculate swap fee (0.3% of transaction)
        const fee = (amount * 0.003 * (fromAsset?.usdValue || 0)) / (fromAsset?.balance || 1)
        setSwapFee(fee)
      } else {
        setPriceImpact(0)
        setSwapFee(0)
      }
    }
  }, [watchFromAsset, watchToAsset, watchFromAmount])

  // Update to amount when from amount or exchange rate changes
  useEffect(() => {
    if (exchangeRate && watchFromAmount) {
      const amount = Number.parseFloat(watchFromAmount)
      if (!isNaN(amount) && amount > 0) {
        const calculatedAmount = amount * exchangeRate
        setToAmount(calculatedAmount.toFixed(8))
      } else {
        setToAmount("")
      }
    } else {
      setToAmount("")
    }
  }, [watchFromAmount, exchangeRate])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format crypto amount
  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${symbol}`
  }

  // Swap from and to assets
  const handleSwapAssets = () => {
    const fromAsset = form.getValues("fromAsset")
    const toAsset = form.getValues("toAsset")
    const fromAmount = form.getValues("fromAmount")

    if (fromAsset && toAsset) {
      form.setValue("fromAsset", toAsset)
      form.setValue("toAsset", fromAsset)

      // If we have an exchange rate, calculate the new from amount
      if (exchangeRate && fromAmount) {
        const amount = Number.parseFloat(fromAmount)
        if (!isNaN(amount) && amount > 0) {
          const calculatedAmount = Number.parseFloat(toAmount)
          form.setValue("fromAmount", calculatedAmount.toString())
        }
      }
    }
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof cryptoSwapSchema>) => {
    console.log("Crypto swap values:", values)

    // Check if user has enough balance
    if (selectedFromAsset) {
      const amount = Number.parseFloat(values.fromAmount)
      if (amount > selectedFromAsset.balance) {
        toast({
          title: "Insufficient Balance",
          description: `You don't have enough ${selectedFromAsset.symbol} to complete this swap.`,
          variant: "destructive",
        })
        return
      }
    }

    setIsConfirming(true)
  }

  // Handle confirmation
  const handleConfirm = () => {
    setIsConfirming(false)
    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      setIsSubmitted(true)

      // Show toast notification
      toast({
        title: "Swap Completed",
        description: "Your crypto swap has been completed successfully.",
        variant: "default",
      })
    }, 3000)
  }

  // Mock chart data for price history
  const priceHistoryData = {
    labels: ["7d", "6d", "5d", "4d", "3d", "2d", "1d", "Now"],
    datasets: [
      {
        label: `${selectedFromAsset?.symbol || "BTC"}/${selectedToAsset?.symbol || "ETH"} Rate`,
        data: [
          exchangeRate ? exchangeRate * 0.92 : 15,
          exchangeRate ? exchangeRate * 0.95 : 15.2,
          exchangeRate ? exchangeRate * 0.97 : 15.3,
          exchangeRate ? exchangeRate * 0.99 : 15.4,
          exchangeRate ? exchangeRate * 0.98 : 15.3,
          exchangeRate ? exchangeRate * 1.01 : 15.6,
          exchangeRate ? exchangeRate * 0.99 : 15.4,
          exchangeRate || 15.5,
        ],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-indigo-50 min-h-screen pb-10">
        <div className="container mx-auto pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/crypto")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Crypto Dashboard
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-[#003366] mb-2">Swap Completed!</h2>
              <p className="text-gray-700 mb-6">Your crypto swap has been completed successfully.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Swapped:</span>
                  <span className="font-medium">
                    {watchFromAmount} {selectedFromAsset?.symbol}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Received:</span>
                  <span className="font-medium">
                    {toAmount} {selectedToAsset?.symbol}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Exchange Rate:</span>
                  <span className="font-medium">
                    1 {selectedFromAsset?.symbol} = {exchangeRate?.toFixed(8)} {selectedToAsset?.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium truncate max-w-[200px]">0x7f2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.push("/dashboard/crypto")}
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

  if (isProcessing) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-indigo-50 min-h-screen pb-10">
        <div className="container mx-auto pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/crypto")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Crypto Dashboard
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Loader2 className="mx-auto h-16 w-16 text-indigo-500 mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-[#003366] mb-2">Processing Swap</h2>
              <p className="text-gray-700 mb-6">Your swap is being processed. Please do not close this window.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 animate-progress"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-indigo-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/crypto")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Crypto Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#003366] flex items-center">
            <RefreshCw className="mr-2 h-6 w-6" />
            Swap Crypto
          </h1>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Swap one cryptocurrency for another directly in your wallet. No need to use an exchange.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>Swap Cryptocurrency</CardTitle>
                <CardDescription>Exchange one crypto asset for another</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fromAsset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Prevent selecting the same asset for both from and to
                              if (value === watchToAsset) {
                                form.setValue("toAsset", "")
                              }
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select asset to swap from" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cryptoAssets.map((asset) => (
                                <SelectItem key={asset.id} value={asset.id} disabled={asset.id === watchToAsset}>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-lg">{asset.icon}</span>
                                    <span>
                                      {asset.name} ({asset.symbol}) - {formatCrypto(asset.balance, asset.symbol)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedFromAsset && (
                            <FormDescription>
                              Available balance: {formatCrypto(selectedFromAsset.balance, selectedFromAsset.symbol)}(
                              {formatCurrency(selectedFromAsset.usdValue)})
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fromAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input placeholder="0.00" {...field} className="flex-1" />
                            </FormControl>
                            {selectedFromAsset && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  form.setValue("fromAmount", selectedFromAsset.balance.toString())
                                }}
                                className="whitespace-nowrap"
                              >
                                Max
                              </Button>
                            )}
                          </div>
                          {selectedFromAsset && watchFromAmount && !isNaN(Number(watchFromAmount)) && (
                            <FormDescription>
                              ≈{" "}
                              {formatCurrency(
                                (Number.parseFloat(watchFromAmount) * selectedFromAsset.usdValue) /
                                  selectedFromAsset.balance,
                              )}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="relative flex justify-center my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="relative z-10 rounded-full bg-white p-2"
                        onClick={handleSwapAssets}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="toAsset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Prevent selecting the same asset for both from and to
                              if (value === watchFromAsset) {
                                form.setValue("fromAsset", "")
                              }
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select asset to receive" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cryptoAssets.map((asset) => (
                                <SelectItem key={asset.id} value={asset.id} disabled={asset.id === watchFromAsset}>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-lg">{asset.icon}</span>
                                    <span>
                                      {asset.name} ({asset.symbol})
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

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">You'll receive:</span>
                        <span className="font-medium">
                          {toAmount ? `${toAmount} ${selectedToAsset?.symbol || ""}` : "-"}
                        </span>
                      </div>
                      {exchangeRate && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Exchange rate:</span>
                          <span className="font-medium flex items-center">
                            1 {selectedFromAsset?.symbol} = {exchangeRate.toFixed(8)} {selectedToAsset?.symbol}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-6 w-6 p-0"
                              onClick={() => setShowChart(!showChart)}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price impact:</span>
                        <span className={`font-medium ${priceImpact > 3 ? "text-amber-600" : "text-gray-900"}`}>
                          {priceImpact.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Swap fee:</span>
                        <span className="font-medium">{formatCurrency(swapFee)}</span>
                      </div>
                    </div>

                    {showChart && exchangeRate && (
                      <div className="p-4 bg-white border rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Price History (7 Days)</h3>
                        <div className="h-[200px]">
                          <Line
                            data={priceHistoryData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: false,
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="slippage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slippage Tolerance</FormLabel>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant={watchSlippage === "0.1" ? "default" : "outline"}
                              className={watchSlippage === "0.1" ? "bg-indigo-600 text-white" : ""}
                              onClick={() => form.setValue("slippage", "0.1")}
                            >
                              0.1%
                            </Button>
                            <Button
                              type="button"
                              variant={watchSlippage === "0.5" ? "default" : "outline"}
                              className={watchSlippage === "0.5" ? "bg-indigo-600 text-white" : ""}
                              onClick={() => form.setValue("slippage", "0.5")}
                            >
                              0.5%
                            </Button>
                            <Button
                              type="button"
                              variant={watchSlippage === "1.0" ? "default" : "outline"}
                              className={watchSlippage === "1.0" ? "bg-indigo-600 text-white" : ""}
                              onClick={() => form.setValue("slippage", "1.0")}
                            >
                              1.0%
                            </Button>
                            <Input
                              placeholder="Custom"
                              value={
                                watchSlippage !== "0.1" && watchSlippage !== "0.5" && watchSlippage !== "1.0"
                                  ? watchSlippage
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value
                                if (
                                  value === "" ||
                                  (!isNaN(Number(value)) && Number(value) > 0 && Number(value) <= 50)
                                ) {
                                  form.setValue("slippage", value)
                                }
                              }}
                              className="w-24"
                            />
                            <span className="flex items-center">%</span>
                          </div>
                          <FormDescription>
                            Your transaction will revert if the price changes unfavorably by more than this percentage.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Information box */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                      <p className="font-medium mb-1 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Swap Information
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Swaps are executed directly in your wallet</li>
                        <li>Exchange rates are based on current market prices</li>
                        <li>A small fee is charged for each swap</li>
                        <li>Higher slippage tolerance may result in a less favorable exchange rate</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => router.push("/dashboard/crypto")}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={!watchFromAsset || !watchToAsset || !watchFromAmount || !exchangeRate}
                      >
                        Review Swap
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>Popular Pairs</CardTitle>
                <CardDescription>Common trading pairs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => {
                      form.setValue("fromAsset", "btc")
                      form.setValue("toAsset", "eth")
                      updateSelectedAsset("btc")
                    }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">₿</span>
                      BTC
                    </span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">Ξ</span>
                      ETH
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => {
                      form.setValue("fromAsset", "eth")
                      form.setValue("toAsset", "usdt")
                      updateSelectedAsset("eth")
                    }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">Ξ</span>
                      ETH
                    </span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">₮</span>
                      USDT
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => {
                      form.setValue("fromAsset", "usdc")
                      form.setValue("toAsset", "btc")
                      updateSelectedAsset("usdc")
                    }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">₵</span>
                      USDC
                    </span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">₿</span>
                      BTC
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => {
                      form.setValue("fromAsset", "sol")
                      form.setValue("toAsset", "usdt")
                      updateSelectedAsset("sol")
                    }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">◎</span>
                      SOL
                    </span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">₮</span>
                      USDT
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => {
                      form.setValue("fromAsset", "bnb")
                      form.setValue("toAsset", "eth")
                      updateSelectedAsset("bnb")
                    }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">BNB</span>
                      BNB
                    </span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">Ξ</span>
                      ETH
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>24h price changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">₿</span>
                      <span>Bitcoin</span>
                    </div>
                    <span className="text-green-600">+2.34%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">Ξ</span>
                      <span>Ethereum</span>
                    </div>
                    <span className="text-green-600">+3.56%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">₮</span>
                      <span>Tether</span>
                    </div>
                    <span className="text-gray-600">+0.01%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">BNB</span>
                      <span>Binance Coin</span>
                    </div>
                    <span className="text-red-600">-1.23%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">◎</span>
                      <span>Solana</span>
                    </div>
                    <span className="text-green-600">+5.67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
            <DialogDescription>Please review your swap details before confirming</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">
                  {watchFromAmount} {selectedFromAsset?.symbol}
                  {selectedFromAsset && watchFromAmount && (
                    <span className="text-gray-500 text-sm ml-1">
                      (≈
                      {formatCurrency(
                        (Number.parseFloat(watchFromAmount) * selectedFromAsset.usdValue) / selectedFromAsset.balance,
                      )}
                      )
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">
                  {toAmount} {selectedToAsset?.symbol}
                  {selectedToAsset && toAmount && (
                    <span className="text-gray-500 text-sm ml-1">
                      (≈
                      {formatCurrency(
                        (Number.parseFloat(toAmount) * selectedToAsset.usdValue) / selectedToAsset.balance,
                      )}
                      )
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Exchange Rate:</span>
                <span className="font-medium">
                  1 {selectedFromAsset?.symbol} = {exchangeRate?.toFixed(8)} {selectedToAsset?.symbol}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price Impact:</span>
                <span className={`font-medium ${priceImpact > 3 ? "text-amber-600" : "text-gray-900"}`}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Swap Fee:</span>
                <span className="font-medium">{formatCurrency(swapFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slippage Tolerance:</span>
                <span className="font-medium">{watchSlippage}%</span>
              </div>
            </div>

            {priceImpact > 3 && (
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: This swap has a high price impact. You may receive significantly less than expected.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirming(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-indigo-600 hover:bg-indigo-700">
              Confirm Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
