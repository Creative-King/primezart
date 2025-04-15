import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Services() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl">
            Discover our comprehensive range of banking and financial services designed to meet your needs.
          </p>
        </div>
      </div>

      {/* Services Categories */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personal Banking",
                description: "Manage your everyday finances with our comprehensive personal banking solutions.",
                image: "/placeholder.svg?height=300&width=400",
                href: "/services/personal",
              },
              {
                title: "Business Banking",
                description: "Support your business growth with our tailored financial solutions and services.",
                image: "/placeholder.svg?height=300&width=400",
                href: "/services/business",
              },
              {
                title: "Investment Services",
                description: "Grow your wealth with our expert investment advice and diverse portfolio options.",
                image: "/placeholder.svg?height=300&width=400",
                href: "/services/investments",
              },
            ].map((category, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-700">{category.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={category.href}>
                    <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Featured Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Premium Checking",
                description: "Enjoy unlimited transactions, priority customer service, and exclusive rewards.",
                href: "/services/personal/checking",
              },
              {
                title: "Mortgage Solutions",
                description: "Find the perfect home loan with competitive rates and flexible terms.",
                href: "/services/personal/mortgages",
              },
              {
                title: "Retirement Planning",
                description: "Secure your future with our comprehensive retirement planning services.",
                href: "/services/investments/retirement",
              },
              {
                title: "Business Loans",
                description: "Fund your business growth with our flexible financing options.",
                href: "/services/business/loans",
              },
              {
                title: "Mobile Banking",
                description: "Access your accounts, transfer funds, and pay bills from anywhere.",
                href: "/services/digital-banking",
              },
              {
                title: "Wealth Management",
                description: "Optimize your investment strategy with personalized wealth management.",
                href: "/services/investments/wealth-management",
              },
              {
                title: "International Banking",
                description: "Manage your global finances seamlessly with our international services.",
                href: "/services/international",
              },
              {
                title: "Insurance Products",
                description: "Protect what matters most with our comprehensive insurance offerings.",
                href: "/services/insurance",
              },
            ].map((service, index) => (
              <Link key={index} href={service.href} className="group">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full transition-all group-hover:shadow-md group-hover:border-[#f0a500]">
                  <h3 className="text-xl font-bold text-[#003366] mb-2 group-hover:text-[#f0a500] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <div className="text-[#003366] font-medium flex items-center text-sm group-hover:text-[#f0a500] transition-colors">
                    Learn More <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Speak with one of our financial advisors to find the right solutions for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black text-lg px-8 py-6">Open an Account</Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#003366] text-lg px-8 py-6"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
