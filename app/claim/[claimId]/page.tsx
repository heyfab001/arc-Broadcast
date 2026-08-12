"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ClaimCard } from "@/components/claim/ClaimCard";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function ClaimPage() {
  const params = useParams();
  const claimId = (params?.claimId as string) || "demo-claim-id";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-6 animate-fade-in">
      {/* Back to Home Link */}
      <div className="w-full max-w-lg mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Arc Broadcast Dashboard</span>
        </Link>
      </div>

      {/* Main Claim Card */}
      <ClaimCard claimId={claimId} />
    </div>
  );
}
