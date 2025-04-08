"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would submit this to your backend
    console.log(values)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      form.reset()
    }, 1000)
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl">We're here to help. Reach out to us with any questions or concerns.</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <MapPin className="w-12 h-12 text-[#f0a500] mb-4" />
              <h3 className="text-xl font-bold text-[#003366] mb-2">Visit Us</h3>
              <p className="text-gray-700">
                123 Financial Street
                <br />
                New York, NY 10001
                <br />
                United States
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Phone className="w-12 h-12 text-[#f0a500] mb-4" />
              <h3 className="text-xl font-bold text-[#003366] mb-2">Call Us</h3>
              <p className="text-gray-700">
                Customer Service:
                <br />
                +1 (800) 123-4567
                <br />
                <span className="text-sm">Available 24/7</span>
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Mail className="w-12 h-12 text-[#f0a500] mb-4" />
              <h3 className="text-xl font-bold text-[#003366] mb-2">Email Us</h3>
              <p className="text-gray-700">
                General Inquiries:
                <br />
                info@skyhighpremium.com
                <br />
                <span className="text-sm">We respond within 24 hours</span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Send Us a Message</h2>
              <p className="text-gray-700 mb-8">
                Have a question or need assistance? Fill out the form below, and one of our representatives will get
                back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center">
                  <CheckCircle className="text-green-500 w-8 h-8 mr-4" />
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">Message Sent!</h3>
                    <p className="text-green-700">
                      Thank you for reaching out. We'll respond to your inquiry as soon as possible.
                    </p>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="account">Account Support</SelectItem>
                                <SelectItem value="loan">Loan Information</SelectItem>
                                <SelectItem value="technical">Technical Support</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="How can we help you?" className="min-h-[150px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-[#f0a500] hover:bg-[#e09400] text-black">
                      {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573036935!2d-73.98784532342224!3d40.75798597138413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sky Premium Headquarters Location"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Locations */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Our Branches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                city: "New York",
                address: "123 Financial Street, NY 10001",
                phone: "+1 (212) 555-1234",
                hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
              },
              {
                city: "Los Angeles",
                address: "456 Banking Avenue, CA 90001",
                phone: "+1 (310) 555-5678",
                hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
              },
              {
                city: "Chicago",
                address: "789 Money Lane, IL 60007",
                phone: "+1 (312) 555-9012",
                hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
              },
              {
                city: "Miami",
                address: "101 Wealth Road, FL 33101",
                phone: "+1 (305) 555-3456",
                hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
              },
            ].map((branch, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#003366] mb-2">{branch.city}</h3>
                <p className="text-gray-700 mb-1">{branch.address}</p>
                <p className="text-gray-700 mb-1">{branch.phone}</p>
                <p className="text-gray-600 text-sm">{branch.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

