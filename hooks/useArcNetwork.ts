"use client";

import { useCallback, useState } from "react";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { ARC_CHAIN_ID } from "@/config/chains";
import { ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS, parseWalletErrorMessage } from "@/lib/arc";
import { showToast } from "@/hooks/useToast";

export function useArcNetwork() {
  const currentChainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChainAsync, isPending: isWagmiSwitching } = useSwitchChain();
  const [isManualSwitching, setIsManualSwitching] = useState(false);

  const isArcTestnet = isConnected ? currentChainId === ARC_CHAIN_ID : true;
  const isWrongNetwork = isConnected && currentChainId !== ARC_CHAIN_ID;
  const isSwitching = isWagmiSwitching || isManualSwitching;

  const switchToArc = useCallback(async (): Promise<boolean> => {
    if (!isConnected) return false;

    setIsManualSwitching(true);
    try {
      if (switchChainAsync) {
        try {
          await switchChainAsync({ chainId: ARC_CHAIN_ID });
          showToast({
            title: "Network Switched",
            message: "Successfully connected to Arc Testnet.",
            type: "success",
          });
          setIsManualSwitching(false);
          return true;
        } catch (switchErr: unknown) {
          // If error is chain not added (4902) or similar, fallback to wallet_addEthereumChain
          const errObj = switchErr as { code?: number; message?: string };
          const isNotAdded =
            errObj?.code === 4902 ||
            errObj?.message?.includes("4902") ||
            errObj?.message?.includes("Unrecognized chain");

          if (isNotAdded && typeof window !== "undefined" && (window as unknown as { ethereum?: { request: (args: unknown) => Promise<unknown> } }).ethereum) {
            const ethereum = (window as unknown as { ethereum: { request: (args: unknown) => Promise<unknown> } }).ethereum;
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS],
            });
            // Automatically switch after adding
            await switchChainAsync({ chainId: ARC_CHAIN_ID });
            showToast({
              title: "Arc Testnet Added",
              message: "Arc Testnet has been added and activated in your wallet.",
              type: "success",
            });
            setIsManualSwitching(false);
            return true;
          }

          // User rejected or other error
          const userFriendlyMsg = parseWalletErrorMessage(switchErr);
          showToast({
            title: "Network Switch",
            message: userFriendlyMsg,
            type: "warning",
          });
          console.warn("[Arc Network] Switch error:", switchErr);
          setIsManualSwitching(false);
          return false;
        }
      }
    } catch (err) {
      const userFriendlyMsg = parseWalletErrorMessage(err);
      showToast({
        title: "Network Switch",
        message: userFriendlyMsg,
        type: "error",
      });
      console.warn("[Arc Network] Unexpected switch error:", err);
    } finally {
      setIsManualSwitching(false);
    }
    return false;
  }, [isConnected, switchChainAsync]);

  return {
    currentChainId,
    isArcTestnet,
    isWrongNetwork,
    isSwitching,
    switchToArc,
  };
}
