# POIA - Proof-of-Intent Agents

The world's first on-chain AI intent execution layer on Polygon.

## 🚀 Overview

POIA transforms user intentions into verifiable on-chain actions using AI agents, creating a new automation infrastructure for Web3. Users express their goals in natural language, and AI safely executes those instructions on-chain with cryptographic guarantees.

## ✨ Features

- **Natural Language Intent Creator** - Express your automation goals in plain English
- **Proof-of-Intent NFT** - Every intent is minted as a tamper-proof NFT on Polygon
- **Automated Execution** - AI agents safely execute intents with cryptographic guarantees
- **Intent Marketplace** - Browse and mint popular automation templates
- **Real-time Activity Logs** - Monitor all executions with full transparency
- **Modern 3D UI** - Beautiful, futuristic interface with glassmorphism effects

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Network**: Polygon (Mainnet & Mumbai Testnet)

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
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file with:
   ```env
   # Polygon Network Configuration
   POLYGON_RPC_URL=https://polygon-rpc.com
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   
   # Private Key (for deployment - NEVER commit to git)
   PRIVATE_KEY=your_private_key_here
   
   # Contract Addresses (after deployment)
   NEXT_PUBLIC_INTENT_NFT_ADDRESS=
   NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=
   
   # Polygon Chain ID
   NEXT_PUBLIC_CHAIN_ID=137
   
   # WalletConnect Project ID (get from https://cloud.walletconnect.com)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
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

### Prerequisites

- A wallet with MATIC tokens for gas fees
- Private key of the deployment wallet
- RPC URL for Polygon network

### Deploy to Polygon Mumbai (Testnet)

1. **Get testnet MATIC**
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Request testnet MATIC to your wallet

2. **Update Hardhat config**
   - Ensure your `.env` has `MUMBAI_RPC_URL` and `PRIVATE_KEY`

3. **Deploy contracts**
   ```bash
   npm run deploy
   ```
   Or specifically to Mumbai:
   ```bash
   npx hardhat run scripts/deploy.ts --network mumbai
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

2. **Deploy contracts**
   ```bash
   npx hardhat run scripts/deploy.ts --network polygon
   ```

3. **Update environment variables**
   - Add the mainnet contract addresses to your `.env`
   - Update `NEXT_PUBLIC_CHAIN_ID=137` for mainnet

## 🔑 Required APIs & Services

### 1. WalletConnect Project ID

**What**: Project ID for WalletConnect integration

**Where to get it**:
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID
5. Add to `.env`: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id`

**Why**: Enables wallet connection via RainbowKit

### 2. Polygon RPC URL

**What**: RPC endpoint for interacting with Polygon network

**Where to get it**:
- **Free Options**:
  - [Polygon Public RPC](https://polygon-rpc.com) (rate-limited)
  - [Alchemy](https://www.alchemy.com/) - Free tier available
  - [Infura](https://www.infura.io/) - Free tier available
  - [QuickNode](https://www.quicknode.com/) - Free tier available

**Recommended**: Use Alchemy or Infura for better reliability

**How to set up**:
1. Sign up for Alchemy/Infura
2. Create a new Polygon app
3. Copy the HTTPS RPC URL
4. Add to `.env`: `POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

### 3. AI Service (Optional - for production)

**What**: AI service for intent parsing (currently uses simulated parsing)

**Where to get it**:
- **OpenAI API**: [platform.openai.com](https://platform.openai.com)
- **Anthropic Claude**: [console.anthropic.com](https://console.anthropic.com)
- **Google Gemini**: [makersuite.google.com](https://makersuite.google.com)

**How to integrate**:
1. Get API key from your chosen provider
2. Update `lib/ai-intent-parser.ts` to use the actual API
3. Add API key to `.env`: `NEXT_PUBLIC_AI_API_KEY=your_api_key`

**Note**: The current implementation uses rule-based parsing for demonstration. For production, integrate a real LLM API.

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
   - Add environment variables in Vercel dashboard
   - Deploy

### Deploy Smart Contracts

Follow the deployment steps above for Polygon mainnet.

## 📚 Project Structure

```
pol2/
├── app/                    # Next.js app directory
│   ├── create/            # Intent creation pages
│   ├── dashboard/         # User dashboard
│   ├── marketplace/      # Intent templates
│   ├── activity/         # Execution logs
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
3. **Test on testnet first** - Always test on Mumbai before mainnet
4. **Review smart contracts** - Consider getting an audit for production
5. **Rate limiting** - Implement rate limiting for production APIs

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test smart contracts
npx hardhat test
```

## 📖 Usage Guide

1. **Connect Wallet**: Click "Connect Wallet" in the navbar
2. **Create Intent**: Go to "Create Intent" and describe what you want to automate
3. **Review & Mint**: Review the parsed intent and mint as NFT
4. **Monitor**: View your intents in the Dashboard
5. **Track Activity**: Check execution logs in Activity page

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

- [ ] Real AI integration (OpenAI/Anthropic)
- [ ] Executor node network
- [ ] Advanced intent templates
- [ ] Multi-chain support
- [ ] Mobile app
- [ ] DAO governance integration
- [ ] Enterprise API

---

Built with ❤️ for the Polygon ecosystem

