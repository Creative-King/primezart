"use client"
import { Mail, Phone, MapPin, Scale } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

export default function SiteFooter() {
  const { currentLanguage } = useLanguage()
  const [legalDialogOpen, setLegalDialogOpen] = useState(false)
  const [attorneyDetailsOpen, setAttorneyDetailsOpen] = useState(false)
  const [legalIssue, setLegalIssue] = useState("")

  const handleLegalAssistance = () => {
    setLegalDialogOpen(true)
  }

  const handleRequestAttorney = () => {
    setLegalDialogOpen(false)
    setAttorneyDetailsOpen(true)
  }

  return (
    <footer className="bg-[#003366] text-white">
      <div className="container mx-auto pt-8 pb-6">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-2">
            <Image
              src="/images/primezart-logo.png"
              alt="Primezart Logo"
              width={40}
              height={40}
              className="h-10 w-auto mr-2"
            />
            <div>
              <div className="text-xl font-bold">
                <span className="text-white">Primez</span>
                <span className="text-[#f0a500]">art</span>
              </div>
              <div className="text-xs text-gray-300">THE ART OF BANKING</div>
            </div>
          </div>
          <p className="text-gray-300 text-sm text-center max-w-md">
            Providing premium banking services with a focus on security, innovation, and customer satisfaction.
          </p>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-300" />
              <span className="text-gray-300 text-sm">support@primezart.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-gray-300" />
              <span className="text-gray-300 text-sm">+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-300" />
              <span className="text-gray-300 text-sm">123 Financial Street, New York, NY 10001</span>
            </div>
          </div>
        </div>

        {/* Legal Assistance */}
        <div className="border-t border-gray-700 pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white flex items-center"
              onClick={handleLegalAssistance}
            >
              <Scale className="h-5 w-5 mr-2" />
              <span>Legal Assistance</span>
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Primezart. All rights reserved.
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-300 mr-2">
              <span className="mr-2">{currentLanguage.flag}</span>
              {currentLanguage.name}
            </span>
          </div>
        </div>
      </div>

      {/* Legal Assistance Dialog */}
      <Dialog open={legalDialogOpen} onOpenChange={setLegalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Legal Assistance</DialogTitle>
            <DialogDescription>
              Primezart provides legal assistance to our premium clients. Please select the type of legal assistance you
              need.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" onClick={handleRequestAttorney}>
                <Scale className="mr-2 h-4 w-4" />
                Request an Attorney
              </Button>
              <Button variant="outline" className="justify-start">
                <Scale className="mr-2 h-4 w-4" />
                Legal Document Review
              </Button>
              <Button variant="outline" className="justify-start">
                <Scale className="mr-2 h-4 w-4" />
                Banking Regulations Consultation
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLegalDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attorney Details Dialog */}
      <Dialog open={attorneyDetailsOpen} onOpenChange={setAttorneyDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Attorney</DialogTitle>
            <DialogDescription>Here are the contact details for your assigned attorney.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Attorney"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl">James Davidson, Esq.</h3>
                <p className="text-gray-500">Banking & Finance Law Specialist</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Experience</p>
                <p>15+ years in Banking & Financial Law</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Education</p>
                <p>J.D., Harvard Law School</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p>james.davidson@primezart-legal.com</p>
                <p className="font-semibold">+1 (800) 123-4567 ext. 123</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Office Hours</p>
                <p>Monday - Friday: 9:00 AM - 5:00 PM EST</p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can contact your attorney directly using the phone number provided above. All
                communications are confidential and covered under attorney-client privilege.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setAttorneyDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  )
}

