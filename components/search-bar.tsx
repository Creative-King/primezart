"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onClose?: () => void
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Add event listener for the Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (onClose) onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-96 items-center">
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search for services, products, help..."
        className="rounded-l-full border-r-0"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-2 bg-white border border-l-0 border-input"
          aria-label="Close search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Button type="submit" className="rounded-r-full bg-[#f0a500] hover:bg-[#e09400] text-black">
        Search
      </Button>
    </form>
  )
}

