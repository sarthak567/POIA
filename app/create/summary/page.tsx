"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PageLayout } from "@/components/PageLayout";
import { parseIntent, generateIntentHash, type ParsedIntent } from "@/lib/ai-intent-parser";
import { getContractAddresses, INTENT_NFT_ABI } from "@/lib/contracts";
import { Loader2, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatAddress } from "@/lib/utils";
import { Toast } from "@/components/Toast";

export default function SummaryPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
  const [intentHash, setIntentHash] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning"; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("parsedIntent");
    if (stored) {
      const intent: ParsedIntent = JSON.parse(stored);
      setParsedIntent(intent);
      const hash = generateIntentHash(intent.intent, Date.now());
      setIntentHash(hash);
    } else {
      router.push("/create");
    }
  }, [router]);

  const handleMint = async () => {
    if (!isConnected || !address || !parsedIntent) return;

    const contracts = getContractAddresses();
    const tokenURI = `https://poia.app/intent/${intentHash}`;

    try {
      writeContract({
        address: contracts.intentNFT,
        abi: INTENT_NFT_ABI,
        functionName: "mintIntent",
        args: [
          address,
          intentHash,
          parsedIntent.executionRules,
          tokenURI,
          address, // Executor address (can be changed later)
        ],
      });
    } catch (err) {
      console.error("Error minting intent:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setToast({
        message: "Intent NFT minted successfully! Redirecting to dashboard...",
        type: "success",
        isVisible: true,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [isSuccess, router]);

  useEffect(() => {
    if (error) {
      setToast({
        message: `Error: ${error.message || "Failed to mint intent"}`,
        type: "error",
        isVisible: true,
      });
    }
  }, [error]);

  if (!parsedIntent) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Intent Summary
            </h1>
            <p className="text-xl text-gray-300">Review your intent before minting on-chain</p>
          </motion.div>

          <div className="space-y-6">
            {/* Human-Friendly Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold mb-4">Your Intent</h2>
              <p className="text-lg text-gray-300">{parsedIntent.intent}</p>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Intent Hash</h3>
                  <p className="font-mono text-sm text-primary-400 break-all">{intentHash}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Frequency</h3>
                  <p className="text-gray-300">{parsedIntent.frequency}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Estimated Gas</h3>
                  <p className="text-gray-300">{parsedIntent.estimatedGas}</p>
                </div>
              </div>
            </motion.div>

            {/* On-Chain Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold mb-4">On-Chain Actions</h2>
              <ul className="space-y-2">
                {parsedIntent.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-primary-400 mt-1">•</span>
                    <span className="text-gray-300">{action}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Safety Locks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-2xl border-2 border-green-500/30"
            >
              <h2 className="text-2xl font-semibold mb-4 text-green-400">Safety Locks</h2>
              <ul className="space-y-2">
                {parsedIntent.safetyConstraints.map((constraint, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-green-300">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Mint Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-8 rounded-2xl"
            >
              {!isConnected ? (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Please connect your wallet to mint</p>
                </div>
              ) : isSuccess ? (
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Intent Minted Successfully!</h3>
                  {hash && (
                    <a
                      href={`https://amoy.polygonscan.com/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <span>View on PolygonScan Amoy</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <p className="text-gray-400 mt-4">Redirecting to dashboard...</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    Minting as: <span className="text-primary-400">{formatAddress(address || "")}</span>
                  </p>
                  <button
                    onClick={handleMint}
                    disabled={isPending || isConfirming}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-white hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {(isPending || isConfirming) ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isConfirming ? "Confirming..." : "Minting..."}</span>
                      </>
                    ) : (
                      <>
                        <span>Mint Proof-of-Intent NFT</span>
                      </>
                    )}
                  </button>
                  {error && (
                    <p className="text-red-400 text-sm mt-4">Error: {error.message}</p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </PageLayout>
  );
}

