"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-context"

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { currentLanguage, setLanguage, languages } = useLanguage()

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/images/primezart-logo.png"
              alt="Primezart Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold">
                <span className="text-gray-900">Primez</span>
                <span className="sky-gold-text">art</span>
              </div>
              <div className="text-xs text-gray-500">THE ART OF BANKING</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/services") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <span className="mr-1">{currentLanguage.flag}</span>
                    <span className="hidden sm:inline-block">{currentLanguage.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang)}>
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href="/search">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            <Button asChild variant="sky" size="sm" className="h-8">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href="/enroll">Enroll</Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isSearchOpen && (
        <div className="border-t py-2 md:hidden">
          <div className="container">
            <form className="flex items-center space-x-2">
              <Input type="search" placeholder="Search..." className="h-9 flex-1" />
              <Button type="submit" size="sm" className="h-9 px-3">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </div>
        </div>
      )}
      {isMenuOpen && (
        <div className="border-t py-4 md:hidden">
          <div className="container space-y-1">
            <Link
              href="/"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray-200 mt-4 flex flex-col space-y-2">
              <Button asChild variant="sky" size="sm" className="w-full justify-center">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-center">
                <Link href="/enroll" onClick={() => setIsMenuOpen(false)}>
                  Enroll
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
