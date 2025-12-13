"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { PageLayout } from "@/components/PageLayout";
import { getContractAddresses, EXECUTION_REGISTRY_ABI } from "@/lib/contracts";
import { formatAddress, formatDate } from "@/lib/utils";
import { Activity, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Execution {
  intentId: string;
  executor: string;
  timestamp: number;
  success: boolean;
  txHash: string;
  resultData: string;
}

export default function ActivityPage() {
  const searchParams = useSearchParams();
  const intentId = searchParams.get("intent");
  const { address, isConnected } = useAccount();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  const contracts = getContractAddresses();

  const { data: executionHistory } = useReadContract({
    address: contracts.executionRegistry,
    abi: EXECUTION_REGISTRY_ABI,
    functionName: "getExecutionHistory",
    args: intentId ? [BigInt(intentId)] : undefined,
    query: {
      enabled: !!intentId && isConnected,
    },
  });

  useEffect(() => {
    const fetchExecutions = async () => {
      if (!executionHistory || (executionHistory as any[]).length === 0) {
        // No execution history from contract yet - show empty state
        setExecutions([]);
      } else {
        // Parse real execution history from contract
        const parsed = (executionHistory as any[]).map((exec) => ({
          intentId: exec.intentId.toString(),
          executor: exec.executor,
          timestamp: Number(exec.timestamp),
          success: exec.success,
          txHash: exec.txHash,
          resultData: exec.resultData,
        }));
        setExecutions(parsed);
      }
      setLoading(false);
    };

    fetchExecutions();
  }, [executionHistory, intentId]);

  return (
    <PageLayout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Activity Logs
            </h1>
            <p className="text-xl text-gray-300">
              {intentId ? `Intent #${intentId} Execution History` : "All Execution History"}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <Activity className="w-8 h-8 animate-spin text-primary-400 mx-auto" />
            </div>
          ) : executions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-2xl text-center"
            >
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No Executions Yet</h3>
              <p className="text-gray-400 mb-4">
                {intentId 
                  ? `No execution history found for Intent #${intentId}. Executions will appear here once the intent starts running.`
                  : "Execution history will appear here once your intents start running. Executions are recorded on-chain when AI agents execute your intents."}
              </p>
              {intentId && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 px-4 py-2 glass hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span>Back to Dashboard</span>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {execution.success ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {execution.success ? "Execution Successful" : "Execution Failed"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatDate(execution.timestamp)}
                          </p>
                        </div>
                        <a
                          href={`https://amoy.polygonscan.com/tx/${execution.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Executor: </span>
                          <span className="text-primary-400 font-mono">
                            {formatAddress(execution.executor)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Intent ID: </span>
                          <span className="text-gray-300">#{execution.intentId}</span>
                        </div>
                        {execution.resultData && (
                          <div className="mt-3 p-3 bg-black/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Result Data:</p>
                            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                              {execution.resultData}
                            </pre>
                          </div>
                        )}
                      </div>
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

