"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { getCryptoPrice, formatPrice, type CryptoAsset } from "@/lib/crypto-prices";
import { motion } from "framer-motion";

interface CryptoPriceDisplayProps {
  symbols?: string[];
  showChange?: boolean;
}

export function CryptoPriceDisplay({ symbols = ["ETH", "BTC", "MATIC"], showChange = true }: CryptoPriceDisplayProps) {
  const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/crypto-prices?action=price`);
        if (response.ok) {
          const data = await response.json();
          const assets = Array.isArray(data.data) ? data.data : [data.data];
          
          const priceMap: Record<string, { price: number; change: number }> = {};
          assets.forEach((asset: CryptoAsset) => {
            if (symbols.includes(asset.symbol)) {
              priceMap[asset.symbol] = {
                price: parseFloat(asset.priceUsd),
                change: parseFloat(asset.changePercent24Hr),
              };
            }
          });
          
          setPrices(priceMap);
        }
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [symbols]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading prices...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {symbols.map((symbol) => {
        const data = prices[symbol];
        if (!data) return null;

        const isPositive = data.change >= 0;
        const Icon = isPositive ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 glass px-3 py-1.5 rounded-lg"
          >
            <span className="font-semibold text-white">{symbol}</span>
            <span className="text-primary-400">{formatPrice(data.price)}</span>
            {showChange && (
              <div className={`flex items-center space-x-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                <Icon className="w-3 h-3" />
                <span className="text-xs">{Math.abs(data.change).toFixed(2)}%</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}


