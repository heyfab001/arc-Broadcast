"use client";

import { useMemo, useCallback } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  Connector,
} from "wagmi";
import { ARC_CHAIN_ID, ARC_TESTNET } from "@/config/chains";
import { truncateAddress } from "@/lib/utils";
import { formatArcUsdc, parseWalletErrorMessage } from "@/lib/arc";
import { useArcNetwork } from "./useArcNetwork";
import { showToast } from "@/hooks/useToast";
import { WalletConnectionStatus } from "@/types/wallet";

export function useArcWallet() {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount();
  const { connectAsync, connectors, isPending: isConnectPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { isArcTestnet, isWrongNetwork, isSwitching, switchToArc } = useArcNetwork();

  // Query real native USDC balance on Arc Testnet
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useBalance({
    address: address,
    chainId: ARC_CHAIN_ID,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10_000,
    },
  });

  const shortAddress = useMemo(() => {
    return address ? truncateAddress(address, 4) : "";
  }, [address]);

  const connectionStatus: WalletConnectionStatus = useMemo(() => {
    if (isConnecting || isReconnecting || isConnectPending) return "connecting";
    if (!isConnected) return "disconnected";
    if (isWrongNetwork) return "wrong_network";
    return "connected";
  }, [isConnecting, isReconnecting, isConnectPending, isConnected, isWrongNetwork]);

  // Formatted native USDC balance (no ETH display)
  const balanceUSDC = useMemo(() => {
    if (!isConnected || !address) return "0.00";
    if (isBalanceLoading) return "...";
    if (isBalanceError || !balanceData) return "0.00";
    return formatArcUsdc(balanceData.value, 4);
  }, [isConnected, address, isBalanceLoading, isBalanceError, balanceData]);

  const balanceRaw = balanceData?.value ?? BigInt(0);

  const connectWallet = useCallback(
    async (targetConnector?: Connector) => {
      const conn = targetConnector || connectors[0];
      if (!conn) {
        showToast({
          title: "Wallet Not Found",
          message: "No compatible wallet detected. Please install an EVM wallet like MetaMask, Rabby, or Coinbase Wallet.",
          type: "warning",
        });
        return;
      }

      try {
        await connectAsync({ connector: conn });
        showToast({
          title: "Wallet Connected",
          message: "Successfully connected EVM wallet.",
          type: "success",
        });
      } catch (err: unknown) {
        const friendly = parseWalletErrorMessage(err);
        showToast({
          title: "Connection Failed",
          message: friendly,
          type: "error",
        });
        console.warn("[Arc Wallet] Connection error:", err);
      }
    },
    [connectAsync, connectors]
  );

  const disconnectWallet = useCallback(() => {
    disconnect();
    showToast({
      title: "Wallet Disconnected",
      message: "Disconnected from Arc Broadcast Payment.",
      type: "info",
    });
  }, [disconnect]);

  return {
    address,
    shortAddress,
    isConnected,
    isConnecting: isConnecting || isConnectPending || isReconnecting,
    isDisconnected: !isConnected,
    status: connectionStatus,
    chainId,
    isArcTestnet,
    isWrongNetwork,
    isSwitching,
    connector,
    connectors,
    balanceUSDC,
    balanceRaw,
    isBalanceLoading,
    isBalanceError,
    refetchBalance,
    connectWallet,
    disconnectWallet,
    switchToArc,
    currentNetwork: ARC_TESTNET,
  };
}
