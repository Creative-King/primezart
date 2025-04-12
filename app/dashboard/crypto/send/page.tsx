"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, QrCode, Copy, CheckCircle2, Info, AlertTriangle, Loader2 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

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

// Mock saved recipients
const savedRecipients = [
  { id: "rec1", name: "John's Hardware Wallet", address: "bc1q9h6mqc5kwqj3rew8gd3z4qjq5ecvnj3f8ksct8", asset: "btc" },
  { id: "rec2", name: "Crypto Exchange Account", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", asset: "eth" },
  { id: "rec3", name: "DeFi Staking Wallet", address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t", asset: "usdt" },
  { id: "rec4", name: "Mining Pool", address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5", asset: "btc" },
  { id: "rec5", name: "Cold Storage", address: "0x9876543210abcdef0123456789abcdef01234567", asset: "eth" },
]

// Form schema for crypto send
const cryptoSendSchema = z.object({
  asset: z.string().min(1, "Please select an asset"),
  recipient: z.string().min(1, "Recipient address is required"),
  amount: z.string().refine((val) => {
    const num = Number.parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Please enter a valid amount"),
  memo: z.string().optional(),
  networkFee: z.string().default("medium"),
})

export default function CryptoSend() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sendTab, setSendTab] = useState("new")
  const [selectedAsset, setSelectedAsset] = useState<(typeof cryptoAssets)[0] | null>(null)
  const [networkFee, setNetworkFee] = useState({
    slow: { amount: 0.0001, usd: 6.0, time: "~60 minutes" },
    medium: { amount: 0.0003, usd: 18.0, time: "~20 minutes" },
    fast: { amount: 0.0005, usd: 30.0, time: "~5 minutes" },
  })

  // Crypto send form
  const form = useForm<z.infer<typeof cryptoSendSchema>>({
    resolver: zodResolver(cryptoSendSchema),
    defaultValues: {
      asset: "",
      recipient: "",
      amount: "",
      memo: "",
      networkFee: "medium",
    },
  })

  // Watch for asset and amount changes
  const watchAsset = form.watch("asset")
  const watchAmount = form.watch("amount")
  const watchNetworkFee = form.watch("networkFee")

  // Update selected asset when asset changes
  const updateSelectedAsset = (assetId: string) => {
    const asset = cryptoAssets.find((a) => a.id === assetId)
    if (asset) {
      setSelectedAsset(asset)

      // Update network fees based on the selected asset
      if (assetId === "btc") {
        setNetworkFee({
          slow: { amount: 0.0001, usd: 6.0, time: "~60 minutes" },
          medium: { amount: 0.0003, usd: 18.0, time: "~20 minutes" },
          fast: { amount: 0.0005, usd: 30.0, time: "~5 minutes" },
        })
      } else if (assetId === "eth") {
        setNetworkFee({
          slow: { amount: 0.001, usd: 2.0, time: "~5 minutes" },
          medium: { amount: 0.002, usd: 4.0, time: "~2 minutes" },
          fast: { amount: 0.003, usd: 6.0, time: "~30 seconds" },
        })
      } else {
        setNetworkFee({
          slow: { amount: 0.5, usd: 0.5, time: "~2 minutes" },
          medium: { amount: 1, usd: 1.0, time: "~1 minute" },
          fast: { amount: 2, usd: 2.0, time: "~30 seconds" },
        })
      }
    }
  }

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

  // Calculate USD value of crypto amount
  const calculateUsdValue = (amount: string, asset: (typeof cryptoAssets)[0] | null) => {
    if (!asset) return null

    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return null

    const usdPerUnit = asset.usdValue / asset.balance
    return numAmount * usdPerUnit
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof cryptoSendSchema>) => {
    console.log("Crypto send values:", values)
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
        title: "Transaction Submitted",
        description: "Your crypto transaction has been submitted to the network.",
        variant: "default",
      })
    }, 3000)
  }

  // Load saved recipient
  const loadRecipient = (recipientId: string) => {
    const recipient = savedRecipients.find((r) => r.id === recipientId)
    if (recipient) {
      form.setValue("recipient", recipient.address)
      form.setValue("asset", recipient.asset)
      updateSelectedAsset(recipient.asset)
      setSendTab("new")
    }
  }

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Address Copied",
      description: "The address has been copied to your clipboard.",
      variant: "default",
    })
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
              <h2 className="text-2xl font-bold text-[#003366] mb-2">Transaction Submitted!</h2>
              <p className="text-gray-700 mb-6">
                Your crypto transaction has been submitted to the network. It may take some time to be confirmed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Asset:</span>
                  <span className="font-medium">
                    {selectedAsset?.name} ({selectedAsset?.symbol})
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {watchAmount} {selectedAsset?.symbol}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-medium truncate max-w-[200px]">{form.getValues().recipient}</span>
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
              <h2 className="text-2xl font-bold text-[#003366] mb-2">Processing Transaction</h2>
              <p className="text-gray-700 mb-6">
                Your transaction is being submitted to the network. Please do not close this window.
              </p>
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
            <Send className="mr-2 h-6 w-6" />
            Send Crypto
          </h1>
        </div>

        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Always double-check recipient addresses before sending. Crypto transactions cannot be reversed once
            confirmed.
          </AlertDescription>
        </Alert>

        <Tabs value={sendTab} onValueChange={setSendTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="new" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              New Transaction
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Saved Recipients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>Send Cryptocurrency</CardTitle>
                <CardDescription>Transfer crypto to another wallet or exchange</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="asset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Asset</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              updateSelectedAsset(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cryptocurrency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cryptoAssets.map((asset) => (
                                <SelectItem key={asset.id} value={asset.id}>
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
                          {selectedAsset && (
                            <FormDescription>
                              Available balance: {formatCrypto(selectedAsset.balance, selectedAsset.symbol)}(
                              {formatCurrency(selectedAsset.usdValue)})
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Address</FormLabel>
                          <div className="flex">
                            <FormControl>
                              <Input placeholder="Enter wallet address" {...field} className="rounded-r-none" />
                            </FormControl>
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline" className="rounded-l-none border-l-0">
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </div>
                          <FormDescription>
                            Enter the recipient's {selectedAsset?.name || "crypto"} wallet address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input placeholder="0.00" {...field} className="flex-1" />
                            </FormControl>
                            {selectedAsset && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  form.setValue("amount", selectedAsset.balance.toString())
                                }}
                                className="whitespace-nowrap"
                              >
                                Max
                              </Button>
                            )}
                          </div>
                          {selectedAsset && watchAmount && !isNaN(Number(watchAmount)) && (
                            <FormDescription>
                              ≈ {formatCurrency(calculateUsdValue(watchAmount, selectedAsset) || 0)}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="networkFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Network Fee</FormLabel>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              type="button"
                              variant={watchNetworkFee === "slow" ? "default" : "outline"}
                              className={`flex flex-col items-center justify-center h-24 ${
                                watchNetworkFee === "slow" ? "bg-indigo-600 text-white" : ""
                              }`}
                              onClick={() => form.setValue("networkFee", "slow")}
                            >
                              <span className="font-semibold">Slow</span>
                              <span className="text-xs mt-1">{networkFee.slow.time}</span>
                              <span className="text-xs mt-1">
                                {selectedAsset?.symbol} {networkFee.slow.amount}
                              </span>
                              <span className="text-xs mt-1">${networkFee.slow.usd.toFixed(2)}</span>
                            </Button>
                            <Button
                              type="button"
                              variant={watchNetworkFee === "medium" ? "default" : "outline"}
                              className={`flex flex-col items-center justify-center h-24 ${
                                watchNetworkFee === "medium" ? "bg-indigo-600 text-white" : ""
                              }`}
                              onClick={() => form.setValue("networkFee", "medium")}
                            >
                              <span className="font-semibold">Medium</span>
                              <span className="text-xs mt-1">{networkFee.medium.time}</span>
                              <span className="text-xs mt-1">
                                {selectedAsset?.symbol} {networkFee.medium.amount}
                              </span>
                              <span className="text-xs mt-1">${networkFee.medium.usd.toFixed(2)}</span>
                            </Button>
                            <Button
                              type="button"
                              variant={watchNetworkFee === "fast" ? "default" : "outline"}
                              className={`flex flex-col items-center justify-center h-24 ${
                                watchNetworkFee === "fast" ? "bg-indigo-600 text-white" : ""
                              }`}
                              onClick={() => form.setValue("networkFee", "fast")}
                            >
                              <span className="font-semibold">Fast</span>
                              <span className="text-xs mt-1">{networkFee.fast.time}</span>
                              <span className="text-xs mt-1">
                                {selectedAsset?.symbol} {networkFee.fast.amount}
                              </span>
                              <span className="text-xs mt-1">${networkFee.fast.usd.toFixed(2)}</span>
                            </Button>
                          </div>
                          <FormDescription>Select transaction priority and fee</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo / Tag (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter memo or destination tag if required" {...field} />
                          </FormControl>
                          <FormDescription>Some exchanges require a memo or tag for deposits</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Information box */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                      <p className="font-medium mb-1 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Transaction Information
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Transactions typically take 10-60 minutes to confirm depending on the network</li>
                        <li>Higher network fees result in faster confirmation times</li>
                        <li>Always double-check the recipient address before sending</li>
                        <li>Crypto transactions cannot be reversed once confirmed</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => router.push("/dashboard/crypto")}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        Review Transaction
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                <CardTitle>Saved Recipients</CardTitle>
                <CardDescription>Select a saved recipient to start a transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="border rounded-lg p-4 hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
                      onClick={() => loadRecipient(recipient.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-indigo-600">{recipient.name}</h3>
                          <p className="text-sm text-gray-500 font-mono truncate max-w-[300px] md:max-w-[500px]">
                            {recipient.address}
                          </p>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {cryptoAssets.find((a) => a.id === recipient.asset)?.name ||
                                recipient.asset.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(recipient.address)
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              loadRecipient(recipient.id)
                            }}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Scanner Dialog */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>Scan a QR code containing a wallet address</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-gray-100 w-64 h-64 flex items-center justify-center rounded-lg mb-4">
              <p className="text-gray-500 text-center">Camera access required to scan QR codes</p>
            </div>
            <Button
              onClick={() =>
                toast({
                  title: "Camera Access Required",
                  description: "Please allow camera access to scan QR codes.",
                  variant: "default",
                })
              }
            >
              Enable Camera
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>Please review your transaction details before confirming</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Asset:</span>
                <span className="font-medium">
                  {selectedAsset?.name} ({selectedAsset?.symbol})
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {watchAmount} {selectedAsset?.symbol}
                  {selectedAsset && watchAmount && (
                    <span className="text-gray-500 text-sm ml-1">
                      (≈{formatCurrency(calculateUsdValue(watchAmount, selectedAsset) || 0)})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium truncate max-w-[200px]">{form.getValues().recipient}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Network Fee:</span>
                <span className="font-medium">
                  {selectedAsset?.symbol} {networkFee[watchNetworkFee as keyof typeof networkFee].amount}
                  <span className="text-gray-500 text-sm ml-1">
                    (${networkFee[watchNetworkFee as keyof typeof networkFee].usd.toFixed(2)})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">
                  {selectedAsset && watchAmount && (
                    <>
                      {Number.parseFloat(watchAmount) + networkFee[watchNetworkFee as keyof typeof networkFee].amount}{" "}
                      {selectedAsset.symbol}
                    </>
                  )}
                </span>
              </div>
            </div>

            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This transaction cannot be reversed once confirmed. Please verify all details are correct.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirming(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-indigo-600 hover:bg-indigo-700">
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
