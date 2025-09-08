import { z } from "zod"

export const MarketDataSchema = z.object({
  symbol: z.string().min(1).max(10),
  price: z.number().positive(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number().nonnegative(),
  marketCap: z.number().positive(),
  timestamp: z.string().datetime(),
  high24h: z.number().positive().optional(),
  low24h: z.number().positive().optional(),
  openPrice: z.number().positive().optional(),
  closePrice: z.number().positive().optional(),
})

export const PortfolioPositionSchema = z.object({
  id: z.string().uuid(),
  symbol: z.string().min(1).max(10),
  shares: z.number().positive(),
  avgPrice: z.number().positive(),
  currentPrice: z.number().positive(),
  totalValue: z.number(),
  unrealizedPnL: z.number(),
  unrealizedPnLPercent: z.number(),
  purchaseDate: z.string().datetime(),
  lastUpdated: z.string().datetime(),
})

export const PortfolioSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  totalValue: z.number(),
  dailyPnL: z.number(),
  dailyPnLPercent: z.number(),
  positions: z.array(PortfolioPositionSchema),
  performance: z.object({
    "1D": z.number(),
    "1W": z.number(),
    "1M": z.number(),
    "3M": z.number(),
    "6M": z.number(),
    "1Y": z.number(),
  }),
  lastUpdated: z.string().datetime(),
})

export const MarketAlertSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  symbol: z.string().min(1).max(10),
  alertType: z.enum(["price_above", "price_below", "volume_spike", "percent_change"]),
  threshold: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  triggeredAt: z.string().datetime().optional(),
  message: z.string().min(1).max(500),
})

export const HistoricalDataSchema = z.object({
  symbol: z.string().min(1).max(10),
  date: z.string().datetime(),
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().nonnegative(),
  adjustedClose: z.number().positive().optional(),
})
