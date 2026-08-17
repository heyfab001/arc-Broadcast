"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
  timestamp?: number;
}

// Global listeners for simple reactive toasts across components
type Listener = (toasts: ToastItem[]) => void;
let currentToasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...currentToasts]));
}

export function showToast(toast: Omit<ToastItem, "id">) {
  const now = Date.now();

  // Deduplicate identical toasts within a 3-second window
  const isDuplicate = currentToasts.some(
    (t) =>
      t.title === toast.title &&
      t.message === toast.message &&
      now - (t.timestamp || 0) < 3000
  );

  if (isDuplicate) {
    return;
  }

  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastItem = { ...toast, id, timestamp: now };

  // Keep max 3 toasts on screen
  if (currentToasts.length >= 3) {
    currentToasts = [...currentToasts.slice(1), newToast];
  } else {
    currentToasts = [...currentToasts, newToast];
  }

  notify();

  const duration = toast.duration ?? 4000;
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
}

export function dismissToast(id: string) {
  currentToasts = currentToasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(currentToasts);

  const subscribe = useCallback(() => {
    const listener: Listener = (updated) => setToasts(updated);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    toasts,
    subscribe,
    show: showToast,
    dismiss: dismissToast,
    success: (title: string, message?: string) => showToast({ title, message, type: "success" }),
    error: (title: string, message?: string) => showToast({ title, message, type: "error" }),
    info: (title: string, message?: string) => showToast({ title, message, type: "info" }),
    warning: (title: string, message?: string) => showToast({ title, message, type: "warning" }),
  };
}
