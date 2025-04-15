import Image from "next/image"
import { TopNavigation } from "@/components/top-navigation"
import { MainNavigation } from "@/components/main-navigation"
import { LoginForm } from "@/components/login-form"
import { ServiceFooter } from "@/components/service-footer"

export default function CustomerPortal() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Logo and Main Navigation */}
      <MainNavigation />

      {/* Main Content */}
      <div className="flex-grow relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Banking App Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Login Form */}
        <div className="relative z-10 flex justify-end h-full">
          <div className="mt-16 mr-16">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer with Service Icons */}
      <ServiceFooter />
    </div>
  )
}
