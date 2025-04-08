import Image from "next/image"
import Link from "next/link"
import { ArrowRight, TrendingUp, BarChart2, PieChart, LineChart, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function InvestmentServices() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Investment Services</h1>
          <p className="text-xl max-w-3xl">
            Grow your wealth with our expert investment advice and diverse portfolio options tailored to your financial
            goals.
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Invest With Confidence</h2>
              <p className="text-gray-700 mb-4">
                At Sky Premium, we understand that investing is personal. Whether you're saving for retirement, a major
                purchase, or building wealth for future generations, our investment services are designed to help you
                achieve your goals.
              </p>
              <p className="text-gray-700 mb-4">
                Our team of experienced financial advisors works closely with you to develop a personalized investment
                strategy based on your risk tolerance, time horizon, and financial objectives.
              </p>
              <div className="mt-6">
                <Link href="/contact">
                  <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black">
                    Schedule a Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Investment Services"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Investment Options Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Investment Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Managed Portfolios</CardTitle>
                <CardDescription>Professional investment management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Professionally managed investment portfolios
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Diversified asset allocation
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Regular portfolio rebalancing
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Ongoing performance monitoring
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Minimum investment: $25,000
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/investments/managed-portfolios" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Self-Directed Investing</CardTitle>
                <CardDescription>Take control of your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Full control over investment decisions
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to stocks, bonds, ETFs, and mutual funds
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Competitive trading fees
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced research and analysis tools
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    No minimum investment
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/investments/self-directed" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Retirement Planning</CardTitle>
                <CardDescription>Secure your financial future</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Traditional and Roth IRA options
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    401(k) rollover assistance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Personalized retirement planning
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Tax-advantaged investment strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Required minimum distribution planning
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/investments/retirement" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Wealth Management Section */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Wealth Management"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Wealth Management</h2>
              <p className="text-gray-700 mb-4">
                Our comprehensive wealth management services go beyond traditional investment advice to address all
                aspects of your financial life, including tax planning, estate planning, and risk management.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Comprehensive Financial Planning</h4>
                    <p className="text-sm text-gray-600">
                      Holistic approach to managing your wealth and achieving your financial goals
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Investment Management</h4>
                    <p className="text-sm text-gray-600">
                      Customized investment strategies aligned with your goals and risk tolerance
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-[#003366]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Estate Planning</h4>
                    <p className="text-sm text-gray-600">
                      Strategies to preserve and transfer wealth to future generations
                    </p>
                  </div>
                </li>
              </ul>
              <Link href="/services/investments/wealth-management">
                <Button className="bg-[#003366]">Explore Wealth Management</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">Our Investment Performance</h2>
          <p className="text-gray-700 mb-12 max-w-3xl mx-auto">
            Our investment strategies have consistently delivered strong results for our clients across various market
            conditions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-[#003366] mb-2">8.7%</div>
              <p className="text-gray-600 font-medium">Average Annual Return</p>
              <p className="text-sm text-gray-500 mt-1">Conservative Portfolio (5 years)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-[#003366] mb-2">12.3%</div>
              <p className="text-gray-600 font-medium">Average Annual Return</p>
              <p className="text-sm text-gray-500 mt-1">Moderate Portfolio (5 years)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-[#003366] mb-2">15.8%</div>
              <p className="text-gray-600 font-medium">Average Annual Return</p>
              <p className="text-sm text-gray-500 mt-1">Aggressive Portfolio (5 years)</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6 max-w-2xl mx-auto">
            Past performance is not a guarantee of future results. Investment returns will fluctuate and are subject to
            market volatility.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start investing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule a consultation with one of our investment advisors to discuss your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black text-lg px-8 py-6">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/services/investments/resources">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#003366] text-lg px-8 py-6"
              >
                Investment Resources
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

