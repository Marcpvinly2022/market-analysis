import { NextResponse } from "next/server"
import { generateMarketData } from "@/lib/data/mock-data"
import type { ApiResponse, MarketData } from "@/lib/types/market"

export async function GET() {
  try {
    const marketData = generateMarketData()

    const response: ApiResponse<MarketData[]> = {
      data: marketData,
      success: true,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      data: [] as never,
      success: false,
      error: "Failed to fetch market data",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
