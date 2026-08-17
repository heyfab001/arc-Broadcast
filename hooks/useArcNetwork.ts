"use client";

import { useCallback, useState } from "react";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { ARC_CHAIN_ID } from "@/config/chains";
import { ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS, parseWalletErrorMessage } from "@/lib/arc";
import { showToast } from "@/hooks/useToast";

export function useArcNetwork() {
  const currentChainId = useChainId();
  const { isConnected, connector } = useAccount();
  const { switchChainAsync, isPending: isWagmiSwitching } = useSwitchChain();
  const [isManualSwitching, setIsManualSwitching] = useState(false);

  const isArcTestnet = isConnected ? currentChainId === ARC_CHAIN_ID : true;
  const isWrongNetwork = isConnected && currentChainId !== ARC_CHAIN_ID;
  const isSwitching = isWagmiSwitching || isManualSwitching;

  const switchToArc = useCallback(async (): Promise<boolean> => {
    if (!isConnected) return false;

    setIsManualSwitching(true);
    try {
      // 1. Try standard wagmi switchChain first
      if (switchChainAsync) {
        try {
          await switchChainAsync({ chainId: ARC_CHAIN_ID });
          showToast({
            title: "Connected",
            message: "Connected to Arc Testnet ✓",
            type: "success",
          });
          setIsManualSwitching(false);
          return true;
        } catch (switchErr: unknown) {
          const errObj = switchErr as { code?: number; message?: string; shortMessage?: string };
          const errMsg = (errObj?.shortMessage || errObj?.message || String(switchErr)).toLowerCase();

          // Check if user rejected the switch prompt
          if (
            errObj?.code === 4001 ||
            errMsg.includes("user rejected") ||
            errMsg.includes("denied") ||
            errMsg.includes("cancelled")
          ) {
            showToast({
              title: "Network Switch",
              message: "Network switch cancelled.",
              type: "warning",
            });
            setIsManualSwitching(false);
            return false;
          }

          // Check if network is not added (EIP-1193 4902 or unrecognized chain)
          const isNotAdded =
            errObj?.code === 4902 ||
            errMsg.includes("4902") ||
            errMsg.includes("unrecognized chain") ||
            errMsg.includes("chain not added") ||
            errMsg.includes("unknown chain");

          // 2. Request wallet_addEthereumChain via standard EIP-1193 provider
          let provider: { request: (args: unknown) => Promise<unknown> } | null = null;
          if (connector?.getProvider) {
            try {
              provider = (await connector.getProvider()) as {
                request: (args: unknown) => Promise<unknown>;
              };
            } catch {
              // fallback
            }
          }

          if (!provider && typeof window !== "undefined") {
            provider = (window as unknown as {
              ethereum?: { request: (args: unknown) => Promise<unknown> };
            }).ethereum || null;
          }

          if (isNotAdded && provider) {
            try {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS],
              });

              // Automatically switch after user approves adding
              await switchChainAsync({ chainId: ARC_CHAIN_ID });

              showToast({
                title: "Connected",
                message: "Connected to Arc Testnet ✓",
                type: "success",
              });
              setIsManualSwitching(false);
              return true;
            } catch (addErr: unknown) {
              const addErrMsg = String((addErr as Error)?.message || addErr).toLowerCase();
              if (addErrMsg.includes("4001") || addErrMsg.includes("user rejected") || addErrMsg.includes("denied")) {
                showToast({
                  title: "Network Switch",
                  message: "Network switch cancelled.",
                  type: "warning",
                });
              } else {
                showToast({
                  title: "Network Error",
                  message: "Couldn't add Arc Testnet. Please add it manually in your wallet.",
                  type: "error",
                });
              }
              setIsManualSwitching(false);
              return false;
            }
          }

          // Other switch failure
          const friendlyMsg = parseWalletErrorMessage(switchErr);
          showToast({
            title: "Network Switch",
            message: friendlyMsg,
            type: "warning",
          });
          setIsManualSwitching(false);
          return false;
        }
      }
    } catch (err: unknown) {
      const friendlyMsg = parseWalletErrorMessage(err);
      showToast({
        title: "Network Switch",
        message: friendlyMsg,
        type: "error",
      });
    } finally {
      setIsManualSwitching(false);
    }
    return false;
  }, [isConnected, connector, switchChainAsync]);

  return {
    currentChainId,
    isArcTestnet,
    isWrongNetwork,
    isSwitching,
    switchToArc,
  };
}
