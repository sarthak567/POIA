"use client";

import { Sparkles, Zap, Shield, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      icon: Sparkles,
      title: "1. Describe Your Intent",
      description: "Tell our AI what you want to automate in plain English. For example: 'Invest 100 USDC into ETH every Monday'",
      color: "text-primary-400",
    },
    {
      icon: Zap,
      title: "2. AI Parses & Validates",
      description: "Our Grok AI analyzes your intent, extracts actions, frequency, and safety constraints automatically",
      color: "text-accent-400",
    },
    {
      icon: Shield,
      title: "3. Mint as NFT",
      description: "Your intent is minted as a Proof-of-Intent NFT on Polygon Amoy, creating a verifiable on-chain record",
      color: "text-green-400",
    },
    {
      icon: CheckCircle2,
      title: "4. Automated Execution",
      description: "AI agents execute your intent automatically based on the rules, with full transparency and control",
      color: "text-blue-400",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to automate your Web3 activities with AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 rounded-xl hover:bg-white/10 transition-all"
            >
              <step.icon className={`w-10 h-10 ${step.color} mb-4`} />
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

