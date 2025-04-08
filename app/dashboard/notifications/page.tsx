"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ArrowLeft, CheckCircle, AlertCircle, Info, Clock, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Security Alert",
    message: "Unusual login detected from a new device. Please verify if this was you.",
    date: "2025-03-10T14:30:00",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Feature Available",
    message: "You can now set up automatic payments for your recurring bills.",
    date: "2025-03-09T10:15:00",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Transfer Completed",
    message: "Your transfer of $1,500.00 to John Smith has been completed successfully.",
    date: "2025-03-08T16:45:00",
    read: false,
  },
  {
    id: 4,
    type: "pending",
    title: "Pending Transaction",
    message: "Your payment of $89.99 to Amazon is pending authorization.",
    date: "2025-03-07T09:20:00",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Statement Available",
    message: "Your February 2025 statement is now available for download.",
    date: "2025-03-05T11:30:00",
    read: true,
  },
  {
    id: 6,
    type: "alert",
    title: "Password Changed",
    message: "Your account password was changed successfully.",
    date: "2025-03-03T15:10:00",
    read: true,
  },
  {
    id: 7,
    type: "success",
    title: "Deposit Received",
    message: "A deposit of $2,750.00 has been credited to your account.",
    date: "2025-03-01T08:45:00",
    read: true,
  },
]

export default function Notifications() {
  const router = useRouter()
  const [notificationsList, setNotificationsList] = useState(notifications)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const markAsRead = (id: number) => {
    setNotificationsList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotificationsList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const unreadCount = notificationsList.filter((n) => !n.read).length

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#003366]">Notifications</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-4">
                  {notificationsList.length > 0 ? (
                    notificationsList.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg flex items-start justify-between ${!notification.read ? "bg-blue-50 border-blue-100" : "bg-white"}`}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div>
                            <h3 className="font-semibold text-[#003366]">{notification.title}</h3>
                            <p className="text-gray-600 text-sm">{notification.message}</p>
                            <p className="text-gray-400 text-xs mt-1">{formatDate(notification.date)}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500">No notifications</h3>
                      <p className="text-gray-400">You don't have any notifications at the moment</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unread">
                <div className="space-y-4">
                  {notificationsList.filter((n) => !n.read).length > 0 ? (
                    notificationsList
                      .filter((n) => !n.read)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border rounded-lg bg-blue-50 border-blue-100 flex items-start justify-between"
                        >
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div>
                              <h3 className="font-semibold text-[#003366]">{notification.title}</h3>
                              <p className="text-gray-600 text-sm">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1">{formatDate(notification.date)}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500">All caught up!</h3>
                      <p className="text-gray-400">You have no unread notifications</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="read">
                <div className="space-y-4">
                  {notificationsList.filter((n) => n.read).length > 0 ? (
                    notificationsList
                      .filter((n) => n.read)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border rounded-lg bg-white flex items-start justify-between"
                        >
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div>
                              <h3 className="font-semibold text-[#003366]">{notification.title}</h3>
                              <p className="text-gray-600 text-sm">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1">{formatDate(notification.date)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500">No read notifications</h3>
                      <p className="text-gray-400">You don't have any read notifications</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

