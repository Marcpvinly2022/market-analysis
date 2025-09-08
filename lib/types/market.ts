export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  timestamp: string
  high24h?: number
  low24h?: number
  openPrice?: number
  closePrice?: number
}

export interface PortfolioPosition {
  id: string
  symbol: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  purchaseDate: string
  lastUpdated: string
}

export interface Portfolio {
  id: string
  userId: string
  totalValue: number
  dailyPnL: number
  dailyPnLPercent: number
  positions: PortfolioPosition[]
  performance: PerformanceMetrics
  lastUpdated: string
}

export interface PerformanceMetrics {
  "1D": number
  "1W": number
  "1M": number
  "3M": number
  "6M": number
  "1Y": number
}

export interface HistoricalData {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedClose?: number
}

export interface MarketAlert {
  id: string
  userId: string
  symbol: string
  alertType: "price_above" | "price_below" | "volume_spike" | "percent_change"
  threshold: number
  isActive: boolean
  createdAt: string
  triggeredAt?: string
  message: string
}

export interface MarketSector {
  name: string
  performance: number
  marketCap: number
  topStocks: string[]
}

export interface MarketIndex {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
  timestamp: string
}

export interface TechnicalIndicator {
  symbol: string
  rsi: number
  macd: number
  sma20: number
  sma50: number
  sma200: number
  bollingerUpper: number
  bollingerLower: number
  timestamp: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  timestamp?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
