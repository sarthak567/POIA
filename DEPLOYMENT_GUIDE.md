# POIA Deployment Guide

Complete step-by-step guide to deploy POIA to Polygon.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up APIs](#setting-up-apis)
3. [Deploying Smart Contracts](#deploying-smart-contracts)
4. [Configuring Frontend](#configuring-frontend)
5. [Deploying Frontend](#deploying-frontend)
6. [Post-Deployment](#post-deployment)

## 🔧 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A crypto wallet (MetaMask recommended)
- Some MATIC tokens for gas fees
- A GitHub account (for frontend deployment)

## 🔑 Setting Up APIs

### Step 1: Get WalletConnect Project ID

1. **Visit WalletConnect Cloud**
   - Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Sign up or log in with your account

2. **Create a New Project**
   - Click "Create New Project"
   - Enter project name: "POIA"
   - Select "App" as project type
   - Click "Create"

3. **Copy Project ID**
   - You'll see your Project ID (format: `a1b2c3d4e5f6...`)
   - Copy this ID

4. **Add to Environment**
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### Step 2: Get Polygon RPC URL

**Option A: Use Alchemy (Recommended)**

1. **Sign Up for Alchemy**
   - Visit [https://www.alchemy.com](https://www.alchemy.com)
   - Create a free account

2. **Create Polygon App**
   - Go to Dashboard
   - Click "Create App"
   - Name: "POIA"
   - Chain: Polygon
   - Network: Polygon Mainnet
   - Click "Create App"

3. **Get RPC URL**
   - Click on your app
   - Click "View Key"
   - Copy the "HTTPS" URL
   - Format: `https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

4. **Add to Environment**
   ```env
   POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
   ```

**Option B: Use Infura**

1. **Sign Up for Infura**
   - Visit [https://www.infura.io](https://www.infura.io)
   - Create a free account

2. **Create Project**
   - Go to Dashboard
   - Click "Create New Key"
   - Name: "POIA"
   - Network: Polygon
   - Click "Create"

3. **Get RPC URL**
   - Copy the HTTPS endpoint
   - Format: `https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID`

4. **Add to Environment**
   ```env
   POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID
   ```

**Option C: Use QuickNode**

1. **Sign Up for QuickNode**
   - Visit [https://www.quicknode.com](https://www.quicknode.com)
   - Create a free account

2. **Create Endpoint**
   - Select Polygon Mainnet
   - Choose plan (Free tier available)
   - Copy the HTTPS URL

3. **Add to Environment**
   ```env
   POLYGON_RPC_URL=https://your-endpoint.quiknode.pro/YOUR_KEY/
   ```

### Step 3: Get Testnet RPC (For Testing)

For Mumbai testnet, use:
- Alchemy: `https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY`
- Infura: `https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID`

Add to environment:
```env
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
```

### Step 4: Get Private Key (For Contract Deployment)

⚠️ **SECURITY WARNING**: Never share your private key or commit it to git!

1. **Export from MetaMask**
   - Open MetaMask
   - Click account icon → Settings → Security & Privacy
   - Click "Show Private Key"
   - Enter password
   - Copy private key

2. **Add to Environment**
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

**Alternative**: Use a dedicated deployment wallet with minimal funds.

## 🚀 Deploying Smart Contracts

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Compile Contracts

```bash
npm run compile
```

This will compile your Solidity contracts and create artifacts.

### Step 3: Get Testnet MATIC (For Testing)

1. **Visit Polygon Faucet**
   - Go to [https://faucet.polygon.technology](https://faucet.polygon.technology)
   - Connect your wallet
   - Request testnet MATIC
   - Wait for confirmation

### Step 4: Deploy to Mumbai Testnet (Recommended First)

```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

**Expected Output:**
```
Deploying contracts with the account: 0x...
Account balance: 1000000000000000000
IntentNFT deployed to: 0x1234...
ExecutionRegistry deployed to: 0x5678...

=== Deployment Summary ===
IntentNFT: 0x1234...
ExecutionRegistry: 0x5678...

Save these addresses to your .env file:
NEXT_PUBLIC_INTENT_NFT_ADDRESS=0x1234...
NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=0x5678...
```

### Step 5: Verify Contracts (Optional but Recommended)

1. **Get API Key from PolygonScan**
   - Visit [https://polygonscan.com](https://polygonscan.com)
   - Sign up for account
   - Go to API-KEYs section
   - Create new API key

2. **Add to Hardhat Config**
   ```typescript
   // hardhat.config.ts
   etherscan: {
     apiKey: {
       polygon: "YOUR_POLYGONSCAN_API_KEY",
       polygonMumbai: "YOUR_POLYGONSCAN_API_KEY",
     }
   }
   ```

3. **Verify Contracts**
   ```bash
   npx hardhat verify --network mumbai 0x1234... [constructor args]
   ```

### Step 6: Deploy to Polygon Mainnet

⚠️ **WARNING**: Only deploy to mainnet after thorough testing!

1. **Ensure You Have Mainnet MATIC**
   - You need MATIC for gas fees (recommended: 0.1+ MATIC)
   - Get MATIC from an exchange or bridge

2. **Update Environment**
   - Ensure `POLYGON_RPC_URL` points to mainnet
   - Double-check your `PRIVATE_KEY`

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.ts --network polygon
   ```

4. **Save Contract Addresses**
   - Copy the deployed addresses
   - Add to your `.env` file:
     ```env
     NEXT_PUBLIC_INTENT_NFT_ADDRESS=0x...
     NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=0x...
     NEXT_PUBLIC_CHAIN_ID=137
     ```

## 🎨 Configuring Frontend

### Step 1: Update Environment Variables

Create/update `.env.local` (for local development) or `.env` (for production):

```env
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract Addresses
NEXT_PUBLIC_INTENT_NFT_ADDRESS=0x...
NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=0x...

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=137

# Optional: AI Service
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key
```

### Step 2: Test Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and test:
- Wallet connection
- Intent creation
- Contract interactions

## 🌐 Deploying Frontend

### Option A: Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/poia.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign up/Log in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel project settings
   - Go to "Environment Variables"
   - Add all variables from your `.env`:
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
     - `NEXT_PUBLIC_INTENT_NFT_ADDRESS`
     - `NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS`
     - `NEXT_PUBLIC_CHAIN_ID`
     - Any other public variables

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Option B: Deploy to Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Visit [https://www.netlify.com](https://www.netlify.com)
   - Drag and drop the `.next` folder
   - Or connect to GitHub for continuous deployment

3. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables

### Option C: Self-Hosted

1. **Build**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Configure Reverse Proxy** (Nginx example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## ✅ Post-Deployment

### Step 1: Verify Everything Works

1. **Test Wallet Connection**
   - Visit your deployed site
   - Click "Connect Wallet"
   - Ensure connection works

2. **Test Intent Creation**
   - Create a test intent
   - Verify it mints successfully
   - Check on PolygonScan

3. **Test Dashboard**
   - View your intents
   - Check activity logs

### Step 2: Register Executor Nodes (If Needed)

If you're running executor nodes:

```typescript
// Using Hardhat console or a script
const registry = await ethers.getContractAt("ExecutionRegistry", EXECUTION_REGISTRY_ADDRESS);
await registry.registerExecutor(EXECUTOR_ADDRESS, "Executor Name");
```

### Step 3: Monitor

- Set up monitoring for contract events
- Monitor gas usage
- Track user activity
- Set up error tracking (Sentry, etc.)

## 🔍 Troubleshooting

### Issue: "Insufficient funds for gas"

**Solution**: Add more MATIC to your deployment wallet

### Issue: "Contract deployment failed"

**Solution**: 
- Check RPC URL is correct
- Verify private key is correct
- Ensure network matches (Mumbai vs Mainnet)

### Issue: "Wallet connection failed"

**Solution**:
- Verify WalletConnect Project ID is correct
- Check network is set to Polygon in wallet
- Clear browser cache

### Issue: "Contract not found"

**Solution**:
- Verify contract addresses in `.env`
- Ensure addresses are correct for the network
- Check contracts are deployed on the correct network

## 📞 Support

If you encounter issues:
1. Check the error message carefully
2. Verify all environment variables are set
3. Check PolygonScan for transaction status
4. Review contract deployment logs
5. Open an issue on GitHub

## 🎉 Success!

Once deployed, your POIA application is live on Polygon! Users can now:
- Create intents in natural language
- Mint Proof-of-Intent NFTs
- Monitor executions
- Browse the marketplace

---

**Remember**: Always test on testnet first, and never commit private keys to version control!

