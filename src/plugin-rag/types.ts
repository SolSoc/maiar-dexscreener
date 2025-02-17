export interface RagConfig {
  name: string;
  description: string;
  handler: () => Promise<string>;
}
