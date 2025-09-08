"use client"

import { useState, useEffect, useCallback } from "react"
import type { MarketData, ApiResponse } from "@/lib/types/market"

interface UseMarketDataOptions {
  symbols?: string[]
  updateInterval?: number
  autoRefresh?: boolean
}

interface UseMarketDataReturn {
  data: MarketData[]
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  refresh: () => Promise<void>
  isConnected: boolean
}

export function useMarketData({
  symbols,
  updateInterval = 5000,
  autoRefresh = true,
}: UseMarketDataOptions = {}): UseMarketDataReturn {
  const [data, setData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch("/api/market-data")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<MarketData[]> = await response.json()

      if (result.success) {
        let marketData = result.data

        // Filter by symbols if provided
        if (symbols && symbols.length > 0) {
          marketData = marketData.filter((item) => symbols.includes(item.symbol))
        }

        setData(marketData)
        setLastUpdate(new Date())
        setIsConnected(true)
      } else {
        throw new Error(result.error || "Failed to fetch market data")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      setIsConnected(false)
      console.error("Market data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  const refresh = useCallback(async () => {
    setLoading(true)
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const startFetching = async () => {
      await fetchData()

      if (autoRefresh) {
        interval = setInterval(fetchData, updateInterval)
      }
    }

    startFetching()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [fetchData, updateInterval, autoRefresh])

  return {
    data,
    loading,
    error,
    lastUpdate,
    refresh,
    isConnected,
  }
}
