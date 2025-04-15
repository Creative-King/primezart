"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Menu, Sun, Moon, Search, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface AdminHeaderProps {
  onMenuButtonClick: () => void
}

export default function AdminHeader({ onMenuButtonClick }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "New User Registration",
        message: "John Doe has registered and is awaiting approval",
        time: "5 minutes ago",
        read: false,
        type: "user",
      },
      {
        id: 2,
        title: "Large Transaction Alert",
        message: "Transaction of $25,000 requires review",
        time: "1 hour ago",
        read: false,
        type: "transaction",
      },
      {
        id: 3,
        title: "System Update",
        message: "System maintenance scheduled for tonight",
        time: "3 hours ago",
        read: true,
        type: "system",
      },
    ])
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}"`,
      })
      // In a real app, implement search functionality
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuButtonClick}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {isSearchOpen ? (
        <form onSubmit={handleSearch} className="flex-1 md:w-auto md:flex-none">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full md:w-[300px] pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="ghost" size="icon" className="md:flex" onClick={() => setIsSearchOpen(true)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted"}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <Badge
                          variant={
                            notification.type === "user"
                              ? "default"
                              : notification.type === "transaction"
                                ? "destructive"
                                : "outline"
                          }
                          className="mr-2"
                        >
                          {notification.type}
                        </Badge>
                        <h4 className="font-medium">{notification.title}</h4>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
