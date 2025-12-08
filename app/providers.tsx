"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { polygon } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import type { Chain } from "viem";

// Define Amoy testnet chain (Polygon's new testnet, replaced Mumbai)
// Use custom RPC from environment if available
// Note: In Next.js, NEXT_PUBLIC_* variables are available in the browser at build time
const amoyRpcUrl = 
  process.env.NEXT_PUBLIC_AMOY_RPC_URL || 
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 
  "https://rpc-amoy.polygon.technology";

// Define Amoy chain as a Chain object (compatible with wagmi/rainbowkit)
const polygonAmoy: Chain = {
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [amoyRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan Amoy",
      url: "https://amoy.polygonscan.com",
    },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "POIA - Proof of Intent Agents",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
  chains: [polygonAmoy, polygon], // Amoy first for testnet development
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

