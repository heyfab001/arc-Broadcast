export type WalletConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrong_network";

export interface Account {
  address: `0x${string}`;
  ensName?: string;
  balanceFormatted?: string;
}

export interface NetworkConfig {
  id: number;
  hexId: `0x${string}`;
  name: string;
  shortName: string;
  rpcUrl: string;
  wsRpcUrl?: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts?: {
    usdcErc20?: `0x${string}`;
  };
  isTestnet: boolean;
  icon?: string;
}

export interface WalletState {
  status: WalletConnectionStatus;
  account: Account | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  isWrongNetwork: boolean;
  isArcTestnet: boolean;
  balanceUSDC: string;
  isBalanceLoading: boolean;
  isBalanceError: boolean;
}
