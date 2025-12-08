#!/usr/bin/env node

/**
 * Setup script to help create .env file
 * Run: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 POIA Environment Setup\n');
  console.log('This script will help you create a .env file with all required variables.\n');

  const env = {};

  // WalletConnect Project ID
  console.log('📱 WalletConnect Setup:');
  console.log('  1. Visit https://cloud.walletconnect.com');
  console.log('  2. Create a new project');
  console.log('  3. Copy your Project ID\n');
  env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = await question('Enter WalletConnect Project ID (or press Enter to skip): ');

  // RPC URLs
  console.log('\n🌐 Polygon RPC Setup:');
  console.log('  Recommended: Use Alchemy (https://www.alchemy.com) or Infura (https://www.infura.io)');
  console.log('  Free tier available for both\n');
  env.POLYGON_RPC_URL = await question('Enter Polygon Mainnet RPC URL (or press Enter to use public RPC): ') || 'https://polygon-rpc.com';
  env.MUMBAI_RPC_URL = await question('Enter Polygon Mumbai Testnet RPC URL (or press Enter to use public RPC): ') || 'https://rpc-mumbai.maticvigil.com';

  // Contract Addresses
  console.log('\n📄 Contract Addresses:');
  console.log('  These will be generated after deploying smart contracts');
  console.log('  You can add them later if deploying now\n');
  env.NEXT_PUBLIC_INTENT_NFT_ADDRESS = await question('Enter IntentNFT contract address (or press Enter to skip): ') || '';
  env.NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS = await question('Enter ExecutionRegistry contract address (or press Enter to skip): ') || '';

  // Chain ID
  env.NEXT_PUBLIC_CHAIN_ID = await question('Enter Chain ID (137 for Polygon Mainnet, 80001 for Mumbai, or press Enter for 137): ') || '137';

  // Private Key (optional, for deployment)
  console.log('\n🔐 Private Key (for contract deployment only):');
  console.log('  ⚠️  WARNING: Never share or commit your private key!');
  console.log('  This is only needed if you plan to deploy contracts\n');
  env.PRIVATE_KEY = await question('Enter private key for deployment (or press Enter to skip): ') || '';

  // AI API Key (optional)
  console.log('\n🤖 AI Service (optional):');
  console.log('  Currently uses simulated parsing. For production, integrate OpenAI/Anthropic\n');
  env.NEXT_PUBLIC_AI_API_KEY = await question('Enter AI API Key (or press Enter to skip): ') || '';

  // Generate .env file
  const envContent = Object.entries(env)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ .env file created successfully!');
  console.log(`   Location: ${envPath}`);
  console.log('\n📝 Next steps:');
  console.log('  1. Review and edit .env if needed');
  console.log('  2. Install dependencies: npm install');
  console.log('  3. Deploy contracts: npm run deploy');
  console.log('  4. Start dev server: npm run dev');
  console.log('\n⚠️  Remember: Never commit .env to git!\n');

  rl.close();
}

setup().catch(console.error);

