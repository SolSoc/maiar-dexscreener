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
import { PluginRag } from "./plugin-rag";

async function mockExternalCall(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["John Doe", "Jim Bean", "Socrates Potato"].join(","));
    }, 1000);
  });
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
    new PluginRag({
      name: "EXTERNAL_USER_SYSTEM",
      description:
        "Returns the full names of all users in the external system.",
      handler: mockExternalCall,
    }),
    new PluginExpress({
      port: 3000,
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
