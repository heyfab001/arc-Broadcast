import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address?: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatAmount(amount: string | number, decimals = 4): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0.00";
  if (num === 0) return "0.00";
  if (num < 0.0001) return "<0.0001";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSmartTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  if (isToday) {
    return `Today · ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday · ${timeStr}`;
  }

  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  return `${dateStr} · ${timeStr}`;
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
