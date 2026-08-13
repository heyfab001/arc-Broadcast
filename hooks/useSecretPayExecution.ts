"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { parseUnits, Hex, Address } from "viem";
import { CONTRACTS, DEFAULT_USDC_DECIMALS } from "@/config/contracts";
import { TRANSACTIONS_FROZEN, TRANSACTIONS_FROZEN_MESSAGE } from "@/config/constants";
import { ARC_TESTNET_CHAIN } from "@/config/chains";
import { ArcSecretPaymentAbi } from "@/contracts/abis/ArcSecretPaymentAbi";
import { Erc20Abi } from "@/contracts/abis/ArcBatchPaymentAbi";
import {
  generateSecureSecret,
  generateClaimId,
  computeSecretHash,
  checkSecretContractBytecode,
  checkSecretAllowance,
} from "@/services/secretPayment";

export type SecretPayStep =
  | "IDLE"
  | "CHECKING_BALANCE"
  | "CHECKING_ALLOWANCE"
  | "AWAITING_APPROVAL"
  | "APPROVAL_SUBMITTED"
  | "WAITING_APPROVAL"
  | "AWAITING_DEPOSIT"
  | "DEPOSIT_SUBMITTED"
  | "WAITING_DEPOSIT"
  | "PAYMENT_CREATED"
  | "ERROR"
  | "CANCELLED";

export interface CreatedSecretClaim {
  claimId: Hex;
  secret: Hex;
  secretHash: Hex;
  amount: string;
  amountRaw: bigint;
  expiryDays: number;
  expiryTimestamp: bigint;
  claimUrl: string;
  depositTxHash: Hex;
}

