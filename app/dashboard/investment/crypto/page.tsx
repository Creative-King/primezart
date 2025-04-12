"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, RefreshCw, Info, CreditCard, Wallet, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock crypto data
const cryptoData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 63245.78,
    change24h: 2.4,
    marketCap: 1234567890000,
    volume24h: 32456789000,
    circulatingSupply: 19500000,
    logo: "🔶",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3421.56,
    change24h: 1.8,
    marketCap: 412345678900,
    volume24h: 18765432100,
    circulatingSupply: 120500000,
    logo: "💠",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 142.89,
    change24h: 5.2,
    marketCap: 61234567890,
    volume24h: 5678901234,
    circulatingSupply: 429000000,
    logo: "🟣",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.58,
    change24h: -1.2,
    marketCap: 20345678901,
    volume24h: 1234567890,
    circulatingSupply: 35100000000,
    logo: "🔵",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    price: 7.82,
    change24h: 0.7,
    marketCap: 9876543210,
    volume24h: 987654321,
    circulatingSupply: 1260000000,
    logo: "⚪",
  },
]

// User's crypto holdings
const userCryptoHoldings = [
  { id: "bitcoin", symbol: "BTC", amount: 0.45, value: 28460.6 },
  { id: "ethereum", symbol: "ETH", amount: 3.2, value: 10948.99 },
  { id: "solana", symbol: "SOL", amount: 25, value: 3572.25 },
]

export default function CryptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank")

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: amount < 1 ? 4 : 2,
      maximumFractionDigits: amount < 1 ? 4 : 2,
    }).format(amount)
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  // Calculate crypto amount based on USD input
  const calculateCryptoAmount = () => {
    if (!purchaseAmount) return "0"
    const crypto = cryptoData.find((c) => c.id === selectedCrypto)
    if (!crypto) return "0"

    const amount = Number.parseFloat(purchaseAmount) / crypto.price
    return amount.toFixed(8)
  }

  // Get selected crypto data
  const getSelectedCrypto = () => {
    return cryptoData.find((c) => c.id === selectedCrypto) || cryptoData[0]
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buy Crypto</h1>
            <p className="text-gray-500">Purchase cryptocurrency with your investment account</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Prices
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">View Portfolio</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Cryptocurrency</CardTitle>
                <CardDescription>Buy crypto with your investment account funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Cryptocurrency</label>
                  <Select defaultValue={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoData.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{crypto.logo}</span>
                            <span>
                              {crypto.name} ({crypto.symbol})
                            </span>
                            <span className="ml-auto text-sm text-gray-500">{formatCurrency(crypto.price)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      You'll Receive ({getSelectedCrypto().symbol})
                    </label>
                    <div className="relative">
                      <Input type="text" readOnly value={calculateCryptoAmount()} className="bg-gray-50" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer flex items-center ${
                        paymentMethod === "bank" ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <Wallet className="h-5 w-5 mr-3 text-gray-700" />
                      <div>
                        <div className="font-medium">Investment Account</div>
                        <div className="text-xs text-gray-500">Available: $34,521.89</div>
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer flex items-center ${
                        paymentMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard className="h-5 w-5 mr-3 text-gray-700" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-xs text-gray-500">Additional fees apply</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700 text-sm">
                    Cryptocurrency prices are volatile. Your investment may lose value. Please review our risk
                    disclosure before investing.
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Buy {getSelectedCrypto().symbol}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Current cryptocurrency market data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-500 text-sm">Name</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Price</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">24h Change</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Market Cap</th>
                        <th className="text-right py-2 font-medium text-gray-500 text-sm">Volume (24h)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoData.map((crypto) => (
                        <tr key={crypto.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{crypto.logo}</span>
                              <div>
                                <div className="font-medium">{crypto.name}</div>
                                <div className="text-xs text-gray-500">{crypto.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 font-medium">{formatCurrency(crypto.price)}</td>
                          <td className="text-right py-3">
                            <span className={crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                              {crypto.change24h >= 0 ? "+" : ""}
                              {crypto.change24h}%
                            </span>
                          </td>
                          <td className="text-right py-3 text-gray-700">
                            {formatCurrency(crypto.marketCap / 1000000000)}B
                          </td>
                          <td className="text-right py-3 text-gray-700">
                            {formatCurrency(crypto.volume24h / 1000000000)}B
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected Crypto</CardTitle>
                <CardDescription>
                  {getSelectedCrypto().name} ({getSelectedCrypto().symbol})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getSelectedCrypto().logo}</span>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(getSelectedCrypto().price)}</div>
                      <div
                        className={`flex items-center ${getSelectedCrypto().change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {getSelectedCrypto().change24h >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {getSelectedCrypto().change24h >= 0 ? "+" : ""}
                        {getSelectedCrypto().change24h}% (24h)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Cap</span>
                    <span className="font-medium">{formatCurrency(getSelectedCrypto().marketCap / 1000000000)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume (24h)</span>
                    <span className="font-medium">{formatCurrency(getSelectedCrypto().volume24h / 1000000000)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Circulating Supply</span>
                    <span className="font-medium">
                      {formatNumber(getSelectedCrypto().circulatingSupply)} {getSelectedCrypto().symbol}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Crypto Holdings</CardTitle>
                <CardDescription>
                  Current portfolio value:{" "}
                  {formatCurrency(userCryptoHoldings.reduce((acc, curr) => acc + curr.value, 0))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userCryptoHoldings.map((holding) => {
                    const crypto = cryptoData.find((c) => c.id === holding.id)
                    return (
                      <div key={holding.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{crypto?.logo}</span>
                          <div>
                            <div className="font-medium">{holding.symbol}</div>
                            <div className="text-xs text-gray-500">
                              {holding.amount} {holding.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(holding.value)}</div>
                          {crypto && (
                            <div className={`text-xs ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {crypto.change24h >= 0 ? "+" : ""}
                              {crypto.change24h}%
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
