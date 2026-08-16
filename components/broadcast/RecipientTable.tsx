"use client";

import React, { useState } from "react";
import { Recipient } from "@/types/payment";
import { RecipientRow } from "./RecipientRow";
import { Button } from "@/components/ui/Button";
import { Plus, Upload } from "lucide-react";
import { MAX_RECIPIENTS } from "@/config/constants";

export interface RecipientTableProps {
  recipients: Recipient[];
  tokenSymbol: string;
  duplicateAddresses: string[];
  onAddRecipient: () => void;
  onRemoveRecipient: (id: string) => void;
  onUpdateRecipient: (id: string, field: "address" | "amount", value: string) => void;
  onOpenCsvModal: () => void;
  onClearAll: () => void;
}

export function RecipientTable({
  recipients,
  tokenSymbol,
  duplicateAddresses,
  onAddRecipient,
  onRemoveRecipient,
  onUpdateRecipient,
  onOpenCsvModal,
  onClearAll,
}: RecipientTableProps) {
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const isMaxReached = recipients.length >= MAX_RECIPIENTS;

  const handleAdd = () => {
    onAddRecipient();
    // Mark next added item to autofocus
    setTimeout(() => {
      if (recipients.length > 0) {
        setNewlyAddedId(recipients[recipients.length - 1].id);
      }
    }, 50);
  };

  return (
    <div className="space-y-3.5">
      {/* Step Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="text-xs font-semibold text-white">
            1. Who are you sending to?
          </h3>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {recipients.length} / {MAX_RECIPIENTS} recipients
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenCsvModal}
            leftIcon={<Upload className="w-3 h-3" />}
          >
            Import CSV
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAdd}
            disabled={isMaxReached}
            leftIcon={<Plus className="w-3 h-3" />}
          >
            + Add wallet
          </Button>

          {recipients.length > 1 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-red-400 px-1.5 py-1 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-7">Wallet address</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-1 text-center">Action</div>
      </div>

      {/* Rows */}
      {recipients.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-lg">
          <p className="text-xs text-slate-400">No recipients added.</p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-0.5">
          {recipients.map((recipient, index) => {
            const isDup = duplicateAddresses.includes(recipient.address.trim().toLowerCase());
            return (
              <RecipientRow
                key={recipient.id}
                index={index}
                recipient={recipient}
                tokenSymbol={tokenSymbol}
                isDuplicate={isDup}
                onUpdate={onUpdateRecipient}
                onRemove={onRemoveRecipient}
                isRemovable={recipients.length > 1}
                autoFocus={recipient.id === newlyAddedId || index === recipients.length - 1 && newlyAddedId !== null}
              />
            );
          })}
        </div>
      )}

      {/* Quick Add Button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={isMaxReached}
        className="w-full py-2.5 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>+ Add wallet</span>
      </button>
    </div>
  );
}
