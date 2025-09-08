"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MarketOverview } from "@/components/market-overview"
import { MarketCharts } from "@/components/market-charts"
import { RealTimeData } from "@/components/real-time-data"
import { MarketTicker } from "@/components/market-ticker"
import { LiveAlerts } from "@/components/live-alerts"
import { PortfolioView } from "@/components/portfolio-view"
import { MarketTrends } from "@/components/market-trends"
import { AnalyticsView } from "@/components/analytics-view"
import { AlertsView } from "@/components/alerts-view"
import { HistoricalView } from "@/components/historical-view"
import { SettingsView } from "@/components/settings-view"
import { useState } from "react"

export default function MarketDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderMainContent = () => {
    switch (activeSection) {
      case "portfolio":
        return <PortfolioView />
      case "trends":
        return <MarketTrends />
      case "analytics":
        return <AnalyticsView />
      case "alerts":
        return <AlertsView />
      case "historical":
        return <HistoricalView />
      case "settings":
        return <SettingsView />
      default:
        return (
          <div className="grid gap-6">
            <MarketOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketCharts />
              <RealTimeData symbols={["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]} />
            </div>
            <LiveAlerts />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <MarketTicker />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6 space-y-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}
