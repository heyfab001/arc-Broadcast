"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SecretPayForm } from "@/components/secret-pay/SecretPayForm";
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { useSecretPay } from "@/hooks/useSecretPay";
import { useArcWallet } from "@/hooks/useArcWallet";

export default function SecretPayPage() {
  const { isConnected, isWrongNetwork, balanceUSDC, isBalanceError } = useArcWallet();
  const numBalance = isConnected && !isWrongNetwork && !isBalanceError ? parseFloat(balanceUSDC) || 0 : 0;

  const {
    selectedToken,
    setSelectedToken,
    amount,
    setAmount,
    expiryDays,
    setExpiryDays,
    message,
    setMessage,
    error,
    canCreate,
  } = useSecretPay(numBalance);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <PageHeader
        title="Secret Pay"
        subtitle="Send USDC using a private claim link."
      />

      <WalletStatus />

      {/* Main Creation Form */}
      <SecretPayForm
        selectedToken={selectedToken}
        onSelectToken={setSelectedToken}
        amount={amount}
        onChangeAmount={setAmount}
        expiryDays={expiryDays}
        onChangeExpiry={setExpiryDays}
        message={message}
        onChangeMessage={setMessage}
        error={error}
        canCreate={canCreate && isConnected && !isWrongNetwork}
        userBalance={numBalance}
      />
    </div>
  );
}
