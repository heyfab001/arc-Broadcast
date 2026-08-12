import React from "react";
import { cn } from "@/lib/utils";

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 p-1 bg-[#090C15] border border-white/[0.08] rounded-xl overflow-x-auto scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
              isActive
                ? "bg-gradient-to-r from-arc-600 to-arc-violet text-white shadow-md shadow-arc-600/20"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded text-[10px] font-mono",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-slate-400"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
