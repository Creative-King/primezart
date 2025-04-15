"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, Upload, AlertCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

// Base form schema with common fields
const baseFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(6, "PIN cannot exceed 6 digits")
    .regex(/^\d+$/, "PIN must contain only numbers"),
})

// Additional fields for business accounts
const businessFormSchema = baseFormSchema.extend({
  companyName: z.string().min(1, "Company name is required"),
  businessType: z.string().min(1, "Business type is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  businessDescription: z.string().min(1, "Business description is required"),
})

// Additional fields for investment accounts
const investmentFormSchema = baseFormSchema.extend({
  investmentExperience: z.string().min(1, "Investment experience is required"),
  riskTolerance: z.string().min(1, "Risk tolerance is required"),
  investmentGoals: z.string().min(1, "Investment goals are required"),
  initialInvestment: z.string().min(1, "Initial investment amount is required"),
})

// Additional fields for joint accounts
const jointFormSchema = baseFormSchema.extend({
  secondaryFirstName: z.string().min(1, "Secondary first name is required"),
  secondaryLastName: z.string().min(1, "Secondary last name is required"),
  secondaryEmail: z.string().email("Invalid secondary email address"),
  secondaryPhone: z.string().min(10, "Secondary phone number must be at least 10 digits"),
  relationshipType: z.string().min(1, "Relationship type is required"),
})

export default function EnrollmentForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null)
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null)
  const [idError, setIdError] = useState<string | null>(null)
  const [accountType, setAccountType] = useState<string>("checking")
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [verificationStatus, setVerificationStatus] = useState("pending")
  const router = useRouter()

  // Determine which form schema to use based on account type
  const getFormSchema = () => {
    switch (accountType) {
      case "business":
        return businessFormSchema
      case "investment":
        return investmentFormSchema
      case "joint":
        return jointFormSchema
      default:
        return baseFormSchema
    }
  }

  // Get account type from localStorage on component mount
  useEffect(() => {
    const storedAccountType = localStorage.getItem("selectedAccountType")
    if (storedAccountType) {
      setAccountType(storedAccountType)
    }
  }, [])

  // Initialize form with the appropriate schema
  const form = useForm<any>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      pin: "",
      // Business fields
      companyName: "",
      businessType: "",
      taxId: "",
      annualRevenue: "",
      numberOfEmployees: "",
      businessDescription: "",
      // Investment fields
      investmentExperience: "",
      riskTolerance: "",
      investmentGoals: "",
      initialInvestment: "",
      // Joint account fields
      secondaryFirstName: "",
      secondaryLastName: "",
      secondaryEmail: "",
      secondaryPhone: "",
      relationshipType: "",
    },
  })

  // Reset form when account type changes
  useEffect(() => {
    form.reset()
  }, [accountType, form])

  // Generate a random OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  function onSubmit(values: any) {
    // Check if ID has been uploaded
    if (!idFrontPreview || !idBackPreview) {
      setIdError("Please upload both sides of your ID document")
      return
    }

    // In a real app, you would submit this to your backend
    console.log(values)

    // Store account type and PIN in localStorage
    localStorage.setItem("newAccountType", accountType)
    localStorage.setItem("userEmail", values.email)
    localStorage.setItem("userPassword", values.password) // Note: In a real app, never store passwords in localStorage
    localStorage.setItem("userPIN", values.pin) // Store the PIN for transaction validation

    // Generate OTP and show verification screen
    const otp = generateOTP()
    setGeneratedOtp(otp)
    setUserEmail(values.email)
    setShowOtpVerification(true)

    // Simulate sending OTP to email
    console.log(`OTP ${otp} would be sent to ${values.email} in a real application`)
  }

  const verifyOTP = () => {
    if (otpValue === generatedOtp) {
      // OTP is correct
      setVerificationStatus("verified")
      setTimeout(() => {
        setIsSubmitted(true)
      }, 1500)
    } else {
      setOtpError("Invalid OTP. Please try again.")
    }
  }

  const resendOTP = () => {
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    setOtpError("")
    // Simulate sending OTP to email
    console.log(`New OTP ${newOtp} would be sent to ${userEmail} in a real application`)
    alert(`For demo purposes: New OTP is ${newOtp}`)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIdFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdFrontPreview(reader.result as string)
        setIdError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIdBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdBackPreview(reader.result as string)
        setIdError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  // Function to handle redirection to login page
  const redirectToLogin = () => {
    router.push("/")
  }

  // Function to go back to account selection
  const goBackToSelection = () => {
    router.push("/enroll")
  }

  // Get account type title
  const getAccountTypeTitle = () => {
    switch (accountType) {
      case "checking":
        return "Premium Checking Account"
      case "savings":
        return "Premium Savings Account"
      case "business":
        return "Business Account"
      case "investment":
        return "Investment Account"
      case "cryptocurrency":
        return "Cryptocurrency Account"
      case "joint":
        return "Joint Account"
      case "trust":
        return "Trust Account"
      case "retirement":
        return "Retirement Account"
      case "offshore":
        return "Offshore Account"
      default:
        return "New Account"
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-12">
            <Image src="/placeholder.svg?height=48&width=120" alt="Primezart Logo" fill className="object-contain" />
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-sm border">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#003366] mb-2">Enrollment Successful!</h2>
            <p className="text-gray-700 mb-6">
              Thank you for enrolling with Primezart. Your {getAccountTypeTitle()} request has been submitted and is
              being processed. You will receive an email confirmation shortly with further instructions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={redirectToLogin} className="bg-[#003366] hover:bg-[#002244] text-white">
                Proceed to Login
              </Button>
            </div>
          </div>
        ) : showOtpVerification ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#003366] mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a verification code to <span className="font-medium">{userEmail}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">Please enter the 6-digit code to complete your registration</p>
            </div>

            {verificationStatus === "verified" ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium mb-2">Email verified successfully!</p>
                <p className="text-gray-500 text-sm mb-4">Your account is being processed...</p>
                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-2 mb-6">
                  <Input
                    type="text"
                    maxLength={6}
                    className="text-center text-lg font-mono w-64"
                    placeholder="Enter 6-digit code"
                    value={otpValue}
                    onChange={(e) => {
                      setOtpValue(e.target.value)
                      setOtpError("")
                    }}
                  />
                </div>

                {otpError && (
                  <div className="text-center mb-4">
                    <p className="text-red-500 text-sm">{otpError}</p>
                  </div>
                )}

                <div className="flex flex-col items-center gap-4">
                  <Button onClick={verifyOTP} className="w-64 bg-[#003366] hover:bg-[#002244] text-white">
                    Verify Code
                  </Button>
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    <button onClick={resendOTP} className="text-blue-600 hover:underline">
                      Resend Code
                    </button>
                  </p>
                </div>

                {/* For demo purposes only */}
                <div className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Demo Note:</strong> For testing purposes, the OTP is: {generatedOtp}
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#003366] text-white p-4">
              <div className="flex items-center mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-[#002244] p-1 mr-2"
                  onClick={goBackToSelection}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold">{getAccountTypeTitle()} Application</h2>
              </div>
              <p className="text-sm md:text-base">
                Please provide the information requested below to open your {getAccountTypeTitle().toLowerCase()}.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
                {/* Personal Details Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Personal Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle name</FormLabel>
                          <FormControl>
                            <Input placeholder="Middle Name" {...field} />
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
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Email address" {...field} />
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
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" placeholder="Date of Birth" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                              <SelectItem value="fl">Florida</SelectItem>
                              <SelectItem value="il">Illinois</SelectItem>
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
                          <FormLabel>Zip code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zipcode/postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Business-specific fields */}
                {accountType === "business" && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Business Information</h3>

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Business Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                                <SelectItem value="corporation">Corporation</SelectItem>
                                <SelectItem value="non-profit">Non-Profit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID / EIN</FormLabel>
                            <FormControl>
                              <Input placeholder="Tax ID Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="annualRevenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Revenue</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Annual Revenue" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-100000">$0 - $100,000</SelectItem>
                                <SelectItem value="100001-500000">$100,001 - $500,000</SelectItem>
                                <SelectItem value="500001-1000000">$500,001 - $1,000,000</SelectItem>
                                <SelectItem value="1000001-5000000">$1,000,001 - $5,000,000</SelectItem>
                                <SelectItem value="5000001+">$5,000,001+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numberOfEmployees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Employees</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Number of Employees" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10</SelectItem>
                                <SelectItem value="11-50">11-50</SelectItem>
                                <SelectItem value="51-200">51-200</SelectItem>
                                <SelectItem value="201-500">201-500</SelectItem>
                                <SelectItem value="501+">501+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business activities"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Investment-specific fields */}
                {accountType === "investment" && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Investment Profile</h3>

                    <FormField
                      control={form.control}
                      name="investmentExperience"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Investment Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Experience Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                              <SelectItem value="experienced">Experienced (5-10 years)</SelectItem>
                              <SelectItem value="expert">Expert (10+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="riskTolerance"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Risk Tolerance</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Risk Tolerance" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="conservative">Conservative</SelectItem>
                              <SelectItem value="moderately-conservative">Moderately Conservative</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="moderately-aggressive">Moderately Aggressive</SelectItem>
                              <SelectItem value="aggressive">Aggressive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investmentGoals"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Investment Goals</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Primary Investment Goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="preservation">Capital Preservation</SelectItem>
                              <SelectItem value="income">Income Generation</SelectItem>
                              <SelectItem value="growth">Long-term Growth</SelectItem>
                              <SelectItem value="speculation">Speculation</SelectItem>
                              <SelectItem value="retirement">Retirement Planning</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="initialInvestment"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Initial Investment Amount</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Initial Investment Amount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-10000">$0 - $10,000</SelectItem>
                              <SelectItem value="10001-50000">$10,001 - $50,000</SelectItem>
                              <SelectItem value="50001-100000">$50,001 - $100,000</SelectItem>
                              <SelectItem value="100001-500000">$100,001 - $500,000</SelectItem>
                              <SelectItem value="500001+">$500,001+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Joint account-specific fields */}
                {accountType === "joint" && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">
                      Secondary Account Holder
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="secondaryFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondaryLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="secondaryEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Email Address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondaryPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="relationshipType"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Relationship to Primary Account Holder</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="partner">Domestic Partner</SelectItem>
                              <SelectItem value="relative">Family Relative</SelectItem>
                              <SelectItem value="business">Business Partner</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* ID Verification Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">ID Verification</h3>

                  {idError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{idError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <FormLabel>ID Front Side</FormLabel>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {idFrontPreview ? (
                          <div className="relative h-48 w-full">
                            <Image
                              src={idFrontPreview || "/placeholder.svg"}
                              alt="ID Front"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Upload front side of your ID</p>
                            <p className="text-xs text-gray-400">Passport, Driver's License, or National ID</p>
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={handleIdFrontUpload} className="mt-4" />
                      </div>
                    </div>

                    <div>
                      <FormLabel>ID Back Side</FormLabel>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {idBackPreview ? (
                          <div className="relative h-48 w-full">
                            <Image
                              src={idBackPreview || "/placeholder.svg"}
                              alt="ID Back"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Upload back side of your ID</p>
                            <p className="text-xs text-gray-400">Passport, Driver's License, or National ID</p>
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={handleIdBackUpload} className="mt-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Account Security</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction PIN</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a 4-6 digit PIN" {...field} maxLength={6} />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            This PIN will be required for all financial transactions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>Passport Photograph</FormLabel>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                        {photoPreview ? (
                          <Image
                            src={photoPreview || "/placeholder.svg"}
                            alt="User photo"
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Image
                            src="/placeholder.svg?height=96&width=96"
                            alt="Default avatar"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
                        <p className="text-xs text-gray-500 mt-1">Max size: 2MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms and conditions and privacy policy</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBackToSelection}
                    className="border-[#003366] text-[#003366]"
                  >
                    Back to Account Selection
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#003366] hover:bg-[#002244] text-white">
                    {form.formState.isSubmitting ? "Submitting..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}
