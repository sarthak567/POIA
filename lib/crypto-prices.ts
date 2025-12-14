// CoinCap API integration for real cryptocurrency price data

export interface CryptoAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface CryptoPriceResponse {
  data: CryptoAsset | CryptoAsset[];
  timestamp: number;
}

// Common token IDs for CoinCap API
export const TOKEN_IDS: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
  MATIC: "matic-network",
  USDC: "usd-coin",
  USDT: "tether",
  DAI: "dai",
  WETH: "wrapped-ether",
  WBTC: "wrapped-bitcoin",
};

/**
 * Get real-time price for a cryptocurrency
 */
export async function getCryptoPrice(symbol: string): Promise<number | null> {
  try {
    const tokenId = TOKEN_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
    const response = await fetch(`/api/crypto-prices?asset=${tokenId}&action=price`);
    
    if (!response.ok) {
      console.error("Failed to fetch crypto price:", response.status);
      return null;
    }

    const data: CryptoPriceResponse = await response.json();
    
    if (Array.isArray(data.data)) {
      const asset = data.data.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase());
      return asset ? parseFloat(asset.priceUsd) : null;
    } else {
      return parseFloat(data.data.priceUsd);
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error);
    return null;
  }
}

/**
 * Get multiple crypto prices at once
 */
export async function getCryptoPrices(symbols: string[]): Promise<Record<string, number>> {
  try {
    const prices: Record<string, number> = {};
    
    // Fetch all prices in parallel
    const pricePromises = symbols.map(async (symbol) => {
      const price = await getCryptoPrice(symbol);
      return { symbol, price };
    });

    const results = await Promise.all(pricePromises);
    
    results.forEach(({ symbol, price }) => {
      if (price !== null) {
        prices[symbol.toUpperCase()] = price;
      }
    });

    return prices;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return {};
  }
}

/**
 * Get top cryptocurrencies
 */
export async function getTopCryptos(limit: number = 10): Promise<CryptoAsset[]> {
  try {
    const response = await fetch(`/api/crypto-prices?action=price&limit=${limit}`);
    
    if (!response.ok) {
      return [];
    }

    const data: CryptoPriceResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching top cryptos:", error);
    return [];
  }
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, decimals: number = 2): string {
  if (price >= 1) {
    return `$${price.toFixed(decimals)}`;
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(8)}`;
  }
}

/**
 * Calculate gas cost in USD based on current MATIC price
 */
export async function calculateGasCostUSD(gasAmount: number): Promise<string> {
  try {
    const maticPrice = await getCryptoPrice("MATIC");
    if (maticPrice) {
      const costUSD = gasAmount * maticPrice;
      return `$${costUSD.toFixed(4)}`;
    }
    return `${gasAmount} MATIC`;
  } catch (error) {
    return `${gasAmount} MATIC`;
  }
}


