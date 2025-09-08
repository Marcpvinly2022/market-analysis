"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface LiveAlert {
  id: string
  symbol: string
  message: string
  type: "price" | "volume" | "news" | "technical"
  severity: "low" | "medium" | "high"
  timestamp: Date
}

export function LiveAlerts() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate real-time alerts
    const generateAlert = (): LiveAlert => {
      const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]
      const types: LiveAlert["type"][] = ["price", "volume", "news", "technical"]
      const severities: LiveAlert["severity"][] = ["low", "medium", "high"]

      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]

      const messages = {
        price: `${symbol} price moved ${Math.random() > 0.5 ? "above" : "below"} key resistance level`,
        volume: `${symbol} experiencing unusual volume spike (+${(Math.random() * 200 + 50).toFixed(0)}%)`,
        news: `Breaking news may impact ${symbol} stock price`,
        technical: `${symbol} RSI indicates ${Math.random() > 0.5 ? "overbought" : "oversold"} conditions`,
      }

      return {
        id: `alert-${Date.now()}-${Math.random()}`,
        symbol,
        message: messages[type],
        type,
        severity,
        timestamp: new Date(),
      }
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new alert
        const newAlert = generateAlert()
        setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]) // Keep only 5 most recent
      }
    }, 5000)

    // Generate initial alert
    setAlerts([generateAlert()])

    return () => clearInterval(interval)
  }, [])

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const getSeverityColor = (severity: LiveAlert["severity"]) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
    }
  }

  const getTypeIcon = (type: LiveAlert["type"]) => {
    switch (type) {
      case "price":
        return TrendingUp
      case "volume":
        return TrendingDown
      case "news":
        return Bell
      case "technical":
        return AlertTriangle
    }
  }

  if (!isVisible || alerts.length === 0) return null

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Live Market Alerts</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getTypeIcon(alert.type)

            return (
              <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">{alert.symbol}</span>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => removeAlert(alert.id)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
