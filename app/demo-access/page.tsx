"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Wallet,
  PiggyBank,
  Building,
  LineChart,
  Coins,
  Users,
  Shield,
  Landmark,
  Briefcase,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const accountTypes = [
  {
    id: "checking",
    title: "Premium Checking",
    description: "Everyday banking with premium benefits and no minimum balance requirements",
    icon: <Wallet className="h-8 w-8 text-blue-500" />,
    path: "/dashboard",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    id: "savings",
    title: "Premium Savings",
    description: "High-yield savings account to help your money grow faster",
    icon: <PiggyBank className="h-8 w-8 text-green-500" />,
    path: "/dashboard/savings",
    color: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  {
    id: "business",
    title: "Business Account",
    description: "Comprehensive banking solutions for businesses of all sizes",
    icon: <Building className="h-8 w-8 text-purple-500" />,
    path: "/dashboard",
    color: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  {
    id: "investment",
    title: "Investment Account",
    description: "Grow your wealth with our diverse investment options",
    icon: <LineChart className="h-8 w-8 text-amber-500" />,
    path: "/dashboard/investment",
    color: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    id: "cryptocurrency",
    title: "Cryptocurrency Account",
    description: "Securely buy, sell, and store digital currencies",
    icon: <Coins className="h-8 w-8 text-cyan-500" />,
    path: "/dashboard/crypto",
    color: "bg-cyan-100",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
  },
  {
    id: "joint",
    title: "Joint Account",
    description: "Shared account for couples, family members, or business partners",
    icon: <Users className="h-8 w-8 text-indigo-500" />,
    path: "/dashboard/joint",
    color: "bg-indigo-100",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
  },
  {
    id: "trust",
    title: "Trust Account",
    description: "Secure account for managing assets on behalf of beneficiaries",
    icon: <Shield className="h-8 w-8 text-red-500" />,
    path: "/dashboard/trust",
    color: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  {
    id: "retirement",
    title: "Retirement Account",
    description: "Plan for your future with tax-advantaged retirement accounts",
    icon: <Landmark className="h-8 w-8 text-orange-500" />,
    path: "/dashboard/retirement",
    color: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
  },
  {
    id: "offshore",
    title: "Offshore Account",
    description: "International banking solutions with enhanced privacy",
    icon: <Briefcase className="h-8 w-8 text-slate-500" />,
    path: "/dashboard/offshore",
    color: "bg-slate-100",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
  },
]

export default function DemoAccess() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId)
  }

  const handleAccessAccount = () => {
    if (!selectedAccount) return

    const account = accountTypes.find((acc) => acc.id === selectedAccount)
    if (account) {
      // Store account type in localStorage to simulate login
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("accountType", selectedAccount)

      // Navigate to the appropriate dashboard
      router.push(account.path)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#003366] mb-2">Primezart Demo Access</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select an account type below to access a demo of that account's dashboard and features. Each account type
            offers a unique banking experience tailored to specific financial needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {accountTypes.map((account) => (
            <Card
              key={account.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAccount === account.id ? `ring-2 ring-[#003366] shadow-md` : `border ${account.borderColor}`
              }`}
              onClick={() => handleAccountSelect(account.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-full ${account.color}`}>{account.icon}</div>
                  {selectedAccount === account.id && (
                    <div className="w-6 h-6 rounded-full bg-[#003366] flex items-center justify-center">
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
                <CardDescription>{account.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-sm ${account.textColor} font-medium`}>Key Features:</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {account.id === "checking" && (
                    <>
                      <li>• No monthly fees</li>
                      <li>• Free ATM withdrawals</li>
                      <li>• Mobile banking</li>
                      <li>• 24/7 customer support</li>
                    </>
                  )}
                  {account.id === "savings" && (
                    <>
                      <li>• Competitive interest rates</li>
                      <li>• Automatic savings plans</li>
                      <li>• Goal-based savings</li>
                      <li>• No minimum balance</li>
                    </>
                  )}
                  {account.id === "business" && (
                    <>
                      <li>• Business credit cards</li>
                      <li>• Merchant services</li>
                      <li>• Payroll processing</li>
                      <li>• Business loans</li>
                    </>
                  )}
                  {account.id === "investment" && (
                    <>
                      <li>• Stocks & ETFs</li>
                      <li>• Mutual funds</li>
                      <li>• Retirement planning</li>
                      <li>• Professional advisors</li>
                    </>
                  )}
                  {account.id === "cryptocurrency" && (
                    <>
                      <li>• Multiple cryptocurrencies</li>
                      <li>• Cold storage security</li>
                      <li>• Real-time market data</li>
                      <li>• Low transaction fees</li>
                    </>
                  )}
                  {account.id === "joint" && (
                    <>
                      <li>• Equal access rights</li>
                      <li>• Transparent transactions</li>
                      <li>• Customizable permissions</li>
                      <li>• Simplified bill payments</li>
                    </>
                  )}
                  {account.id === "trust" && (
                    <>
                      <li>• Legal protection</li>
                      <li>• Estate planning</li>
                      <li>• Tax advantages</li>
                      <li>• Wealth preservation</li>
                    </>
                  )}
                  {account.id === "retirement" && (
                    <>
                      <li>• Tax benefits</li>
                      <li>• Long-term growth</li>
                      <li>• Multiple plan options</li>
                      <li>• Retirement calculators</li>
                    </>
                  )}
                  {account.id === "offshore" && (
                    <>
                      <li>• Multi-currency support</li>
                      <li>• International transfers</li>
                      <li>• Asset protection</li>
                      <li>• Global investment access</li>
                    </>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
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
            onClick={handleAccessAccount}
            disabled={!selectedAccount}
            className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-2 text-lg"
          >
            Access Account Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

