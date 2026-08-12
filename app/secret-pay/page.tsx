"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SecretPayForm } from "@/components/secret-pay/SecretPayForm";
import { WorkflowStepper } from "@/components/secret-pay/WorkflowStepper";
import { SecurityNotice } from "@/components/secret-pay/SecurityNotice";
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
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Secret Pay"
        subtitle="Send tokens privately with a claim link."
        badge="Zero-Knowledge Escrow"
      />

      {/* Wallet Status Banner */}
      <WalletStatus actionLabel="create private secret payments" />

      {/* Main Creation Form */}
      <div className="space-y-6">
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

        {/* Security & Cryptography Guarantee */}
        <SecurityNotice />
      </div>

      {/* Visual Workflow Steps */}
      <div className="pt-4">
        <WorkflowStepper />
      </div>
    </div>
  );
}
