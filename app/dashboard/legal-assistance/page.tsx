"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Scale,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Download,
  ExternalLink,
  Phone,
  Mail,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LegalAssistancePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for legal services
  const legalServices = [
    {
      id: 1,
      title: "Contract Review",
      description: "Professional review of contracts and legal documents",
      icon: <FileText className="h-6 w-6" />,
      price: "From $150",
      timeframe: "48 hours",
    },
    {
      id: 2,
      title: "Legal Consultation",
      description: "One-on-one consultation with a specialized attorney",
      icon: <MessageSquare className="h-6 w-6" />,
      price: "From $200/hour",
      timeframe: "Same day",
    },
    {
      id: 3,
      title: "Document Preparation",
      description: "Preparation of legal documents and agreements",
      icon: <FileText className="h-6 w-6" />,
      price: "From $250",
      timeframe: "3-5 days",
    },
    {
      id: 4,
      title: "Legal Representation",
      description: "Attorney representation for legal proceedings",
      icon: <Scale className="h-6 w-6" />,
      price: "Custom quote",
      timeframe: "As needed",
    },
  ]

  // Mock data for legal documents
  const legalDocuments = [
    {
      id: 1,
      title: "Power of Attorney",
      type: "Legal Form",
      date: "Updated Jan 2024",
      status: "Available",
    },
    {
      id: 2,
      title: "Last Will and Testament",
      type: "Legal Form",
      date: "Updated Mar 2024",
      status: "Available",
    },
    {
      id: 3,
      title: "Non-Disclosure Agreement",
      type: "Contract Template",
      date: "Updated Feb 2024",
      status: "Available",
    },
    {
      id: 4,
      title: "Business Formation Documents",
      type: "Legal Package",
      date: "Updated Apr 2024",
      status: "Available",
    },
  ]

  // Mock data for legal advisors
  const legalAdvisors = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Corporate Law",
      experience: "15 years",
      rating: 4.9,
      reviews: 124,
      availability: "Available today",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Tax Law",
      experience: "12 years",
      rating: 4.8,
      reviews: 98,
      availability: "Available tomorrow",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      specialty: "Estate Planning",
      experience: "10 years",
      rating: 4.7,
      reviews: 87,
      availability: "Available today",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "David Williams",
      specialty: "Intellectual Property",
      experience: "18 years",
      rating: 4.9,
      reviews: 156,
      availability: "Available in 2 days",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      advisor: "Sarah Johnson",
      date: "May 15, 2024",
      time: "10:00 AM",
      type: "Video Call",
      topic: "Business Contract Review",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Assistance</h1>
          <p className="text-gray-600 mt-1">Access premium legal services and resources</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
          <Button className="bg-[#003366] hover:bg-[#002244] text-white">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Consultation
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#003366] to-[#004080] rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6">
            <Scale className="h-16 w-16" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Premium Legal Services</h2>
            <p className="mb-4">
              As a Primezart client, you have access to exclusive legal assistance services, including document review,
              consultations with top attorneys, and customized legal solutions for your personal and business needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 hover:bg-white/30">24/7 Legal Hotline</Badge>
              <Badge className="bg-white/20 hover:bg-white/30">Document Review</Badge>
              <Badge className="bg-white/20 hover:bg-white/30">Attorney Consultations</Badge>
              <Badge className="bg-white/20 hover:bg-white/30">Legal Document Templates</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Legal Services</h2>
          <div className="mt-3 sm:mt-0 flex items-center">
            <div className="relative mr-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search services..."
                className="pl-10 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="representation">Representation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {legalServices.map((service) => (
            <Card key={service.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-[#f0f5ff] flex items-center justify-center mb-2">
                  <div className="text-[#003366]">{service.icon}</div>
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-[#003366]">{service.price}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {service.timeframe}
                  </p>
                </div>
                <Button variant="ghost" className="text-[#003366] hover:text-[#002244] p-0">
                  Details <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="documents" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Legal Documents</TabsTrigger>
          <TabsTrigger value="advisors">Legal Advisors</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <CardTitle>Document Templates & Resources</CardTitle>
                <div className="mt-3 sm:mt-0">
                  <Input placeholder="Search documents..." className="w-full sm:w-64" />
                </div>
              </div>
              <CardDescription>
                Access and download legal document templates prepared by our legal experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Document Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {legalDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{doc.title}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{doc.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{doc.date}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{doc.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="text-[#003366]">
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalAdvisors.map((advisor) => (
              <Card key={advisor.id} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={advisor.image} alt={advisor.name} />
                      <AvatarFallback>
                        {advisor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">{advisor.name}</h3>
                      <p className="text-[#003366] font-medium">{advisor.specialty}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <span className="mr-3">{advisor.experience} experience</span>
                        <span className="flex items-center">
                          ★ {advisor.rating} ({advisor.reviews} reviews)
                        </span>
                      </div>
                      <Badge className="mt-2 bg-green-100 text-green-800">{advisor.availability}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm" className="text-[#003366]">
                      <Mail className="h-4 w-4 mr-1" /> Message
                    </Button>
                    <Button variant="outline" size="sm" className="text-[#003366]">
                      <Phone className="h-4 w-4 mr-1" /> Call
                    </Button>
                    <Button size="sm" className="bg-[#003366] hover:bg-[#002244] text-white">
                      <Calendar className="h-4 w-4 mr-1" /> Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Legal Consultations</CardTitle>
              <CardDescription>Your scheduled appointments with legal advisors</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={appointment.image} alt={appointment.advisor} />
                          <AvatarFallback>
                            {appointment.advisor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{appointment.topic}</h4>
                          <p className="text-sm text-gray-600">with {appointment.advisor}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" /> {appointment.date}
                            <Clock className="h-3 w-3 ml-2 mr-1" /> {appointment.time}
                            {appointment.type === "Video Call" && <Video className="h-3 w-3 ml-2 mr-1" />}
                            {appointment.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button size="sm" className="bg-[#003366] hover:bg-[#002244] text-white">
                          Join Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled legal consultations.</p>
                  <Button className="bg-[#003366] hover:bg-[#002244] text-white">Schedule a Consultation</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Need Specialized Legal Assistance?</h2>
            <p className="text-gray-600 max-w-2xl">
              Our team of legal experts is available to provide personalized assistance for complex legal matters.
              Contact our dedicated legal support team for priority service.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-[#003366] hover:bg-[#002244] text-white">
              <ExternalLink className="mr-2 h-4 w-4" />
              Contact Legal Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

