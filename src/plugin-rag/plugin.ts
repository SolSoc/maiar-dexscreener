import { createLogger, PluginBase, PluginResult } from "@maiar-ai/core";
import { RagConfig } from "./types";

const log = createLogger("plugin-rag");
export class PluginRag extends PluginBase {
  constructor(private config: RagConfig) {
    super({
      id: "plugin-rag",
      name: "Rag",
      description: "Handles retrieval based augmentation.",
    });

    if (
      !this.config ||
      !this.config.name ||
      !this.config.description ||
      !this.config.handler
    ) {
      throw new Error(
        "Rag plugin requires a name, description, and handler function."
      );
    }

    this.addExecutor({
      name: "inject_external_information",
      description: "Inject static external information into the context.",
      execute: async (): Promise<PluginResult> => {
        const result = await this.config.handler();
        log.info(
          `Result of RAG handler: ${this.config.name} has been injected into the context`
        );
        return {
          success: true,
          data: {
            information: result,
            helpfulInstruction: `
            SYSTEM NAME: ${this.config.name}
            
            ${this.config.description}
            
            You must use the information in the context to augment the response if it answers the user's question.`,
          },
        };
      },
    });
  }
}

export * from "./types";
