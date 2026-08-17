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
    if (recipients.length > 0) {
      setNewlyAddedId(recipients[recipients.length - 1].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            1. Who are you sending to?
          </h3>
          <span className="text-sm text-gray-500 mt-0.5 block font-medium">
            {recipients.length} / {MAX_RECIPIENTS} recipients
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenCsvModal}
            leftIcon={<Upload className="w-4 h-4" />}
            className="h-10 text-sm font-semibold"
          >
            Import CSV
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAdd}
            disabled={isMaxReached}
            leftIcon={<Plus className="w-4 h-4" />}
            className="h-10 text-sm font-semibold"
          >
            + Add wallet
          </Button>

          {recipients.length > 1 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm font-medium text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 gap-2.5 px-1 text-sm font-semibold text-gray-600 uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-7">Wallet address</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-1 text-center">Action</div>
      </div>

      {/* Rows */}
      {recipients.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <p className="text-base text-gray-500">No recipients added.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
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
                autoFocus={recipient.id === newlyAddedId || (index === recipients.length - 1 && newlyAddedId !== null)}
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
        className="w-full h-12 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 text-base font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span>+ Add wallet</span>
      </button>
    </div>
  );
}
