"use client";

import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowRight, Sparkles, Shield, Zap, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-glow">
              Tell your AI what to do.
              <br />
              It executes on-chain — safely and automatically.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              POIA transforms user intentions into verifiable on-chain actions using AI agents,
              creating a new automation infrastructure for Web3.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-white hover:from-primary-500 hover:to-accent-500 transition-all transform hover:scale-105 glow-effect flex items-center justify-center space-x-2"
              >
                <span>Launch App</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 glass rounded-lg font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Marketplace</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-accent-500/20 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </section>

      {/* What is POIA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What is POIA?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The world's first on-chain AI intent execution layer. Instead of manually interacting
              with DeFi protocols, users simply express their goals in natural language.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Natural Language",
                description: "Express your goals in plain English. Our AI converts your intent into executable on-chain actions.",
              },
              {
                icon: Shield,
                title: "Proof-of-Intent NFT",
                description: "Every intent is minted as a tamper-proof NFT on Polygon, ensuring verifiable and transparent execution.",
              },
              {
                icon: Zap,
                title: "Automated Execution",
                description: "AI agents safely execute your intents with cryptographic guarantees and real-time monitoring.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass p-8 rounded-xl hover:bg-white/10 transition-all"
              >
                <feature.icon className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Features</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "DeFi Automation", desc: "Automate investments, yield farming, and portfolio management" },
              { icon: Lock, title: "DAO Operations", desc: "Streamline treasury management and governance workflows" },
              { icon: Zap, title: "Personal Finance", desc: "Automate recurring payments and smart savings strategies" },
              { icon: Shield, title: "Stop-Loss Guardrails", desc: "Protect your assets with automated risk management" },
              { icon: Sparkles, title: "Intent Marketplace", desc: "Browse and mint popular automation templates" },
              { icon: Globe, title: "Universal Use Cases", desc: "From crypto payroll to NFT scheduled tasks" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass p-6 rounded-xl hover:bg-white/10 transition-all"
              >
                <feature.icon className="w-8 h-8 text-primary-400 mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Automate Your Web3 Life?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start creating your first intent and experience the future of on-chain automation.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-white hover:from-primary-500 hover:to-accent-500 transition-all transform hover:scale-105"
            >
              <span>Create Your First Intent</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

