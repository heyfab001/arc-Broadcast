"use client";

import { useState, useCallback, useMemo } from "react";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { ARC_BATCH_PAYMENT_ABI, ERC20_ABI } from "@/contracts/abis/ArcBatchPaymentAbi";
import { CONTRACTS, DEFAULT_USDC_DECIMALS } from "@/config/contracts";
import {
  checkAllowance,
  getErc20Balance,
  toAtomicAmount,
  checkContractBytecode,
} from "@/services/broadcastPayment";
import { Recipient } from "@/types/payment";
import { ARC_CHAIN_ID, ARC_TESTNET } from "@/config/chains";
import { parseWalletErrorMessage } from "@/lib/arc";
import { showToast } from "@/hooks/useToast";
import { isAddress } from "viem";

export type BroadcastPaymentStep =
  | "IDLE"
  | "VALIDATING"
  | "CHECKING_BALANCE"
  | "CHECKING_ALLOWANCE"
  | "AWAITING_APPROVAL_WALLET"
  | "APPROVAL_SUBMITTED"
  | "WAITING_APPROVAL_CONFIRMATION"
  | "AWAITING_BATCH_WALLET"
  | "BATCH_SUBMITTED"
  | "WAITING_BATCH_CONFIRMATION"
  | "SUCCESS"
  | "ERROR"
  | "CANCELLED"
  | "NOT_DEPLOYED";

export interface BroadcastPaymentState {
  step: BroadcastPaymentStep;
  statusText: string;
  isProcessing: boolean;
  approvalTxHash: string | null;
  batchTxHash: string | null;
  error: string | null;
  totalAmountFormatted: string;
  recipientCount: number;
}

