"use client"

import { useState } from "react"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  QrCode,
  Copy,
  Check,
  Landmark,
  BitcoinIcon,
  WalletIcon,
  DollarSignIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TwoFactorVerification } from "./two-factor-auth"

// Mock crypto wallets
const cryptoWallets = [
  {
    id: "btc-wallet",
    name: "Bitcoin Wallet",
    symbol: "BTC",
    balance: 0.235,
    fiatValue: 12045.23,
    address: "bc1q89ku5swgv63j8pklhxqzld0ekzc7wvgp5cncwd",
    image: "/placeholder.svg?height=24&width=24&text=BTC",
  },
  {
    id: "eth-wallet",
    name: "Ethereum Wallet",
    symbol: "ETH",
    balance: 3.15,
    fiatValue: 7915.62,
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    image: "/placeholder.svg?height=24&width=24&text=ETH",
  },
  {
    id: "sol-wallet",
    name: "Solana Wallet",
    symbol: "SOL",
    balance: 57.12,
    fiatValue: 5851.11,
    address: "7iFfqELdV5amKNwUd9WQgLLuCRfKfTmVJ2ss9SFrLmzo",
    image: "/placeholder.svg?height=24&width=24&text=SOL",
  },
]

// Mock bank accounts
const bankAccounts = [
  {
    id: "checking",
    name: "Premium Checking",
    number: "****4532",
    balance: 12435.67,
    currency: "USD",
    routingNumber: "074000078",
  },
  {
    id: "savings",
    name: "Premium Savings",
    number: "****7890",
    balance: 34521.89,
    currency: "USD",
    routingNumber: "074000078",
  },
]

