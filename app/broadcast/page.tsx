"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { TokenSelector } from "@/components/common/TokenSelector";
import { RecipientTable } from "@/components/broadcast/RecipientTable";
import { CSVUploadModal } from "@/components/broadcast/CSVUploadModal";
import { TransactionSummary } from "@/components/broadcast/TransactionSummary";
import { BroadcastPreviewModal } from "@/components/broadcast/BroadcastPreviewModal";
import { BroadcastExecutionModal } from "@/components/broadcast/BroadcastExecutionModal";
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { useBroadcast } from "@/hooks/useBroadcast";
import { useArcWallet } from "@/hooks/useArcWallet";
import { useBroadcastPayment } from "@/hooks/useBroadcastPayment";
import { CONTRACTS } from "@/config/contracts";
import { showToast } from "@/hooks/useToast";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BroadcastPage() {
  const {
    isConnected,
    isWrongNetwork,
    balanceUSDC,
    isBalanceError,
  } = useArcWallet();

  const numBalance = isConnected && !isWrongNetwork && !isBalanceError ? parseFloat(balanceUSDC) || 0 : 0;

  const {
    selectedToken,
    setSelectedToken,
    recipients,
    addRecipient,
    removeRecipient,
    updateRecipient,
    setRecipientsBulk,
    clearRecipients,
    validation,
    isCsvModalOpen,
    setIsCsvModalOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    canSubmit,
  } = useBroadcast(numBalance);

  const {
    step: paymentStep,
    statusText,
    isProcessing,
    approvalTxHash,
    batchTxHash,
    error: paymentError,
    executeBroadcastPayment,
    resetPaymentState,
  } = useBroadcastPayment();

  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);

  const handleOpenPreview = () => {
    if (!isConnected) {
      showToast({
        title: "Connect wallet",
        message: "Connect your wallet to continue.",
        type: "warning",
      });
      return;
    }
    if (isWrongNetwork) {
      showToast({
        title: "Wrong network",
        message: "Please switch to Arc Testnet.",
        type: "warning",
      });
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleStartRealBroadcast = async () => {
    setIsPreviewOpen(false);
    setIsExecutionModalOpen(true);
    await executeBroadcastPayment(
      recipients,
      CONTRACTS.arcTestnet.usdc,
      CONTRACTS.arcTestnet.batchPayment
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Page Header */}
      <PageHeader
        title="Broadcast Payment"
        subtitle="Send USDC to multiple wallets in one transaction."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCsvModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="h-11 px-4 text-sm font-semibold"
          >
            Import CSV
          </Button>
        }
      />

      <WalletStatus />

      {/* 60% / 40% Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form & Recipient Table (Col 7 - approx 60%) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Currency selection & Balance bar */}
          <GlassCard variant="default" className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1.5">
                  Token
                </span>
                <TokenSelector
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              </div>

              <div className="text-right text-sm">
                <span className="text-gray-500 block text-xs sm:text-sm">Available balance</span>
                <span className="font-mono font-semibold text-gray-900 text-sm sm:text-base mt-0.5 block">
                  {!isConnected ? "Not connected" : `${balanceUSDC} USDC`}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Recipient Table */}
          <GlassCard variant="default" className="p-5 sm:p-6">
            <RecipientTable
              recipients={recipients}
              tokenSymbol={selectedToken.symbol}
              duplicateAddresses={validation.duplicateAddresses}
              onAddRecipient={addRecipient}
              onRemoveRecipient={removeRecipient}
              onUpdateRecipient={updateRecipient}
              onOpenCsvModal={() => setIsCsvModalOpen(true)}
              onClearAll={clearRecipients}
            />
          </GlassCard>
        </div>

        {/* Right Column: Payment Summary (Col 5 - approx 40%) */}
        <div className="lg:col-span-5 sticky top-20">
          <TransactionSummary
            token={selectedToken}
            validation={validation}
            canSubmit={canSubmit && isConnected && !isWrongNetwork}
            onPreviewOrSend={handleOpenPreview}
            isProcessing={isProcessing}
            paymentStep={paymentStep}
          />
        </div>
      </div>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImport={(imported) => {
          setRecipientsBulk(imported);
          showToast({
            title: "CSV imported",
            message: `Imported ${imported.length} recipients.`,
            type: "success",
          });
        }}
      />

      {/* Preview Modal */}
      <BroadcastPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        token={selectedToken}
        recipients={recipients}
        validation={validation}
        onConfirmBroadcast={handleStartRealBroadcast}
        isBroadcasting={isProcessing}
      />

      {/* Execution Status Modal */}
      <BroadcastExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => {
          setIsExecutionModalOpen(false);
          if (paymentStep === "SUCCESS") {
            clearRecipients();
            resetPaymentState();
          }
        }}
        step={paymentStep}
        statusText={statusText}
        approvalTxHash={approvalTxHash}
        batchTxHash={batchTxHash}
        error={paymentError}
        recipientCount={validation.recipientCount}
        totalAmount={validation.totalAmount.toString()}
        tokenSymbol={selectedToken.symbol}
        onRetry={handleStartRealBroadcast}
      />
    </div>
  );
}
