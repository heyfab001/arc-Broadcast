import { defineChain } from "viem";
import { NetworkConfig } from "@/types/wallet";

export const ARC_CHAIN_ID = 5042002;
export const ARC_HEX_CHAIN_ID = "0x4CF4B2" as const;
export const ARC_USDC_CONTRACT = "0x3600000000000000000000000000000000000000" as const;

/**
 * Viem custom chain definition for Arc Testnet
 */
export const arcTestnetChain = defineChain({
  id: ARC_CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
      webSocket: ["wss://rpc.testnet.arc.network"],
    },
    public: {
      http: ["https://rpc.testnet.arc.network"],
      webSocket: ["wss://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  contracts: {
    usdcErc20: {
      address: ARC_USDC_CONTRACT,
    },
  },
  testnet: true,
});

export const ARC_TESTNET_CHAIN = arcTestnetChain;

/**
 * Application network metadata
 */
export const ARC_TESTNET: NetworkConfig = {
  id: ARC_CHAIN_ID,
  hexId: ARC_HEX_CHAIN_ID,
  name: "Arc Testnet",
  shortName: "Arc",
  rpcUrl: "https://rpc.testnet.arc.network",
  wsRpcUrl: "wss://rpc.testnet.arc.network",
  explorerUrl: "https://testnet.arcscan.app",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  contracts: {
    usdcErc20: ARC_USDC_CONTRACT,
  },
  isTestnet: true,
};

export const SUPPORTED_NETWORKS: NetworkConfig[] = [ARC_TESTNET];
export const DEFAULT_NETWORK = ARC_TESTNET;
