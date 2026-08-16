"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { parseRecipientCSV, generateSampleCSV } from "@/lib/csv";
import { Recipient } from "@/types/payment";
import { Upload, Download, CheckCircle2 } from "lucide-react";

export interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (recipients: Recipient[]) => void;
}

export function CSVUploadModal({
  isOpen,
  onClose,
  onImport,
}: CSVUploadModalProps) {
  const [csvText, setCsvText] = useState("");
  const [parsedInfo, setParsedInfo] = useState<{
    count: number;
    validCount: number;
    errors: string[];
    recipients: Recipient[];
  } | null>(null);

  const handleParse = (textToParse: string) => {
    const result = parseRecipientCSV(textToParse);
    setParsedInfo({
      count: result.totalParsed,
      validCount: result.validCount,
      errors: result.errors,
      recipients: result.recipients,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const sample = generateSampleCSV();
    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "arc_broadcast_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (!parsedInfo || parsedInfo.recipients.length === 0) return;
    onImport(parsedInfo.recipients);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import CSV"
      description="Add up to 100 wallet addresses and amounts."
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* File Drop */}
        <label className="flex flex-col items-center justify-center p-5 border border-dashed border-white/15 hover:border-white/30 rounded-xl bg-[#0C0D12] cursor-pointer transition-colors">
          <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
          <span className="text-sm sm:text-base font-medium text-white">
            Choose CSV file or drag and drop
          </span>
          <span className="text-xs sm:text-sm text-slate-400 mt-1">
            Format: address,amount
          </span>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Paste Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <label className="text-slate-300 font-medium">Or paste text:</label>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              handleParse(e.target.value);
            }}
            placeholder={"0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7,10.5\n0x3B82F62563EB1D4ED81E40AF1E3A8A00F5D48B5C,25.0"}
            className="w-full bg-[#0C0D12] border border-white/15 rounded-lg p-3 text-sm font-mono text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Parsed Summary */}
        {parsedInfo && parsedInfo.count > 0 && (
          <div className="p-3.5 rounded-lg bg-[#0C0D12] border border-white/[0.06] space-y-1.5 text-sm">
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Found {parsedInfo.validCount} valid {parsedInfo.validCount === 1 ? "recipient" : "recipients"}
            </span>
            {parsedInfo.errors.length > 0 && (
              <div className="space-y-1 pt-1.5 border-t border-white/[0.04]">
                {parsedInfo.errors.slice(0, 3).map((err, i) => (
                  <p key={i} className="text-xs text-amber-400">
                    {err}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-11 text-sm font-medium">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmImport}
            disabled={!parsedInfo || parsedInfo.recipients.length === 0}
            className="h-11 px-5 text-sm font-semibold"
          >
            Import {parsedInfo?.validCount ? `(${parsedInfo.validCount})` : ""}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
