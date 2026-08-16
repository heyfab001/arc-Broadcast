"use client";

import React from "react";
import { Tabs, TabOption } from "@/components/ui/Tabs";
import { HistoryTab } from "@/hooks/usePaymentHistory";
import { Layers, Send, KeyRound, Sparkles } from "lucide-react";

export interface HistoryFilterTabsProps {
  activeTab: HistoryTab;
  onChangeTab: (tab: HistoryTab) => void;
}

export function HistoryFilterTabs({
  activeTab,
  onChangeTab,
}: HistoryFilterTabsProps) {
  const tabs: TabOption<HistoryTab>[] = [
    {
      id: "all",
      label: "All",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "broadcast",
      label: "Broadcast",
      icon: <Send className="w-3.5 h-3.5" />,
    },
    {
      id: "secret_pay",
      label: "Secret Pay",
      icon: <KeyRound className="w-3.5 h-3.5" />,
    },
    {
      id: "claim",
      label: "Claims",
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
  ];

  return <Tabs tabs={tabs} activeTab={activeTab} onChange={onChangeTab} />;
}
