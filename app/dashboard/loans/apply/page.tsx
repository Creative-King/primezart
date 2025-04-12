"use client"

import { useEffect } from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Home,
  Car,
  Briefcase,
  GraduationCap,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

// Loan types
const loanTypes = [
  {
    id: "mortgage",
    name: "Mortgage",
    description: "Finance your dream home",
    icon: <Home className="h-5 w-5 text-blue-600" />,
    color: "bg-blue-100",
    minAmount: 100000,
    maxAmount: 1000000,
    rates: "3.99% - 5.49%",
    terms: "15 - 30 years",
  },
  {
    id: "auto",
    name: "Auto Loan",
    description: "Finance your next vehicle",
    icon: <Car className="h-5 w-5 text-green-600" />,
    color: "bg-green-100",
    minAmount: 5000,
    maxAmount: 100000,
    rates: "3.49% - 6.99%",
    terms: "2 - 7 years",
  },
  {
    id: "personal",
    name: "Personal Loan",
    description: "For your personal needs",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
    color: "bg-purple-100",
    minAmount: 1000,
    maxAmount: 50000,
    rates: "5.99% - 15.99%",
    terms: "1 - 7 years",
  },
  {
    id: "business",
    name: "Business Loan",
    description: "Grow your business",
    icon: <Briefcase className="h-5 w-5 text-amber-600" />,
    color: "bg-amber-100",
    minAmount: 10000,
    maxAmount: 500000,
    rates: "4.99% - 12.99%",
    terms: "1 - 10 years",
  },
  {
    id: "education",
    name: "Education Loan",
    description: "Invest in your education",
    icon: <GraduationCap className="h-5 w-5 text-indigo-600" />,
    color: "bg-indigo-100",
    minAmount: 5000,
    maxAmount: 100000,
    rates: "3.99% - 7.99%",
    terms: "5 - 15 years",
  },
]

// Form schema for loan application
const loanApplicationSchema = z
  .object({
    loanType: z.string().min(1, "Please select a loan type"),
    loanAmount: z.number().min(1000, "Minimum loan amount is $1,000"),
    loanTerm: z.number().min(12, "Minimum term is 12 months"),
    purpose: z.string().min(1, "Please specify the purpose of the loan"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    employmentStatus: z.enum(["employed", "self-employed", "retired", "unemployed"]),
    employerName: z.string().optional(),
    annualIncome: z.string().min(1, "Annual income is required"),
    creditScore: z.enum(["excellent", "good", "fair", "poor"]),
    existingCustomer: z.boolean().default(false),
    accountNumber: z.string().optional(),
    additionalInfo: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    privacyPolicyAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    }),
  })
  .refine(
    (data) => {
      if (data.employmentStatus === "employed" || data.employmentStatus === "self-employed") {
        return !!data.employerName
      }
      return true
    },
    {
      message: "Employer name is required",
      path: ["employerName"],
    },
  )
  .refine(
    (data) => {
      if (data.existingCustomer) {
        return !!data.accountNumber
      }
      return true
    },
    {
      message: "Account number is required for existing customers",
      path: ["accountNumber"],
    },
  )

