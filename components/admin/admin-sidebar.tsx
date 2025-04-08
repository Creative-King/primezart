"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  Shield,
  FileText,
  HelpCircle,
  Database,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AdminSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: SidebarItem[]
  badge?: number | string
}

export default function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Automatically open submenu based on current path
  useEffect(() => {
    const currentMainPath = pathname.split("/").slice(0, 3).join("/")
    const menuWithCurrentPath = sidebarItems.find((item) =>
      item.submenu?.some((subitem) => subitem.href.startsWith(currentMainPath)),
    )

    if (menuWithCurrentPath) {
      setOpenSubmenu(menuWithCurrentPath.title)
    }
  }, [pathname])

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "#",
      icon: <Users className="h-5 w-5" />,
      badge: 3,
      submenu: [
        {
          title: "All Users",
          href: "/admin/users",
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: "Pending Approvals",
          href: "/admin/users/approvals",
          icon: <Shield className="h-4 w-4" />,
          badge: 3,
        },
        {
          title: "User Activity",
          href: "/admin/users/activity",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Transactions",
      href: "#",
      icon: <CreditCard className="h-5 w-5" />,
      submenu: [
        {
          title: "All Transactions",
          href: "/admin/transactions",
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          title: "Pending Transactions",
          href: "/admin/transactions/pending",
          icon: <Bell className="h-4 w-4" />,
          badge: 5,
        },
        {
          title: "International Transfers",
          href: "/admin/transactions/international",
          icon: <Globe className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "System",
      href: "#",
      icon: <Database className="h-5 w-5" />,
      submenu: [
        {
          title: "Audit Logs",
          href: "/admin/system/audit",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Backup & Restore",
          href: "/admin/system/backup",
          icon: <Database className="h-4 w-4" />,
        },
        {
          title: "System Health",
          href: "/admin/system/health",
          icon: <Shield className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "/admin/support",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  const handleLogout = () => {
    // In a real app, perform logout actions
    localStorage.removeItem("isAdmin")
    window.location.href = "/admin/login"
  }

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => onOpenChange(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-950 border-r transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:z-0",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Sky Premium</span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) =>
                item.submenu ? (
                  <Collapsible
                    key={item.title}
                    open={openSubmenu === item.title}
                    onOpenChange={() => toggleSubmenu(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between font-normal",
                          pathname.startsWith(item.href) && "bg-muted",
                        )}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {openSubmenu === item.title ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 pt-1">
                      {item.submenu.map((subitem) => (
                        <Link key={subitem.href} href={subitem.href}>
                          <Button
                            variant="ghost"
                            className={cn("w-full justify-start font-normal", pathname === subitem.href && "bg-muted")}
                          >
                            <div className="flex items-center w-full">
                              {subitem.icon}
                              <span className="ml-2">{subitem.title}</span>
                              {subitem.badge && (
                                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                  {subitem.badge}
                                </span>
                              )}
                            </div>
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn("w-full justify-start font-normal", pathname === item.href && "bg-muted")}
                    >
                      <div className="flex items-center w-full">
                        {item.icon}
                        <span className="ml-2">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Button>
                  </Link>
                ),
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}

