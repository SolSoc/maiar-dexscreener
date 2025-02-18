import "dotenv/config";

// Suppress deprecation warnings
process.removeAllListeners("warning");

import { config } from "dotenv";
import path from "path";

// Load environment variables from root .env
config({
  path: path.resolve(__dirname, "../../..", ".env"),
});

import { createRuntime } from "@maiar-ai/core";

// Import all plugins
import { SQLiteProvider } from "@maiar-ai/memory-sqlite";
import { OpenAIProvider } from "@maiar-ai/model-openai";

import { PluginExpress } from "@maiar-ai/plugin-express";
import { PluginTextGeneration } from "@maiar-ai/plugin-text";
import messageRouter from "./app";
import { PluginTrending } from "./plugin-dexscreener";

interface TrendingDexscreenerToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  openGraph: string;
  description: string;
  links: {
    type: string;
    url: string;
  }[];
  totalAmount: number;
}

async function mockExternalCall(): Promise<TrendingDexscreenerToken[]> {
  const response = await fetch(
    "https://api.dexscreener.com/token-boosts/top/v1",
    {
      method: "GET",
      headers: {},
    }
  );
  return (await response.json()) as TrendingDexscreenerToken[];
}

async function formatTrending(): Promise<string> {
  const tokens = await mockExternalCall();
  return tokens
    .map(
      (token) =>
        `${token.description} - ${token.url} - ${token.totalAmount} total amount
    
      Chain ID: ${token.chainId}
      Description: ${token.description}
      `
    )
    .join("\n");
}

// Create and start the agent
const runtime = createRuntime({
  model: new OpenAIProvider({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY as string,
  }),
  memory: new SQLiteProvider({
    dbPath: path.join(process.cwd(), "data", "conversations.db"),
  }),
  plugins: [
    new PluginTrending({
      name: "Dexscreener Boosted Tokens",
      description: "Returns the list of the most boosted tokens on dexscreener",
      fetchTrending: formatTrending,
    }),
    new PluginExpress({
      port: 3000,
      router: messageRouter,
    }),
    new PluginTextGeneration(),
  ],
});

// Start the runtime if this file is run directly
if (require.main === module) {
  console.log("Starting agent...");
  runtime.start().catch((error) => {
    console.error("Failed to start agent:", error);
    process.exit(1);
  });

  // Handle shutdown gracefully
  process.on("SIGINT", async () => {
    console.log("Shutting down agent...");
    await runtime.stop();
    process.exit(0);
  });
}
