import { Address } from "viem";

export const INTENT_NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "intentHash", type: "string" },
      { internalType: "string", name: "executionRules", type: "string" },
      { internalType: "string", name: "tokenURI", type: "string" },
      { internalType: "address", name: "executor", type: "address" },
    ],
    name: "mintIntent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getIntent",
    outputs: [
      {
        components: [
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "string", name: "intentHash", type: "string" },
          { internalType: "string", name: "executionRules", type: "string" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "executionCount", type: "uint256" },
          { internalType: "address", name: "executor", type: "address" },
        ],
        internalType: "struct IntentNFT.IntentData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserIntents",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "setIntentStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalIntents",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const EXECUTION_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "intentId", type: "uint256" }],
    name: "getExecutionHistory",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "intentId", type: "uint256" },
          { internalType: "address", name: "executor", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "success", type: "bool" },
          { internalType: "string", name: "txHash", type: "string" },
          { internalType: "string", name: "resultData", type: "string" },
        ],
        internalType: "struct ExecutionRegistry.Execution[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function getContractAddresses() {
  return {
    intentNFT: (process.env.NEXT_PUBLIC_INTENT_NFT_ADDRESS || "0x0000000000000000000000000000000000000000") as Address,
    executionRegistry: (process.env.NEXT_PUBLIC_EXECUTION_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000") as Address,
  };
}

