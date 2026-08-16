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
import { Wallet, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BroadcastPage() {
  const {
    isConnected,
    isWrongNetwork,
    balanceUSDC,
    isBalanceLoading,
    isBalanceError,
    refetchBalance,
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
        title: "Connect Wallet",
        message: "Connect your wallet to continue.",
        type: "warning",
      });
      return;
    }
    if (isWrongNetwork) {
      showToast({
        title: "Switch to Arc Testnet",
        message: "Please switch your wallet to Arc Testnet.",
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Broadcast Payment"
        subtitle="Send tokens to multiple wallets in one transaction."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCsvModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Import CSV
          </Button>
        }
      />

      {/* Wallet / Network Status Callout if disconnected or wrong network */}
      <WalletStatus />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Form & Table (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Token & Balance Card */}
          <GlassCard variant="default" className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Token
                </label>
                <TokenSelector
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              </div>

              {/* Sender Balance */}
              <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 block">Balance</span>
                    {isConnected && (
                      <button
                        onClick={() => refetchBalance()}
                        className="text-slate-500 hover:text-slate-300"
                        title="Refresh balance"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 ${isBalanceLoading ? "animate-spin" : ""}`} />
                      </button>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    {!isConnected ? (
                      "Connect Wallet"
                    ) : isWrongNetwork ? (
                      <span className="text-amber-400">Switch to Arc</span>
                    ) : isBalanceError ? (
                      <span className="text-amber-400">Unable to load</span>
                    ) : (
                      `${balanceUSDC} ${selectedToken.symbol}`
                    )}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Recipient Table Card */}
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

        {/* Right Column: Transaction Summary (Col 4) */}
        <div className="lg:col-span-4 sticky top-24">
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
            title: "CSV Imported",
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
