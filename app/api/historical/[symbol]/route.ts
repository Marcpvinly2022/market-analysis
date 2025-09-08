import { NextResponse } from "next/server"
import { generateHistoricalData } from "@/lib/data/mock-data"
import type { ApiResponse, HistoricalData } from "@/lib/types/market"

export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params
    const url = new URL(request.url)
    const days = Number.parseInt(url.searchParams.get("days") || "30")

    if (!symbol) {
      const errorResponse: ApiResponse<never> = {
        data: [] as never,
        success: false,
        error: "Symbol parameter is required",
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const historicalData = generateHistoricalData(symbol.toUpperCase(), days)

    const response: ApiResponse<HistoricalData[]> = {
      data: historicalData,
      success: true,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      data: [] as never,
      success: false,
      error: "Failed to fetch historical data",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
