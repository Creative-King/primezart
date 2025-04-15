"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (isLoggedIn === "true") {
      // If already logged in, redirect to dashboard
      router.push("/dashboard")
    } else {
      // If not logged in, redirect to home page where login form is
      router.push("/")
    }
  }, [router])

  // Return null or a loading indicator while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting...</p>
    </div>
  )
}
