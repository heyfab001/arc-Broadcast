import { Token } from "@/types/token";

export const SUPPORTED_TOKENS: Token[] = [
  {
    address: "native",
    symbol: "USDC",
    name: "USD Coin (Native Gas)",
    decimals: 18,
    isNative: true,
  },
  {
    address: "0x3B82F62563EB1D4ED81E40AF1E3A8A00F5D48B5C",
    symbol: "ARC",
    name: "Arc Token",
    decimals: 18,
    isNative: false,
  },
  {
    address: "0x2563EB1D4ED81E40AF1E3A8A00F5D48B5C3B82F6",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    isNative: false,
  },
  {
    address: "0x1D4ED81E40AF1E3A8A00F5D48B5C3B82F62563EB",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    isNative: false,
  }
];

export const DEFAULT_TOKEN = SUPPORTED_TOKENS[0];
