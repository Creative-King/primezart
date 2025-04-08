"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ArrowRight, Building, Briefcase, CreditCard, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  yearEstablished: z.string().min(1, "Year established is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  employeeCount: z.string().min(1, "Employee count is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPosition: z.string().min(1, "Contact position is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  serviceType: z.string().min(1, "Service type is required"),
  loanAmount: z.string().optional(),
  loanPurpose: z.string().optional(),
  additionalInfo: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export default function ApplyBanking() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      registrationNumber: "",
      yearEstablished: "",
      annualRevenue: "",
      employeeCount: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      contactName: "",
      contactPosition: "",
      contactEmail: "",
      contactPhone: "",
      serviceType: "",
      loanAmount: "",
      loanPurpose: "",
      additionalInfo: "",
      termsAccepted: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1500)
  }

  const watchServiceType = form.watch("serviceType")

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Apply for Business Banking</h1>
          <p className="text-xl max-w-3xl">
            Grow your business with our comprehensive banking solutions tailored to your needs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#003366] mb-2">Application Submitted!</h2>
                <p className="text-gray-700 mb-6">
                  Thank you for your application. Our business banking team will review your information and contact you
                  within 2 business days.
                </p>
                <p className="text-gray-700 mb-6">
                  Your application reference number:{" "}
                  <span className="font-bold">BIZ-{Math.floor(Math.random() * 1000000)}</span>
                </p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-[#003366] hover:bg-[#002244] text-white"
                >
                  Return to Home
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#003366] text-white p-4 flex items-center">
                  <Building className="mr-2" />
                  <p className="text-sm md:text-base">
                    Please complete the form below to apply for our business banking services.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
                    {/* Business Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Business Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select business type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                                  <SelectItem value="corporation">Corporation</SelectItem>
                                  <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name="registrationNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Registration Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter registration number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="yearEstablished"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Established</FormLabel>
                              <FormControl>
                                <Input placeholder="YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="annualRevenue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Revenue</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select annual revenue" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="less_than_100k">Less than $100,000</SelectItem>
                                  <SelectItem value="100k_500k">$100,000 - $500,000</SelectItem>
                                  <SelectItem value="500k_1m">$500,000 - $1 million</SelectItem>
                                  <SelectItem value="1m_5m">$1 million - $5 million</SelectItem>
                                  <SelectItem value="5m_10m">$5 million - $10 million</SelectItem>
                                  <SelectItem value="more_than_10m">More than $10 million</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="employeeCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Employees</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select employee count" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1_5">1-5</SelectItem>
                                  <SelectItem value="6_20">6-20</SelectItem>
                                  <SelectItem value="21_50">21-50</SelectItem>
                                  <SelectItem value="51_100">51-100</SelectItem>
                                  <SelectItem value="101_500">101-500</SelectItem>
                                  <SelectItem value="more_than_500">More than 500</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Business Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Business Address</h3>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
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
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter state" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter zip code" {...field} />
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
                          <FormItem className="mt-4">
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Primary Contact</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPosition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position/Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter position" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter email address" {...field} />
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
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#003366] border-b pb-2 mb-4">Banking Services</h3>

                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>What services are you interested in?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="business_checking" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Business Checking Account</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="business_savings" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Business Savings Account</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="merchant_services" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Merchant Services</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="business_credit_card" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Business Credit Card</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="business_loan" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Business Loan</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Other Services</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchServiceType === "business_loan" && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          <FormField
                            control={form.control}
                            name="loanAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Requested Loan Amount</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter amount" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="loanPurpose"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Loan Purpose</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select loan purpose" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="working_capital">Working Capital</SelectItem>
                                    <SelectItem value="equipment">Equipment Purchase</SelectItem>
                                    <SelectItem value="expansion">Business Expansion</SelectItem>
                                    <SelectItem value="real_estate">Commercial Real Estate</SelectItem>
                                    <SelectItem value="refinance">Debt Refinancing</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Additional Information</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide any additional information that may help us better understand your business needs."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                              I agree to the terms and conditions and authorize Sky Premium to verify the information
                              provided.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-[#003366] hover:bg-[#002244] text-white">
                      {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Choose Us */}
            <Card className="bg-white shadow-md border-0">
              <CardHeader className="bg-[#003366] text-white">
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Why Choose Sky Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#f0a500] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#003366]">Dedicated Business Support</h4>
                    <p className="text-sm text-gray-600">Personal relationship manager for your business needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#f0a500] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#003366]">Competitive Rates</h4>
                    <p className="text-sm text-gray-600">Low fees and favorable interest rates for businesses</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#f0a500] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#003366]">Digital Banking</h4>
                    <p className="text-sm text-gray-600">Advanced online and mobile banking for businesses</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#f0a500] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#003366]">Financial Insights</h4>
                    <p className="text-sm text-gray-600">Tools and reports to help manage your business finances</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Services */}
            <Card className="bg-white shadow-md border-0">
              <CardHeader className="bg-[#003366] text-white">
                <CardTitle className="text-lg flex items-center">
                  <Building className="mr-2 h-5 w-5" /> Our Business Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-[#f0a500] mr-2" />
                      <h4 className="font-semibold text-[#003366]">Business Accounts</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Checking and savings accounts designed for businesses of all sizes
                    </p>
                  </div>

                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-[#f0a500] mr-2" />
                      <h4 className="font-semibold text-[#003366]">Business Loans</h4>
                    </div>
                    <p className="text-sm text-gray-600">Financing solutions to help your business grow and succeed</p>
                  </div>

                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <ArrowRight className="h-5 w-5 text-[#f0a500] mr-2" />
                      <h4 className="font-semibold text-[#003366]">Merchant Services</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Payment processing solutions for in-store and online transactions
                    </p>
                  </div>

                  <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <ArrowRight className="h-5 w-5 text-[#f0a500] mr-2" />
                      <h4 className="font-semibold text-[#003366]">Treasury Management</h4>
                    </div>
                    <p className="text-sm text-gray-600">Optimize cash flow and streamline financial operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white shadow-md border-0">
              <CardHeader className="bg-[#003366] text-white">
                <CardTitle className="text-lg">Need Assistance?</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Our business banking specialists are ready to help you with your application.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Call us:</span> +1 (800) 123-4567
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Email:</span> business@skypremium.com
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Hours:</span> Monday-Friday, 9am-5pm
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

