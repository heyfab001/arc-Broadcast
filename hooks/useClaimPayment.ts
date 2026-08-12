"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { Hex, Address } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { ARC_TESTNET_CHAIN } from "@/config/chains";
import { ArcSecretPaymentAbi } from "@/contracts/abis/ArcSecretPaymentAbi";
import { getOnChainClaim, OnChainClaim, computeSecretHash } from "@/services/secretPayment";

export type ClaimStep =
  | "LOADING_CLAIM"
  | "CLAIM_AVAILABLE"
  | "AWAITING_CLAIM_WALLET"
  | "CLAIM_SUBMITTED"
  | "WAITING_CLAIM"
  | "CLAIMED"
  | "EXPIRED"
  | "REFUNDED"
  | "INVALID"
  | "ERROR"
  | "AWAITING_REFUND_WALLET"
  | "REFUND_SUBMITTED"
  | "WAITING_REFUND";

export function useClaimPayment(claimIdParam: string) {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<ClaimStep>("LOADING_CLAIM");
  const [claimData, setClaimData] = useState<OnChainClaim | null>(null);
  const [secretKey, setSecretKey] = useState<Hex | null>(null);
  const [claimTxHash, setClaimTxHash] = useState<Hex | null>(null);
  const [refundTxHash, setRefundTxHash] = useState<Hex | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSecretValid, setIsSecretValid] = useState<boolean>(false);

  // Normalize claimId
  const claimId: Hex = claimIdParam.startsWith("0x")
    ? (claimIdParam as Hex)
    : (`0x${claimIdParam}` as Hex);

  // Extract secret from URL hash fragment (#0x...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash) {
        const formattedSecret: Hex = hash.startsWith("0x")
          ? (hash as Hex)
          : (`0x${hash}` as Hex);
        setSecretKey(formattedSecret);
      }
    }
  }, []);

  // Fetch on-chain claim state
  const refreshClaim = useCallback(async () => {
    setStep("LOADING_CLAIM");
    setErrorMessage(null);

    try {
      const data = await getOnChainClaim(claimId);
      if (!data || !data.isExists) {
        setClaimData(null);
        setStep("INVALID");
        return;
      }

      setClaimData(data);

      if (data.claimed) {
        setStep("CLAIMED");
        return;
      }

      if (data.refunded) {
        setStep("REFUNDED");
        return;
      }

      if (data.isExpired) {
        setStep("EXPIRED");
        return;
      }

      setStep("CLAIM_AVAILABLE");
    } catch (err: any) {
      console.error("[CLAIM_PAY] Error fetching claim:", err);
      setErrorMessage(err?.message || "Failed to load claim from blockchain.");
      setStep("ERROR");
    }
  }, [claimId]);

  useEffect(() => {
    if (claimIdParam) {
      refreshClaim();
    }
  }, [claimIdParam, refreshClaim]);

  // Validate secret against secretHash
  useEffect(() => {
    if (claimData && secretKey) {
      try {
        const computed = computeSecretHash(secretKey);
        setIsSecretValid(computed.toLowerCase() === claimData.secretHash.toLowerCase());
      } catch {
        setIsSecretValid(false);
      }
    }
  }, [claimData, secretKey]);

  // Execute Claim
  const claimPayment = useCallback(async () => {
    setErrorMessage(null);
    setClaimTxHash(null);

    if (!isConnected || !userAddress) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    if (chainId !== ARC_TESTNET_CHAIN.id) {
      setErrorMessage(`Please switch to ${ARC_TESTNET_CHAIN.name}.`);
      return;
    }

    if (!secretKey) {
      setErrorMessage("Secret key missing from claim URL fragment (#secret).");
      return;
    }

    if (!publicClient) {
      setErrorMessage("Public client not available.");
      return;
    }

    try {
      setStep("AWAITING_CLAIM_WALLET");
      console.log("[CLAIM_PAY] Prompting claim transaction for receiver:", userAddress);

      const tx = await writeContractAsync({
        address: CONTRACTS.arcTestnet.secretPayment,
        abi: ArcSecretPaymentAbi,
        functionName: "claim",
        args: [claimId, secretKey],
      });

      setClaimTxHash(tx);
      setStep("CLAIM_SUBMITTED");
      console.log("[CLAIM_PAY] Claim transaction submitted:", tx);

      setStep("WAITING_CLAIM");
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });

      if (receipt.status !== "success") {
        throw new Error("Claim transaction failed on-chain.");
      }

      console.log("[CLAIM_PAY] Claim confirmed on-chain.");
      setStep("CLAIMED");
      await refreshClaim();
    } catch (err: any) {
      console.error("[CLAIM_PAY] Error claiming payment:", err);
      const rawMsg = err?.shortMessage || err?.message || "Claim transaction failed";
      if (rawMsg.includes("User rejected") || rawMsg.includes("denied")) {
        setErrorMessage("Claim transaction was cancelled in your wallet.");
      } else {
        setErrorMessage(rawMsg);
      }
      setStep("CLAIM_AVAILABLE");
    }
  }, [isConnected, userAddress, chainId, secretKey, claimId, publicClient, writeContractAsync, refreshClaim]);

  // Execute Refund if expired and caller is sender
  const refundPayment = useCallback(async () => {
    setErrorMessage(null);
    setRefundTxHash(null);

    if (!isConnected || !userAddress) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    if (chainId !== ARC_TESTNET_CHAIN.id) {
      setErrorMessage(`Please switch to ${ARC_TESTNET_CHAIN.name}.`);
      return;
    }

    if (!publicClient) {
      setErrorMessage("Public client not available.");
      return;
    }

    try {
      setStep("AWAITING_REFUND_WALLET");
      console.log("[CLAIM_PAY] Prompting refund transaction for sender:", userAddress);

      const tx = await writeContractAsync({
        address: CONTRACTS.arcTestnet.secretPayment,
        abi: ArcSecretPaymentAbi,
        functionName: "refundExpired",
        args: [claimId],
      });

      setRefundTxHash(tx);
      setStep("REFUND_SUBMITTED");
      console.log("[CLAIM_PAY] Refund transaction submitted:", tx);

      setStep("WAITING_REFUND");
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });

      if (receipt.status !== "success") {
        throw new Error("Refund transaction failed on-chain.");
      }

      console.log("[CLAIM_PAY] Refund confirmed on-chain.");
      setStep("REFUNDED");
      await refreshClaim();
    } catch (err: any) {
      console.error("[CLAIM_PAY] Error refunding payment:", err);
      const rawMsg = err?.shortMessage || err?.message || "Refund transaction failed";
      setErrorMessage(rawMsg);
      setStep("EXPIRED");
    }
  }, [isConnected, userAddress, chainId, claimId, publicClient, writeContractAsync, refreshClaim]);

  const isSender = Boolean(
    userAddress &&
    claimData?.sender &&
    userAddress.toLowerCase() === claimData.sender.toLowerCase()
  );

  return {
    step,
    claimData,
    secretKey,
    isSecretValid,
    claimTxHash,
    refundTxHash,
    errorMessage,
    isSender,
    claimPayment,
    refundPayment,
    refreshClaim,
  };
}
