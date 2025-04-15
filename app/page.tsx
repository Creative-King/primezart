import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ServiceIcons from "@/components/service-icons"
import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Image Background */}
      <div className="relative text-white min-h-[600px] flex items-center overflow-hidden">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/hong-kong-skyline.jpg" alt="Hong Kong Skyline" fill priority className="object-cover" />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/80 via-[#1a365d]/60 to-transparent z-10"></div>
        </div>

        {/* Content */}
        <div className="container relative z-20 grid gap-8 py-12 mx-auto md:grid-cols-2">
          {/* Left side - Hero Content */}
          <div className="flex flex-col justify-center">
            <p className="mb-2 text-lg">Explore the Financial Future</p>
            <h1 className="mb-2 text-5xl font-bold">
              Bank
              <br />
              Online On
              <br />
              Primezart
            </h1>
            <p className="text-2xl font-light mb-6 text-[#f0a500]">The Art of Banking</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/enroll">
                <Button className="bg-[#0047ab] hover:bg-[#003d91] text-white px-6 py-6 h-auto">
                  Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex items-center justify-center md:justify-end">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#003366]">Our Banking Solutions</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center p-6 text-center transition-shadow border rounded-lg hover:shadow-lg">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-md">
                <Image src="/images/personal-banking-sign.jpg" alt="Personal Banking" fill className="object-cover" />
              </div>
              <div className="w-16 h-16 bg-[#f0a500] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366]">Personal Banking</h3>
              <p className="mb-4 text-gray-600">
                Manage your everyday finances with our comprehensive personal banking solutions.
              </p>
              <Link href="/services/personal" className="text-[#003366] font-semibold hover:text-[#f0a500]">
                Learn More
              </Link>
            </div>

            <div className="flex flex-col items-center p-6 text-center transition-shadow border rounded-lg hover:shadow-lg">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-md">
                <Image src="/images/investment-coins.jpg" alt="Investment Services" fill className="object-cover" />
              </div>
              <div className="w-16 h-16 bg-[#f0a500] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366]">Investment Services</h3>
              <p className="mb-4 text-gray-600">
                Grow your wealth with our expert investment advice and diverse portfolio options.
              </p>
              <Link href="/services/investments" className="text-[#003366] font-semibold hover:text-[#f0a500]">
                Learn More
              </Link>
            </div>

            <div className="flex flex-col items-center p-6 text-center transition-shadow border rounded-lg hover:shadow-lg">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-md">
                <Image src="/images/business-charts-money.jpg" alt="Business Banking" fill className="object-cover" />
              </div>
              <div className="w-16 h-16 bg-[#f0a500] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-4h4v-2h-4V7h-2v4H8v2h4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366]">Business Banking</h3>
              <p className="mb-4 text-gray-600">
                Support your business growth with our tailored financial solutions and services.
              </p>
              <Link href="/services/business" className="text-[#003366] font-semibold hover:text-[#f0a500]">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#003366]">What Our Customers Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                quote:
                  "Primezart has been instrumental in helping my business grow. Their personalized service and flexible business loans made all the difference.",
              },
              {
                name: "Michael Chen",
                role: "Investment Banker",
                quote:
                  "The investment advisory services at Primezart are top-notch. My portfolio has seen consistent growth since I switched to them 3 years ago.",
              },
              {
                name: "Aisha Patel",
                role: "Personal Banking Customer",
                quote:
                  "I love how easy it is to manage my finances with Primezart's mobile app. The customer service is always helpful and responsive.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-[#003366]">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-700">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Icons */}
      <ServiceIcons />
    </div>
  )
}
