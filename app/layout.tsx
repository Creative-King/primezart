import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Open_Sans, Montserrat } from "next/font/google"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { LanguageProvider } from "@/components/language-context"
import ChatWidget from "@/components/chat-widget"

// Define fonts
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
})

// Update metadata
export const metadata: Metadata = {
  title: "Primezart",
  description: "Premium banking services",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'