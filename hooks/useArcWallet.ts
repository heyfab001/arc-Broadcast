"use client";

import { useMemo, useCallback } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
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
  const { connectAsync, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    currentChainId,
    actualChainId,
    isArcTestnet,
    isWrongNetwork,
    isSwitching,
    switchToArc,
    syncProviderChainId,
  } = useArcNetwork();

  // Query real native USDC balance on Arc Testnet (no aggressive polling)
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useBalance({
    address: address,
    chainId: ARC_CHAIN_ID,
    query: {
      enabled: isConnected && !!address && isArcTestnet,
      refetchInterval: 60_000,
      refetchIntervalInBackground: false,
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

  // Formatted native USDC balance
  const balanceUSDC = useMemo(() => {
    if (!isConnected || !address || isWrongNetwork) return "0.00";
    if (isBalanceLoading && !balanceData) return "0.00";
    if (isBalanceError || !balanceData) return "0.00";
    return formatArcUsdc(balanceData.value, 4);
  }, [isConnected, address, isWrongNetwork, isBalanceLoading, isBalanceError, balanceData]);

  const balanceRaw = balanceData?.value ?? BigInt(0);

  const connectWallet = useCallback(
    async (targetConnector?: Connector) => {
      const conn = targetConnector || connectors[0];
      if (!conn) {
        showToast({
          title: "Wallet not found",
          message: "Please install an EVM wallet extension like MetaMask or Rabby.",
          type: "warning",
        });
        return;
      }

      try {
        await connectAsync({ connector: conn });
      } catch (err: unknown) {
        const friendly = parseWalletErrorMessage(err);
        showToast({
          title: "Connection failed",
          message: friendly,
          type: "error",
        });
      }
    },
    [connectAsync, connectors]
  );

  const disconnectWallet = useCallback(() => {
    disconnect();
    showToast({
      title: "Wallet disconnected",
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
    chainId: actualChainId ?? currentChainId,
    actualChainId,
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
    syncProviderChainId,
    currentNetwork: ARC_TESTNET,
  };
}
