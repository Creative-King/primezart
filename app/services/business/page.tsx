import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building, CreditCard, Briefcase, Globe, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BusinessBanking() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Business Banking</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive financial solutions designed to help your business grow, manage cash flow, and achieve
            long-term success.
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Banking Solutions for Every Business</h2>
              <p className="text-gray-700 mb-4">
                At Sky Premium, we understand that businesses have unique financial needs. Whether you're a small
                startup, a growing mid-sized company, or an established enterprise, our business banking solutions are
                designed to support your operations and help you achieve your goals.
              </p>
              <p className="text-gray-700 mb-4">
                Our dedicated business banking team works closely with you to understand your specific requirements and
                provide tailored solutions that address your challenges and opportunities.
              </p>
              <div className="mt-6">
                <Link href="/services/apply">
                  <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Business Banking"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Accounts Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Business Account Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Business Checking</CardTitle>
                <CardDescription>Efficient cash management for daily operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    No monthly fee with qualifying balance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    500 free transactions per month
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Online and mobile banking access
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Business debit cards for authorized users
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Integrated payment processing
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/apply" className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Business Savings</CardTitle>
                <CardDescription>Grow your business reserves</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Competitive interest rates
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Tiered rates based on balance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Automatic sweep options
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    FDIC insured up to $250,000
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Easy transfers between accounts
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/apply" className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Merchant Services</CardTitle>
                <CardDescription>Accept payments with ease</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    In-store and online payment processing
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Competitive transaction rates
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Next-day funding available
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    PCI compliance support
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Fraud protection services
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/merchant" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Business Loans Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Business Financing Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Term Loans</h3>
              <p className="text-gray-600 mb-4">
                Fixed-rate loans for major purchases, expansion, or refinancing existing debt.
              </p>
              <ul className="text-sm text-gray-600 mb-4">
                <li>• Loan amounts up to $1,000,000</li>
                <li>• Terms up to 10 years</li>
                <li>• Competitive fixed rates</li>
              </ul>
              <Link
                href="/services/business/loans"
                className="text-[#003366] font-medium hover:text-[#f0a500] flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Lines of Credit</h3>
              <p className="text-gray-600 mb-4">
                Flexible funding to manage cash flow, handle unexpected expenses, or seize opportunities.
              </p>
              <ul className="text-sm text-gray-600 mb-4">
                <li>• Credit lines up to $500,000</li>
                <li>• Pay interest only on what you use</li>
                <li>• Revolving credit availability</li>
              </ul>
              <Link
                href="/services/business/credit-lines"
                className="text-[#003366] font-medium hover:text-[#f0a500] flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Commercial Real Estate</h3>
              <p className="text-gray-600 mb-4">
                Financing for purchasing, refinancing, or renovating commercial properties.
              </p>
              <ul className="text-sm text-gray-600 mb-4">
                <li>• Up to 80% loan-to-value</li>
                <li>• Terms up to 25 years</li>
                <li>• Competitive rates</li>
              </ul>
              <Link
                href="/services/business/real-estate"
                className="text-[#003366] font-medium hover:text-[#f0a500] flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Equipment Financing</h3>
              <p className="text-gray-600 mb-4">
                Loans and leases for purchasing new or used equipment for your business.
              </p>
              <ul className="text-sm text-gray-600 mb-4">
                <li>• Up to 100% financing available</li>
                <li>• Terms based on equipment life</li>
                <li>• Fixed or variable rates</li>
              </ul>
              <Link
                href="/services/business/equipment"
                className="text-[#003366] font-medium hover:text-[#f0a500] flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Treasury Management Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Treasury Management"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Treasury Management</h2>
              <p className="text-gray-700 mb-4">
                Optimize your cash flow, improve operational efficiency, and enhance financial control with our
                comprehensive treasury management solutions.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Cash Management</h4>
                    <p className="text-sm text-gray-600">Streamline collections, disbursements, and reporting</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">International Services</h4>
                    <p className="text-sm text-gray-600">Manage global transactions with ease and security</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Fraud Prevention</h4>
                    <p className="text-sm text-gray-600">Protect your business with advanced security features</p>
                  </div>
                </li>
              </ul>
              <Link href="/services/business/treasury">
                <Button className="bg-[#003366]">Explore Treasury Services</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Business Cards Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-6 text-center">Business Card Solutions</h2>
          <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Manage expenses, streamline purchasing, and earn rewards with our business credit and debit card options.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col h-full">
              <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Business Credit Cards</h3>
              <p className="text-gray-600 mb-4">Manage company expenses while earning rewards on business purchases.</p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Cash back on business purchases
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Expense management tools
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Employee cards with spending controls
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Detailed reporting and categorization
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="/dashboard/cards/request">
                  <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black">Apply Now</Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col h-full">
              <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-2">Business Debit Cards</h3>
              <p className="text-gray-600 mb-4">
                Direct access to your business checking account with enhanced control and security.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  No annual fee
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Multiple cards for authorized employees
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Set spending limits by employee
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time transaction alerts
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="/dashboard/cards/request">
                  <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black">Request Cards</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Partner with Sky Premium for comprehensive business banking solutions tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/apply">
              <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black text-lg px-8 py-6">Apply Now</Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#003366] text-lg px-8 py-6"
              >
                Contact a Business Banker
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

