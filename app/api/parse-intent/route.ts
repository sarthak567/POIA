import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json(
        { error: "Invalid input. Please provide a valid intent description." },
        { status: 400 }
      );
    }

    // Get Gemini API key from environment
    const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables");
      return NextResponse.json(
        { 
          error: "AI API key not configured",
          fallback: true,
          ...parseIntentFallback(userInput)
        },
        { status: 500 }
      );
    }

    console.log("Calling Gemini API with key:", apiKey.substring(0, 10) + "...");

    // Fetch real crypto prices for better context
    let cryptoPrices = "";
    try {
      const baseUrl = request.headers.get("host") 
        ? `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`
        : "http://localhost:3000";
      
      const pricesResponse = await fetch(`${baseUrl}/api/crypto-prices?action=price`);
      if (pricesResponse.ok) {
        const pricesData = await pricesResponse.json();
        if (pricesData.data && Array.isArray(pricesData.data)) {
          const relevantTokens = pricesData.data
            .filter((asset: any) => ["ETH", "BTC", "MATIC", "USDC", "USDT"].includes(asset.symbol))
            .slice(0, 5)
            .map((asset: any) => `${asset.symbol}: $${parseFloat(asset.priceUsd).toFixed(2)}`)
            .join(", ");
          if (relevantTokens) {
            cryptoPrices = `Current crypto prices: ${relevantTokens}. `;
          }
        }
      }
    } catch (error) {
      // Continue without prices if API fails
      console.log("Could not fetch crypto prices for context");
    }

    // Create a detailed prompt for intent parsing - optimized for all template types
    const systemPrompt = `You are an expert AI assistant that parses user intentions for on-chain automation on Polygon blockchain. 
Your task is to analyze ANY user input and extract structured information for automation.

EXTRACT THE FOLLOWING:
1. Actions: Specific blockchain actions (e.g., "Swap tokens", "Transfer tokens", "Deposit to pool", "Stake tokens", "Withdraw from pool", "Execute sell order", "Add liquidity", "Rebalance portfolio")
2. Frequency: Execution frequency - "Weekly", "Monthly", "Daily", "One-time", or "Conditional" (for price-based triggers)
3. Risk Warnings: Potential risks (market volatility, slippage, smart contract risks, etc.)
4. Safety Constraints: Safety measures (maximum amounts, price thresholds, confirmation requirements, etc.)
5. Estimated Gas: Gas cost in MATIC format (e.g., "0.02 MATIC")

${cryptoPrices}Use current market prices when relevant.

IMPORTANT EXAMPLES:
- DCA/Investment: "Invest 100 USDC into ETH every Monday" → actions: ["Swap USDC to ETH"], frequency: "Weekly"
- Payments: "Send 20 USDC to 0x742d... every month" → actions: ["Transfer USDC"], frequency: "Monthly"
- Stop-Loss: "Sell my ETH if price drops below $2000" → actions: ["Monitor price", "Execute sell order"], frequency: "Conditional"
- Rebalancing: "Rebalance portfolio to 60% ETH and 40% USDC" → actions: ["Calculate allocation", "Swap tokens to target ratio"], frequency: "Conditional"
- Yield Farming: "Move USDC to highest APY pool" → actions: ["Compare APY rates", "Withdraw from current pool", "Deposit to new pool"], frequency: "Weekly"
- Staking: "Stake MATIC rewards weekly" → actions: ["Claim rewards", "Stake tokens"], frequency: "Weekly"

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "actions": ["action1", "action2"],
  "frequency": "Weekly|Monthly|Daily|One-time|Conditional",
  "riskWarnings": ["warning1", "warning2"],
  "safetyConstraints": ["constraint1", "constraint2"],
  "estimatedGas": "0.XX MATIC"
}

Gas estimates: Simple transfers: 0.01 MATIC, Swaps: 0.02-0.05 MATIC, Complex operations: 0.05+ MATIC.`;

    const userPrompt = `Parse this user intent for on-chain automation: "${userInput}"

Extract all relevant information and return the JSON structure as specified.`;

    // Helper function to make API request with retry logic
    const makeGeminiRequest = async (modelName: string, retryCount = 0): Promise<Response> => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\n${userPrompt}\n\nCRITICAL: Return ONLY valid JSON object. No markdown, no code blocks, no explanations. Just the raw JSON starting with { and ending with }.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2, // Lower temperature for more consistent JSON
              maxOutputTokens: 1500, // Increased for complex intents
              responseMimeType: "application/json",
            },
          }),
        });

        // Retry on 429 (rate limit) with exponential backoff
        if (response.status === 429 && retryCount < 2) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s
          console.log(`Rate limited, retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return makeGeminiRequest(modelName, retryCount + 1);
        }

        return response;
      } catch (error) {
        // Retry on network errors
        if (retryCount < 2) {
          const retryDelay = Math.pow(2, retryCount) * 1000;
          console.log(`Network error, retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return makeGeminiRequest(modelName, retryCount + 1);
        }
        throw error;
      }
    };

    // Try gemini-2.5-flash first (free tier friendly), fallback to pro if needed
    // Flash is faster, cheaper, and has better free tier limits
    let response = await makeGeminiRequest("gemini-2.5-flash");
    let modelUsed = "gemini-2.5-flash";
    
    // If 429 (quota) or other errors, try pro model as fallback
    if (!response.ok && response.status === 429) {
      console.log("Flash model quota exceeded, trying gemini-2.5-pro");
      response = await makeGeminiRequest("gemini-2.5-pro");
      modelUsed = "gemini-2.5-pro";
    } else if (!response.ok && (response.status === 403 || response.status === 404)) {
      console.log("Trying fallback model: gemini-2.5-pro");
      response = await makeGeminiRequest("gemini-2.5-pro");
      modelUsed = "gemini-2.5-pro";
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      
      // Try to parse error for better feedback
      let errorMessage = "Gemini API request failed";
      
      try {
        const errorJson = JSON.parse(errorData);
        errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
        
        // Handle specific error types
        if (errorMessage.includes("leaked") || errorMessage.includes("API key")) {
          errorMessage = "API key issue detected. Please get a new Gemini API key from https://aistudio.google.com";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429") || response.status === 429) {
          errorMessage = "API quota exceeded. The free tier has limited requests. Please wait a few minutes or upgrade your plan. Using fallback parser.";
        }
      } catch (e) {
        // Error is not JSON, use raw text
      }
      
      console.error("Error details:", {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage
      });
      
      // Fallback to rule-based parsing if API fails
      return NextResponse.json({
        fallback: true,
        error: errorMessage,
        ...parseIntentFallback(userInput),
      });
    }

    const data = await response.json();
    
    // Gemini API response structure is different
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Gemini API response received, length:", aiResponse.length);

    // Try to extract JSON from the response with multiple strategies
    let parsedData;
    try {
      let jsonString = aiResponse.trim();
      
      // Strategy 1: Remove markdown code blocks
      if (jsonString.includes("```")) {
        jsonString = jsonString.replace(/```(?:json)?\s*/g, "").replace(/```\s*$/g, "").trim();
      }
      
      // Strategy 2: Find JSON object (handles cases where there's extra text)
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      // Strategy 3: Try parsing directly
      parsedData = JSON.parse(jsonString);
      
      // Validate required fields
      if (!parsedData.actions || !Array.isArray(parsedData.actions)) {
        throw new Error("Invalid response: missing actions array");
      }
      
      console.log("Successfully parsed Gemini response");
    } catch (parseError: any) {
      console.error("Failed to parse AI response:", parseError.message);
      console.error("Raw response (first 500 chars):", aiResponse.substring(0, 500));
      
      // Try one more time with a more aggressive extraction
      try {
        const aggressiveMatch = aiResponse.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
        if (aggressiveMatch) {
          parsedData = JSON.parse(aggressiveMatch[0]);
          console.log("Successfully parsed with aggressive extraction");
        } else {
          throw new Error("No valid JSON found");
        }
      } catch (secondError) {
        // Final fallback to rule-based parsing
        console.warn("Using fallback parser due to JSON parsing failure");
        return NextResponse.json({
          fallback: true,
          error: "Failed to parse AI response. Using fallback parser.",
          ...parseIntentFallback(userInput),
        });
      }
    }

    // Validate and sanitize parsed data
    const actions = Array.isArray(parsedData.actions) && parsedData.actions.length > 0
      ? parsedData.actions
      : ["Process intent based on user instructions"];
    
    const frequency = parsedData.frequency || "One-time";
    const riskWarnings = Array.isArray(parsedData.riskWarnings) && parsedData.riskWarnings.length > 0
      ? parsedData.riskWarnings
      : ["Standard execution risks apply"];
    
    const safetyConstraints = Array.isArray(parsedData.safetyConstraints) && parsedData.safetyConstraints.length > 0
      ? parsedData.safetyConstraints
      : ["Standard safety protocols"];
    
    const estimatedGas = parsedData.estimatedGas || "0.01 MATIC";

    // Generate execution rules
    const executionRules = JSON.stringify({
      frequency: frequency,
      actions: actions,
      conditions: [],
      constraints: safetyConstraints,
      version: "1.0",
    });

    console.log("Successfully processed intent with Gemini API");

    return NextResponse.json({
      intent: userInput,
      actions: actions,
      frequency: frequency,
      riskWarnings: riskWarnings,
      estimatedGas: estimatedGas,
      safetyConstraints: safetyConstraints,
      executionRules,
      fallback: false, // Explicitly mark as successful API call
    });
  } catch (error: any) {
    console.error("Error in parse-intent API:", error);
    
    // Try to get userInput from request body
    let userInput = "";
    try {
      const body = await request.json();
      userInput = body.userInput || "";
    } catch (e) {
      // Request body already consumed, use empty string
    }
    
    // Fallback to rule-based parsing
    const fallback = parseIntentFallback(userInput);
    
    return NextResponse.json({
      fallback: true,
      error: error.message || "Unexpected error occurred",
      ...fallback,
    });
  }
}

