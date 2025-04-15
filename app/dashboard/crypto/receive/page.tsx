"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, QrCode, Copy, Check, Share2, DownloadCloud, AlertTriangle, ClipboardCopy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Mock crypto wallets
const cryptoWallets = [
  {
    id: "btc-wallet",
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    balance: 0.25,
    usdBalance: 17135.53,
    network: "Bitcoin Mainnet",
    minConfirmations: 3,
    recentTx: [
      {
        id: "tx1",
        amount: 0.05,
        from: "External Wallet",
        date: "2024-11-19T14:30:00Z",
        confirmations: 24,
        status: "completed",
      },
      {
        id: "tx2",
        amount: 0.1,
        from: "Coinbase",
        date: "2024-11-05T10:15:00Z",
        confirmations: 152,
        status: "completed",
      },
    ],
  },
  {
    id: "eth-wallet",
    name: "Ethereum",
    symbol: "ETH",
    address: "0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8",
    balance: 2.5,
    usdBalance: 8631.95,
    network: "Ethereum Mainnet",
    minConfirmations: 12,
    recentTx: [
      {
        id: "tx3",
        amount: 0.75,
        from: "Binance",
        date: "2024-11-15T08:45:00Z",
        confirmations: 52,
        status: "completed",
      },
    ],
  },
  {
    id: "sol-wallet",
    name: "Solana",
    symbol: "SOL",
    address: "5zrEGt4VZkpSAYE97DvGbxiQEW6LjwJ9ZbNSB6sQFsMR",
    balance: 20,
    usdBalance: 2865.0,
    network: "Solana Mainnet",
    minConfirmations: 32,
    recentTx: [],
  },
]

export default function CryptoReceivePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(cryptoWallets[0])
  const [copied, setCopied] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [qrSize, setQrSize] = useState("medium")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatCrypto = (value, symbol) => {
    return `${value.toLocaleString(undefined, { minimumFractionDigits: symbol === "BTC" ? 8 : 4, maximumFractionDigits: symbol === "BTC" ? 8 : 4 })} ${symbol}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedWallet.name} Wallet Address`,
        text: `My ${selectedWallet.name} address: ${selectedWallet.address}`,
      })
    } else {
      alert("Web Share API is not supported in your browser. Please copy the address manually.")
    }
  }

  const handleDownloadQR = () => {
    // In a real app, this would generate and download a QR code image
    alert("QR code image download would be triggered here")
  }

  const getQrSizeClass = () => {
    switch (qrSize) {
      case "small":
        return "w-32 h-32"
      case "large":
        return "w-64 h-64"
      default:
        return "w-48 h-48"
    }
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
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
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Receive Crypto</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#1e293b] border-[#334155]">
            <CardHeader className="pb-2">
              <CardTitle>Receive {selectedWallet.name}</CardTitle>
              <CardDescription className="text-gray-400">
                Share your address to receive {selectedWallet.symbol}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet Selector */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Select Wallet</p>
                <Select
                  defaultValue={selectedWallet.id}
                  onValueChange={(value) => setSelectedWallet(cryptoWallets.find((w) => w.id === value))}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#334155] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#334155] text-white">
                    {cryptoWallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        <div className="flex items-center">
                          <span className="font-medium">{wallet.name}</span>
                          <span className="ml-2 text-gray-400">({formatCrypto(wallet.balance, wallet.symbol)})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center">
                <div className={`bg-white p-4 rounded-lg ${getQrSizeClass()}`}>
                  {/* This would be a real QR code in a production app */}
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <QrCode className="w-3/4 h-3/4 text-[#0f172a]" />
                  </div>
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQrSize("small")}
                    className={`border-[#334155] hover:bg-[#334155] text-white ${qrSize === "small" ? "bg-[#334155]" : ""}`}
                  >
                    Small
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQrSize("medium")}
                    className={`border-[#334155] hover:bg-[#334155] text-white ${qrSize === "medium" ? "bg-[#334155]" : ""}`}
                  >
                    Medium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQrSize("large")}
                    className={`border-[#334155] hover:bg-[#334155] text-white ${qrSize === "large" ? "bg-[#334155]" : ""}`}
                  >
                    Large
                  </Button>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">Your {selectedWallet.name} Address</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-[#334155]"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-[#334155]"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-mono break-all">{selectedWallet.address}</p>
              </div>

              {/* Network Info */}
              <div className="bg-[#0f172a] rounded-lg p-3 border border-[#334155] space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Network</p>
                  <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800/30">
                    {selectedWallet.network}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm">Minimum Confirmations</p>
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800/30">
                    {selectedWallet.minConfirmations}
                  </Badge>
                </div>
              </div>

              {/* More Information Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="w-full border-[#334155] hover:bg-[#334155] text-white"
              >
                {showMoreInfo ? "Hide Details" : "Show More Details"}
              </Button>

              {showMoreInfo && (
                <Alert className="bg-[#334155]/50 border-[#475569]">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mr-2" />
                  <AlertDescription className="text-xs">
                    <p>
                      Only send {selectedWallet.symbol} to this address. Sending any other cryptocurrency may result in
                      permanent loss of funds.
                    </p>
                    <p className="mt-2">
                      Transactions typically require {selectedWallet.minConfirmations} network confirmations before they
                      are credited to your account.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button className="w-full bg-[#6366f1] hover:bg-[#4f46e5]" onClick={handleCopyAddress}>
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button className="w-full bg-[#334155] hover:bg-[#475569]" onClick={handleDownloadQR}>
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full border-[#334155] hover:bg-[#334155] text-white"
                onClick={() => router.push("/dashboard/crypto/wallet")}
              >
                Go to Wallet
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Transactions */}
          {selectedWallet.recentTx.length > 0 && (
            <Card className="bg-[#1e293b] border-[#334155] mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Recent Deposits</CardTitle>
                <CardDescription className="text-gray-400">
                  Recent {selectedWallet.symbol} deposits to this address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedWallet.recentTx.map((tx) => (
                    <div key={tx.id} className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{formatCrypto(tx.amount, selectedWallet.symbol)}</p>
                          <p className="text-sm text-gray-400">From: {tx.from}</p>
                          <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800/30">
                          {tx.confirmations} confirmations
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
