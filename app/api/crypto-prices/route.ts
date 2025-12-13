import { NextRequest, NextResponse } from "next/server";

// CoinCap API - Free cryptocurrency price data
// No API key required for basic usage (200 req/min)
// With API key: 500 req/min (optional)

const COINCAP_API_URL = "https://api.coincap.io/v2";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const asset = searchParams.get("asset"); // e.g., "ethereum", "bitcoin", "matic-network"
    const action = searchParams.get("action") || "price"; // price, assets, rates

    const apiKey = process.env.NEXT_PUBLIC_COINCAP_API_KEY;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add API key if available (optional, for higher rate limits)
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    let url = "";

    switch (action) {
      case "price":
        // Get price for specific asset
        if (asset) {
          url = `${COINCAP_API_URL}/assets/${asset}`;
        } else {
          // Get top assets
          url = `${COINCAP_API_URL}/assets?limit=100`;
        }
        break;
      case "rates":
        // Get exchange rates
        url = `${COINCAP_API_URL}/rates`;
        break;
      case "markets":
        // Get market data
        if (asset) {
          url = `${COINCAP_API_URL}/markets?baseId=${asset}`;
        } else {
          url = `${COINCAP_API_URL}/markets`;
        }
        break;
      default:
        url = `${COINCAP_API_URL}/assets?limit=100`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CoinCap API error:", response.status, errorText);
      return NextResponse.json(
        { error: `CoinCap API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching crypto prices:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch crypto data" },
      { status: 500 }
    );
  }
}

