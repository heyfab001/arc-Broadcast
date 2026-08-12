"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useArcWallet } from "./useArcWallet";
import { TokenBalance } from "@/types/token";
import { DEFAULT_TOKEN } from "@/config/tokens";
import { ARC_TESTNET } from "@/config/chains";

type ArcWalletContextType = ReturnType<typeof useArcWallet> & {
  account: { address: string; balanceFormatted: string } | null;
  selectedTokenBalance: TokenBalance;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
};

const WalletContext = createContext<ArcWalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useArcWallet();

  const account = useMemo(() => {
    if (!wallet.isConnected || !wallet.address) return null;
    return {
      address: wallet.address,
      balanceFormatted: wallet.balanceUSDC,
    };
  }, [wallet.isConnected, wallet.address, wallet.balanceUSDC]);

  const selectedTokenBalance = useMemo<TokenBalance>(() => {
    return {
      token: DEFAULT_TOKEN,
      balance: wallet.balanceUSDC,
      rawBalance: wallet.balanceRaw,
      formattedBalance: wallet.balanceUSDC,
      usdValue: wallet.balanceUSDC,
    };
  }, [wallet.balanceUSDC, wallet.balanceRaw]);

  const value: ArcWalletContextType = useMemo(
    () => ({
      ...wallet,
      account,
      selectedTokenBalance,
      connect: async () => {
        await wallet.connectWallet();
      },
      disconnect: () => {
        wallet.disconnectWallet();
      },
      switchNetwork: async () => {
        await wallet.switchToArc();
      },
    }),
    [wallet, account, selectedTokenBalance]
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
