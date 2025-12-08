"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { PageLayout } from "@/components/PageLayout";
import { getContractAddresses, INTENT_NFT_ABI } from "@/lib/contracts";
import { formatAddress, formatDate } from "@/lib/utils";
import { Activity, Play, Pause, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface IntentData {
  tokenId: string;
  intentHash: string;
  createdAt: number;
  isActive: boolean;
  executionCount: number;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [userIntents, setUserIntents] = useState<IntentData[]>([]);
  const [loading, setLoading] = useState(true);

  const contracts = getContractAddresses();

  const { data: intentIds } = useReadContract({
    address: contracts.intentNFT,
    abi: INTENT_NFT_ABI,
    functionName: "getUserIntents",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  useEffect(() => {
    const fetchIntents = async () => {
      if (!intentIds || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        // In a real app, you'd fetch each intent's data
        // For now, we'll create mock data
        const intents: IntentData[] = (intentIds as bigint[]).map((id, idx) => ({
          tokenId: id.toString(),
          intentHash: `0x${id.toString(16).padStart(64, "0")}`,
          createdAt: Date.now() / 1000 - idx * 86400, // Mock timestamps
          isActive: idx % 3 !== 0, // Some inactive
          executionCount: Math.floor(Math.random() * 10),
        }));
        setUserIntents(intents);
      } catch (error) {
        console.error("Error fetching intents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntents();
  }, [intentIds, isConnected]);

  if (!isConnected) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view your intents</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-xl text-gray-300">Manage your active intents and automations</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Intents</p>
                  <p className="text-3xl font-bold">{userIntents.length}</p>
                </div>
                <Sparkles className="w-8 h-8 text-primary-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Intents</p>
                  <p className="text-3xl font-bold">
                    {userIntents.filter((i) => i.isActive).length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Executions</p>
                  <p className="text-3xl font-bold">
                    {userIntents.reduce((sum, i) => sum + i.executionCount, 0)}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-accent-400" />
              </div>
            </motion.div>
          </div>

          {/* Intents List */}
          {loading ? (
            <div className="text-center py-12">
              <Activity className="w-8 h-8 animate-spin text-primary-400 mx-auto" />
            </div>
          ) : userIntents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-2xl text-center"
            >
              <Sparkles className="w-16 h-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No Intents Yet</h3>
              <p className="text-gray-400 mb-6">Create your first intent to get started</p>
              <Link
                href="/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-white hover:from-primary-500 hover:to-accent-500 transition-all"
              >
                <span>Create Intent</span>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {userIntents.map((intent, idx) => (
                <motion.div
                  key={intent.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-6 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">Intent #{intent.tokenId}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            intent.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {intent.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-mono mb-2 break-all">
                        {intent.intentHash}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Created: {formatDate(intent.createdAt)}</span>
                        <span>•</span>
                        <span>Executions: {intent.executionCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                        title={intent.isActive ? "Pause" : "Resume"}
                      >
                        {intent.isActive ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <Link
                        href={`/activity?intent=${intent.tokenId}`}
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                        title="View Activity"
                      >
                        <Activity className="w-5 h-5" />
                      </Link>
                      <a
                        href={`https://amoy.polygonscan.com/token/${contracts.intentNFT}?a=${intent.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                        title="View on PolygonScan Amoy"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

