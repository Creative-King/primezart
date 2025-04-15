"use client"

import { useState } from "react"
import type React from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowRight,
  Building,
  Briefcase,
  PiggyBank,
  Coins,
  Users,
  Shield,
  LineChart,
  Landmark,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    houseAddress: z.string().min(1, "House address is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    occupation: z.string().min(1, "Occupation is required"),
    incomeRange: z.string().min(1, "Income range is required"),
    accountType: z.string().min(1, "Account type is required"),
    accountCurrency: z.string().min(1, "Account currency is required"),
    pin: z.string().min(4, "PIN must be at least 4 digits"),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function Enroll() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null)
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null)
  const [idError, setIdError] = useState<string | null>(null)

  const accountTypes = [
    {
      id: "checking",
      title: "Premium Checking",
      description: "Everyday banking with premium benefits and no minimum balance requirements",
      icon: <Wallet className="h-8 w-8 text-blue-500" />,
      features: ["No monthly fees", "Free ATM withdrawals", "Mobile banking", "24/7 customer support"],
    },
    {
      id: "savings",
      title: "Premium Savings",
      description: "High-yield savings account to help your money grow faster",
      icon: <PiggyBank className="h-8 w-8 text-green-500" />,
      features: ["Competitive interest rates", "Automatic savings plans", "Goal-based savings", "No minimum balance"],
    },
    {
      id: "business",
      title: "Business Account",
      description: "Comprehensive banking solutions for businesses of all sizes",
      icon: <Building className="h-8 w-8 text-purple-500" />,
      features: ["Business credit cards", "Merchant services", "Payroll processing", "Business loans"],
    },
    {
      id: "investment",
      title: "Investment Account",
      description: "Grow your wealth with our diverse investment options",
      icon: <LineChart className="h-8 w-8 text-amber-500" />,
      features: ["Stocks & ETFs", "Mutual funds", "Retirement planning", "Professional advisors"],
    },
    {
      id: "cryptocurrency",
      title: "Cryptocurrency Account",
      description: "Securely buy, sell, and store digital currencies",
      icon: <Coins className="h-8 w-8 text-cyan-500" />,
      features: ["Multiple cryptocurrencies", "Cold storage security", "Real-time market data", "Low transaction fees"],
    },
    {
      id: "joint",
      title: "Joint Account",
      description: "Shared account for couples, family members, or business partners",
      icon: <Users className="h-8 w-8 text-indigo-500" />,
      features: [
        "Equal access rights",
        "Transparent transactions",
        "Customizable permissions",
        "Simplified bill payments",
      ],
    },
    {
      id: "trust",
      title: "Trust Account",
      description: "Secure account for managing assets on behalf of beneficiaries",
      icon: <Shield className="h-8 w-8 text-red-500" />,
      features: ["Legal protection", "Estate planning", "Tax advantages", "Wealth preservation"],
    },
    {
      id: "retirement",
      title: "Retirement Account",
      description: "Plan for your future with tax-advantaged retirement accounts",
      icon: <Landmark className="h-8 w-8 text-orange-500" />,
      features: ["Tax benefits", "Long-term growth", "Multiple plan options", "Retirement calculators"],
    },
    {
      id: "offshore",
      title: "Offshore Account",
      description: "International banking solutions with enhanced privacy",
      icon: <Briefcase className="h-8 w-8 text-slate-500" />,
      features: ["Multi-currency support", "International transfers", "Asset protection", "Global investment access"],
    },
  ]

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId)
  }

  const handleContinue = () => {
    if (selectedAccount) {
      // Store the selected account type in localStorage to use in the form
      localStorage.setItem("selectedAccountType", selectedAccount)
      router.push("/enroll/form")
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      dateOfBirth: "",
      houseAddress: "",
      phone: "",
      email: "",
      occupation: "",
      incomeRange: "",
      accountType: "",
      accountCurrency: "USD",
      pin: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if ID has been uploaded
    if (!idFrontPreview || !idBackPreview) {
      setIdError("Please upload both sides of your ID document")
      return
    }

    // In a real app, you would submit this to your backend
    console.log(values)

    // Store account type in localStorage to redirect to the correct account after login
    localStorage.setItem("newAccountType", values.accountType)
    localStorage.setItem("userEmail", values.email)
    localStorage.setItem("userPassword", values.password) // Note: In a real app, never store passwords in localStorage

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1500)
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

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-12">
            <Image src="/placeholder.svg?height=48&width=120" alt="Primezart Logo" fill className="object-contain" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#003366] mb-2">Choose Your Account Type</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the type of account that best fits your financial needs. Each account comes with unique features and
            benefits designed to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {accountTypes.map((account) => (
            <Card
              key={account.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAccount === account.id ? "ring-2 ring-blue-500 shadow-md" : "border border-gray-200"
              }`}
              onClick={() => handleAccountSelect(account.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-full bg-gray-50">{account.icon}</div>
                  {selectedAccount === account.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl mt-2">{account.title}</CardTitle>
                <CardDescription className="text-sm">{account.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {account.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                  onClick={() => handleAccountSelect(account.id)}
                >
                  {selectedAccount === account.id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedAccount}
            className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-2 text-lg"
          >
            Continue to Application <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
