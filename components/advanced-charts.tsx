"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts"
import { useState } from "react"

const correlationData = [
  { x: 2.3, y: 1.8, symbol: "AAPL", size: 150 },
  { x: -1.2, y: 0.5, symbol: "GOOGL", size: 120 },
  { x: 3.1, y: 2.9, symbol: "MSFT", size: 180 },
  { x: -0.8, y: -1.2, symbol: "TSLA", size: 90 },
  { x: 1.5, y: 1.1, symbol: "AMZN", size: 160 },
  { x: 0.2, y: -0.3, symbol: "META", size: 110 },
]

const riskReturnData = [
  { subject: "Return", A: 120, B: 110, fullMark: 150 },
  { subject: "Volatility", A: 98, B: 130, fullMark: 150 },
  { subject: "Sharpe Ratio", A: 86, B: 130, fullMark: 150 },
  { subject: "Max Drawdown", A: 99, B: 100, fullMark: 150 },
  { subject: "Beta", A: 85, B: 90, fullMark: 150 },
  { subject: "Alpha", A: 65, B: 85, fullMark: 150 },
]

const treemapData = [
  {
    name: "Technology",
    size: 3500,
    children: [
      { name: "AAPL", size: 1200, value: 2.3 },
      { name: "MSFT", size: 1100, value: 1.8 },
      { name: "GOOGL", size: 800, value: -0.5 },
      { name: "NVDA", size: 400, value: 4.2 },
    ],
  },
  {
    name: "Healthcare",
    size: 2000,
    children: [
      { name: "JNJ", size: 800, value: 1.1 },
      { name: "PFE", size: 600, value: -1.2 },
      { name: "UNH", size: 600, value: 2.8 },
    ],
  },
  {
    name: "Financial",
    size: 1500,
    children: [
      { name: "JPM", size: 500, value: 0.8 },
      { name: "BAC", size: 400, value: 1.5 },
      { name: "WFC", size: 300, value: -0.3 },
      { name: "GS", size: 300, value: 2.1 },
    ],
  },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function AdvancedCharts() {
  const [activeChart, setActiveChart] = useState<"correlation" | "risk" | "treemap">("correlation")

  const renderChart = () => {
    switch (activeChart) {
      case "correlation":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="x"
                name="Beta"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Beta (Market Correlation)", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Alpha"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Alpha (Excess Return)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value, name) => [value, name === "x" ? "Beta" : name === "y" ? "Alpha" : name]}
              />
              <Scatter
                dataKey="size"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )

      case "risk":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={riskReturnData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickCount={4} />
              <Radar
                name="Portfolio"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Benchmark"
                dataKey="B"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )

      case "treemap":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="hsl(var(--border))"
              strokeWidth={2}
              content={({ root, depth, x, y, width, height, index, payload, colors, name }) => {
                if (depth === 1) {
                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                          fill: COLORS[index % COLORS.length],
                          stroke: "hsl(var(--border))",
                          strokeWidth: 2,
                          fillOpacity: 0.7,
                        }}
                      />
                      {width > 60 && height > 20 && (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          textAnchor="middle"
                          fill="hsl(var(--card-foreground))"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {name}
                        </text>
                      )}
                    </g>
                  )
                }
                if (depth === 2) {
                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                          fill: payload?.value > 0 ? "hsl(var(--chart-4))" : "hsl(var(--chart-2))",
                          stroke: "hsl(var(--border))",
                          strokeWidth: 1,
                          fillOpacity: 0.8,
                        }}
                      />
                      {width > 40 && height > 15 && (
                        <>
                          <text
                            x={x + width / 2}
                            y={y + height / 2 - 5}
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {name}
                          </text>
                          <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="white" fontSize="8">
                            {payload?.value > 0 ? "+" : ""}
                            {payload?.value?.toFixed(1)}%
                          </text>
                        </>
                      )}
                    </g>
                  )
                }
                return null
              }}
            />
          </ResponsiveContainer>
        )
    }
  }

  const getChartTitle = () => {
    switch (activeChart) {
      case "correlation":
        return "Risk-Return Scatter Plot"
      case "risk":
        return "Risk Profile Analysis"
      case "treemap":
        return "Portfolio Heatmap"
    }
  }

  const getChartDescription = () => {
    switch (activeChart) {
      case "correlation":
        return "Correlation between market beta and alpha generation"
      case "risk":
        return "Multi-dimensional risk assessment vs benchmark"
      case "treemap":
        return "Sector allocation with performance overlay"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">{getChartTitle()}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{getChartDescription()}</p>
          </div>
          <Badge variant="outline">Advanced Analytics</Badge>
        </div>

        <div className="flex space-x-2 mt-4">
          {(["correlation", "risk", "treemap"] as const).map((type) => (
            <Button
              key={type}
              variant={activeChart === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart(type)}
              className="h-8"
            >
              {type === "correlation" ? "Scatter" : type === "risk" ? "Radar" : "Treemap"}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {renderChart()}

        {/* Chart-specific legends and info */}
        {activeChart === "risk" && (
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary opacity-60 rounded"></div>
              <span>Portfolio</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-2 opacity-60 rounded"></div>
              <span>Benchmark</span>
            </div>
          </div>
        )}

        {activeChart === "treemap" && (
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-4 rounded"></div>
              <span>Positive Performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-2 rounded"></div>
              <span>Negative Performance</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