export function useSecretPayExecution() {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<SecretPayStep>("IDLE");
  const [approvalTxHash, setApprovalTxHash] = useState<Hex | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<Hex | null>(null);
  const [createdClaim, setCreatedClaim] = useState<CreatedSecretClaim | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createSecretPayment = useCallback(
    async (amountStr: string, expiryDays: number, memo?: string) => {
      setErrorMessage(null);
      setApprovalTxHash(null);
      setDepositTxHash(null);
      setCreatedClaim(null);

      // Emergency freeze check
      if (TRANSACTIONS_FROZEN) {
        console.warn("[SECRET_PAY SECURITY FREEZE] Transactions are paused for security audit.");
        setErrorMessage(TRANSACTIONS_FROZEN_MESSAGE);
        setStep("ERROR");
        return;
      }

      // Preflight checks
      if (!isConnected || !userAddress) {
        setErrorMessage("Please connect your wallet first.");
        setStep("ERROR");
        return;
      }

      if (chainId !== ARC_TESTNET_CHAIN.id) {
        setErrorMessage(`Please switch to ${ARC_TESTNET_CHAIN.name} (Chain ID: ${ARC_TESTNET_CHAIN.id}).`);
        setStep("ERROR");
        return;
      }

      const parsedAmount = parseFloat(amountStr);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setErrorMessage("Please enter a valid positive token amount.");
        setStep("ERROR");
        return;
      }

      if (!publicClient) {
        setErrorMessage("Public client unavailable. Please check your network connection.");
        setStep("ERROR");
        return;
      }

      try {
        // Step 1: Verify contract bytecode
        setStep("CHECKING_BALANCE");
        console.log("[SECRET_PAY] 1. Checking contract deployment on Arc Testnet...");
        const bytecodeCheck = await checkSecretContractBytecode();
        if (!bytecodeCheck.isDeployed) {
          throw new Error(
            `ArcSecretPayment contract is not deployed at ${CONTRACTS.arcTestnet.secretPayment}.`
          );
        }

        const amountRaw = parseUnits(amountStr, DEFAULT_USDC_DECIMALS);

        // Step 2: Check Allowance
        setStep("CHECKING_ALLOWANCE");
        console.log("[SECRET_PAY] 2. Checking USDC allowance for amount:", amountRaw.toString());
        const { hasSufficientAllowance } = await checkSecretAllowance(userAddress, amountRaw);

        // Step 3: Trigger Approval if needed
        if (!hasSufficientAllowance) {
          setStep("AWAITING_APPROVAL");
          console.log("[SECRET_PAY] 3. Prompting USDC approval transaction...");

          const appTx = await writeContractAsync({
            address: CONTRACTS.arcTestnet.usdc,
            abi: Erc20Abi,
            functionName: "approve",
            args: [CONTRACTS.arcTestnet.secretPayment, amountRaw],
          });

          setApprovalTxHash(appTx);
          setStep("APPROVAL_SUBMITTED");
          console.log("[SECRET_PAY] 4. Approval submitted:", appTx);

          setStep("WAITING_APPROVAL");
          const appReceipt = await publicClient.waitForTransactionReceipt({
            hash: appTx,
            confirmations: 1,
          });

          if (appReceipt.status !== "success") {
            throw new Error("USDC approval transaction failed on-chain.");
          }
          console.log("[SECRET_PAY] 5. Approval confirmed on-chain.");
        } else {
          console.log("[SECRET_PAY] Sufficient allowance already present. Skipping approval.");
        }

        // Step 4: Cryptographically generate secret and claimId
        console.log("[SECRET_PAY] 6. Generating client-side secret commitment...");
        const secret = generateSecureSecret();
        const claimId = generateClaimId();
        const secretHash = computeSecretHash(secret);
        const expiryTimestamp = BigInt(Math.floor(Date.now() / 1000) + expiryDays * 86400);

        // Step 5: Prompt Deposit Transaction
        setStep("AWAITING_DEPOSIT");
        console.log("[SECRET_PAY] 7. Prompting createClaim deposit transaction...");

        const depTx = await writeContractAsync({
          address: CONTRACTS.arcTestnet.secretPayment,
          abi: ArcSecretPaymentAbi,
          functionName: "createClaim",
          args: [claimId, secretHash, CONTRACTS.arcTestnet.usdc, amountRaw, expiryTimestamp],
        });

        setDepositTxHash(depTx);
        setStep("DEPOSIT_SUBMITTED");
        console.log("[SECRET_PAY] 8. Deposit submitted:", depTx);

        // Step 6: Wait for Deposit Confirmation
        setStep("WAITING_DEPOSIT");
        const depReceipt = await publicClient.waitForTransactionReceipt({
          hash: depTx,
          confirmations: 1,
        });

        if (depReceipt.status !== "success") {
          throw new Error("Secret deposit transaction failed on-chain.");
        }
        console.log("[SECRET_PAY] 9. Deposit confirmed on-chain.");

        // Step 7: Construct URL with hash fragment
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const claimUrl = `${origin}/claim/${claimId}#${secret}`;

        setCreatedClaim({
          claimId,
          secret,
          secretHash,
          amount: amountStr,
          amountRaw,
          expiryDays,
          expiryTimestamp,
          claimUrl,
          depositTxHash: depTx,
        });

        setStep("PAYMENT_CREATED");
        console.log("[SECRET_PAY] 10. Payment created successfully. Claim URL ready.");
      } catch (err: any) {
        console.error("[SECRET_PAY] Execution error:", err);
        const rawMsg = err?.shortMessage || err?.message || "Transaction failed";
        if (
          rawMsg.includes("User rejected") ||
          rawMsg.includes("denied") ||
          rawMsg.includes("Rejected")
        ) {
          setStep("CANCELLED");
          setErrorMessage("Transaction was cancelled in your wallet.");
        } else {
          setStep("ERROR");
          setErrorMessage(rawMsg);
        }
      }
    },
    [isConnected, userAddress, chainId, publicClient, writeContractAsync]
  );

  const reset = useCallback(() => {
    setStep("IDLE");
    setApprovalTxHash(null);
    setDepositTxHash(null);
    setCreatedClaim(null);
    setErrorMessage(null);
  }, []);

  return {
    step,
    approvalTxHash,
    depositTxHash,
    createdClaim,
    errorMessage,
    createSecretPayment,
    reset,
    isProcessing:
      step !== "IDLE" &&
      step !== "PAYMENT_CREATED" &&
      step !== "ERROR" &&
      step !== "CANCELLED",
  };
}
