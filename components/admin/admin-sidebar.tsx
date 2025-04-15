"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Shield, Building, Globe } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type React from "react"

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AdminSidebar = ({ open, onOpenChange, className }: AdminSidebarProps) => {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-transform lg:relative lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2.5">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Dashboard</h2>
            <div className="space-y-1">
              <Button variant={pathname === "/admin" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Link>
              </Button>
              <Button
                variant={pathname === "/admin/users/approvals" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/users/approvals">
                  <Users className="mr-2 h-4 w-4" />
                  User Approvals
                </Link>
              </Button>
              <Button
                variant={pathname === "/admin/transactions" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/transactions">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Transactions
                </Link>
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">System Management</h2>
            <div className="space-y-1">
              <Button
                variant={pathname === "/admin/banks" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/banks">
                  <Building className="mr-2 h-4 w-4" />
                  Banks
                </Link>
              </Button>
              <Button
                variant={pathname === "/admin/international" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/international">
                  <Globe className="mr-2 h-4 w-4" />
                  International Transfers
                </Link>
              </Button>
              <Button
                variant={pathname === "/admin/security" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Link>
              </Button>
              <Button
                variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
                asChild
              >
                <Link href="/admin/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
