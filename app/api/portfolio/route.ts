import { NextResponse } from "next/server"
import { generatePortfolioData } from "@/lib/data/mock-data"
import type { ApiResponse, Portfolio } from "@/lib/types/market"

export async function GET() {
  try {
    const portfolioData = generatePortfolioData()

    const response: ApiResponse<Portfolio> = {
      data: portfolioData,
      success: true,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      data: {} as never,
      success: false,
      error: "Failed to fetch portfolio data",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
