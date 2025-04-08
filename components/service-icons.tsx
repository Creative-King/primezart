"use client"

import { useState } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

const services = [
  { icon: "👤", label: "Open Account", href: "/enroll" },
  { icon: "💰", label: "Apply Banking", href: "/services/apply" },
  { icon: "💳", label: "Request Card", href: "/dashboard/cards/request" },
  { icon: "📞", label: "Contact Us", href: "/contact" },
  { icon: "📍", label: "Find a Branch", href: "/locations" },
  { icon: "📱", label: "App Download", href: "#", comingSoon: true },
  { icon: "🧮", label: "Loan Calculator", href: "#", comingSoon: true },
  { icon: "🌐", label: "Online Help", href: "/help" },
]

export default function ServiceIcons() {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonService, setComingSoonService] = useState("")

  const handleServiceClick = (service: { label: string; comingSoon?: boolean; href: string }) => {
    if (service.comingSoon) {
      setComingSoonService(service.label)
      setShowComingSoon(true)
      return
    }
  }

  return (
    <>
      <div className="bg-[#003366] text-white py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 justify-items-center">
            {services.map((item, index) =>
              item.comingSoon ? (
                <button
                  key={index}
                  onClick={() => handleServiceClick(item)}
                  className="flex flex-col items-center group bg-transparent border-none cursor-pointer"
                >
                  <div className="bg-[#f0a500] rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="text-sm text-center group-hover:text-[#f0a500] transition-colors">{item.label}</span>
                </button>
              ) : (
                <Link key={index} href={item.href} className="flex flex-col items-center group">
                  <div className="bg-[#f0a500] rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="text-sm text-center group-hover:text-[#f0a500] transition-colors">{item.label}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <AlertCircle className="h-5 w-5 mr-2 text-[#f0a500]" />
              Coming Soon
            </DialogTitle>
            <DialogDescription>
              Our {comingSoonService} feature is currently under development. We're working hard to bring you this
              service soon. Please check back later!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

