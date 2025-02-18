export interface DexscreenerPluginConfig {
  name: string;
  description: string;
  fetchTrending: () => Promise<string>;
}
