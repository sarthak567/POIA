# POIA Quick Start Guide

Get POIA up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

**Option A: Use Setup Script (Recommended)**
```bash
node scripts/setup-env.js
```

**Option B: Manual Setup**
```bash
cp .env.example .env
# Edit .env with your values
```

**Minimum Required Variables:**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_CHAIN_ID=137
```

### 3. Get WalletConnect Project ID

1. Visit [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up and create a project
3. Copy Project ID to `.env`

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🚀 Deploy Smart Contracts (Optional)

### For Testing (Mumbai Testnet)

1. **Get Testnet MATIC**
   - Visit [Polygon Faucet](https://faucet.polygon.technology)
   - Request testnet MATIC

2. **Add to .env**
   ```env
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   PRIVATE_KEY=your_private_key
   ```

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.ts --network mumbai
   ```

4. **Add Contract Addresses to .env**
   ```env
   NEXT_PUBLIC_INTENT_NFT_ADDRESS=0x...
   NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=0x...
   ```

### For Production (Polygon Mainnet)

1. **Ensure you have MATIC** (0.1+ recommended)

2. **Add to .env**
   ```env
   POLYGON_RPC_URL=https://polygon-rpc.com
   PRIVATE_KEY=your_private_key
   ```

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.ts --network polygon
   ```

4. **Update .env with mainnet addresses**

## 📱 Using the App

1. **Connect Wallet**
   - Click "Connect Wallet" in navbar
   - Select your wallet (MetaMask, etc.)
   - Approve connection

2. **Create Intent**
   - Go to "Create Intent"
   - Type your automation goal
   - Example: "Invest 100 USDC into ETH every Monday"
   - Click "Parse Intent with AI"

3. **Review & Mint**
   - Review parsed intent
   - Click "Continue to Summary"
   - Review details
   - Click "Mint Proof-of-Intent NFT"

4. **Monitor**
   - View intents in Dashboard
   - Check Activity Logs
   - Browse Marketplace for templates

## 🎯 Common Use Cases

### Dollar-Cost Averaging
```
Invest 100 USDC into ETH every Monday
```

### Recurring Payments
```
Send 20 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb every month on the 1st
```

### Stop-Loss Protection
```
Sell my ETH if the price drops below $2000
```

### Yield Optimization
```
Move my USDC to the highest APY stablecoin pool weekly
```

## 🔧 Troubleshooting

### "Wallet connection failed"
- Check WalletConnect Project ID is correct
- Ensure wallet is on Polygon network
- Clear browser cache

### "Contract not found"
- Verify contract addresses in `.env`
- Ensure contracts are deployed
- Check network matches (Mumbai vs Mainnet)

### "Insufficient funds"
- Add MATIC to your wallet
- For testnet, use Polygon Faucet

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment
- Explore the codebase to understand the architecture

## 🆘 Need Help?

- Check the documentation
- Open an issue on GitHub
- Review the code comments

---

**Happy Building! 🚀**

