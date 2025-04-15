"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const { toast } = useToast()

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }, [pathname, isDesktop])

  // Set sidebar open by default on desktop
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true)
    }
  }, [isDesktop])

  // Check if user is authenticated as admin (simplified for demo)
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")
    if (!isAdmin && !pathname.includes("/admin/login")) {
      // In a real app, redirect to admin login
      toast({
        title: "Authentication required",
        description: "Please log in as an administrator.",
        variant: "destructive",
      })
      // window.location.href = "/admin/login"
    }
  }, [pathname, toast])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className={`flex flex-col ${sidebarOpen ? "lg:ml-64" : ""} transition-all duration-300 ease-in-out`}>
          <AdminHeader onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
