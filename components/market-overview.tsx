"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import type { Portfolio, MarketData } from "@/lib/types/market"

interface OverviewMetrics {
  totalPortfolioValue: number
  dailyPnL: number
  dailyPnLPercent: number
  totalMarketCap: number
  marketCapChange: number
  activePositions: number
  positionsChange: number
}

export function MarketOverview() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setError(null)

        // Fetch portfolio data
        const portfolioResponse = await fetch("/api/portfolio")
        const portfolioResult = await portfolioResponse.json()

        // Fetch market data
        const marketResponse = await fetch("/api/market-data")
        const marketResult = await marketResponse.json()

        if (portfolioResult.success && marketResult.success) {
          const portfolio: Portfolio = portfolioResult.data
          const marketData: MarketData[] = marketResult.data

          // Calculate total market cap from market data
          const totalMarketCap = marketData.reduce((sum, stock) => sum + stock.marketCap, 0)

          // Calculate average market cap change (simplified)
          const avgMarketCapChange = marketData.reduce((sum, stock) => sum + stock.changePercent, 0) / marketData.length

          const overviewMetrics: OverviewMetrics = {
            totalPortfolioValue: portfolio.totalValue,
            dailyPnL: portfolio.dailyPnL,
            dailyPnLPercent: portfolio.dailyPnLPercent,
            totalMarketCap,
            marketCapChange: avgMarketCapChange,
            activePositions: portfolio.positions.length,
            positionsChange: Math.floor(Math.random() * 5) - 2, // Simulated change
          }

          setMetrics(overviewMetrics)
        } else {
          throw new Error("Failed to fetch overview data")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewData()

    // Set up periodic updates
    const interval = setInterval(fetchOverviewData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">{error || "Failed to load overview data"}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metricCards = [
    {
      title: "Total Portfolio Value",
      value: `$${metrics.totalPortfolioValue.toLocaleString()}`,
      change: `${metrics.dailyPnLPercent >= 0 ? "+" : ""}${metrics.dailyPnLPercent.toFixed(2)}%`,
      trend: metrics.dailyPnLPercent >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Daily P&L",
      value: `${metrics.dailyPnL >= 0 ? "+" : ""}$${Math.abs(metrics.dailyPnL).toLocaleString()}`,
      change: `${metrics.dailyPnLPercent >= 0 ? "+" : ""}${metrics.dailyPnLPercent.toFixed(2)}%`,
      trend: metrics.dailyPnL >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: "Market Cap",
      value: `$${(metrics.totalMarketCap / 1000000000000).toFixed(1)}T`,
      change: `${metrics.marketCapChange >= 0 ? "+" : ""}${metrics.marketCapChange.toFixed(2)}%`,
      trend: metrics.marketCapChange >= 0 ? "up" : "down",
      icon: Activity,
    },
    {
      title: "Active Positions",
      value: metrics.activePositions.toString(),
      change: `${metrics.positionsChange >= 0 ? "+" : ""}${metrics.positionsChange}`,
      trend: metrics.positionsChange >= 0 ? "up" : "down",
      icon: Activity,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
              <span className="text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
