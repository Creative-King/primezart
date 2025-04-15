"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, ChevronRight, Lock, Eye, EyeOff, Shield, CreditCardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export default function CardsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [accountMode, setAccountMode] = useState("personal")
  const [activeTab, setActiveTab] = useState("physical")
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [requestCardDialogOpen, setRequestCardDialogOpen] = useState(false)
  const [freezeCardDialogOpen, setFreezeCardDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  // Mock cards data
  const personalCards = [
    {
      id: "card1",
      type: "Credit",
      name: "Primezart Premium Credit Card",
      number: "5459 **** **** 7949",
      expiryDate: "03/28",
      cvv: "***",
      status: "Active",
      limit: 10000,
      balance: 2500,
      color: "from-[#f5e7b9] to-[#e6c66e]",
      textColor: "text-[#003366]",
    },
    {
      id: "card2",
      type: "Debit",
      name: "Primezart Everyday Debit Card",
      number: "4539 **** **** 1234",
      expiryDate: "05/27",
      cvv: "***",
      status: "Active",
      linkedAccount: "Checking",
      color: "from-[#003366] to-[#001a33]",
      textColor: "text-white",
    },
  ]

  const businessCards = [
    {
      id: "card3",
      type: "Credit",
      name: "Primezart Business Platinum Card",
      number: "4539 **** **** 6123",
      expiryDate: "05/27",
      cvv: "***",
      status: "Active",
      limit: 50000,
      balance: 12750,
      color: "from-[#1a2a3a] to-[#0d1520]",
      textColor: "text-white",
    },
    {
      id: "card4",
      type: "Debit",
      name: "Primezart Business Debit Card",
      number: "4539 **** **** 8765",
      expiryDate: "09/26",
      cvv: "***",
      status: "Active",
      linkedAccount: "Business Checking",
      color: "from-[#2c3e50] to-[#1a2530]",
      textColor: "text-white",
    },
  ]

  const virtualCards = [
    {
      id: "vcard1",
      type: "Virtual Credit",
      name: "Primezart Virtual Shopping Card",
      number: "4111 **** **** 1111",
      expiryDate: "12/25",
      cvv: "***",
      status: "Active",
      limit: 2000,
      balance: 0,
      color: "from-[#6a11cb] to-[#2575fc]",
      textColor: "text-white",
      accountType: "personal",
    },
    {
      id: "vcard2",
      type: "Virtual Debit",
      name: "Primezart Business Virtual Card",
      number: "5555 **** **** 4444",
      expiryDate: "10/26",
      cvv: "***",
      status: "Active",
      limit: 5000,
      balance: 0,
      color: "from-[#4a00e0] to-[#8e2de2]",
      textColor: "text-white",
      accountType: "business",
    },
  ]

  useEffect(() => {
    setIsClient(true)

    // Check localStorage for account mode
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("accountMode")
      if (storedMode) {
        setAccountMode(storedMode)
      }
    }
  }, [])

  const handleRequestCard = () => {
    setRequestCardDialogOpen(true)
  }

  const handleFreezeCard = (card) => {
    setSelectedCard(card)
    setFreezeCardDialogOpen(true)
  }

  const handleSubmitCardRequest = () => {
    // In a real app, this would submit the request to the backend
    setRequestCardDialogOpen(false)
    alert("Your card request has been submitted successfully!")
  }

  const handleConfirmFreeze = () => {
    // In a real app, this would freeze the card via API call
    setFreezeCardDialogOpen(false)
    alert(`Your ${selectedCard.name} has been frozen. You can unfreeze it at any time.`)
  }

  // Filter cards based on account mode
  const filteredPhysicalCards = accountMode === "personal" ? personalCards : businessCards
  const filteredVirtualCards = virtualCards.filter((card) =>
    accountMode === "personal" ? card.accountType === "personal" : card.accountType === "business",
  )

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cards</h1>
          <p className="text-muted-foreground">Manage your physical and virtual cards.</p>
        </div>
        <Button onClick={handleRequestCard} className="sky-button">
          <Plus className="mr-2 h-4 w-4" /> Request New Card
        </Button>
      </div>

      <Tabs defaultValue="physical" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="physical">Physical Cards</TabsTrigger>
          <TabsTrigger value="virtual">Virtual Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="physical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 sm:px-0">
            {filteredPhysicalCards.map((card) => (
              <Card key={card.id} className="overflow-hidden max-w-[450px] mx-auto w-full">
                <CardHeader className="p-0">
                  <div
                    className={`relative rounded-t-xl overflow-hidden h-48 bg-gradient-to-br ${card.color}`}
                    style={{ minHeight: "180px" }}
                  >
                    {/* Bank logo at top */}
                    <div className="absolute top-4 left-4 flex items-center">
                      <Image
                        src="/images/primezart-logo.png"
                        alt="Primezart Logo"
                        width={24}
                        height={24}
                        className="h-6 w-auto mr-1"
                      />
                      <div className={`${card.textColor} font-bold text-sm`}>Primezart</div>
                    </div>

                    {/* Card Type */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${card.type === "Credit" ? "bg-[#f0a500]" : "bg-blue-500"} text-white`}>
                        {card.type}
                      </Badge>
                    </div>

                    {/* Chip - moved to right side */}
                    <div className="absolute top-16 right-16">
                      <div className="w-10 h-7 bg-[#d4af37] bg-opacity-80 rounded-md border border-[#c4a137] shadow-inner"></div>
                    </div>

                    {/* Card Number */}
                    <div className="absolute bottom-16 left-4">
                      <p className={`font-mono text-xs ${card.textColor} opacity-70 tracking-wider`}>Card Number</p>
                      <p className={`font-mono text-lg ${card.textColor} tracking-wider`}>
                        {showCardDetails
                          ? card.number
                          : card.number.replace(/\d{4} \*{4} \*{4} (\d{4})/, "•••• •••• •••• $1")}
                      </p>
                    </div>

                    {/* Expiration and CVV */}
                    <div className="absolute bottom-4 left-4 flex space-x-6">
                      <div>
                        <p className={`${card.textColor} opacity-70 text-xs mb-1`}>Exp. Date</p>
                        <p className={`${card.textColor} text-sm`}>{showCardDetails ? card.expiryDate : "••/••"}</p>
                      </div>
                      <div>
                        <p className={`${card.textColor} opacity-70 text-xs mb-1`}>CVV</p>
                        <p className={`${card.textColor} text-sm`}>{showCardDetails ? card.cvv : "•••"}</p>
                      </div>
                    </div>

                    {/* Card Holder Name */}
                    <div className="absolute bottom-4 right-4">
                      <p className={`${card.textColor} text-xs uppercase`}>
                        {accountMode === "personal" ? "John Doe" : "Acme Business Inc."}
                      </p>
                    </div>

                    {/* Mastercard logo - adjusted position */}
                    <div className="absolute bottom-12 right-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-red-500 opacity-80"></div>
                        <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80 -ml-3"></div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">{card.name}</h3>
                      <p className="text-sm text-gray-500">
                        {card.type === "Credit"
                          ? `Available Credit: ${card.limit - card.balance}`
                          : `Linked to ${card.linkedAccount}`}
                      </p>
                    </div>
                    <Badge
                      className={card.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {card.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowCardDetails(!showCardDetails)}
                      >
                        {showCardDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {showCardDetails ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFreezeCard(card)}>
                      <Lock className="h-4 w-4 mr-1" /> Freeze Card
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => router.push(`/dashboard/cards/${card.id}`)}
                  >
                    View Card Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="virtual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 sm:px-0">
            {filteredVirtualCards.map((card) => (
              <Card key={card.id} className="overflow-hidden max-w-[450px] mx-auto w-full">
                <CardHeader className="p-0">
                  <div
                    className={`relative rounded-t-xl overflow-hidden h-48 bg-gradient-to-br ${card.color}`}
                    style={{ minHeight: "180px" }}
                  >
                    {/* Bank logo at top */}
                    <div className="absolute top-4 left-4 flex items-center">
                      <Image
                        src="/images/primezart-logo.png"
                        alt="Primezart Logo"
                        width={24}
                        height={24}
                        className="h-6 w-auto mr-1"
                      />
                      <div className={`${card.textColor} font-bold text-sm`}>Primezart</div>
                    </div>

                    {/* Virtual Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-purple-500 text-white">Virtual</Badge>
                    </div>

                    {/* Chip - moved to right side */}
                    <div className="absolute top-16 right-16">
                      <div className="w-10 h-7 bg-[#d4af37] bg-opacity-80 rounded-md border border-[#c4a137] shadow-inner"></div>
                    </div>

                    {/* Card Number */}
                    <div className="absolute bottom-16 left-4">
                      <p className={`font-mono text-xs ${card.textColor} opacity-70 tracking-wider`}>Card Number</p>
                      <p className={`font-mono text-lg ${card.textColor} tracking-wider`}>
                        {showCardDetails
                          ? card.number
                          : card.number.replace(/\d{4} \*{4} \*{4} (\d{4})/, "•••• •••• •••• $1")}
                      </p>
                    </div>

                    {/* Expiration and CVV */}
                    <div className="absolute bottom-4 left-4 flex space-x-6">
                      <div>
                        <p className={`${card.textColor} opacity-70 text-xs mb-1`}>Exp. Date</p>
                        <p className={`${card.textColor} text-sm`}>{showCardDetails ? card.expiryDate : "••/••"}</p>
                      </div>
                      <div>
                        <p className={`${card.textColor} opacity-70 text-xs mb-1`}>CVV</p>
                        <p className={`${card.textColor} text-sm`}>{showCardDetails ? card.cvv : "•••"}</p>
                      </div>
                    </div>

                    {/* Card Holder Name */}
                    <div className="absolute bottom-4 right-4">
                      <p className={`${card.textColor} text-xs uppercase`}>
                        {accountMode === "personal" ? "John Doe" : "Acme Business Inc."}
                      </p>
                    </div>

                    {/* Virtual Card Icon */}
                    <div className="absolute bottom-12 right-4">
                      <Shield className={`h-8 w-8 ${card.textColor} opacity-80`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">{card.name}</h3>
                      <p className="text-sm text-gray-500">{`Limit: ${card.limit}`}</p>
                    </div>
                    <Badge
                      className={card.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {card.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowCardDetails(!showCardDetails)}
                      >
                        {showCardDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {showCardDetails ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFreezeCard(card)}>
                      <Lock className="h-4 w-4 mr-1" /> Freeze Card
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => router.push(`/dashboard/cards/${card.id}`)}
                  >
                    View Card Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Card Dialog */}
      <Dialog open={requestCardDialogOpen} onOpenChange={setRequestCardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request New Card</DialogTitle>
            <DialogDescription>Select the type of card you would like to request.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-type" className="text-right">
                Card Type
              </Label>
              <Select defaultValue="debit">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="virtual">Virtual Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linked-account" className="text-right">
                Linked Account
              </Label>
              <Select defaultValue="checking">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  {accountMode === "business" && <SelectItem value="business">Business Account</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-name" className="text-right">
                Name on Card
              </Label>
              <Input
                id="card-name"
                className="col-span-3"
                defaultValue={accountMode === "personal" ? "John Doe" : "Acme Business Inc."}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Delivery</Label>
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  <Switch id="express-delivery" />
                  <Label htmlFor="express-delivery">Express Delivery (2-3 business days)</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCardRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Freeze Card Dialog */}
      <Dialog open={freezeCardDialogOpen} onOpenChange={setFreezeCardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Freeze Card</DialogTitle>
            <DialogDescription>
              {selectedCard &&
                `Are you sure you want to freeze your ${selectedCard.name}? You can unfreeze it at any time.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              Freezing your card will temporarily prevent any new purchases, ATM withdrawals, or other transactions.
              Recurring payments and subscriptions may still be processed.
            </p>
            <div className="flex items-center p-3 bg-blue-50 rounded-md">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-700">
                For security reasons, we recommend freezing your card if it's misplaced or you suspect unauthorized use.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmFreeze}>
              Freeze Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simplicity Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Card Security Features</CardTitle>
            <CardDescription>
              Primezart cards come with advanced security features to protect your finances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-10 w-10 text-blue-500 mb-2" />
                <h3 className="font-medium mb-1">Fraud Protection</h3>
                <p className="text-sm text-gray-500">24/7 monitoring for suspicious activity with real-time alerts.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Lock className="h-10 w-10 text-blue-500 mb-2" />
                <h3 className="font-medium mb-1">Instant Card Freeze</h3>
                <p className="text-sm text-gray-500">Freeze and unfreeze your card instantly from your dashboard.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <CreditCardIcon className="h-10 w-10 text-blue-500 mb-2" />
                <h3 className="font-medium mb-1">Contactless Payments</h3>
                <p className="text-sm text-gray-500">Secure tap-to-pay technology for quick and safe transactions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
