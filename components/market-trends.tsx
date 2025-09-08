"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import type { MarketIndex } from "@/lib/types/market"

interface SectorData {
  name: string
  performance: number
  marketCap: number
  topStocks: string[]
}

const mockSectors: SectorData[] = [
  { name: "Technology", performance: 2.45, marketCap: 12500000000000, topStocks: ["AAPL", "MSFT", "GOOGL"] },
  { name: "Healthcare", performance: -0.87, marketCap: 8900000000000, topStocks: ["JNJ", "PFE", "UNH"] },
  { name: "Financial Services", performance: 1.23, marketCap: 7800000000000, topStocks: ["JPM", "BAC", "WFC"] },
  { name: "Consumer Cyclical", performance: -1.45, marketCap: 6700000000000, topStocks: ["AMZN", "TSLA", "HD"] },
  { name: "Communication Services", performance: 0.98, marketCap: 5600000000000, topStocks: ["META", "GOOGL", "NFLX"] },
]

export function MarketTrends() {
  const [sectors, setSectors] = useState<SectorData[]>(mockSectors)
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchIndices = async () => {
    try {
      setError(null)
      const response = await fetch("/api/market-indices")
      const result = await response.json()

      if (result.success) {
        setIndices(result.data)
        setLastUpdate(new Date())
      } else {
        throw new Error(result.error || "Failed to fetch market indices")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndices()
    const interval = setInterval(fetchIndices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market Trends</h2>
        <div className="flex items-center space-x-2">
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">Updated: {lastUpdate.toLocaleTimeString()}</span>
          )}
          <Button onClick={fetchIndices} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge variant="outline">Live Data</Badge>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle>Major Indices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && indices.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center p-4 border rounded-lg">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                  <div className="h-6 w-24 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {indices.map((index) => (
                <div key={index.symbol} className="text-center p-4 border rounded-lg">
                  <div className="font-semibold text-sm text-muted-foreground">{index.name}</div>
                  <div className="text-xl font-bold mt-1">{index.value.toLocaleString()}</div>
                  <div className="flex items-center justify-center space-x-1 text-xs mt-1">
                    {index.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={index.change >= 0 ? "text-green-500" : "text-red-500"}>
                      {index.change >= 0 ? "+" : ""}
                      {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sector Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectors.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">{sector.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Market Cap: ${(sector.marketCap / 1000000000000).toFixed(1)}T
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Top: {sector.topStocks.join(", ")}</div>
                </div>
                <div className="text-right">
                  <Badge variant={sector.performance >= 0 ? "default" : "destructive"}>
                    {sector.performance >= 0 ? "+" : ""}
                    {sector.performance.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
