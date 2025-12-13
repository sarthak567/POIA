"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Zap, 
  Filter,
  Repeat,
  Target,
  Wallet,
  Clock,
  TrendingDown,
  ArrowUpDown,
  PiggyBank,
  Receipt,
  Users,
  BarChart3,
  Coins,
  Lock,
  RefreshCw,
  Gift
} from "lucide-react";
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
  {
    id: "7",
    title: "Recurring Bill Payments",
    description: "Automate monthly subscriptions and bill payments",
    category: "Payments",
    icon: Receipt,
    usage: 1650,
    example: "Send 20 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb every month on the 1st",
  },
  {
    id: "8",
    title: "Portfolio Rebalancing",
    description: "Automatically rebalance your portfolio to target allocation",
    category: "DeFi",
    icon: BarChart3,
    usage: 980,
    example: "Rebalance my portfolio to 60% ETH and 40% USDC when prices change by 10%",
  },
  {
    id: "9",
    title: "Take Profit Orders",
    description: "Auto-sell when profit target is reached",
    category: "Trading",
    icon: Target,
    usage: 1450,
    example: "Sell 25% of my BTC when price increases by 20%",
  },
  {
    id: "10",
    title: "Auto Staking",
    description: "Automatically stake rewards and compound earnings",
    category: "DeFi",
    icon: Lock,
    usage: 1120,
    example: "Stake my MATIC rewards every week and compound the earnings",
  },
  {
    id: "11",
    title: "Liquidity Provision",
    description: "Automatically add liquidity to pools when conditions are met",
    category: "DeFi",
    icon: Coins,
    usage: 750,
    example: "Add 1000 USDC to ETH/USDC pool when TVL is above $1M",
  },
  {
    id: "12",
    title: "Gas Optimization",
    description: "Batch transactions to save on gas fees",
    category: "Optimization",
    icon: Zap,
    usage: 890,
    example: "Wait for 5 pending transactions then batch execute them together",
  },
  {
    id: "13",
    title: "Savings Automation",
    description: "Automatically save a portion of income",
    category: "Savings",
    icon: PiggyBank,
    usage: 1340,
    example: "Transfer 10% of my USDC balance to savings wallet every Friday",
  },
  {
    id: "14",
    title: "Multi-Sig Automation",
    description: "Automate multi-signature wallet operations",
    category: "DAO",
    icon: Users,
    usage: 420,
    example: "Execute DAO proposal if 3 of 5 signers approve within 7 days",
  },
  {
    id: "15",
    title: "Price Alert & Action",
    description: "Get notified and take action when price changes",
    category: "Trading",
    icon: Clock,
    usage: 1890,
    example: "Buy 50 USDC worth of ETH when ETH price drops 5% in 24 hours",
  },
  {
    id: "16",
    title: "Token Swapping Automation",
    description: "Auto-swap tokens based on market conditions",
    category: "DeFi",
    icon: ArrowUpDown,
    usage: 1100,
    example: "Swap 100 USDC to DAI when DAI price is below $0.99",
  },
  {
    id: "17",
    title: "Yield Farming Rotation",
    description: "Automatically move funds between yield farms",
    category: "DeFi",
    icon: RefreshCw,
    usage: 920,
    example: "Move my USDC to highest APY farm when difference exceeds 2%",
  },
  {
    id: "18",
    title: "Recurring Donations",
    description: "Automate charitable donations and contributions",
    category: "Payments",
    icon: Gift,
    usage: 380,
    example: "Donate 50 USDC to 0xCharity... every month on the 15th",
  },
  {
    id: "19",
    title: "Trailing Stop Loss",
    description: "Dynamic stop-loss that follows price upward",
    category: "Risk",
    icon: TrendingDown,
    usage: 1560,
    example: "Sell my ETH if price drops 10% from the 7-day high",
  },
  {
    id: "20",
    title: "Dollar Cost Averaging Out",
    description: "Gradually sell holdings over time",
    category: "Trading",
    icon: Repeat,
    usage: 720,
    example: "Sell 5% of my ETH holdings every week for 20 weeks",
  },
  {
    id: "21",
    title: "Emergency Fund Builder",
    description: "Build emergency fund automatically",
    category: "Savings",
    icon: Wallet,
    usage: 1050,
    example: "Transfer 200 USDC to emergency wallet every month until balance reaches 5000 USDC",
  },
  {
    id: "22",
    title: "Arbitrage Opportunity",
    description: "Automatically execute arbitrage trades",
    category: "Trading",
    icon: ArrowUpDown,
    usage: 640,
    example: "Swap USDC to DAI on DEX A and back on DEX B when profit exceeds 0.5%",
  },
  {
    id: "23",
    title: "Liquidation Protection",
    description: "Prevent liquidation by adding collateral",
    category: "Risk",
    icon: Shield,
    usage: 1380,
    example: "Add 100 USDC collateral when loan health factor drops below 1.5",
  },
  {
    id: "24",
    title: "Token Vesting Release",
    description: "Automatically claim and manage vested tokens",
    category: "DAO",
    icon: Clock,
    usage: 290,
    example: "Claim vested tokens every month and stake 50% of them",
  },
];

const categories = ["All", "DeFi", "Risk", "DAO", "NFT", "Trading", "Payments", "Savings", "Optimization"];

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular");

  const filteredTemplates = templates
    .filter((template) => {
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.usage - a.usage; // Sort by usage descending
      } else {
        return parseInt(b.id) - parseInt(a.id); // Sort by ID descending (newest first)
      }
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
            <div className="flex flex-col gap-4">
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
                  <span className="text-sm text-gray-400">Sort:</span>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      sortBy === "popular"
                        ? "bg-primary-600 text-white"
                        : "glass text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      sortBy === "newest"
                        ? "bg-primary-600 text-white"
                        : "glass text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Newest
                  </button>
                </div>
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

          {/* Featured Templates (Top 3) */}
          {selectedCategory === "All" && searchQuery === "" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-primary-400" />
                <span>Featured Templates</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {templates
                  .sort((a, b) => b.usage - a.usage)
                  .slice(0, 3)
                  .map((template, idx) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="glass p-6 rounded-xl hover:bg-white/10 transition-all group cursor-pointer border-2 border-primary-500/30"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <template.icon className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                        <div className="flex flex-col items-end">
                          <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded mb-1">
                            {template.category}
                          </span>
                          <span className="text-xs text-yellow-400">⭐ Featured</span>
                        </div>
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
            </motion.div>
          )}

          {/* All Templates Section */}
          {filteredTemplates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                {selectedCategory !== "All" || searchQuery !== "" ? "Search Results" : "All Templates"}
              </h2>
              <div className="mb-4 text-gray-400 text-sm">
                Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
              </div>
            </motion.div>
          )}

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

