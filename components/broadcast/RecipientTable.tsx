"use client";

import React from "react";
import { Recipient } from "@/types/payment";
import { RecipientRow } from "./RecipientRow";
import { Button } from "@/components/ui/Button";
import { Plus, Upload, Users, Inbox } from "lucide-react";
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
    <div className="space-y-4">
      {/* Table Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Recipients</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/[0.05] border border-white/[0.08] text-slate-300">
              {recipients.length} / {MAX_RECIPIENTS}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Add up to 100 wallet addresses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenCsvModal}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Import CSV
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAddRecipient}
            disabled={isMaxReached}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add recipient
          </Button>

          {recipients.length > 1 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 gap-2.5 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-7">Wallet</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-1 text-center">Remove</div>
      </div>

      {/* Rows Container */}
      {recipients.length === 0 ? (
        <div className="py-10 text-center space-y-2 border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01]">
          <Inbox className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="text-xs font-medium text-white">No recipients added</p>
          <p className="text-[11px] text-slate-400">Add a wallet address to get started.</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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

      {/* Quick Add Button */}
      <button
        type="button"
        onClick={onAddRecipient}
        disabled={isMaxReached}
        className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.1] hover:border-arc-500/40 bg-white/[0.01] hover:bg-arc-500/[0.04] text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5 text-arc-400" />
        <span>Add recipient ({recipients.length}/{MAX_RECIPIENTS})</span>
      </button>
    </div>
  );
}