export function useBroadcastPayment() {
  const { address, isConnected, chainId } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<BroadcastPaymentStep>("IDLE");
  const [statusText, setStatusText] = useState<string>("Send Batch Payment");
  const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null);
  const [batchTxHash, setBatchTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPaymentSummary, setLastPaymentSummary] = useState<{
    recipientCount: number;
    totalAmount: string;
  } | null>(null);

  const resetPaymentState = useCallback(() => {
    setStep("IDLE");
    setStatusText("Send Batch Payment");
    setApprovalTxHash(null);
    setBatchTxHash(null);
    setError(null);
  }, []);

  const executeBroadcastPayment = useCallback(
    async (
      recipients: Recipient[],
      tokenAddress: `0x${string}` = CONTRACTS.arcTestnet.usdc,
      batchContractAddress: `0x${string}` = CONTRACTS.arcTestnet.batchPayment
    ) => {
      console.log("[BROADCAST] button clicked");

      // 1. Connection check
      if (!isConnected || !address) {
        console.warn("[BROADCAST] Wallet not connected");
        setStep("ERROR");
        setError("Please connect your Web3 wallet.");
        setStatusText("Wallet Required");
        showToast({
          title: "Wallet Required",
          message: "Please connect your wallet to execute batch payment.",
          type: "warning",
        });
        return;
      }

      console.log("[BROADCAST] wallet address:", address);
      console.log("[BROADCAST] chain ID:", chainId);

      // 2. Network check
      if (chainId !== ARC_CHAIN_ID) {
        console.warn("[BROADCAST] Wrong network:", chainId, "Expected:", ARC_CHAIN_ID);
        setStep("ERROR");
        setError("Switch to Arc Testnet");
        setStatusText("Switch to Arc Testnet");
        showToast({
          title: "Wrong Network",
          message: "Please switch to Arc Testnet to execute payment.",
          type: "warning",
        });
        return;
      }

      // 3. Contract address verification (Section 5 & 16)
      if (
        !batchContractAddress ||
        batchContractAddress.trim() === "" ||
        batchContractAddress === "0x0000000000000000000000000000000000000000" ||
        !isAddress(batchContractAddress)
      ) {
        const errorMsg = "Batch payment contract is not deployed.";
        console.error(
          "[BROADCAST] ArcBatchPayment is not configured. Deploy ArcBatchPayment to Arc Testnet and add the real contract address."
        );
        setStep("NOT_DEPLOYED");
        setError(
          "Batch payment contract is not deployed. Deploy ArcBatchPayment to Arc Testnet and set NEXT_PUBLIC_ARC_BATCH_PAYMENT_ADDRESS."
        );
        setStatusText("Contract Not Deployed");
        showToast({
          title: "Contract Not Deployed",
          message:
            "Deploy ArcBatchPayment to Arc Testnet and configure NEXT_PUBLIC_ARC_BATCH_PAYMENT_ADDRESS.",
          type: "error",
        });
        return;
      }

      // 4. Contract bytecode check (Section 16)
      const hasBytecode = await checkContractBytecode(batchContractAddress);
      if (!hasBytecode) {
        const errorMsg = "Batch payment contract is not deployed at the configured address.";
        console.error(`[BROADCAST] No bytecode found at ${batchContractAddress} on Arc Testnet.`);
        setStep("NOT_DEPLOYED");
        setError(errorMsg);
        setStatusText("Contract Not Found");
        showToast({
          title: "Contract Not Found",
          message: errorMsg,
          type: "error",
        });
        return;
      }

      // 5. Recipient validation (Section 11)
      setStep("VALIDATING");
      setStatusText("Validating recipients...");

      const validRecipients = recipients.filter(
        (r) => r.address && r.address.trim() !== "" && r.amount && Number(r.amount) > 0
      );

      if (validRecipients.length === 0 || validRecipients.length > 100) {
        console.warn("[BROADCAST] Invalid recipient count:", validRecipients.length);
        setStep("ERROR");
        setError("Recipient count must be between 1 and 100.");
        setStatusText("Invalid Recipients");
        return;
      }

      for (let i = 0; i < validRecipients.length; i++) {
        const r = validRecipients[i];
        if (!isAddress(r.address.trim()) || r.address.trim() === "0x0000000000000000000000000000000000000000") {
          setStep("ERROR");
          setError(`Invalid recipient address at #${i + 1}: ${r.address}`);
          setStatusText("Invalid Address");
          return;
        }
        if (isNaN(Number(r.amount)) || Number(r.amount) <= 0) {
          setStep("ERROR");
          setError(`Invalid amount for recipient #${i + 1}`);
          setStatusText("Invalid Amount");
          return;
        }
      }

      setError(null);
      setApprovalTxHash(null);
      setBatchTxHash(null);

      try {
        const recipientAddresses: `0x${string}`[] = [];
        const atomicAmounts: bigint[] = [];
        let totalAtomic = BigInt(0);

        for (const r of validRecipients) {
          const atomic = toAtomicAmount(r.amount, DEFAULT_USDC_DECIMALS);
          recipientAddresses.push(r.address.trim() as `0x${string}`);
          atomicAmounts.push(atomic);
          totalAtomic += atomic;
        }

        const totalFormatted = validRecipients
          .reduce((acc, r) => acc + (parseFloat(r.amount) || 0), 0)
          .toFixed(4);

        console.log("[BROADCAST] recipient count:", validRecipients.length);
        console.log("[BROADCAST] total amount (formatted):", totalFormatted, "USDC");
        console.log("[BROADCAST] total amount (atomic 6 decimals):", totalAtomic.toString());

        setLastPaymentSummary({
          recipientCount: validRecipients.length,
          totalAmount: totalFormatted,
        });

        // 6. Balance check (Section 9)
        setStep("CHECKING_BALANCE");
        setStatusText("Checking USDC balance...");
        const balanceData = await getErc20Balance(address, tokenAddress);
        console.log("[BROADCAST] user ERC20 USDC balance:", balanceData.formatted, "USDC (raw:", balanceData.raw.toString(), ")");

        if (balanceData.raw < totalAtomic) {
          console.warn("[BROADCAST] Insufficient balance. Required:", totalAtomic.toString(), "Available:", balanceData.raw.toString());
          setStep("ERROR");
          const msg = "Insufficient USDC balance.";
          setError(msg);
          setStatusText("Insufficient Balance");
          showToast({
            title: "Insufficient Balance",
            message: `You need ${totalFormatted} USDC, but your wallet has ${balanceData.formatted} USDC.`,
            type: "warning",
          });
          return;
        }

        // 7. Allowance check (Section 8)
        setStep("CHECKING_ALLOWANCE");
        setStatusText("Checking allowance...");
        const currentAllowance = await checkAllowance(address, batchContractAddress, tokenAddress);
        console.log("[BROADCAST] current allowance:", currentAllowance.toString());
        console.log("[BROADCAST] required allowance:", totalAtomic.toString());

        // 8. Request approval if allowance is insufficient
        if (currentAllowance < totalAtomic) {
          console.log("[BROADCAST] requesting approval from wallet...");
          setStep("AWAITING_APPROVAL_WALLET");
          setStatusText("Confirm USDC Approval in your wallet");

          const approveHash = await writeContractAsync({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [batchContractAddress, totalAtomic],
            chainId: ARC_CHAIN_ID,
            account: address,
          });

          console.log("[BROADCAST] approval tx hash:", approveHash);
          setApprovalTxHash(approveHash);
          setStep("APPROVAL_SUBMITTED");
          setStatusText("Approval submitted - waiting for confirmation...");

          showToast({
            title: "Approval Submitted",
            message: `Approval tx sent: ${approveHash.slice(0, 10)}...`,
            type: "info",
          });

          console.log("[BROADCAST] waiting for approval receipt...");
          setStep("WAITING_APPROVAL_CONFIRMATION");
          setStatusText("Waiting for approval confirmation on Arc...");

          const approvalReceipt = await waitForTransactionReceipt(config, {
            hash: approveHash,
            chainId: ARC_CHAIN_ID,
          });

          if (approvalReceipt.status !== "success") {
            throw new Error("USDC approval transaction failed or reverted on Arc Testnet.");
          }

          console.log("[BROADCAST] approval confirmed!");
          showToast({
            title: "USDC Approved",
            message: "USDC allowance confirmed on Arc Testnet.",
            type: "success",
          });
        } else {
          console.log("[BROADCAST] Current allowance is already sufficient. Skipping approval.");
        }

        // 9. Call batchTransfer on ArcBatchPayment contract (Section 4)
        console.log("[BROADCAST] requesting batch transfer from wallet...");
        setStep("AWAITING_BATCH_WALLET");
        setStatusText("Confirm Batch Payment in your wallet");

        const batchHash = await writeContractAsync({
          address: batchContractAddress,
          abi: ARC_BATCH_PAYMENT_ABI,
          functionName: "batchTransfer",
          args: [tokenAddress, recipientAddresses, atomicAmounts],
          chainId: ARC_CHAIN_ID,
          account: address,
        });

        console.log("[BROADCAST] batch tx hash:", batchHash);
        setBatchTxHash(batchHash);
        setStep("BATCH_SUBMITTED");
        setStatusText("Batch payment submitted - confirming on Arc...");

        showToast({
          title: "Batch Payment Submitted",
          message: `Transaction hash: ${batchHash.slice(0, 10)}...`,
          type: "info",
        });

        console.log("[BROADCAST] waiting for batch receipt...");
        setStep("WAITING_BATCH_CONFIRMATION");
        setStatusText("Confirming batch payment on Arc...");

        const batchReceipt = await waitForTransactionReceipt(config, {
          hash: batchHash,
          chainId: ARC_CHAIN_ID,
        });

        if (batchReceipt.status !== "success") {
          throw new Error("Batch payment transaction failed or reverted on Arc Testnet.");
        }

        console.log("[BROADCAST] batch confirmed!");

        // Final Success
        setStep("SUCCESS");
        setStatusText("Payment Sent");
        showToast({
          title: "Payment Sent!",
          message: `Disbursed ${totalFormatted} USDC to ${validRecipients.length} recipients on Arc Testnet.`,
          type: "success",
        });
      } catch (err: unknown) {
        console.error("[BROADCAST Error]:", err);
        const rawMessage = (err as Error)?.message || "";
        const isUserRejected =
          rawMessage.includes("rejected") ||
          rawMessage.includes("denied") ||
          rawMessage.includes("User rejected") ||
          rawMessage.includes("User denied");

        if (isUserRejected) {
          console.log("[BROADCAST] User cancelled transaction in wallet.");
          setStep("CANCELLED");
          setError("Transaction cancelled");
          setStatusText("Transaction cancelled");
          showToast({
            title: "Cancelled",
            message: "Transaction cancelled in wallet.",
            type: "warning",
          });
        } else {
          setStep("ERROR");
          const friendlyMsg = parseWalletErrorMessage(err);
          setError(friendlyMsg);
          setStatusText("Transaction Failed");
          showToast({
            title: "Payment Error",
            message: friendlyMsg,
            type: "error",
          });
        }
      }
    },
    [address, isConnected, chainId, config, writeContractAsync]
  );

  const isProcessing = useMemo(() => {
    return (
      step === "VALIDATING" ||
      step === "CHECKING_BALANCE" ||
      step === "CHECKING_ALLOWANCE" ||
      step === "AWAITING_APPROVAL_WALLET" ||
      step === "APPROVAL_SUBMITTED" ||
      step === "WAITING_APPROVAL_CONFIRMATION" ||
      step === "AWAITING_BATCH_WALLET" ||
      step === "BATCH_SUBMITTED" ||
      step === "WAITING_BATCH_CONFIRMATION"
    );
  }, [step]);

  return {
    step,
    statusText,
    isProcessing,
    approvalTxHash,
    batchTxHash,
    error,
    lastPaymentSummary,
    executeBroadcastPayment,
    resetPaymentState,
    arcScanBaseUrl: ARC_TESTNET.explorerUrl,
  };
}
