"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { ARC_CHAIN_ID } from "@/config/chains";
import {
  ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS,
  normalizeChainId,
  parseWalletErrorMessage,
} from "@/lib/arc";
import { showToast } from "@/hooks/useToast";

// Global in-flight lock across all components to prevent duplicate switch calls
let isGlobalSwitching = false;

export function useArcNetwork() {
  const { isConnected, connector, chainId: accountChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [providerChainId, setProviderChainId] = useState<number | null>(null);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  // Helper to query actual chain ID from active EIP-1193 provider
  const syncProviderChainId = useCallback(async () => {
    try {
      let provider: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } | null = null;
      if (connector?.getProvider) {
        try {
          provider = (await connector.getProvider()) as {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
          };
        } catch {
          // fallback
        }
      }
      if (!provider && typeof window !== "undefined") {
        provider = (window as unknown as {
          ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
        }).ethereum || null;
      }

      if (provider) {
        const rawHex = await provider.request({ method: "eth_chainId" });
        const normalized = normalizeChainId(rawHex);
        if (normalized !== null) {
          setProviderChainId(normalized);
          return normalized;
        }
      }
    } catch (e) {
      console.warn("[Arc Network] Error fetching eth_chainId:", e);
    }
    return null;
  }, [connector]);

  // Sync on initial connect or connector change (read-only, never triggers switch)
  useEffect(() => {
    if (isConnected) {
      if (accountChainId) {
        const normalized = normalizeChainId(accountChainId);
        if (normalized !== null) {
          setProviderChainId(normalized);
        }
      }
      syncProviderChainId();
    } else {
      setProviderChainId(null);
    }
  }, [isConnected, accountChainId, connector, syncProviderChainId]);

  // Listen to EIP-1193 chainChanged event directly on the active provider
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleChainChanged = (newChainIdHex: unknown) => {
      const normalized = normalizeChainId(newChainIdHex);
      console.log("[Arc Network] chainChanged detected:", newChainIdHex, "-> normalized:", normalized);
      if (normalized !== null) {
        setProviderChainId(normalized);
      }
    };

    let activeProvider: {
      on?: (event: string, handler: (param: unknown) => void) => void;
      removeListener?: (event: string, handler: (param: unknown) => void) => void;
    } | null = null;

    if (connector?.getProvider) {
      connector.getProvider().then((prov) => {
        activeProvider = prov as typeof activeProvider;
        activeProvider?.on?.("chainChanged", handleChainChanged);
      }).catch(() => {});
    }

    const winEthereum = (window as unknown as {
      ethereum?: {
        on?: (event: string, handler: (param: unknown) => void) => void;
        removeListener?: (event: string, handler: (param: unknown) => void) => void;
      };
    }).ethereum;

    winEthereum?.on?.("chainChanged", handleChainChanged);

    return () => {
      activeProvider?.removeListener?.("chainChanged", handleChainChanged);
      winEthereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [connector]);

  // Single Normalized Source of Truth for wallet chain ID
  const effectiveChainId = useMemo(() => {
    if (!isConnected) return null;
    if (providerChainId !== null) return providerChainId;
    if (accountChainId) {
      return normalizeChainId(accountChainId);
    }
    return null;
  }, [isConnected, providerChainId, accountChainId]);

  const isArcTestnet = useMemo(() => {
    if (!isConnected) return true; // Default view when disconnected
    if (effectiveChainId === null) return true;
    return effectiveChainId === ARC_CHAIN_ID;
  }, [isConnected, effectiveChainId]);

  const isWrongNetwork = useMemo(() => {
    if (!isConnected) return false;
    if (effectiveChainId === null) return false;
    return effectiveChainId !== ARC_CHAIN_ID;
  }, [isConnected, effectiveChainId]);

  // Explicit user-initiated switch request with mutex lock (NEVER auto-retries)
  const switchToArc = useCallback(async (): Promise<boolean> => {
    if (!isConnected) return false;

    // Mutex lock to prevent duplicate concurrent switch requests
    if (isGlobalSwitching) {
      console.log("[Arc Network] Switch request already in-flight. Ignoring duplicate click.");
      return false;
    }

    isGlobalSwitching = true;
    setIsSwitching(true);

    try {
      let provider: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } | null = null;
      if (connector?.getProvider) {
        try {
          provider = (await connector.getProvider()) as typeof provider;
        } catch {}
      }
      if (!provider && typeof window !== "undefined") {
        provider = (window as unknown as {
          ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
        }).ethereum || null;
      }

      // Step 1: Attempt standard wallet switch
      if (switchChainAsync) {
        try {
          await switchChainAsync({ chainId: ARC_CHAIN_ID });
        } catch (switchErr: unknown) {
          const errObj = switchErr as { code?: number; message?: string; shortMessage?: string };
          const errMsg = (errObj?.shortMessage || errObj?.message || String(switchErr)).toLowerCase();

          // User rejected the switch request
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
            isGlobalSwitching = false;
            setIsSwitching(false);
            return false;
          }

          // Unrecognized chain (4902) -> Request add network once
          const isNotAdded =
            errObj?.code === 4902 ||
            errMsg.includes("4902") ||
            errMsg.includes("unrecognized chain") ||
            errMsg.includes("chain not added") ||
            errMsg.includes("unknown chain");

          if (isNotAdded && provider) {
            try {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS],
              });

              // Switch after network addition approved
              await switchChainAsync({ chainId: ARC_CHAIN_ID });
            } catch (addErr: unknown) {
              const addErrMsg = String((addErr as Error)?.message || addErr).toLowerCase();
              if (addErrMsg.includes("4001") || addErrMsg.includes("user rejected") || addErrMsg.includes("denied")) {
                showToast({
                  title: "Network Switch",
                  message: "Adding Arc Testnet was cancelled.",
                  type: "warning",
                });
              } else {
                showToast({
                  title: "Network Error",
                  message: "Couldn't add Arc Testnet. Please add it manually in your wallet.",
                  type: "error",
                });
              }
              isGlobalSwitching = false;
              setIsSwitching(false);
              return false;
            }
          } else {
            const friendlyMsg = parseWalletErrorMessage(switchErr);
            showToast({
              title: "Network Switch",
              message: friendlyMsg,
              type: "warning",
            });
            isGlobalSwitching = false;
            setIsSwitching(false);
            return false;
          }
        }
      }

      // Step 2: Verify actual provider chain ID after switch
      const verified = await syncProviderChainId();
      if (verified === ARC_CHAIN_ID) {
        showToast({
          title: "Connected",
          message: "Connected to Arc Testnet ✓",
          type: "success",
        });
        isGlobalSwitching = false;
        setIsSwitching(false);
        return true;
      }
    } catch (err: unknown) {
      const friendlyMsg = parseWalletErrorMessage(err);
      showToast({
        title: "Network Switch",
        message: friendlyMsg,
        type: "error",
      });
    } finally {
      isGlobalSwitching = false;
      setIsSwitching(false);
    }
    return false;
  }, [isConnected, connector, switchChainAsync, syncProviderChainId]);

  return {
    currentChainId: effectiveChainId || ARC_CHAIN_ID,
    actualChainId: effectiveChainId,
    isArcTestnet,
    isWrongNetwork,
    isSwitching,
    switchToArc,
    syncProviderChainId,
  };
}
