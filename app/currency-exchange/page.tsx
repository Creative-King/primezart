"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, RefreshCw, TrendingUp, Globe, DollarSign } from "lucide-react"
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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Currency data with flags and codes
const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", symbol: "R" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺", symbol: "₽" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", symbol: "R$" },
]

// Mock exchange rates (in a real app, these would come from an API)
const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.82,
    AUD: 1.52,
    CAD: 1.36,
    CHF: 0.89,
    CNY: 7.24,
    INR: 83.12,
    SGD: 1.34,
    AED: 3.67,
    SAR: 3.75,
    ZAR: 18.65,
    RUB: 91.25,
    MXN: 17.05,
    BRL: 5.05,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    JPY: 163.15,
    AUD: 1.65,
    CAD: 1.48,
    CHF: 0.97,
    CNY: 7.88,
    INR: 90.52,
    SGD: 1.46,
    AED: 4.0,
    SAR: 4.08,
    ZAR: 20.31,
    RUB: 99.36,
    MXN: 18.56,
    BRL: 5.5,
  },
  // Add more as needed
}

// Generate mock rates for all currencies
currencies.forEach((fromCurrency) => {
  if (!mockExchangeRates[fromCurrency.code]) {
    mockExchangeRates[fromCurrency.code] = {}
    currencies.forEach((toCurrency) => {
      if (fromCurrency.code !== toCurrency.code) {
        // Generate a random rate between 0.5 and 2.0 if not already defined
        mockExchangeRates[fromCurrency.code][toCurrency.code] =
          mockExchangeRates[fromCurrency.code]?.[toCurrency.code] || Math.random() * 1.5 + 0.5
      }
    })
  }
})

