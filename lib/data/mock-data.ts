import type { MarketData, Portfolio, HistoricalData, MarketSector, MarketIndex } from "@/lib/types/market"

export const STOCK_SYMBOLS = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "TSLA",
  "AMZN",
  "META",
  "NVDA",
  "NFLX",
  "AMD",
  "INTC",
  "CRM",
  "ORCL",
  "ADBE",
  "PYPL",
  "UBER",
  "SPOT",
]

export const MARKET_SECTORS = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer Cyclical",
  "Communication Services",
  "Industrials",
  "Consumer Defensive",
  "Energy",
  "Utilities",
  "Real Estate",
  "Basic Materials",
]

export function generateMarketData(): MarketData[] {
  return STOCK_SYMBOLS.map((symbol) => {
    const basePrice = Math.random() * 800 + 50
    const change = (Math.random() - 0.5) * 20
    const changePercent = (change / basePrice) * 100

    return {
      symbol,
      price: Number(basePrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 1000000,
      marketCap: Math.floor(Math.random() * 2000000000000) + 10000000000,
      timestamp: new Date().toISOString(),
      high24h: Number((basePrice + Math.random() * 10).toFixed(2)),
      low24h: Number((basePrice - Math.random() * 10).toFixed(2)),
      openPrice: Number((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
      closePrice: Number((basePrice + (Math.random() - 0.5) * 3).toFixed(2)),
    }
  })
}

export function generatePortfolioData(userId = "user-123"): Portfolio {
  const positions = STOCK_SYMBOLS.slice(0, 8).map((symbol, index) => {
    const shares = Math.floor(Math.random() * 1000) + 10
    const avgPrice = Math.random() * 200 + 50
    const currentPrice = avgPrice + (Math.random() - 0.5) * 50
    const totalValue = shares * currentPrice
    const unrealizedPnL = shares * (currentPrice - avgPrice)
    const unrealizedPnLPercent = (unrealizedPnL / (shares * avgPrice)) * 100

    return {
      id: `position-${index + 1}`,
      symbol,
      shares,
      avgPrice: Number(avgPrice.toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(2)),
      totalValue: Number(totalValue.toFixed(2)),
      unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
      unrealizedPnLPercent: Number(unrealizedPnLPercent.toFixed(2)),
      purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
    }
  })

  const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0)
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0)
  const dailyPnLPercent = (totalPnL / totalValue) * 100

  return {
    id: "portfolio-1",
    userId,
    totalValue: Number(totalValue.toFixed(2)),
    dailyPnL: Number(totalPnL.toFixed(2)),
    dailyPnLPercent: Number(dailyPnLPercent.toFixed(2)),
    positions,
    performance: {
      "1D": Number((Math.random() * 6 - 3).toFixed(2)),
      "1W": Number((Math.random() * 10 - 5).toFixed(2)),
      "1M": Number((Math.random() * 20 - 10).toFixed(2)),
      "3M": Number((Math.random() * 30 - 15).toFixed(2)),
      "6M": Number((Math.random() * 40 - 20).toFixed(2)),
      "1Y": Number((Math.random() * 60 - 30).toFixed(2)),
    },
    lastUpdated: new Date().toISOString(),
  }
}

export function generateHistoricalData(symbol: string, days = 30): HistoricalData[] {
  const data: HistoricalData[] = []
  const basePrice = Math.random() * 200 + 50

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const open = basePrice + (Math.random() - 0.5) * 20
    const close = open + (Math.random() - 0.5) * 10
    const high = Math.max(open, close) + Math.random() * 5
    const low = Math.min(open, close) - Math.random() * 5
    const volume = Math.floor(Math.random() * 10000000) + 1000000

    data.push({
      symbol,
      date: date.toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      adjustedClose: Number(close.toFixed(2)),
    })
  }

  return data
}

export function generateMarketSectors(): MarketSector[] {
  return MARKET_SECTORS.map((name) => ({
    name,
    performance: Number((Math.random() * 10 - 5).toFixed(2)),
    marketCap: Math.floor(Math.random() * 5000000000000) + 100000000000,
    topStocks: STOCK_SYMBOLS.slice(0, 3),
  }))
}

export function generateMarketIndices(): MarketIndex[] {
  const indices = [
    { name: "S&P 500", symbol: "SPX", baseValue: 4500 },
    { name: "NASDAQ", symbol: "IXIC", baseValue: 14000 },
    { name: "Dow Jones", symbol: "DJI", baseValue: 35000 },
    { name: "Russell 2000", symbol: "RUT", baseValue: 2000 },
  ]

  return indices.map((index) => {
    const change = (Math.random() - 0.5) * 200
    const changePercent = (change / index.baseValue) * 100

    return {
      name: index.name,
      symbol: index.symbol,
      value: Number((index.baseValue + change).toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      timestamp: new Date().toISOString(),
    }
  })
}
