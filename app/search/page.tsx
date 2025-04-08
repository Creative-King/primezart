"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SearchIcon } from "lucide-react"

import SearchBar from "@/components/search-bar"

interface SearchResult {
  title: string
  description: string
  category: string
  url: string
  image?: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      setIsLoading(true)

      // Simulate API call to search database
      setTimeout(() => {
        // Mock search results
        const mockResults: SearchResult[] = [
          {
            title: "Premium Checking Account",
            description:
              "Our premium checking account offers unlimited transactions, no monthly fees, and exclusive rewards.",
            category: "Personal Banking",
            url: "/services/personal/checking",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            title: "Mobile Banking App",
            description:
              "Download our mobile banking app to manage your accounts, transfer funds, and pay bills from anywhere.",
            category: "Digital Banking",
            url: "/mobile-app",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            title: "Investment Advisory Services",
            description: "Our expert advisors can help you build and manage a diversified investment portfolio.",
            category: "Investment Services",
            url: "/services/investments/advisory",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            title: "Mortgage Calculator",
            description: "Use our mortgage calculator to estimate your monthly payments and total cost of ownership.",
            category: "Tools",
            url: "/tools/mortgage-calculator",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            title: "Contact Customer Service",
            description: "Get in touch with our customer service team for assistance with your accounts.",
            category: "Support",
            url: "/contact",
            image: "/placeholder.svg?height=100&width=100",
          },
        ]

        // Filter results based on query
        const filteredResults = mockResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()),
        )

        setResults(filteredResults)
        setIsLoading(false)
      }, 1000)
    }
  }, [query])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#003366] text-white py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        {query ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                {isLoading ? "Searching..." : `Showing ${results.length} results for "${query}"`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <Link key={index} href={result.url} className="block">
                    <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      {result.image && (
                        <div className="flex-shrink-0">
                          <Image
                            src={result.image || "/placeholder.svg"}
                            alt={result.title}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-[#f0a500] font-medium mb-1">{result.category}</div>
                        <h2 className="text-xl font-bold text-[#003366] mb-2">{result.title}</h2>
                        <p className="text-gray-700">{result.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-[#003366] mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any results for "{query}". Please try a different search term.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-[#003366] mb-2">Search our website</h2>
            <p className="text-gray-600 mb-6">
              Enter a search term to find information about our services, products, and support.
            </p>
            <div className="max-w-md mx-auto">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

