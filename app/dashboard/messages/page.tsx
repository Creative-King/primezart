"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft, Search, User, Send, Paperclip } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Mock messages data
const conversations = [
  {
    id: 1,
    contact: {
      name: "Customer Support",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      department: "Support Team",
    },
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hello! How can I assist you today with your banking needs?",
        time: "10:30 AM",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        text: "Hi, I have a question about my recent transaction. I don't recognize a charge from yesterday.",
        time: "10:35 AM",
        read: true,
      },
      {
        id: 3,
        sender: "them",
        text: "I'd be happy to help you with that. Could you please provide the transaction date and amount so I can look into it for you?",
        time: "10:38 AM",
        read: false,
      },
    ],
    unread: 1,
  },
  {
    id: 2,
    contact: {
      name: "Mortgage Advisor",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      department: "Mortgage Department",
    },
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Thank you for your interest in our mortgage products. Based on your application, I've prepared some options for you.",
        time: "Yesterday",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        text: "Thanks for getting back to me. When would be a good time to discuss these options in detail?",
        time: "Yesterday",
        read: true,
      },
    ],
    unread: 0,
  },
  {
    id: 3,
    contact: {
      name: "Investment Advisor",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      department: "Wealth Management",
    },
    messages: [
      {
        id: 1,
        sender: "them",
        text: "I've reviewed your portfolio and have some recommendations for rebalancing to align with your long-term goals.",
        time: "Mar 5",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        text: "That sounds great. Could you send me a detailed report of these recommendations?",
        time: "Mar 5",
        read: true,
      },
      {
        id: 3,
        sender: "them",
        text: "I've attached a comprehensive report with my analysis and recommendations. Let me know if you'd like to schedule a call to discuss further.",
        time: "Mar 6",
        read: false,
      },
    ],
    unread: 1,
  },
]

export default function Messages() {
  const router = useRouter()
  const [activeConversation, setActiveConversation] = useState<number | null>(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const filteredConversations = conversations.filter((convo) =>
    convo.contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const currentConversation = conversations.find((convo) => convo.id === activeConversation)

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    // In a real app, you would send this to your backend
    console.log(`Sending message to conversation ${activeConversation}: ${newMessage}`)

    // For demo purposes, we'll just clear the input
    setNewMessage("")
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold text-[#003366]">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg flex items-center cursor-pointer ${
                        activeConversation === conversation.id ? "bg-[#003366] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="relative mr-3">
                        <Image
                          src={conversation.contact.avatar || "/placeholder.svg"}
                          alt={conversation.contact.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        {conversation.contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3
                            className={`font-medium truncate ${
                              activeConversation === conversation.id ? "text-white" : "text-[#003366]"
                            }`}
                          >
                            {conversation.contact.name}
                          </h3>
                          <span
                            className={`text-xs ${
                              activeConversation === conversation.id ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            {conversation.messages[conversation.messages.length - 1].time}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            activeConversation === conversation.id ? "text-gray-200" : "text-gray-600"
                          }`}
                        >
                          {conversation.messages[conversation.messages.length - 1].text}
                        </p>
                        <p
                          className={`text-xs ${
                            activeConversation === conversation.id ? "text-gray-200" : "text-gray-400"
                          }`}
                        >
                          {conversation.contact.department}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span
                          className={`ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                            activeConversation === conversation.id
                              ? "bg-white text-[#003366]"
                              : "bg-[#f0a500] text-white"
                          }`}
                        >
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">No conversations found</h3>
                    <p className="text-gray-400">Try a different search term</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Conversation */}
          <Card className="md:col-span-2">
            <CardContent className="p-0 h-[600px] flex flex-col">
              {activeConversation && currentConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <Image
                          src={currentConversation.contact.avatar || "/placeholder.svg"}
                          alt={currentConversation.contact.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        {currentConversation.contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#003366]">{currentConversation.contact.name}</h3>
                        <p className="text-xs text-gray-500">
                          {currentConversation.contact.online ? "Online" : "Offline"} •{" "}
                          {currentConversation.contact.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "them" && (
                          <div className="mr-2 flex-shrink-0">
                            <Image
                              src={currentConversation.contact.avatar || "/placeholder.svg"}
                              alt={currentConversation.contact.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          </div>
                        )}
                        <div>
                          <div
                            className={`max-w-md rounded-lg p-3 ${
                              message.sender === "me"
                                ? "bg-[#003366] text-white rounded-tr-none"
                                : "bg-gray-100 rounded-tl-none"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div
                            className={`text-xs mt-1 flex items-center ${
                              message.sender === "me" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className="text-gray-500">{message.time}</span>
                            {message.sender === "me" && (
                              <span className="ml-1 text-blue-500">{message.read ? "✓✓" : "✓"}</span>
                            )}
                          </div>
                        </div>
                        {message.sender === "me" && (
                          <div className="ml-2 flex-shrink-0">
                            <User className="h-8 w-8 bg-gray-200 rounded-full p-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-end">
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                      />
                      <div className="flex ml-2">
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                          <Paperclip className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button
                          className="ml-2 rounded-full h-10 w-10 bg-[#003366]"
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">No conversation selected</h3>
                    <p className="text-gray-400">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

