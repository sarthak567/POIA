"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { parseIntent, type ParsedIntent } from "@/lib/ai-intent-parser";
import { Sparkles, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast } from "@/components/Toast";

const templates = [
  {
    title: "Auto-Invest Weekly",
    description: "Dollar-cost average into ETH every week",
    example: "Invest 100 USDC into ETH every Monday",
  },
  {
    title: "Pay Recurring Bills",
    description: "Automate monthly payments",
    example: "Send 20 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb every month on the 1st",
  },
  {
    title: "Rebalance Portfolio",
    description: "Automatically rebalance your holdings",
    example: "Rebalance my portfolio to 60% ETH and 40% USDC when prices change by 10%",
  },
  {
    title: "Stop-Loss Protection",
    description: "Auto-sell if price drops",
    example: "Sell my ETH if the price drops below $2000",
  },
];

export default function CreateIntentPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning"; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Check for template example from marketplace
  useEffect(() => {
    const templateExample = sessionStorage.getItem("templateExample");
    if (templateExample) {
      setInput(templateExample);
      sessionStorage.removeItem("templateExample");
    }
  }, []);

  const handleParse = async () => {
    if (!input.trim()) {
      setToast({
        message: "Please enter an intent description",
        type: "warning",
        isVisible: true,
      });
      return;
    }

    setIsParsing(true);
    try {
      const result = await parseIntent(input);
      setParsedIntent(result);
      
      if (result.fallback) {
        setToast({
          message: "Using fallback parser - Gemini API may be unavailable",
          type: "warning",
          isVisible: true,
        });
      } else {
        setToast({
          message: "Intent parsed successfully with Gemini AI!",
          type: "success",
          isVisible: true,
        });
      }
    } catch (error: any) {
      console.error("Error parsing intent:", error);
      setToast({
        message: `Failed to parse intent: ${error.message || "Please try again"}`,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleUseTemplate = (example: string) => {
    setInput(example);
  };

  const handleContinue = () => {
    if (parsedIntent) {
      // Store in sessionStorage to pass to summary page
      sessionStorage.setItem("parsedIntent", JSON.stringify(parsedIntent));
      router.push("/create/summary");
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Create Your Intent
            </h1>
            <p className="text-xl text-gray-300">
              Describe what you want to automate in natural language
            </p>
          </motion.div>

          {/* Main Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-2xl mb-8"
          >
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to automate...&#10;&#10;Example: 'Invest my USDC into the highest-yield stablecoin pool every Monday'"
                className="w-full h-48 bg-black/30 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isParsing}
              />
              <button
                onClick={handleParse}
                disabled={!input.trim() || isParsing}
                className="mt-4 w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-white hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Parsing Intent...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Parse Intent with Gemini AI</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Suggested Templates</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUseTemplate(template.example)}
                  className="glass p-6 rounded-xl text-left hover:bg-white/10 transition-all group"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  <p className="text-xs text-primary-300 font-mono">{template.example}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Parsed Intent Display */}
          <AnimatePresence>
            {parsedIntent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-8 rounded-2xl border-2 border-primary-500/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-semibold">Parsed Intent</h2>
                  </div>
                  {parsedIntent.fallback && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                      Fallback Mode
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary-400">Actions</h3>
                    <ul className="space-y-2">
                      {parsedIntent.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-primary-400 mt-1">•</span>
                          <span className="text-gray-300">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-primary-400">Frequency</h3>
                      <p className="text-gray-300">{parsedIntent.frequency}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-primary-400">Estimated Gas</h3>
                      <p className="text-gray-300">{parsedIntent.estimatedGas}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary-400">Risk Warnings</h3>
                    <ul className="space-y-2">
                      {parsedIntent.riskWarnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-yellow-400">
                          <span className="mt-1">⚠</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary-400">Safety Constraints</h3>
                    <ul className="space-y-2">
                      {parsedIntent.safetyConstraints.map((constraint, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-green-400">
                          <span className="mt-1">✓</span>
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-white hover:from-primary-500 hover:to-accent-500 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Summary</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

