import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart, Activity, Target } from "lucide-react"
import { AdvancedCharts } from "./advanced-charts"

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Badge variant="outline">Advanced Metrics</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Sharpe Ratio", value: "1.45", icon: Target, description: "Risk-adjusted return" },
          { title: "Beta", value: "0.87", icon: Activity, description: "Market correlation" },
          { title: "Max Drawdown", value: "-8.2%", icon: BarChart3, description: "Largest peak-to-trough decline" },
          { title: "Win Rate", value: "68%", icon: PieChart, description: "Profitable trades" },
        ].map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdvancedCharts />
    </div>
  )
}
