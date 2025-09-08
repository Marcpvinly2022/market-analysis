"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"
import { useState, useEffect } from "react"
import { TrendingUp, BarChart3, PieChartIcon, Activity } from "lucide-react"

const generateTimeSeriesData = (days = 30) => {
  const data = []
  const basePrice = 150
  let currentPrice = basePrice

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    const volatility = (Math.random() - 0.5) * 10
    currentPrice = Math.max(currentPrice + volatility, 50)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      high: Number((currentPrice + Math.random() * 5).toFixed(2)),
      low: Number((currentPrice - Math.random() * 5).toFixed(2)),
      sma20: Number((currentPrice + (Math.random() - 0.5) * 2).toFixed(2)),
      sma50: Number((currentPrice + (Math.random() - 0.5) * 4).toFixed(2)),
    })
  }
  return data
}

const sectorData = [
  { name: "Technology", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Healthcare", value: 20, color: "hsl(var(--chart-2))" },
  { name: "Financial", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Consumer", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Energy", value: 10, color: "hsl(var(--chart-5))" },
  { name: "Others", value: 8, color: "hsl(var(--muted))" },
]

const performanceData = [
  { period: "1W", portfolio: 2.3, market: 1.8, benchmark: 1.5 },
  { period: "1M", portfolio: 8.7, market: 6.2, benchmark: 5.8 },
  { period: "3M", portfolio: 15.2, market: 12.1, benchmark: 11.5 },
  { period: "6M", portfolio: 22.8, market: 18.9, benchmark: 17.2 },
  { period: "1Y", portfolio: 34.5, market: 28.7, benchmark: 26.3 },
]

type ChartType = "line" | "area" | "bar" | "pie" | "composed"

export function MarketCharts() {
  const [chartType, setChartType] = useState<ChartType>("line")
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData())
  const [timeframe, setTimeframe] = useState("30D")

  useEffect(() => {
    const days = timeframe === "7D" ? 7 : timeframe === "30D" ? 30 : timeframe === "90D" ? 90 : 365
    setTimeSeriesData(generateTimeSeriesData(days))
  }, [timeframe])

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Bar dataKey="portfolio" fill="hsl(var(--primary))" name="Portfolio" />
              <Bar dataKey="market" fill="hsl(var(--chart-2))" name="Market" />
              <Bar dataKey="benchmark" fill="hsl(var(--chart-3))" name="Benchmark" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case "composed":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis yAxisId="price" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="volume" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--muted))" opacity={0.3} />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma20"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1}
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma50"
                stroke="hsl(var(--chart-3))"
                strokeWidth={1}
                dot={false}
                strokeDasharray="10 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )

      default: // line chart
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  const getChartTitle = () => {
    switch (chartType) {
      case "area":
        return "Price Trend Analysis"
      case "bar":
        return "Performance Comparison"
      case "pie":
        return "Portfolio Allocation"
      case "composed":
        return "Technical Analysis"
      default:
        return "Market Performance"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">{getChartTitle()}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{timeframe}</Badge>
            <Badge variant={chartType === "line" ? "default" : "outline"}>
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Chart Type Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2">
            {(["line", "area", "bar", "pie", "composed"] as ChartType[]).map((type) => {
              const icons = {
                line: TrendingUp,
                area: Activity,
                bar: BarChart3,
                pie: PieChartIcon,
                composed: Activity,
              }
              const Icon = icons[type]

              return (
                <Button
                  key={type}
                  variant={chartType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType(type)}
                  className="h-8"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              )
            })}
          </div>

          {/* Timeframe Controls */}
          <div className="flex space-x-1">
            {["7D", "30D", "90D", "1Y"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className="h-8 px-3"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {renderChart()}

        {/* Chart Legend for Composed Chart */}
        {chartType === "composed" && (
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-primary"></div>
              <span>Price</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-chart-2 border-dashed border-t"></div>
              <span>SMA 20</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-chart-3 border-dashed border-t"></div>
              <span>SMA 50</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-2 bg-muted opacity-30"></div>
              <span>Volume</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
