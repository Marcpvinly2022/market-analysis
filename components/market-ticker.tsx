"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MarketData } from "@/lib/types/market"

interface MarketTickerProps {
  updateInterval?: number
}

export function MarketTicker({ updateInterval = 3000 }: MarketTickerProps) {
  const [tickerData, setTickerData] = useState<MarketData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const response = await fetch("/api/market-data")
        const result = await response.json()

        if (result.success) {
          setTickerData(result.data.slice(0, 10)) // Show top 10 stocks
        }
      } catch (error) {
        console.error("Failed to fetch ticker data:", error)
      }
    }

    fetchTickerData()
    const interval = setInterval(fetchTickerData, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  useEffect(() => {
    if (tickerData.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % tickerData.length)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [tickerData])

  if (tickerData.length === 0) return null

  const currentStock = tickerData[currentIndex]

  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2 px-4">
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{currentStock.symbol}</span>
          <span className="font-bold">${currentStock.price.toFixed(2)}</span>
        </div>

        <div className={`flex items-center space-x-1 ${currentStock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {currentStock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>
            {currentStock.change >= 0 ? "+" : ""}
            {currentStock.changePercent.toFixed(2)}%
          </span>
        </div>

        <div className="text-muted-foreground text-xs">Vol: {currentStock.volume?.toLocaleString() || "N/A"}</div>
      </div>
    </div>
  )
}