export default function LoanApplicationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<"pending" | "approved" | "rejected">("pending")
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null)

  // Get loan type details
  const getLoanTypeDetails = (id: string) => {
    return loanTypes.find((loan) => loan.id === id)
  }

  // Loan application form
  const form = useForm<z.infer<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanType: "",
      loanAmount: 10000,
      loanTerm: 36,
      purpose: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      employmentStatus: "employed",
      employerName: "",
      annualIncome: "",
      creditScore: "good",
      existingCustomer: false,
      accountNumber: "",
      additionalInfo: "",
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },
  })

  const watchLoanType = form.watch("loanType")
  const watchEmploymentStatus = form.watch("employmentStatus")
  const watchExistingCustomer = form.watch("existingCustomer")
  const watchLoanAmount = form.watch("loanAmount")
  const watchLoanTerm = form.watch("loanTerm")

  // Update loan type details when loan type changes
  useEffect(() => {
    if (watchLoanType) {
      setSelectedLoanType(watchLoanType)
    }
  }, [watchLoanType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const loanType = getLoanTypeDetails(watchLoanType)
    if (!loanType) return 0

    // Use middle rate for estimation
    const rateRange = loanType.rates.split(" - ")
    const minRate = Number.parseFloat(rateRange[0].replace("%", ""))
    const maxRate = Number.parseFloat(rateRange[1].replace("%", ""))
    const rate = (minRate + maxRate) / 2

    // Monthly interest rate
    const monthlyRate = rate / 100 / 12
    // Calculate monthly payment using the loan formula
    const payment = (watchLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -watchLoanTerm))

    return payment
  }

  const nextStep = () => {
    const fieldsToValidate =
      currentStep === 1
        ? ["loanType", "loanAmount", "loanTerm", "purpose"]
        : currentStep === 2
          ? ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]
          : []

    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setCurrentStep(currentStep + 1)
      }
    })
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const onSubmit = (values: z.infer<typeof loanApplicationSchema>) => {
    console.log("Loan application values:", values)

    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true)
      setApplicationStatus("pending")
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="container mx-auto pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/loans")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Loans
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              {applicationStatus === "pending" ? (
                <>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Application Submitted</h2>
                  <p className="text-gray-700 mb-4">
                    Your loan application has been successfully submitted and is now under review.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">Application Details</h3>
                    <div className="space-y-1 text-sm text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Type:</span>
                        <span className="font-medium">{getLoanTypeDetails(form.getValues("loanType"))?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-medium">{formatCurrency(form.getValues("loanAmount"))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Term:</span>
                        <span className="font-medium">
                          {form.getValues("loanTerm")} months ({Math.floor(form.getValues("loanTerm") / 12)} years)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application ID:</span>
                        <span className="font-medium">LOAN-{Math.floor(Math.random() * 1000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date Submitted:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg mb-6 text-left">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-amber-800 text-sm">What happens next?</h4>
                        <ul className="text-sm text-amber-700 mt-1 space-y-1 list-disc list-inside">
                          <li>Our loan team will review your application within 1-2 business days</li>
                          <li>You'll receive an email notification with the status of your application</li>
                          <li>If approved, you'll be contacted to complete the loan process</li>
                          <li>You can check your application status in your account dashboard</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : applicationStatus === "approved" ? (
                <>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Application Approved</h2>
                  <p className="text-gray-700 mb-4">Congratulations! Your loan application has been approved.</p>
                </>
              ) : (
                <>
                  <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-[#003366] mb-2">Application Rejected</h2>
                  <p className="text-gray-700 mb-4">
                    We're sorry, but your loan application has been rejected. Please contact our customer support for
                    more information.
                  </p>
                </>
              )}

              <div className="flex gap-4 justify-center mt-6">
                <Button onClick={() => router.push("/dashboard/loans")} className="bg-[#003366] hover:bg-[#002244]">
                  Return to Loans
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
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/loans")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Loans
          </Button>
          <h1 className="text-2xl font-bold text-[#003366]">Loan Application</h1>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center w-full max-w-3xl">
            <div className={`flex-1 h-2 ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <div className={`flex-1 h-2 ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
            <div className={`flex-1 h-2 ${currentStep >= 3 ? "bg-blue-500" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              3
            </div>
            <div className={`flex-1 h-2 ${currentStep >= 4 ? "bg-blue-500" : "bg-gray-200"}`}></div>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Loan Details"}
              {currentStep === 2 && "Personal Information"}
              {currentStep === 3 && "Financial Information"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Select your loan type and enter loan details"}
              {currentStep === 2 && "Provide your personal information"}
              {currentStep === 3 && "Tell us about your financial situation"}
              {currentStep === 4 && "Review your application and submit"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="loanType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Type</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {loanTypes.map((loan) => (
                              <div
                                key={loan.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                  field.value === loan.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                                }`}
                                onClick={() => {
                                  field.onChange(loan.id)
                                  // Set default loan amount based on loan type
                                  form.setValue("loanAmount", loan.minAmount)
                                }}
                              >
                                <div className="flex items-center">
                                  <div className={`p-3 ${loan.color} rounded-full mr-3`}>{loan.icon}</div>
                                  <div>
                                    <h3 className="font-medium">{loan.name}</h3>
                                    <p className="text-sm text-gray-500">{loan.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedLoanType && (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Loan Information</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Amount Range</p>
                              <p className="font-medium">
                                {formatCurrency(getLoanTypeDetails(selectedLoanType)?.minAmount || 0)} -{" "}
                                {formatCurrency(getLoanTypeDetails(selectedLoanType)?.maxAmount || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Interest Rates</p>
                              <p className="font-medium">{getLoanTypeDetails(selectedLoanType)?.rates}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Terms</p>
                              <p className="font-medium">{getLoanTypeDetails(selectedLoanType)?.terms}</p>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="loanAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Amount</FormLabel>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">{formatCurrency(field.value)}</span>
                                </div>
                                <FormControl>
                                  <Slider
                                    min={getLoanTypeDetails(selectedLoanType)?.minAmount || 1000}
                                    max={getLoanTypeDetails(selectedLoanType)?.maxAmount || 100000}
                                    step={1000}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{formatCurrency(getLoanTypeDetails(selectedLoanType)?.minAmount || 0)}</span>
                                  <span>{formatCurrency(getLoanTypeDetails(selectedLoanType)?.maxAmount || 0)}</span>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="loanTerm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Term (months)</FormLabel>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">
                                    {field.value} months ({Math.floor(field.value / 12)} years)
                                  </span>
                                </div>
                                <FormControl>
                                  <Slider
                                    min={12}
                                    max={360}
                                    step={12}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>1 year</span>
                                  <span>30 years</span>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 mb-2">Estimated Monthly Payment</h3>
                          <p className="text-2xl font-bold text-blue-700">
                            {formatCurrency(calculateMonthlyPayment())}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            This is an estimate based on the loan amount, term, and average interest rate.
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purpose of Loan</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe the purpose of this loan"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>Briefly explain how you plan to use the loan funds.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email address" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AL">Alabama</SelectItem>
                                <SelectItem value="AK">Alaska</SelectItem>
                                <SelectItem value="AZ">Arizona</SelectItem>
                                {/* Add other states */}
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="NY">New York</SelectItem>
                                <SelectItem value="TX">Texas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="existingCustomer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I am an existing customer</FormLabel>
                            <FormDescription>Check this box if you already have an account with us.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {watchExistingCustomer && (
                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Employment Status</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="employed" />
                                </FormControl>
                                <FormLabel className="font-normal">Employed</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="self-employed" />
                                </FormControl>
                                <FormLabel className="font-normal">Self-Employed</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="retired" />
                                </FormControl>
                                <FormLabel className="font-normal">Retired</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="unemployed" />
                                </FormControl>
                                <FormLabel className="font-normal">Unemployed</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(watchEmploymentStatus === "employed" || watchEmploymentStatus === "self-employed") && (
                      <FormField
                        control={form.control}
                        name="employerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {watchEmploymentStatus === "employed" ? "Employer Name" : "Business Name"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  watchEmploymentStatus === "employed"
                                    ? "Enter your employer's name"
                                    : "Enter your business name"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

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
                          <FormDescription>Please provide your gross annual income before taxes.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your credit score range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent (750+)</SelectItem>
                              <SelectItem value="good">Good (700-749)</SelectItem>
                              <SelectItem value="fair">Fair (650-699)</SelectItem>
                              <SelectItem value="poor">Poor (Below 650)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us determine your interest rate. We will verify this information.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information you'd like to share"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include any information that might help us evaluate your application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-medium text-lg mb-4">Application Summary</h3>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-2">Loan Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Loan Type</p>
                              <p className="font-medium">{getLoanTypeDetails(watchLoanType)?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Loan Amount</p>
                              <p className="font-medium">{formatCurrency(watchLoanAmount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Loan Term</p>
                              <p className="font-medium">
                                {watchLoanTerm} months ({Math.floor(watchLoanTerm / 12)} years)
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Estimated Monthly Payment</p>
                              <p className="font-medium">{formatCurrency(calculateMonthlyPayment())}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-2">Personal Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">
                                {form.getValues("firstName")} {form.getValues("lastName")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{form.getValues("email")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{form.getValues("phone")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">
                                {form.getValues("address")}, {form.getValues("city")}, {form.getValues("state")}{" "}
                                {form.getValues("zipCode")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-2">Financial Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Employment Status</p>
                              <p className="font-medium capitalize">{form.getValues("employmentStatus")}</p>
                            </div>
                            {(form.getValues("employmentStatus") === "employed" ||
                              form.getValues("employmentStatus") === "self-employed") && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  {form.getValues("employmentStatus") === "employed"
                                    ? "Employer Name"
                                    : "Business Name"}
                                </p>
                                <p className="font-medium">{form.getValues("employerName")}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-500">Annual Income</p>
                              <p className="font-medium">${form.getValues("annualIncome")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Credit Score Range</p>
                              <p className="font-medium capitalize">{form.getValues("creditScore")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="font-medium text-amber-800 text-sm">Important Information</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            By submitting this application, you authorize us to obtain credit reports and verify the
                            information provided. This application does not guarantee loan approval.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I agree to the terms and conditions</FormLabel>
                            <FormDescription>
                              By checking this box, you confirm that you have read and agree to our{" "}
                              <a href="#" className="text-blue-600 hover:underline">
                                terms and conditions
                              </a>
                              .
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacyPolicyAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I agree to the privacy policy</FormLabel>
                            <FormDescription>
                              By checking this box, you confirm that you have read and agree to our{" "}
                              <a href="#" className="text-blue-600 hover:underline">
                                privacy policy
                              </a>
                              .
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex justify-between pt-4">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button type="button" className="ml-auto" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="ml-auto bg-[#003366]">
                      Submit Application
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
