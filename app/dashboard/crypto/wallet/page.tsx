"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ClipboardCopy,
  Eye,
  EyeOff,
  Clock,
  QrCode,
  Layers,
  ShieldCheck,
  Info,
  AlertTriangle,
  Check,
  Plus,
  Lock,
  LockKeyhole,
  Copy,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FloatingRadialMenu from "@/components/floating-radial-menu"
import { Textarea } from "@/components/ui/textarea"

// Mock data for crypto assets
const cryptoWallets = [
  {
    id: "btc-wallet",
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    balance: 0.25,
    usdBalance: 17135.53,
    privateKey: "xprv9s21ZrQH143K...[redacted]",
    mnemonic: "abandon ability able about above absent absorb abstract absurd abuse access accident",
    transactions: [
      {
        id: "tx1",
        type: "receive",
        amount: 0.15,
        from: "External Wallet",
        to: "My Bitcoin Wallet",
        date: "2024-11-15T10:30:00Z",
        status: "completed",
        hash: "0x8f2b7c6d5e4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c",
      },
      {
        id: "tx2",
        type: "send",
        amount: 0.05,
        from: "My Bitcoin Wallet",
        to: "External Wallet",
        date: "2024-11-10T14:45:00Z",
        status: "completed",
        hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      },
      {
        id: "tx3",
        type: "receive",
        amount: 0.15,
        from: "Coinbase",
        to: "My Bitcoin Wallet",
        date: "2024-10-25T09:15:00Z",
        status: "completed",
        hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
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
    privateKey: "0x8f2b7c6d5e4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c",
    mnemonic: "abandon ability able about above absent absorb abstract absurd abuse access accident",
    transactions: [
      {
        id: "tx4",
        type: "receive",
        amount: 1.5,
        from: "Binance",
        to: "My Ethereum Wallet",
        date: "2024-11-12T11:20:00Z",
        status: "completed",
        hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      },
      {
        id: "tx5",
        type: "send",
        amount: 0.5,
        from: "My Ethereum Wallet",
        to: "External Wallet",
        date: "2024-11-05T16:30:00Z",
        status: "completed",
        hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
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
    privateKey: "4vJ9JU1bJJE96FbKUAPX....[redacted]",
    mnemonic: "abandon ability able about above absent absorb abstract absurd abuse access accident",
    transactions: [
      {
        id: "tx6",
        type: "receive",
        amount: 10,
        from: "FTX",
        to: "My Solana Wallet",
        date: "2024-11-08T09:45:00Z",
        status: "completed",
        hash: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
      },
    ],
  },
]

export default function CryptoWalletPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("assets")
  const [selectedWallet, setSelectedWallet] = useState(cryptoWallets[0])
  const [isAddressVisible, setIsAddressVisible] = useState(true)
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false)
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false)
  const [showBackupDialog, setShowBackupDialog] = useState(false)
  const [copyState, setCopyState] = useState({ address: false, privateKey: false, mnemonic: false })
  const [showQRCode, setShowQRCode] = useState(false)
  const [backupPassword, setBackupPassword] = useState("")
  const [backupConfirmPassword, setBackupConfirmPassword] = useState("")
  const [backupPasswordError, setBackupPasswordError] = useState("")
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)
  const [recoveryPhrase, setRecoveryPhrase] = useState("")
  const [recoveryPhraseError, setRecoveryPhraseError] = useState("")

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
    setCopyState({ ...copyState, address: true })
    setTimeout(() => setCopyState({ ...copyState, address: false }), 2000)
  }

  const handleCopyPrivateKey = () => {
    navigator.clipboard.writeText(selectedWallet.privateKey)
    setCopyState({ ...copyState, privateKey: true })
    setTimeout(() => setCopyState({ ...copyState, privateKey: false }), 2000)
  }

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(selectedWallet.mnemonic)
    setCopyState({ ...copyState, mnemonic: true })
    setTimeout(() => setCopyState({ ...copyState, mnemonic: false }), 2000)
  }

  const handleBackupWallet = () => {
    if (!backupPassword) {
      setBackupPasswordError("Password is required")
      return
    }

    if (backupPassword !== backupConfirmPassword) {
      setBackupPasswordError("Passwords do not match")
      return
    }

    if (backupPassword.length < 8) {
      setBackupPasswordError("Password must be at least 8 characters")
      return
    }

    // In a real app, this would encrypt the keys and download them
    // For demo, just simulate a download
    const element = document.createElement("a")
    const file = new Blob(
      [
        JSON.stringify(
          {
            walletAddress: selectedWallet.address,
            encryptedData: "This would be encrypted data in a real app",
            createdAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `${selectedWallet.symbol.toLowerCase()}-wallet-backup.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setBackupPassword("")
    setBackupConfirmPassword("")
    setBackupPasswordError("")
    setShowBackupDialog(false)

    // Show success message
    alert("Wallet backup file has been downloaded. Keep it in a secure location.")
  }

  const handleRecoverWallet = () => {
    if (!recoveryPhrase.trim()) {
      setRecoveryPhraseError("Recovery phrase is required")
      return
    }

    // In a real app, this would validate the recovery phrase
    // For demo, just check if it's similar to our mnemonic
    const words = recoveryPhrase.trim().split(/\s+/)

    if (words.length !== 12) {
      setRecoveryPhraseError("Recovery phrase must contain 12 words")
      return
    }

    // For demo, simulate success
    setRecoveryPhrase("")
    setRecoveryPhraseError("")
    setShowRecoveryDialog(false)

    // Show success message
    alert("Wallet recovery initiated. Your wallet will be restored shortly.")
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
            <h1 className="text-xl font-bold">Crypto Wallet</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallets List */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#1e293b] border-[#334155]">
              <CardHeader className="pb-2">
                <CardTitle>My Wallets</CardTitle>
                <CardDescription className="text-gray-400">Manage your cryptocurrency wallets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {cryptoWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedWallet.id === wallet.id ? "bg-[#334155]" : "hover:bg-[#334155]/50"
                    }`}
                    onClick={() => setSelectedWallet(wallet)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center mr-3">
                          <span className="font-bold text-sm">{wallet.symbol}</span>
                        </div>
                        <div>
                          <p className="font-medium">{wallet.name}</p>
                          <p className="text-xs text-gray-400">{formatCrypto(wallet.balance, wallet.symbol)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(wallet.usdBalance)}</p>
                        <Badge variant="outline" className="text-xs">
                          Wallet
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 border-[#334155] hover:bg-[#334155] text-white"
                  onClick={() => router.push("/dashboard/crypto/add-wallet")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Wallet
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border-[#334155]">
              <CardHeader className="pb-2">
                <CardTitle>Security</CardTitle>
                <CardDescription className="text-gray-400">Protect your crypto assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#334155] hover:bg-[#334155] text-white flex justify-between"
                  onClick={() => setShowBackupDialog(true)}
                >
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    <span>Backup Wallet</span>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#334155] hover:bg-[#334155] text-white flex justify-between"
                  onClick={() => setShowRecoveryDialog(true)}
                >
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>Recover Wallet</span>
                  </div>
                  <Layers className="h-4 w-4 text-blue-400" />
                </Button>

                <Alert className="bg-[#334155]/50 border-[#475569]">
                  <ShieldCheck className="h-4 w-4 text-green-400 mr-2" />
                  <AlertDescription className="text-xs">
                    Your wallet keys are encrypted and stored locally. Never share your private keys or recovery phrase.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Wallet Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1e293b] border-[#334155]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedWallet.name} Wallet</CardTitle>
                    <CardDescription className="text-gray-400">
                      Balance: {formatCrypto(selectedWallet.balance, selectedWallet.symbol)} (
                      {formatCurrency(selectedWallet.usdBalance)})
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/dashboard/crypto/send")}
                      className="border-[#334155] hover:bg-[#334155] text-white"
                    >
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/dashboard/crypto/receive")}
                      className="border-[#334155] hover:bg-[#334155] text-white"
                    >
                      Receive
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Wallet Address</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddressVisible(!isAddressVisible)}
                        className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                      >
                        {isAddressVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyAddress}
                        className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                      >
                        {copyState.address ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQRCode(true)}
                        className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative bg-[#0f172a] rounded-md p-3">
                    <p className="text-sm font-mono break-all">
                      {isAddressVisible ? selectedWallet.address : "•".repeat(20)}
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#334155]" />

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-gray-400">Private Key</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPrivateKeyVisible(!isPrivateKeyVisible)}
                          className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                        >
                          {isPrivateKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPrivateKey}
                          className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                          disabled={!isPrivateKeyVisible}
                        >
                          {copyState.privateKey ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="relative bg-[#0f172a] rounded-md p-3">
                      {isPrivateKeyVisible ? (
                        <p className="text-sm font-mono break-all">{selectedWallet.privateKey}</p>
                      ) : (
                        <div className="flex items-center justify-center py-3">
                          <Lock className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-gray-500">Private key is hidden for security</span>
                        </div>
                      )}
                    </div>
                    {isPrivateKeyVisible && (
                      <Alert variant="destructive" className="bg-red-900/20 border-red-800/30 text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <AlertDescription className="text-xs">
                          Never share your private key with anyone. Anyone with your private key has full control of
                          your funds.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-gray-400">Recovery Phrase (Mnemonic)</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMnemonicVisible(!isMnemonicVisible)}
                          className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                        >
                          {isMnemonicVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyMnemonic}
                          className="h-6 w-6 p-1 text-gray-400 hover:text-white"
                          disabled={!isMnemonicVisible}
                        >
                          {copyState.mnemonic ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="relative bg-[#0f172a] rounded-md p-3">
                      {isMnemonicVisible ? (
                        <p className="text-sm font-mono break-all">{selectedWallet.mnemonic}</p>
                      ) : (
                        <div className="flex items-center justify-center py-3">
                          <LockKeyhole className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-gray-500">Recovery phrase is hidden for security</span>
                        </div>
                      )}
                    </div>
                    {isMnemonicVisible && (
                      <Alert variant="destructive" className="bg-red-900/20 border-red-800/30 text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <AlertDescription className="text-xs">
                          Write down your recovery phrase and keep it in a secure location. This is the only way to
                          recover your wallet if you lose access.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="transactions" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-[#1e293b] border-[#334155] w-full">
                <TabsTrigger value="transactions" className="flex-1 data-[state=active]:bg-[#334155]">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-[#334155]">
                  Security
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-[#334155]">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <Card className="bg-[#1e293b] border-[#334155] mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription className="text-gray-400">
                      Recent {selectedWallet.name} transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedWallet.transactions.length > 0 ? (
                        selectedWallet.transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="p-3 bg-[#0f172a] rounded-lg border border-[#334155]/50 hover:border-[#334155]"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    tx.type === "receive"
                                      ? "bg-green-900/30 text-green-400"
                                      : "bg-amber-900/30 text-amber-400"
                                  }`}
                                >
                                  {tx.type === "receive" ? (
                                    <Download className="h-4 w-4" />
                                  ) : (
                                    <Upload className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{tx.type === "receive" ? "Received" : "Sent"}</p>
                                  <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-medium ${
                                    tx.type === "receive" ? "text-green-400" : "text-amber-400"
                                  }`}
                                >
                                  {tx.type === "receive" ? "+" : "-"}
                                  {tx.amount} {selectedWallet.symbol}
                                </p>
                                <div className="flex items-center justify-end mt-1">
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-900/20 text-green-400 border-green-800/30"
                                  >
                                    {tx.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-[#334155]/50 text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <span className="text-gray-400">From: </span>
                                  <span className="font-mono">{tx.from}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">To: </span>
                                  <span className="font-mono">{tx.to}</span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-400">Confirmations: 32</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs text-blue-400 hover:text-blue-300"
                                >
                                  View on Explorer
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No transactions found for this wallet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-[#334155] hover:bg-[#334155] text-white"
                      disabled={selectedWallet.transactions.length === 0}
                    >
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="bg-[#1e293b] border-[#334155] mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription className="text-gray-400">Manage security options for your wallet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <ShieldCheck className="h-5 w-5 text-green-400 mr-2" />
                          <span className="font-medium">2-Factor Authentication</span>
                        </div>
                        <Badge className="bg-green-900/30 text-green-400 border-green-800/30">Enabled</Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        Your account is protected with 2FA. This adds an extra layer of security when performing
                        sensitive operations.
                      </p>
                    </div>

                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Lock className="h-5 w-5 text-blue-400 mr-2" />
                          <span className="font-medium">Transaction PIN</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#334155] hover:bg-[#334155] text-white h-7"
                        >
                          Change PIN
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">
                        Your transaction PIN is required for all outgoing transactions. Keep it secure and don't share
                        it with anyone.
                      </p>
                    </div>

                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                          <span className="font-medium">Transaction Limits</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#334155] hover:bg-[#334155] text-white h-7"
                        >
                          Adjust Limits
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">
                        Daily withdrawal limit: {formatCurrency(10000)}. Monthly withdrawal limit:{" "}
                        {formatCurrency(50000)}.
                      </p>
                    </div>

                    <Alert className="bg-blue-900/20 border-blue-800/30 text-blue-400">
                      <Info className="h-4 w-4 mr-2" />
                      <AlertDescription className="text-xs">
                        Your wallet security is your responsibility. Keep your recovery phrase in a secure location, and
                        never share your private keys.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-[#1e293b] border-[#334155] mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle>Wallet Settings</CardTitle>
                    <CardDescription className="text-gray-400">Customize your wallet preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Wallet Name</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#334155] hover:bg-[#334155] text-white h-7"
                        >
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">Current name: {selectedWallet.name} Wallet</p>
                    </div>

                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Default Currency</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#334155] hover:bg-[#334155] text-white h-7"
                        >
                          Change
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">Currently displaying values in USD</p>
                    </div>

                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Transaction Notifications</span>
                        <Badge className="bg-green-900/30 text-green-400 border-green-800/30">Enabled</Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        You'll receive notifications for all incoming and outgoing transactions
                      </p>
                    </div>

                    <div className="p-4 bg-[#0f172a] rounded-lg border border-red-800/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="font-medium text-red-400">Delete Wallet</span>
                        </div>
                        <Button variant="destructive" size="sm" className="bg-red-900/50 hover:bg-red-900 h-7">
                          Delete
                        </Button>
                      </div>
                      <p className="text-sm text-red-300/70">
                        This will remove the wallet from this device. Make sure you have a backup of your private keys.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="bg-[#1e293b] border-[#334155] text-white">
          <DialogHeader>
            <DialogTitle>{selectedWallet.name} Wallet Address</DialogTitle>
            <DialogDescription className="text-gray-400">
              Scan this QR code to send {selectedWallet.symbol} to this wallet
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg">
              {/* This would be a real QR code in a production app */}
              <div className="w-48 h-48 bg-white flex items-center justify-center">
                <QrCode className="w-32 h-32 text-[#0f172a]" />
              </div>
            </div>
            <p className="mt-4 text-sm font-mono text-center break-all">{selectedWallet.address}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCopyAddress}
              className="w-full bg-[#334155] hover:bg-[#475569] text-white border-none"
            >
              {copyState.address ? <Check className="h-4 w-4 mr-2" /> : <ClipboardCopy className="h-4 w-4 mr-2" />}
              Copy Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="bg-[#1e293b] border-[#334155] text-white">
          <DialogHeader>
            <DialogTitle>Backup Your Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">Create an encrypted backup of your wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Alert className="bg-amber-900/20 border-amber-800/30 text-amber-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription className="text-xs">
                Your wallet backup will be encrypted with the password you provide. Store this file in a secure
                location.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="password">Encryption Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={backupPassword}
                onChange={(e) => {
                  setBackupPassword(e.target.value)
                  setBackupPasswordError("")
                }}
                className="bg-[#0f172a] border-[#334155] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={backupConfirmPassword}
                onChange={(e) => {
                  setBackupConfirmPassword(e.target.value)
                  setBackupPasswordError("")
                }}
                className="bg-[#0f172a] border-[#334155] text-white"
              />
            </div>

            {backupPasswordError && <p className="text-red-500 text-sm">{backupPasswordError}</p>}
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              onClick={() => setShowBackupDialog(false)}
              variant="ghost"
              className="border-[#334155] hover:bg-[#334155] text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleBackupWallet} className="bg-[#6366f1] hover:bg-[#4f46e5] text-white">
              Download Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recovery Dialog */}
      <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <DialogContent className="bg-[#1e293b] border-[#334155] text-white">
          <DialogHeader>
            <DialogTitle>Recover Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              Restore your wallet using a seed phrase or private key
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Alert className="bg-amber-900/20 border-amber-800/30 text-amber-400">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription className="text-xs">
                Enter your 12-word recovery phrase (seed phrase) to restore your wallet.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="recoveryPhrase">Recovery Phrase</Label>
              <Textarea
                id="recoveryPhrase"
                placeholder="Enter your 12-word recovery phrase, separated by spaces"
                value={recoveryPhrase}
                onChange={(e) => {
                  setRecoveryPhrase(e.target.value)
                  setRecoveryPhraseError("")
                }}
                className="bg-[#0f172a] border-[#334155] text-white h-28"
              />
              {recoveryPhraseError && <p className="text-red-500 text-sm">{recoveryPhraseError}</p>}
              <p className="text-xs text-gray-400">
                Example: abandon ability able about above absent absorb abstract absurd abuse access accident
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              onClick={() => setShowRecoveryDialog(false)}
              variant="ghost"
              className="border-[#334155] hover:bg-[#334155] text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleRecoverWallet} className="bg-[#6366f1] hover:bg-[#4f46e5] text-white">
              Recover Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Menu */}
      <FloatingRadialMenu type="crypto" />
    </div>
  )
}
