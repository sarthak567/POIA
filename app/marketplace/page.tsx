"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { Sparkles, TrendingUp, DollarSign, Shield, Zap, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  usage: number;
  example: string;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Auto DCA Agent",
    description: "Dollar-cost average into your favorite tokens automatically",
    category: "DeFi",
    icon: TrendingUp,
    usage: 1250,
    example: "Invest 100 USDC into ETH every Monday",
  },
  {
    id: "2",
    title: "Auto Yield Rotation",
    description: "Automatically switch to the highest-yield pool",
    category: "DeFi",
    icon: DollarSign,
    usage: 890,
    example: "Move my USDC to the highest APY stablecoin pool weekly",
  },
  {
    id: "3",
    title: "Stop-Loss Protection",
    description: "Auto-sell if price drops below threshold",
    category: "Risk",
    icon: Shield,
    usage: 2100,
    example: "Sell my ETH if price drops below $2000",
  },
  {
    id: "4",
    title: "DAO Payroll Scheduler",
    description: "Automate recurring payments to team members",
    category: "DAO",
    icon: Zap,
    usage: 450,
    example: "Send 500 USDC to 0x742d... every 1st of the month",
  },
  {
    id: "5",
    title: "NFT Rental Auto-Renewal",
    description: "Automatically renew NFT rentals",
    category: "NFT",
    icon: Sparkles,
    usage: 320,
    example: "Renew my NFT rental if balance is above 100 USDC",
  },
  {
    id: "6",
    title: "Token Price Guard",
    description: "Auto-sell when price target is reached",
    category: "Trading",
    icon: TrendingUp,
    usage: 1800,
    example: "Sell 50% of my ETH when price reaches $3000",
  },
];

const categories = ["All", "DeFi", "Risk", "DAO", "NFT", "Trading"];

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    // Store template example and redirect to create page
    sessionStorage.setItem("templateExample", template.example);
    router.push("/create");
  };

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
              Intent Marketplace
            </h1>
            <p className="text-xl text-gray-300">
              Browse and mint popular automation templates
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-primary-600 text-white"
                          : "glass text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                onClick={() => handleUseTemplate(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <template.icon className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                  {template.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {template.usage.toLocaleString()} uses
                  </p>
                  <button className="text-primary-400 text-sm font-semibold group-hover:text-primary-300 transition-colors">
                    Use Template →
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 font-mono">{template.example}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No templates found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

