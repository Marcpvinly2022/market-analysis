"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Wifi, WifiOff, RefreshCw, Pause, Play } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import type { MarketData } from "@/lib/types/market"

interface RealTimeDataProps {
  symbols?: string[]
  updateInterval?: number
}

export function RealTimeData({ symbols, updateInterval = 2000 }: RealTimeDataProps) {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch("/api/market-data")
      const result = await response.json()

      if (result.success) {
        let data = result.data

        // Filter by symbols if provided
        if (symbols && symbols.length > 0) {
          data = data.filter((item: MarketData) => symbols.includes(item.symbol))
        }

        setMarketData(data)
        setLastUpdate(new Date())
        setIsConnected(true)
      } else {
        throw new Error(result.error || "Failed to fetch market data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const startRealTimeUpdates = () => {
      // Initial fetch
      fetchMarketData()

      // Set up interval for real-time updates
      if (!isPaused) {
        interval = setInterval(() => {
          fetchMarketData()
        }, updateInterval)
      }
    }

    startRealTimeUpdates()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [fetchMarketData, updateInterval, isPaused])

  const handleRefresh = () => {
    setLoading(true)
    fetchMarketData()
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const [priceChanges, setPriceChanges] = useState<Record<string, "up" | "down" | null>>({})

  useEffect(() => {
    const changes: Record<string, "up" | "down" | null> = {}

    marketData.forEach((stock) => {
      if (stock.change > 0) {
        changes[stock.symbol] = "up"
      } else if (stock.change < 0) {
        changes[stock.symbol] = "down"
      } else {
        changes[stock.symbol] = null
      }
    })

    setPriceChanges(changes)
  }, [marketData])

  if (loading && marketData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Real-Time Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading market data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Real-Time Market Data</CardTitle>
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isConnected ? "Live" : "Disconnected"}</span>
            </Badge>

            {/* Control Buttons */}
            <Button variant="outline" size="sm" onClick={togglePause}>
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </Button>

            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Last Update Time */}
        {lastUpdate && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
            {isPaused && " (Paused)"}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {marketData.map((stock) => (
            <div
              key={stock.symbol}
              className={`flex items-center justify-between p-3 rounded-lg bg-muted transition-all duration-300 ${
                priceChanges[stock.symbol] === "up"
                  ? "ring-2 ring-green-500/20 bg-green-50/50"
                  : priceChanges[stock.symbol] === "down"
                    ? "ring-2 ring-red-500/20 bg-red-50/50"
                    : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="font-semibold text-card-foreground">{stock.symbol}</div>
                <div className="text-lg font-bold text-card-foreground">${stock.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Vol: {stock.volume?.toLocaleString() || "N/A"}</div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-sm font-medium ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stock.high24h && stock.low24h && (
                      <>
                        H: ${stock.high24h.toFixed(2)} L: ${stock.low24h.toFixed(2)}
                      </>
                    )}
                  </div>
                </div>

                <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="flex items-center space-x-1">
                  {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{stock.changePercent.toFixed(2)}%</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {marketData.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">No market data available</div>
        )}
      </CardContent>
    </Card>
  )
}
