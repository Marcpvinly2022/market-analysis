"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, PieChart, Activity, AlertTriangle, Database, Settings } from "lucide-react"
import { useState } from "react"

const sidebarItems = [
  { id: "overview", icon: BarChart3, label: "Overview", href: "/" },
  { id: "trends", icon: TrendingUp, label: "Market Trends", href: "/trends" },
  { id: "portfolio", icon: PieChart, label: "Portfolio", href: "/portfolio" },
  { id: "analytics", icon: Activity, label: "Analytics", href: "/analytics" },
  { id: "alerts", icon: AlertTriangle, label: "Alerts", href: "/alerts" },
  { id: "historical", icon: Database, label: "Historical Data", href: "/historical" },
  { id: "settings", icon: Settings, label: "Settings", href: "/settings" },
]

interface DashboardSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function DashboardSidebar({ activeSection = "overview", onSectionChange }: DashboardSidebarProps) {
  const [currentSection, setCurrentSection] = useState(activeSection)

  const handleSectionClick = (sectionId: string) => {
    setCurrentSection(sectionId)
    onSectionChange?.(sectionId)
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={currentSection === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              currentSection === item.id && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
            onClick={() => handleSectionClick(item.id)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
