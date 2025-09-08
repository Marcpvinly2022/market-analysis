"use client"

import { useState, useEffect, useCallback } from "react"
import type { Portfolio, ApiResponse } from "@/lib/types/market"

interface UsePortfolioOptions {
  updateInterval?: number
  autoRefresh?: boolean
}

interface UsePortfolioReturn {
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  refresh: () => Promise<void>
}

export function usePortfolio({
  updateInterval = 30000,
  autoRefresh = true,
}: UsePortfolioOptions = {}): UsePortfolioReturn {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchPortfolio = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch("/api/portfolio")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<Portfolio> = await response.json()

      if (result.success) {
        setPortfolio(result.data)
        setLastUpdate(new Date())
      } else {
        throw new Error(result.error || "Failed to fetch portfolio data")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Portfolio fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await fetchPortfolio()
  }, [fetchPortfolio])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const startFetching = async () => {
      await fetchPortfolio()

      if (autoRefresh) {
        interval = setInterval(fetchPortfolio, updateInterval)
      }
    }

    startFetching()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [fetchPortfolio, updateInterval, autoRefresh])

  return {
    portfolio,
    loading,
    error,
    lastUpdate,
    refresh,
  }
}
