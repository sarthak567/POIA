import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy IntentNFT
  const IntentNFT = await ethers.getContractFactory("IntentNFT");
  const intentNFT = await IntentNFT.deploy();
  await intentNFT.waitForDeployment();
  const intentNFTAddress = await intentNFT.getAddress();
  console.log("IntentNFT deployed to:", intentNFTAddress);

  // Deploy ExecutionRegistry
  const ExecutionRegistry = await ethers.getContractFactory("ExecutionRegistry");
  const executionRegistry = await ExecutionRegistry.deploy(intentNFTAddress);
  await executionRegistry.waitForDeployment();
  const executionRegistryAddress = await executionRegistry.getAddress();
  console.log("ExecutionRegistry deployed to:", executionRegistryAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("IntentNFT:", intentNFTAddress);
  console.log("ExecutionRegistry:", executionRegistryAddress);
  console.log("\nSave these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_INTENT_NFT_ADDRESS=${intentNFTAddress}`);
  console.log(`NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS=${executionRegistryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