export function CryptoTransferCard() {
  const [activeTab, setActiveTab] = useState("sendCrypto")
  const [selectedCryptoWallet, setSelectedCryptoWallet] = useState("")
  const [selectedBankAccount, setSelectedBankAccount] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [selectedReceiveWallet, setSelectedReceiveWallet] = useState(cryptoWallets[0].id)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [fiatAmount, setFiatAmount] = useState("")
  const [fiatCurrency, setFiatCurrency] = useState("USD")
  const [showTwoFactorVerification, setShowTwoFactorVerification] = useState(false)
  const [hideBalances, setHideBalances] = useState(false)

  // Currency exchange rates (mock data)
  const exchangeRates = {
    BTC: 51342.67,
    ETH: 2513.48,
    SOL: 102.43,
  }

  // Format currency values
  const formatCurrency = (value: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value)
  }

  // Format crypto values
  const formatCrypto = (value: number, symbol: string) => {
    return `${value.toFixed(symbol === "BTC" ? 8 : 6)} ${symbol}`
  }

  // Calculate fiat value based on crypto amount
  const calculateFiatValue = (amount: string, symbol: string) => {
    if (!amount || isNaN(Number(amount))) return ""
    const rate = exchangeRates[symbol as keyof typeof exchangeRates] || 0
    return (Number(amount) * rate).toFixed(2)
  }

  // Calculate crypto amount based on fiat value
  const calculateCryptoAmount = (fiatValue: string, symbol: string) => {
    if (!fiatValue || isNaN(Number(fiatValue))) return ""
    const rate = exchangeRates[symbol as keyof typeof exchangeRates] || 1
    return (Number(fiatValue) / rate).toFixed(symbol === "BTC" ? 8 : 6)
  }

  // Handle send crypto
  const handleSendCrypto = () => {
    if (!selectedCryptoWallet || !recipientAddress || !cryptoAmount) {
      setShowError(true)
      setErrorMessage("Please fill in all required fields")
      return
    }

    setShowConfirmation(true)
  }

  // Handle convert crypto to fiat
  const handleCryptoToFiat = () => {
    if (!selectedCryptoWallet || !selectedBankAccount || !cryptoAmount) {
      setShowError(true)
      setErrorMessage("Please fill in all required fields")
      return
    }

    setShowConfirmation(true)
  }

  // Handle confirmation
  const handleConfirmTransaction = () => {
    setIsProcessing(true)
    setShowError(false)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setShowConfirmation(false)
      setShowSuccess(true)

      // Reset form
      setTimeout(() => {
        setShowSuccess(false)
        setCryptoAmount("")
        setRecipientAddress("")
        setFiatAmount("")
      }, 3000)
    }, 2000)
  }

  // Handle copy address
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  // Get selected wallet data
  const selectedWallet = cryptoWallets.find((wallet) => wallet.id === selectedCryptoWallet)
  const receiveWallet = cryptoWallets.find((wallet) => wallet.id === selectedReceiveWallet)

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Crypto Services</CardTitle>
              <CardDescription>Send, receive, and convert cryptocurrency</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setHideBalances(!hideBalances)} className="h-8 w-8 p-0">
              {hideBalances ? (
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="sendCrypto">
                <BitcoinIcon className="h-4 w-4 mr-2" />
                Send
              </TabsTrigger>
              <TabsTrigger value="receiveCrypto">
                <WalletIcon className="h-4 w-4 mr-2" />
                Receive
              </TabsTrigger>
              <TabsTrigger value="convertCrypto">
                <DollarSignIcon className="h-4 w-4 mr-2" />
                Convert
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sendCrypto">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">From Wallet</label>
                  <Select value={selectedCryptoWallet} onValueChange={setSelectedCryptoWallet}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={wallet.image} alt={wallet.symbol} />
                              <AvatarFallback>{wallet.symbol}</AvatarFallback>
                            </Avatar>
                            <span>
                              {wallet.name} ({hideBalances ? "***" : formatCrypto(wallet.balance, wallet.symbol)})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Recipient Address</label>
                  <Input
                    className="mt-1.5"
                    placeholder="Enter wallet address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <div className="flex mt-1.5">
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={cryptoAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "")
                        setCryptoAmount(value)
                      }}
                      className="rounded-r-none"
                    />
                    <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-muted">
                      {selectedWallet?.symbol || "BTC"}
                    </div>
                  </div>
                  {selectedWallet && cryptoAmount && !isNaN(Number(cryptoAmount)) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈{" "}
                      {formatCurrency(
                        Number(cryptoAmount) * exchangeRates[selectedWallet.symbol as keyof typeof exchangeRates],
                      )}
                    </p>
                  )}
                </div>

                {showError && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="receiveCrypto">
              <div className="flex flex-col items-center justify-center py-6">
                <BitcoinIcon className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Receive Cryptocurrency</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Generate a QR code or copy your wallet address to receive crypto
                </p>
                <Button onClick={() => setShowReceiveDialog(true)}>View Wallet Address</Button>
              </div>
            </TabsContent>

            <TabsContent value="convertCrypto">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">From Wallet</label>
                  <Select value={selectedCryptoWallet} onValueChange={setSelectedCryptoWallet}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={wallet.image} alt={wallet.symbol} />
                              <AvatarFallback>{wallet.symbol}</AvatarFallback>
                            </Avatar>
                            <span>
                              {wallet.name} ({hideBalances ? "***" : formatCrypto(wallet.balance, wallet.symbol)})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">To Bank Account</label>
                  <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center">
                            <Landmark className="h-4 w-4 mr-2" />
                            <span>
                              {account.name} ({account.number})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Crypto Amount</label>
                    <div className="flex mt-1.5">
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={cryptoAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "")
                          setCryptoAmount(value)
                          if (selectedWallet && value && !isNaN(Number(value))) {
                            setFiatAmount(calculateFiatValue(value, selectedWallet.symbol))
                          } else {
                            setFiatAmount("")
                          }
                        }}
                        className="rounded-r-none"
                      />
                      <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-muted">
                        {selectedWallet?.symbol || "BTC"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Fiat Amount</label>
                    <div className="flex mt-1.5">
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={fiatAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "")
                          setFiatAmount(value)
                          if (selectedWallet && value && !isNaN(Number(value))) {
                            setCryptoAmount(calculateCryptoAmount(value, selectedWallet.symbol))
                          } else {
                            setCryptoAmount("")
                          }
                        }}
                        className="rounded-r-none"
                      />
                      <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                        <SelectTrigger className="w-24 rounded-l-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {selectedWallet && selectedBankAccount && (
                  <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                      Current exchange rate: 1 {selectedWallet.symbol} ={" "}
                      {formatCurrency(exchangeRates[selectedWallet.symbol as keyof typeof exchangeRates])}
                    </AlertDescription>
                  </Alert>
                )}

                {showError && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">View History</Button>
          <Button
            onClick={() => {
              if (activeTab === "sendCrypto") {
                handleSendCrypto()
              } else if (activeTab === "convertCrypto") {
                handleCryptoToFiat()
              } else if (activeTab === "receiveCrypto") {
                setShowReceiveDialog(true)
              }
            }}
            disabled={
              (activeTab === "sendCrypto" && (!selectedCryptoWallet || !recipientAddress || !cryptoAmount)) ||
              (activeTab === "convertCrypto" && (!selectedCryptoWallet || !selectedBankAccount || !cryptoAmount))
            }
          >
            {activeTab === "sendCrypto"
              ? "Send Crypto"
              : activeTab === "receiveCrypto"
                ? "Generate Address"
                : "Convert Crypto"}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>Please review the details before proceeding</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <div className="flex items-center">
                  {selectedWallet && (
                    <>
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={selectedWallet.image} alt={selectedWallet.symbol} />
                        <AvatarFallback>{selectedWallet.symbol}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{selectedWallet.name}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                {activeTab === "sendCrypto" ? (
                  <div>
                    <span className="font-medium">
                      {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-8)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Landmark className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">
                      {bankAccounts.find((acc) => acc.id === selectedBankAccount)?.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Amount</span>
                <div>
                  <div className="font-medium text-right">
                    {cryptoAmount} {selectedWallet?.symbol}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈{" "}
                    {formatCurrency(
                      Number(cryptoAmount) * (exchangeRates[selectedWallet?.symbol as keyof typeof exchangeRates] || 0),
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Fee</span>
                <div className="font-medium">
                  {selectedWallet?.symbol === "BTC"
                    ? "0.0001 BTC"
                    : selectedWallet?.symbol === "ETH"
                      ? "0.003 ETH"
                      : "0.001 SOL"}
                </div>
              </div>

              <Alert className="mt-2 bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>This transaction requires two-factor authentication.</AlertDescription>
              </Alert>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConfirmation(false)
                setShowTwoFactorVerification(true)
              }}
            >
              Continue with 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two-factor verification dialog */}
      <TwoFactorVerification
        open={showTwoFactorVerification}
        onOpenChange={setShowTwoFactorVerification}
        onVerified={() => {
          handleConfirmTransaction()
        }}
      />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Successful</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center mb-2">
              {activeTab === "sendCrypto"
                ? `You have successfully sent ${cryptoAmount} ${selectedWallet?.symbol}`
                : `You have successfully converted ${cryptoAmount} ${selectedWallet?.symbol} to ${fiatAmount} ${fiatCurrency}`}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Transaction ID: TX{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Cryptocurrency</DialogTitle>
            <DialogDescription>Share your wallet address to receive crypto</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex justify-center mb-4">
              <Select value={selectedReceiveWallet} onValueChange={setSelectedReceiveWallet}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptoWallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={wallet.image} alt={wallet.symbol} />
                          <AvatarFallback>{wallet.symbol}</AvatarFallback>
                        </Avatar>
                        <span>{wallet.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {receiveWallet && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-md border">
                    <QrCode className="h-48 w-48" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Wallet Address</label>
                  <div className="flex mt-1.5">
                    <Input readOnly value={receiveWallet.address} className="font-mono text-sm rounded-r-none" />
                    <Button
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={() => copyAddress(receiveWallet.address)}
                    >
                      {copiedAddress ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Only send {receiveWallet.symbol} to this address. Sending any other cryptocurrency may result in
                    permanent loss.
                  </p>
                </div>

                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    Current balance: {formatCrypto(receiveWallet.balance, receiveWallet.symbol)}
                    (≈ {formatCurrency(receiveWallet.fiatValue)})
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowReceiveDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