export default function CurrencyExchange() {
  const [amount, setAmount] = useState<string>("1000")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [result, setResult] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [popularPairs, setPopularPairs] = useState<Array<{ from: string; to: string; rate: number }>>([])
  const [chartData, setChartData] = useState<any>(null)

  // Generate chart data
  const generateChartData = (baseCurrency: string, targetCurrency: string) => {
    // Generate dates for the last 30 days
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    // Generate random rate data with a trend
    const baseRate = mockExchangeRates[baseCurrency]?.[targetCurrency] || 1
    const data = labels.map((_, i) => {
      // Create a slight trend with some randomness
      const volatility = 0.005 // 0.5% daily volatility
      const trend = 0.0002 // slight upward trend
      const randomFactor = (Math.random() - 0.5) * volatility
      return baseRate * (1 + randomFactor + trend * i)
    })

    return {
      labels,
      datasets: [
        {
          label: `${baseCurrency}/${targetCurrency} Exchange Rate`,
          data,
          borderColor: "#003366",
          backgroundColor: "rgba(0, 51, 102, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }

  // Calculate exchange rate
  const calculateExchange = () => {
    if (!amount || isNaN(Number(amount))) return

    const rate = mockExchangeRates[fromCurrency]?.[toCurrency] || 1
    setResult(Number(amount) * rate)

    // Update last updated time
    const now = new Date()
    setLastUpdated(now.toLocaleTimeString())
  }

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Generate popular currency pairs
  useEffect(() => {
    const pairs = [
      { from: "USD", to: "EUR" },
      { from: "EUR", to: "GBP" },
      { from: "USD", to: "JPY" },
      { from: "GBP", to: "USD" },
      { from: "USD", to: "CAD" },
      { from: "AUD", to: "USD" },
    ]

    const pairsWithRates = pairs.map((pair) => ({
      ...pair,
      rate: mockExchangeRates[pair.from]?.[pair.to] || 1,
    }))

    setPopularPairs(pairsWithRates)
  }, [])

  // Calculate exchange on currency or amount change
  useEffect(() => {
    calculateExchange()
  }, [fromCurrency, toCurrency, amount])

  // Update chart data when currencies change
  useEffect(() => {
    setChartData(generateChartData(fromCurrency, toCurrency))
  }, [fromCurrency, toCurrency])

  // Find currency objects
  const fromCurrencyObj = currencies.find((c) => c.code === fromCurrency)
  const toCurrencyObj = currencies.find((c) => c.code === toCurrency)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h1 className="text-4xl font-bold mb-4">Currency Exchange</h1>
              <p className="text-xl max-w-2xl">
                Convert between currencies with our real-time exchange rates. Fast, secure, and competitive rates for
                all your international transactions.
              </p>
            </div>
            <div className="relative w-64 h-64">
              <Image
                src="/placeholder.svg?height=256&width=256"
                alt="Currency Exchange"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currency Converter */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <div className="bg-[#003366] text-white p-4">
                <h2 className="text-xl font-bold flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5" /> Currency Converter
                </h2>
              </div>
              <CardContent className="p-6">
                <Tabs defaultValue="convert" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="convert">Convert</TabsTrigger>
                    <TabsTrigger value="chart">Charts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="convert" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full"
                          placeholder="Enter amount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center">
                                  <span className="mr-2">{currency.flag}</span>
                                  <span>
                                    {currency.code} - {currency.name}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-center my-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={swapCurrencies}
                        className="rounded-full h-10 w-10 border-dashed border-gray-300"
                      >
                        <ArrowRight className="h-4 w-4 rotate-90" />
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center">
                                <span className="mr-2">{currency.flag}</span>
                                <span>
                                  {currency.code} - {currency.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Exchange Rate</span>
                        <span className="text-sm text-gray-500">
                          {lastUpdated ? `Last updated: ${lastUpdated}` : ""}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg">
                            1 {fromCurrencyObj?.code} ={" "}
                            {mockExchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4) || "1.0000"}{" "}
                            {toCurrencyObj?.code}
                          </p>
                        </div>
                        <Button onClick={calculateExchange} className="bg-[#003366]">
                          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                        </Button>
                      </div>
                    </div>

                    {result !== null && (
                      <div className="mt-6 p-6 bg-[#003366]/10 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Result</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              {amount} {fromCurrencyObj?.code}
                            </p>
                            <p className="text-3xl font-bold text-[#003366]">
                              {toCurrencyObj?.symbol}
                              {result.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              // In a real app, this would submit the transaction
                              alert(`Transaction submitted: Converting ${amount} ${fromCurrency} to ${toCurrency}`)
                            }}
                            className="bg-[#f0a500] hover:bg-[#e09400] text-black"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="chart">
                    <div className="h-80 bg-white rounded-lg p-4">
                      {chartData && (
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top" as const,
                              },
                              title: {
                                display: true,
                                text: `${fromCurrency}/${toCurrency} Exchange Rate History`,
                              },
                            },
                            scales: {
                              y: {
                                ticks: {
                                  callback: (value) => value.toFixed(4),
                                },
                              },
                            },
                          }}
                        />
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Currency Pairs */}
            <Card className="bg-white shadow-md border-0">
              <div className="bg-[#003366] text-white p-4">
                <h2 className="text-lg font-bold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" /> Popular Currency Pairs
                </h2>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {popularPairs.map((pair, index) => {
                    const fromObj = currencies.find((c) => c.code === pair.from)
                    const toObj = currencies.find((c) => c.code === pair.to)
                    return (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{fromObj?.flag}</span>
                          <span>
                            {pair.from}/{pair.to}
                          </span>
                        </div>
                        <div className="font-semibold">{pair.rate.toFixed(4)}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Currency Information */}
            <Card className="bg-white shadow-md border-0">
              <div className="bg-[#003366] text-white p-4">
                <h2 className="text-lg font-bold flex items-center">
                  <Globe className="mr-2 h-5 w-5" /> Currency Information
                </h2>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-2xl mr-3">{fromCurrencyObj?.flag}</span>
                    <div>
                      <p className="font-semibold">{fromCurrencyObj?.code}</p>
                      <p className="text-sm text-gray-500">{fromCurrencyObj?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-2xl mr-3">{toCurrencyObj?.flag}</span>
                    <div>
                      <p className="font-semibold">{toCurrencyObj?.code}</p>
                      <p className="text-sm text-gray-500">{toCurrencyObj?.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white shadow-md border-0">
              <div className="bg-[#003366] text-white p-4">
                <h2 className="text-lg font-bold flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" /> Our Services
                </h2>
              </div>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  <li className="p-2 hover:bg-gray-50 rounded-md">
                    <a href="#" className="flex items-center text-[#003366]">
                      <ArrowRight className="h-4 w-4 mr-2" /> International Transfers
                    </a>
                  </li>
                  <li className="p-2 hover:bg-gray-50 rounded-md">
                    <a href="#" className="flex items-center text-[#003366]">
                      <ArrowRight className="h-4 w-4 mr-2" /> Currency Accounts
                    </a>
                  </li>
                  <li className="p-2 hover:bg-gray-50 rounded-md">
                    <a href="#" className="flex items-center text-[#003366]">
                      <ArrowRight className="h-4 w-4 mr-2" /> Business Exchange
                    </a>
                  </li>
                  <li className="p-2 hover:bg-gray-50 rounded-md">
                    <a href="#" className="flex items-center text-[#003366]">
                      <ArrowRight className="h-4 w-4 mr-2" /> Travel Money
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
