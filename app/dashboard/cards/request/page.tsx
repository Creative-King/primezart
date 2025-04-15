"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle, Shield, Wallet, Landmark } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock account data
const accounts = [
  { id: "acc1", name: "Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "acc2", name: "Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
]

// Form schema for card request
const cardRequestSchema = z.object({
  cardType: z.enum(["debit", "credit"]),
  cardDesign: z.string().min(1, "Please select a card design"),
  linkedAccount: z.string().min(1, "Please select an account to link"),
  nameOnCard: z.string().min(1, "Name on card is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),

  // Credit card specific fields
  creditLimit: z.string().optional(),
  employmentStatus: z.string().optional(),
  annualIncome: z.string().optional(),

  // Terms acceptance
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export default function CardRequest() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [cardTab, setCardTab] = useState<"debit" | "credit">("debit")

  // Card request form
  const form = useForm<z.infer<typeof cardRequestSchema>>({
    resolver: zodResolver(cardRequestSchema),
    defaultValues: {
      cardType: "debit",
      cardDesign: "",
      linkedAccount: "",
      nameOnCard: "",
      deliveryAddress: "",
      contactPhone: "",
      creditLimit: "",
      employmentStatus: "",
      annualIncome: "",
      termsAccepted: false,
    },
  })

  // Watch for card type changes
  const watchCardType = form.watch("cardType")

  // Update card type when tab changes
  const handleTabChange = (value: string) => {
    if (value === "debit" || value === "credit") {
      setCardTab(value)
      form.setValue("cardType", value as "debit" | "credit")
    }
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof cardRequestSchema>) => {
    console.log("Card request values:", values)

    // In a real app, you would submit this to your backend
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1500)
  }

  // Card design options
  const debitCardDesigns = [
    {
      id: "classic",
      name: "Classic",
      image: "/placeholder.svg?height=120&width=180",
      description: "Standard debit card with no annual fee",
    },
    {
      id: "premium",
      name: "Premium",
      image: "/placeholder.svg?height=120&width=180",
      description: "Enhanced security features and exclusive offers",
    },
    {
      id: "metal",
      name: "Metal",
      image: "/placeholder.svg?height=120&width=180",
      description: "Durable metal card with premium benefits",
    },
  ]

  const creditCardDesigns = [
    {
      id: "rewards",
      name: "Rewards",
      image: "/placeholder.svg?height=120&width=180",
      description: "Earn points on every purchase",
    },
    {
      id: "cashback",
      name: "Cash Back",
      image: "/placeholder.svg?height=120&width=180",
      description: "Get cash back on eligible purchases",
    },
    {
      id: "travel",
      name: "Travel",
      image: "/placeholder.svg?height=120&width=180",
      description: "No foreign transaction fees and travel benefits",
    },
    {
      id: "platinum",
      name: "Platinum",
      image: "/placeholder.svg?height=120&width=180",
      description: "Premium card with exclusive benefits and higher limits",
    },
  ]

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="container mx-auto pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-[#003366] mb-2">Card Request Submitted!</h2>
              <p className="text-gray-700 mb-6">
                Your {watchCardType === "credit" ? "credit" : "debit"} card request has been successfully submitted. You
                will receive a confirmation email shortly with details about your new card.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.push("/dashboard")}
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

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#003366] flex items-center">
            <CreditCard className="mr-2 h-6 w-6" />
            Request a New Card
          </h1>
        </div>

        <Tabs value={cardTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="debit">Debit Card</TabsTrigger>
            <TabsTrigger value="credit">Credit Card</TabsTrigger>
          </TabsList>

          <TabsContent value="debit">
            <Card>
              <CardHeader>
                <CardTitle>Request a Debit Card</CardTitle>
                <CardDescription>
                  A debit card is linked directly to your checking account and allows you to make purchases or withdraw
                  cash.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <input type="hidden" {...form.register("cardType")} value="debit" />

                    <FormField
                      control={form.control}
                      name="cardDesign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Card Design</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            {debitCardDesigns.map((design) => (
                              <div
                                key={design.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                  field.value === design.id
                                    ? "border-[#003366] bg-blue-50 ring-2 ring-blue-200"
                                    : "hover:border-gray-300"
                                }`}
                                onClick={() => form.setValue("cardDesign", design.id)}
                              >
                                <div className="relative h-24 w-full mb-3">
                                  <Image
                                    src={design.image || "/placeholder.svg"}
                                    alt={design.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <h3 className="font-semibold text-[#003366]">{design.name}</h3>
                                <p className="text-sm text-gray-600">{design.description}</p>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link to Account</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account to link" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accounts
                                .filter((acc) => acc.type === "checking")
                                .map((acc) => (
                                  <SelectItem key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.number})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Your debit card will be linked to this account for purchases and withdrawals
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nameOnCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name as it should appear on card" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full delivery address" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your card will be delivered to this address within 7-10 business days
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">Debit Card Features</p>
                          <ul className="list-disc list-inside space-y-1 ml-1">
                            <li>Zero liability protection for unauthorized transactions</li>
                            <li>Contactless payment capability</li>
                            <li>Access to over 40,000 fee-free ATMs nationwide</li>
                            <li>24/7 fraud monitoring</li>
                            <li>Mobile wallet compatibility (Apple Pay, Google Pay, Samsung Pay)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I agree to the terms and conditions for card issuance and usage</FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#003366]">
                        {form.formState.isSubmitting ? "Processing..." : "Submit Request"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit">
            <Card>
              <CardHeader>
                <CardTitle>Request a Credit Card</CardTitle>
                <CardDescription>
                  A credit card allows you to borrow money for purchases up to a pre-approved limit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Credit approval is subject to application review and creditworthiness. Additional verification may
                    be required.
                  </AlertDescription>
                </Alert>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <input type="hidden" {...form.register("cardType")} value="credit" />

                    <FormField
                      control={form.control}
                      name="cardDesign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Card Type</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {creditCardDesigns.map((design) => (
                              <div
                                key={design.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                  field.value === design.id
                                    ? "border-[#003366] bg-blue-50 ring-2 ring-blue-200"
                                    : "hover:border-gray-300"
                                }`}
                                onClick={() => form.setValue("cardDesign", design.id)}
                              >
                                <div className="relative h-24 w-full mb-3">
                                  <Image
                                    src={design.image || "/placeholder.svg"}
                                    alt={design.name}
                                    className="object-contain"
                                    fill
                                  />
                                </div>
                                <h3 className="font-semibold text-[#003366]">{design.name}</h3>
                                <p className="text-sm text-gray-600">{design.description}</p>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nameOnCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name as it should appear on card" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full delivery address" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your card will be delivered to this address within 7-10 business days
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="employed">Employed Full-Time</SelectItem>
                              <SelectItem value="part-time">Employed Part-Time</SelectItem>
                              <SelectItem value="self-employed">Self-Employed</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="annualIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Income</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <Input className="pl-7" placeholder="0.00" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="creditLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested Credit Limit (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <Input className="pl-7" placeholder="0.00" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>Leave blank for standard evaluation</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                      <div className="flex items-start">
                        <Wallet className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">Credit Card Benefits</p>
                          <ul className="list-disc list-inside space-y-1 ml-1">
                            <li>No annual fee for the first year</li>
                            <li>Earn rewards points on every purchase</li>
                            <li>0% intro APR on purchases for 12 months</li>
                            <li>24/7 concierge service for Platinum cardholders</li>
                            <li>Travel insurance and purchase protection</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions for card issuance and usage, and authorize a credit
                              check
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#003366]">
                        {form.formState.isSubmitting ? "Processing..." : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Landmark className="h-4 w-4 mr-2" />
                  <p>Credit decisions are typically made within 2-3 business days. You will be notified via email.</p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