// Fallback parser if API fails
function parseIntentFallback(userInput: string) {
  const lowerInput = userInput.toLowerCase();
  const actions: string[] = [];
  const riskWarnings: string[] = [];
  const safetyConstraints: string[] = [];
  let frequency = "One-time";
  let estimatedGas = "0.01 MATIC";

  // DCA / Investment patterns
  if (lowerInput.includes("invest") || lowerInput.includes("buy") || lowerInput.includes("dca") || lowerInput.includes("dollar-cost")) {
    actions.push("Swap tokens via DEX");
    actions.push("Transfer tokens to wallet");
    riskWarnings.push("Market volatility may affect investment value");
    safetyConstraints.push("Maximum 10% of wallet balance per transaction");
    
    if (lowerInput.includes("weekly") || lowerInput.includes("week") || lowerInput.includes("monday")) {
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

  // Payment / Transfer patterns
  if (lowerInput.includes("pay") || lowerInput.includes("send") || lowerInput.includes("transfer") || lowerInput.includes("donate")) {
    actions.push("Transfer tokens to recipient");
    riskWarnings.push("Ensure recipient address is correct");
    safetyConstraints.push("Require confirmation before each transfer");
    
    if (lowerInput.includes("monthly") || lowerInput.includes("month") || lowerInput.includes("1st")) {
      frequency = "Monthly";
    } else if (lowerInput.includes("weekly") || lowerInput.includes("week")) {
      frequency = "Weekly";
    }
  }

  // Yield / Staking patterns
  if (lowerInput.includes("yield") || lowerInput.includes("stake") || lowerInput.includes("pool") || lowerInput.includes("apy")) {
    actions.push("Deposit tokens to yield pool");
    actions.push("Monitor APY changes");
    riskWarnings.push("APY rates may fluctuate");
    safetyConstraints.push("Auto-withdraw if APY drops below threshold");
    
    if (lowerInput.includes("highest") || lowerInput.includes("best") || lowerInput.includes("rotation")) {
      actions.push("Compare APY rates across pools");
      actions.push("Switch to highest yield pool");
    }
  }

  // Stop-Loss / Sell patterns
  if (lowerInput.includes("stop") || lowerInput.includes("loss") || lowerInput.includes("sell") || lowerInput.includes("price drops") || lowerInput.includes("below")) {
    actions.push("Monitor token price");
    actions.push("Execute sell order if conditions met");
    riskWarnings.push("Slippage may affect execution price");
    safetyConstraints.push("Minimum price threshold required");
    frequency = "Conditional";
  }

  // Take Profit patterns
  if (lowerInput.includes("profit") || lowerInput.includes("target") || lowerInput.includes("reaches") || lowerInput.includes("price reaches")) {
    actions.push("Monitor token price");
    actions.push("Execute sell order when target reached");
    riskWarnings.push("Price may not reach target");
    safetyConstraints.push("Set realistic profit targets");
    frequency = "Conditional";
  }

  // Rebalancing patterns
  if (lowerInput.includes("rebalance") || lowerInput.includes("portfolio") || lowerInput.includes("allocation")) {
    actions.push("Calculate current portfolio allocation");
    actions.push("Swap tokens to achieve target ratio");
    riskWarnings.push("Rebalancing may incur trading fees");
    safetyConstraints.push("Rebalance only when deviation exceeds threshold");
    frequency = "Conditional";
    estimatedGas = "0.05 MATIC";
  }

  // Liquidity provision patterns
  if (lowerInput.includes("liquidity") || lowerInput.includes("add liquidity") || lowerInput.includes("lp")) {
    actions.push("Add tokens to liquidity pool");
    actions.push("Monitor pool TVL and fees");
    riskWarnings.push("Impermanent loss may occur");
    safetyConstraints.push("Monitor pool health regularly");
    estimatedGas = "0.05 MATIC";
  }

  // Gas optimization patterns
  if (lowerInput.includes("gas") || lowerInput.includes("batch") || lowerInput.includes("optimize")) {
    actions.push("Batch multiple transactions");
    actions.push("Wait for optimal gas prices");
    riskWarnings.push("Delayed execution may affect timing");
    safetyConstraints.push("Set maximum delay threshold");
  }

  // Savings patterns
  if (lowerInput.includes("save") || lowerInput.includes("emergency") || lowerInput.includes("savings")) {
    actions.push("Transfer to savings wallet");
    riskWarnings.push("Ensure sufficient balance for operations");
    safetyConstraints.push("Maintain minimum operational balance");
  }

  // Multi-sig / DAO patterns
  if (lowerInput.includes("dao") || lowerInput.includes("multi-sig") || lowerInput.includes("proposal") || lowerInput.includes("signer") || lowerInput.includes("payroll")) {
    actions.push("Submit transaction for approval");
    actions.push("Wait for required signatures");
    riskWarnings.push("Transaction may be rejected by signers");
    safetyConstraints.push("Require minimum approval threshold");
    frequency = "Conditional";
  }

  if (actions.length === 0) {
    actions.push("Process intent based on user instructions");
    riskWarnings.push("Please review all actions before execution");
  }

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
  };
}

