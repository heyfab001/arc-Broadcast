"use client";

import React from "react";
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
  const isMaxReached = recipients.length >= MAX_RECIPIENTS;

  return (
    <div className="space-y-3">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
        <div>
          <h3 className="text-xs font-semibold text-white">Recipients</h3>
          <span className="text-[11px] text-slate-400">
            Up to 100 recipients ({recipients.length}/{MAX_RECIPIENTS})
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
            onClick={onAddRecipient}
            disabled={isMaxReached}
            leftIcon={<Plus className="w-3 h-3" />}
          >
            Add recipient
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

      {/* Table Column Headers */}
      <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-7">Wallet</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-1 text-center">Action</div>
      </div>

      {/* Rows */}
      {recipients.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-lg">
          <p className="text-xs text-slate-400">No recipients added.</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[480px] overflow-y-auto pr-0.5">
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
              />
            );
          })}
        </div>
      )}

      {/* Quick Add Row Button */}
      <button
        type="button"
        onClick={onAddRecipient}
        disabled={isMaxReached}
        className="w-full py-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-3 h-3" />
        <span>Add recipient</span>
      </button>
    </div>
  );
}
