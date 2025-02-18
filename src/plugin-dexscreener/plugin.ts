import { createLogger, PluginBase, PluginResult } from "@maiar-ai/core";
import { DexscreenerPluginConfig } from "./types";

const log = createLogger("plugin-trending");
export class PluginTrending extends PluginBase {
  constructor(private config: DexscreenerPluginConfig) {
    super({
      id: "plugin-rag",
      name: "Dexscreener",
      description: "Handles retrieval of trending tokens on dexscreener",
    });

    if (
      !config ||
      !config.fetchTrending ||
      !config.name ||
      !config.description
    ) {
      throw new Error("Invalid configuration provided to PluginTrending");
    }

    this.addExecutor({
      name: "inject_external_information",
      description: "Inject trending tokens",
      execute: async (): Promise<PluginResult> => {
        const result = await this.config.fetchTrending();
        log.info(
          `Result of calling fetchTrending: ${JSON.stringify(result, null, 2)}`
        );
        return {
          success: true,
          data: {
            information: result,
            // add more detailed information about the plugin
            helpfulInstruction: `This injects the recent top boosted tokens from dexscreener.`,
          },
        };
      },
    });
  }
}

export * from "./types";
