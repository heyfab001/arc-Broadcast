"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { parseRecipientCSV, generateSampleCSV } from "@/lib/csv";
import { Recipient } from "@/types/payment";
import { Upload, FileText, Download, CheckCircle2, AlertCircle } from "lucide-react";

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
      title="Upload Recipient CSV"
      description="Import up to 100 wallet addresses and token amounts in one batch."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {/* File Drop Area */}
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.1] hover:border-arc-500/40 rounded-2xl bg-white/[0.01] hover:bg-arc-500/[0.02] cursor-pointer transition-all">
          <div className="w-12 h-12 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400 mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-white">
            Choose CSV file or drag & drop
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Format: address,amount (Max 100 rows)
          </span>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Or Paste Raw Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Or paste CSV text directly:
            </label>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-xs text-arc-400 hover:text-arc-300 flex items-center gap-1 hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              Download Sample CSV
            </button>
          </div>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              handleParse(e.target.value);
            }}
            placeholder={"0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7,10.5\n0x3B82F62563EB1D4ED81E40AF1E3A8A00F5D48B5C,25.0"}
            className="w-full bg-[#090C16] border border-white/[0.08] rounded-xl p-3 text-xs font-mono text-white placeholder-slate-600 outline-none focus:border-arc-500 focus:ring-1 focus:ring-arc-500/30"
          />
        </div>

        {/* Parsing Summary Alert */}
        {parsedInfo && parsedInfo.count > 0 && (
          <div className="p-3.5 rounded-xl bg-[#0C1220] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Parsed {parsedInfo.count} rows ({parsedInfo.validCount} valid)
              </span>
            </div>
            {parsedInfo.errors.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                {parsedInfo.errors.slice(0, 3).map((err, i) => (
                  <p key={i} className="text-[11px] text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {err}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmImport}
            disabled={!parsedInfo || parsedInfo.recipients.length === 0}
          >
            Import {parsedInfo?.validCount ? `${parsedInfo.validCount} Recipients` : "Recipients"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
