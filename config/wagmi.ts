import { http, createConfig, injected } from "wagmi";
import { arcTestnetChain } from "./chains";

export const wagmiConfig = createConfig({
  chains: [arcTestnetChain],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [arcTestnetChain.id]: http("https://rpc.testnet.arc.network"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
