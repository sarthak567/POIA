"use client";

import { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-16 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass border border-primary-500/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Sparkles className="w-6 h-6 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Welcome to POIA! 🚀</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Create AI-powered automations for your Web3 activities. Simply describe what you want to automate, and our AI will handle the rest!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/create"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                      <span>Create Your First Intent</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center px-3 py-1.5 glass hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                      Browse Templates
                    </Link>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-4"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


