import { NextResponse } from "next/server"
import { generateMarketIndices } from "@/lib/data/mock-data"
import type { ApiResponse, MarketIndex } from "@/lib/types/market"

export async function GET() {
  try {
    const indices: MarketIndex[] = generateMarketIndices()
    console.log("Generated indices:", indices) // ✅ debug log

    const response: ApiResponse<MarketIndex[]> = {
      data: indices,
      success: true,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    const errorResponse: ApiResponse<never> = {
      data: [] as never,
      success: false,
      error: "Failed to fetch market indices",
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
