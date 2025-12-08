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

    // Get Grok API key from environment
    const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
    
    if (!apiKey) {
      console.error("Grok API key not found in environment variables");
      return NextResponse.json(
        { 
          error: "AI API key not configured",
          fallback: true,
          ...parseIntentFallback(userInput)
        },
        { status: 500 }
      );
    }

    // Grok API endpoint (xAI)
    // xAI Grok API uses this endpoint
    const apiUrl = "https://api.x.ai/v1/chat/completions";
    
    console.log("Calling Grok API with key:", apiKey.substring(0, 10) + "...");

    // Create a detailed prompt for intent parsing
    const systemPrompt = `You are an expert AI assistant that parses user intentions for on-chain automation on Polygon blockchain. 
Your task is to analyze user input and extract:
1. Actions: What blockchain actions need to be performed (e.g., "Swap tokens", "Transfer tokens", "Deposit to pool")
2. Frequency: How often this should execute (e.g., "Weekly", "Monthly", "Daily", "One-time")
3. Risk Warnings: Potential risks or concerns
4. Safety Constraints: Safety measures or limits that should be applied
5. Estimated Gas: Estimated gas cost in MATIC

Return a JSON object with this exact structure:
{
  "actions": ["action1", "action2"],
  "frequency": "Weekly|Monthly|Daily|One-time",
  "riskWarnings": ["warning1", "warning2"],
  "safetyConstraints": ["constraint1", "constraint2"],
  "estimatedGas": "0.XX MATIC"
}

Be specific and accurate. For DeFi actions, consider gas costs (simple transfers: ~0.01 MATIC, swaps: ~0.02-0.05 MATIC, complex operations: ~0.05+ MATIC).`;

    const userPrompt = `Parse this user intent for on-chain automation: "${userInput}"

Extract all relevant information and return the JSON structure as specified.`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-2", // Try grok-2 first, fallback to grok-beta if needed
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }, // Request JSON response format
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Grok API error:", response.status, errorData);
      
      // Try to parse error for better feedback
      let errorMessage = "Grok API request failed";
      try {
        const errorJson = JSON.parse(errorData);
        errorMessage = errorJson.error?.message || errorMessage;
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
    const aiResponse = data.choices?.[0]?.message?.content || "";

    console.log("Grok API response received, length:", aiResponse.length);

    // Try to extract JSON from the response
    let parsedData;
    try {
      // Look for JSON in the response (handle both plain JSON and markdown code blocks)
      let jsonString = aiResponse;
      
      // Check if response is wrapped in markdown code blocks
      const codeBlockMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1];
      } else {
        // Try to find JSON object directly
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }
      }
      
      parsedData = JSON.parse(jsonString);
      console.log("Successfully parsed Grok response");
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", aiResponse.substring(0, 500));
      // Fallback to rule-based parsing
      return NextResponse.json({
        fallback: true,
        error: "Failed to parse AI response",
        ...parseIntentFallback(userInput),
      });
    }

    // Generate execution rules
    const executionRules = JSON.stringify({
      frequency: parsedData.frequency || "One-time",
      actions: parsedData.actions || [],
      conditions: [],
      constraints: parsedData.safetyConstraints || [],
      version: "1.0",
    });

    return NextResponse.json({
      intent: userInput,
      actions: parsedData.actions || [],
      frequency: parsedData.frequency || "One-time",
      riskWarnings: parsedData.riskWarnings || ["Standard execution risks apply"],
      estimatedGas: parsedData.estimatedGas || "0.01 MATIC",
      safetyConstraints: parsedData.safetyConstraints || ["Standard safety protocols"],
      executionRules,
    });
  } catch (error: any) {
    console.error("Error in parse-intent API:", error);
    
    // Fallback to rule-based parsing
    const fallback = parseIntentFallback(
      (await request.json()).userInput || ""
    );
    
    return NextResponse.json({
      fallback: true,
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

