// AI Intent Parser - Uses Gemini API for real AI parsing
// Falls back to rule-based parsing if API is unavailable
// Uses CoinCap API for real cryptocurrency price data

export interface ParsedIntent {
  intent: string;
  actions: string[];
  frequency?: string;
  conditions?: string[];
  riskWarnings: string[];
  estimatedGas: string;
  safetyConstraints: string[];
  executionRules: string;
  fallback?: boolean; // Indicates if fallback parser was used
}

export async function parseIntent(userInput: string): Promise<ParsedIntent> {
  try {
    // Call the API route which handles Grok API integration
    const response = await fetch("/api/parse-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as ParsedIntent;
  } catch (error) {
    console.error("Error calling parse-intent API:", error);
    
    // Fallback to local rule-based parsing
    return parseIntentFallback(userInput);
  }
}

// Fallback parser if API fails
function parseIntentFallback(userInput: string): ParsedIntent {
  const lowerInput = userInput.toLowerCase();
  const actions: string[] = [];
  const riskWarnings: string[] = [];
  const safetyConstraints: string[] = [];
  let frequency = "One-time";
  let estimatedGas = "0.01 MATIC";

  // Detect intent patterns
  if (lowerInput.includes("invest") || lowerInput.includes("buy") || lowerInput.includes("dca")) {
    actions.push("Swap tokens via DEX");
    actions.push("Transfer tokens to wallet");
    riskWarnings.push("Market volatility may affect investment value");
    safetyConstraints.push("Maximum 10% of wallet balance per transaction");
    
    if (lowerInput.includes("weekly") || lowerInput.includes("week")) {
      frequency = "Weekly";
      estimatedGas = "0.02 MATIC";
    } else if (lowerInput.includes("monthly") || lowerInput.includes("month")) {
      frequency = "Monthly";
      estimatedGas = "0.02 MATIC";
    } else if (lowerInput.includes("daily") || lowerInput.includes("day")) {
      frequency = "Daily";
      estimatedGas = "0.05 MATIC";
    }
  }

  if (lowerInput.includes("pay") || lowerInput.includes("send") || lowerInput.includes("transfer")) {
    actions.push("Transfer tokens to recipient");
    riskWarnings.push("Ensure recipient address is correct");
    safetyConstraints.push("Require confirmation before each transfer");
    
    if (lowerInput.includes("monthly") || lowerInput.includes("month")) {
      frequency = "Monthly";
    } else if (lowerInput.includes("weekly") || lowerInput.includes("week")) {
      frequency = "Weekly";
    }
  }

  if (lowerInput.includes("yield") || lowerInput.includes("stake") || lowerInput.includes("pool")) {
    actions.push("Deposit tokens to yield pool");
    actions.push("Monitor APY changes");
    riskWarnings.push("APY rates may fluctuate");
    safetyConstraints.push("Auto-withdraw if APY drops below threshold");
  }

  if (lowerInput.includes("stop") || lowerInput.includes("loss") || lowerInput.includes("sell")) {
    actions.push("Monitor token price");
    actions.push("Execute sell order if conditions met");
    riskWarnings.push("Slippage may affect execution price");
    safetyConstraints.push("Minimum price threshold required");
  }

  // Default actions if none detected
  if (actions.length === 0) {
    actions.push("Process intent based on user instructions");
    riskWarnings.push("Please review all actions before execution");
  }

  // Generate execution rules JSON
  const executionRules = JSON.stringify({
    frequency: frequency,
    actions: actions,
    conditions: [],
    constraints: safetyConstraints,
    version: "1.0",
  });

  return {
    intent: userInput,
    actions,
    frequency,
    riskWarnings: riskWarnings.length > 0 ? riskWarnings : ["Standard execution risks apply"],
    estimatedGas,
    safetyConstraints: safetyConstraints.length > 0 ? safetyConstraints : ["Standard safety protocols"],
    executionRules,
    fallback: true,
  };
}

export function generateIntentHash(intent: string, timestamp: number): string {
  // In production, use proper cryptographic hashing
  return `0x${Buffer.from(`${intent}-${timestamp}`).toString("hex").slice(0, 64)}`;
}

