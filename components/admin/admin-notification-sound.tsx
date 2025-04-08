"use client"

import { useEffect, useRef } from "react"

export default function AdminNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/notification.mp3")

    // Play the notification sound
    const playSound = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.5 // Set volume to 50%
          await audioRef.current.play()
        }
      } catch (error) {
        console.error("Failed to play notification sound:", error)
      }
    }

    playSound()

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return null // This component doesn't render anything
}

