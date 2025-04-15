"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock crypto market data
const initialCryptoData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 51342.67,
    change24h: 2.45,
    volume24h: 32540000000,
    marketCap: 1004532600000,
    image: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 2513.48,
    change24h: 1.87,
    volume24h: 18650000000,
    marketCap: 301865400000,
    image: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    price: 0.5087,
    change24h: -0.76,
    volume24h: 1234000000,
    marketCap: 27350000000,
    image: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.392,
    change24h: 3.21,
    volume24h: 568900000,
    marketCap: 13872000000,
    image: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 102.43,
    change24h: 5.67,
    volume24h: 2450000000,
    marketCap: 44230000000,
    image: "/placeholder.svg?height=24&width=24",
  },
]

export function CryptoMarketData() {
  const [cryptoData, setCryptoData] = useState(initialCryptoData)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scrollWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth

    if (scrollWidth <= clientWidth) return

    const animateScroll = () => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1
        if (newPosition >= scrollWidth - clientWidth) {
          return 0
        }
        return newPosition
      })
    }

    const interval = setInterval(animateScroll, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosition
    }
  }, [scrollPosition])

  // This would be replaced with actual API calls in a production environment
  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      // Update with slight variations to simulate real-time data
      const updatedData = cryptoData.map((crypto) => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() * 0.02 - 0.01)),
        change24h: crypto.change24h + (Math.random() * 0.5 - 0.25),
      }))
      setCryptoData(updatedData)
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 800)
  }

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000)

    return () => clearInterval(interval)
  }, [cryptoData])

  // Format currency with commas and 2 decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value)
  }

  // Format large numbers with abbreviations (K, M, B)
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`
    }
    return `${value.toFixed(2)}`
  }

  // Animation for scrolling ticker
  // useEffect(() => {
  //   if (!scrollRef.current) return

  //   const scrollContainer = scrollRef.current
  //   setScrollWidth(scrollContainer.scrollWidth)
  //   setContainerWidth(scrollContainer.clientWidth)

  //   const animate = () => {
  //     setScrollPosition((prevPosition) => {
  //       const newPosition = prevPosition + 0.5
  //       // Reset when we've scrolled through all content
  //       if (newPosition >= scrollWidth) {
  //         return 0
  //       }
  //       return newPosition
  //     })
  //     animationRef.current = requestAnimationFrame(animate)
  //   }

  //   animationRef.current = requestAnimationFrame(animate)

  //   return () => {
  //     if (animationRef.current) {
  //       cancelAnimationFrame(animationRef.current)
  //     }
  //   }
  // }, [scrollWidth])

  // Update scroll position
  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollLeft = scrollPosition
  //   }
  // }, [scrollPosition])

  // Handle resize to recalculate widths
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (scrollRef.current) {
  //       setScrollWidth(scrollRef.current.scrollWidth)
  //       setContainerWidth(scrollRef.current.clientWidth)
  //     }
  //   }

  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Cryptocurrency Market</CardTitle>
            <CardDescription>Real-time crypto market data</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading} className="h-8 px-2">
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Animated ticker */}
        <div className="flex space-x-8 overflow-x-auto pb-2 no-scrollbar" ref={scrollRef}>
          {cryptoData.map((coin, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-white font-medium">{coin.name}</span>
              <span className="text-white font-bold">{formatCurrency(coin.price).replace("$", "")}</span>
              <span className={coin.change24h > 0 ? "text-green-400" : "text-red-400"}>
                {coin.change24h > 0 ? (
                  <ArrowUpIcon className="inline h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="inline h-3 w-3 mr-1" />
                )}
                {Math.abs(coin.change24h)}%
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-left text-muted-foreground">
                <th className="font-medium px-4 py-2">Asset</th>
                <th className="font-medium px-4 py-2 text-right">Price</th>
                <th className="font-medium px-4 py-2 text-right">24h Change</th>
                <th className="font-medium px-4 py-2 text-right">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto) => (
                <tr key={crypto.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={crypto.image || "/placeholder.svg"}
                        alt={crypto.name}
                        className="w-6 h-6 mr-2 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(crypto.price)}</td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      crypto.change24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <div className="flex items-center justify-end">
                      {crypto.change24h >= 0 ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(crypto.change24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatLargeNumber(crypto.marketCap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </CardFooter>
    </Card>
  )
}
