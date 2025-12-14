"use client";

import { useAccount, useChainId } from "wagmi";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function NetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isAmoy = chainId === 80002;

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <div className="glass border rounded-lg p-3 flex items-center space-x-2">
        {isAmoy ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white">Polygon Amoy</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">Switch to Amoy</span>
          </>
        )}
      </div>
    </motion.div>
  );
}


