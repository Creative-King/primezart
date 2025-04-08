"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"

export function MainNavigation() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top Navigation */}
      <div className="bg-[#003366] text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex">
            <Link
              href="/"
              className={`px-4 py-3 font-medium text-sm hover:bg-[#004080] ${pathname === "/" ? "bg-[#004080]" : ""}`}
            >
              HOME
            </Link>
            <Link
              href="/personal"
              className={`px-4 py-3 font-medium text-sm hover:bg-[#004080] ${pathname === "/personal" ? "bg-[#004080]" : ""}`}
            >
              PERSONAL
            </Link>
          </div>
          <div className="flex">
            <Link
              href="/language"
              className={`px-4 py-3 font-medium text-sm hover:bg-[#004080] ${pathname === "/language" ? "bg-[#004080]" : ""}`}
            >
              SELECT LANGUAGE
            </Link>
            <Link
              href="/sustainability"
              className={`px-4 py-3 font-medium text-sm hover:bg-[#004080] ${pathname === "/sustainability" ? "bg-[#004080]" : ""}`}
            >
              SUSTAINABILITY
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-3 font-medium text-sm hover:bg-[#004080] ${pathname === "/contact" ? "bg-[#004080]" : ""}`}
            >
              CONTACT
            </Link>
          </div>
        </div>
      </div>

      {/* Logo and Main Navigation */}
      <div className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="relative w-12 h-12">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Sky High Premium Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="ml-2">
                <div className="text-[#003366] font-bold text-xl">Sky High</div>
                <div className="text-[#f0a500] font-medium">Premium</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center ml-8 space-x-6">
              <Link
                href="/about"
                className={`text-[#003366] font-medium hover:text-[#f0a500] ${pathname === "/about" ? "text-[#f0a500]" : ""}`}
              >
                About
              </Link>
              <Link
                href="/services"
                className={`text-[#003366] font-medium hover:text-[#f0a500] ${pathname.includes("/services") ? "text-[#f0a500]" : ""}`}
              >
                Services
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <div className="relative">
                <SearchBar onClose={() => setIsSearchOpen(false)} />
              </div>
            ) : (
              <button className="p-2 text-[#003366]" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
                <Search className="h-5 w-5" />
              </button>
            )}
            <Link href="/online-banking">
              <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black font-medium">Online Banking</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainNavigation

