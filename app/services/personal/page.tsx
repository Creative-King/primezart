import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Shield, CreditCard, Wallet, Landmark, PiggyBank } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PersonalBanking() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Personal Banking</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive banking solutions designed to meet your personal financial needs and help you achieve your
            goals.
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Banking That Fits Your Life</h2>
              <p className="text-gray-700 mb-4">
                At Sky Premium, we understand that everyone's financial journey is unique. That's why we offer a range
                of personal banking solutions that can be tailored to your specific needs.
              </p>
              <p className="text-gray-700 mb-4">
                Whether you're saving for a major purchase, managing day-to-day expenses, or planning for the future,
                our personal banking services provide the tools and support you need to succeed.
              </p>
              <div className="mt-6">
                <Link href="/enroll">
                  <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black">
                    Open an Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Personal Banking"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Types Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Personal Account Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Premium Checking</CardTitle>
                <CardDescription>Everyday banking with premium benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    No monthly maintenance fee with qualifying deposits
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited transactions and withdrawals
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Free online and mobile banking
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Complimentary debit card with rewards
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to 40,000+ fee-free ATMs
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/enroll" className="w-full">
                  <Button className="w-full">Open Checking Account</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Premium Savings</CardTitle>
                <CardDescription>Grow your money with competitive rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Competitive interest rates
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    No minimum balance requirements
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Automatic savings options
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Goal-based savings tools
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    FDIC insured up to $250,000
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/enroll" className="w-full">
                  <Button className="w-full">Open Savings Account</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Money Market</CardTitle>
                <CardDescription>Higher yields with flexible access</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Higher interest rates than standard savings
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Check-writing privileges
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Tiered interest rates based on balance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Limited transactions per month
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    FDIC insured up to $250,000
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/enroll" className="w-full">
                  <Button className="w-full">Open Money Market Account</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Personal Loans Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Personal Loans & Credit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col h-full">
              <div className="mb-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Landmark className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Personal Loans</h3>
              <p className="text-gray-600 mb-4">
                Whether you're consolidating debt, financing a major purchase, or covering unexpected expenses, our
                personal loans offer competitive rates and flexible terms.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Fixed rates starting at 5.99% APR
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Loan amounts from $2,500 to $50,000
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Terms from 12 to 60 months
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  No prepayment penalties
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="/services/personal/loans">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col h-full">
              <div className="mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Credit Cards</h3>
              <p className="text-gray-600 mb-4">
                Our credit cards offer competitive rates, valuable rewards, and enhanced security features to help you
                manage your finances with confidence.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Rewards on everyday purchases
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  No annual fee options available
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced fraud protection
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Digital wallet compatibility
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="/dashboard/cards/request">
                  <Button variant="outline">Apply Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Banking Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Digital Banking Solutions</h2>
              <p className="text-gray-700 mb-4">
                Bank anytime, anywhere with our secure and user-friendly digital banking platform. Manage your accounts,
                make transfers, pay bills, and more from your computer or mobile device.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Access</h4>
                    <p className="text-sm text-gray-600">
                      Multi-factor authentication and encryption to keep your information safe
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Card Controls</h4>
                    <p className="text-sm text-gray-600">
                      Lock/unlock your cards, set spending limits, and receive transaction alerts
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Mobile Deposit</h4>
                    <p className="text-sm text-gray-600">Deposit checks from your smartphone with just a few taps</p>
                  </div>
                </li>
              </ul>
              <Link href="/online-banking">
                <Button className="bg-[#003366]">Explore Digital Banking</Button>
              </Link>
            </div>
            <div className="relative h-80 md:h-auto order-1 md:order-2">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Digital Banking"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Open an account today and experience the Sky Premium difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enroll">
              <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black text-lg px-8 py-6">Open an Account</Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#003366] text-lg px-8 py-6"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
