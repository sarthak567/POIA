# POIA - Proof-of-Intent Agents

The world's first on-chain AI intent execution layer on Polygon.

## 🚀 Overview

POIA transforms user intentions into verifiable on-chain actions using AI agents, creating a new automation infrastructure for Web3. Users express their goals in natural language, and AI safely executes those instructions on-chain with cryptographic guarantees.

## ✨ Features

- **Natural Language Intent Creator** - Express your automation goals in plain English using Gemini AI
- **Proof-of-Intent NFT** - Every intent is minted as a tamper-proof NFT on Polygon Amoy
- **24+ Automation Templates** - Pre-built templates for DCA, yield farming, stop-loss, and more
- **Intent Marketplace** - Browse and mint popular automation templates
- **Real-time Activity Logs** - Monitor all executions with full transparency
- **Live Crypto Prices** - Real-time price data from CoinCap API
- **Modern 3D UI** - Beautiful, futuristic interface with glassmorphism effects

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **AI**: Google Gemini API
- **Network**: Polygon Amoy Testnet (Chain ID: 80002)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd pol2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Polygon Amoy Testnet RPC URL
   NEXT_PUBLIC_AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
   AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY

   # Private Key (for deployment - NEVER commit to git)
   PRIVATE_KEY=your_private_key_here

   # Contract Addresses (after deployment)
   NEXT_PUBLIC_INTENT_NFT_ADDRESS=0x...
   NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=0x...

   # Chain ID
   NEXT_PUBLIC_CHAIN_ID=80002

   # WalletConnect Project ID (get from https://cloud.walletconnect.com)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

   # Gemini AI API Key (get from https://aistudio.google.com)
   NEXT_PUBLIC_AI_API_KEY=your_gemini_api_key

   # CoinCap API Key (optional - for higher rate limits)
   NEXT_PUBLIC_COINCAP_API_KEY=your_coincap_api_key
   ```

## 🏗️ Development

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Compile smart contracts**
   ```bash
   npm run compile
   ```

## 📝 Smart Contract Deployment

### Deploy to Polygon Amoy (Testnet)

1. **Get testnet MATIC**

   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Select "Amoy" testnet
   - Request testnet MATIC to your wallet

2. **Update `.env`**

   - Ensure your `.env` has `AMOY_RPC_URL` and `PRIVATE_KEY`

3. **Deploy contracts**

   ```bash
   npx hardhat run scripts/deploy.js --network amoy
   ```

4. **Save contract addresses**
   - Copy the deployed addresses from the console output
   - Add them to your `.env` file:
     ```env
     NEXT_PUBLIC_INTENT_NFT_ADDRESS=0x...
     NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=0x...
     ```

### Deploy to Polygon Mainnet

1. **Ensure you have mainnet MATIC**

   - You'll need MATIC for gas fees (recommended: 0.1+ MATIC)

2. **Update Hardhat config**

   - Add mainnet RPC URL to `.env`: `POLYGON_RPC_URL=...`

3. **Deploy contracts**

   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

4. **Update environment variables**
   - Add the mainnet contract addresses to your `.env`
   - Update `NEXT_PUBLIC_CHAIN_ID=137` for mainnet

## 🔑 Required APIs & Services

### 1. WalletConnect Project ID

**Where to get it**:

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID
5. Add to `.env`: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id`

### 2. Polygon RPC URL

**Where to get it**:

- **Alchemy**: [alchemy.com](https://www.alchemy.com/) - Free tier available
- **Infura**: [infura.io](https://www.infura.io/) - Free tier available
- **QuickNode**: [quicknode.com](https://www.quicknode.com/) - Free tier available

**Recommended**: Use Alchemy for better reliability

**How to set up**:

1. Sign up for Alchemy
2. Create a new Polygon Amoy app
3. Copy the HTTPS RPC URL
4. Add to `.env`: `NEXT_PUBLIC_AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY`

### 3. Gemini AI API Key

**Where to get it**:

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Add to `.env`: `NEXT_PUBLIC_AI_API_KEY=your_gemini_api_key`

**Why**: Powers the AI intent parsing feature

### 4. CoinCap API Key (Optional)

**Where to get it**:

1. Visit [CoinCap API](https://coincapapi.mintlify.app/api-reference/request-API-Key)
2. Request an API key
3. Add to `.env`: `NEXT_PUBLIC_COINCAP_API_KEY=your_api_key`

**Why**: Provides real-time cryptocurrency prices (works without key, but has rate limits)

## 🚢 Production Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables in Vercel dashboard
   - Deploy

### Deploy Smart Contracts

Follow the deployment steps above for Polygon mainnet.

## 📚 Project Structure

```
pol2/
├── app/                    # Next.js app directory
│   ├── create/            # Intent creation pages
│   ├── dashboard/         # User dashboard
│   ├── marketplace/      # Intent templates (24+ templates)
│   ├── activity/         # Execution logs
│   ├── api/              # API routes
│   │   ├── parse-intent/ # Gemini AI integration
│   │   └── crypto-prices/# CoinCap API integration
│   └── layout.tsx        # Root layout
├── components/            # React components
├── contracts/            # Solidity smart contracts
├── lib/                  # Utilities and helpers
├── scripts/              # Deployment scripts
└── public/               # Static assets
```

## 🔒 Security Considerations

1. **Never commit private keys** - Always use `.env` files
2. **Verify contract addresses** - Double-check before deploying
3. **Test on testnet first** - Always test on Amoy before mainnet
4. **Review smart contracts** - Consider getting an audit for production
5. **Rate limiting** - Implement rate limiting for production APIs
6. **API keys** - Keep all API keys secure and never expose them

## 🧪 Testing

```bash
# Compile contracts
npm run compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network amoy

# Test smart contracts
npx hardhat test
```

## 📖 Usage Guide

1. **Connect Wallet**: Click "Connect Wallet" in the navbar (switch to Polygon Amoy)
2. **Browse Templates**: Visit Marketplace to see 24+ automation templates
3. **Create Intent**: Go to "Create Intent" and describe what you want to automate
4. **AI Parsing**: Gemini AI will parse your intent and extract actions, frequency, and risks
5. **Review & Mint**: Review the parsed intent and mint as Proof-of-Intent NFT
6. **Monitor**: View your intents in the Dashboard
7. **Track Activity**: Check execution logs in Activity page

## 🎯 Features in Detail

### Intent Marketplace

- 24+ pre-built automation templates
- Categories: DeFi, Trading, Risk, Payments, Savings, DAO, NFT, Optimization
- Search and filter functionality
- Sort by popularity or newest

### AI Intent Parsing

- Powered by Google Gemini AI
- Automatic retry on failures
- Enhanced fallback parser for all template types
- Real-time crypto price context

### Dashboard

- View all your minted intents
- Pause/resume intents
- Track execution counts
- Links to PolygonScan

### Activity Logs

- Real-time execution history
- Transaction hashes
- Success/failure status
- Detailed execution data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## 🆘 Support

For issues and questions:

- Open an issue on GitHub
- Check the documentation
- Contact the development team

## 🎯 Roadmap

- [x] Gemini AI integration
- [x] CoinCap API for real prices
- [x] 24+ automation templates
- [x] Polygon Amoy deployment
- [ ] Executor node network
- [ ] Advanced intent templates
- [ ] Multi-chain support
- [ ] Mobile app
- [ ] DAO governance integration
- [ ] Enterprise API

---

Built with ❤️ for the Polygon ecosystem
