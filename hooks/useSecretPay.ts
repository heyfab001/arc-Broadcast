"use client";

import { useState, useMemo } from "react";
import { Token } from "@/types/token";
import { DEFAULT_TOKEN } from "@/config/tokens";
import { CLAIM_EXPIRY_OPTIONS } from "@/config/constants";
import { isValidAmount } from "@/lib/validation";

export function useSecretPay(userBalance = 2500) {
  const [selectedToken, setSelectedToken] = useState<Token>(DEFAULT_TOKEN);
  const [amount, setAmount] = useState<string>("");
  const [expiryDays, setExpiryDays] = useState<number>(CLAIM_EXPIRY_OPTIONS[2].value); // Default 7 days
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdClaim, setCreatedClaim] = useState<{
    claimId: string;
    secretKey: string;
    amount: string;
    token: Token;
    expiryDate: string;
    claimUrl: string;
  } | null>(null);

  const numAmount = parseFloat(amount || "0");
  const isAmountValid = isValidAmount(amount);
  const isBalanceSufficient = isAmountValid && numAmount <= userBalance;

  const error = useMemo(() => {
    if (!amount) return null;
    if (!isAmountValid) return "Please enter a valid positive token amount.";
    if (!isBalanceSufficient) return `Insufficient balance. Available: ${userBalance} ${selectedToken.symbol}`;
    return null;
  }, [amount, isAmountValid, isBalanceSufficient, userBalance, selectedToken.symbol]);

  const canCreate = isAmountValid && isBalanceSufficient && !isSubmitting;

  const resetForm = () => {
    setAmount("");
    setMessage("");
    setCreatedClaim(null);
  };

  return {
    selectedToken,
    setSelectedToken,
    amount,
    setAmount,
    expiryDays,
    setExpiryDays,
    message,
    setMessage,
    isSubmitting,
    setIsSubmitting,
    createdClaim,
    setCreatedClaim,
    error,
    canCreate,
    resetForm,
  };
}
