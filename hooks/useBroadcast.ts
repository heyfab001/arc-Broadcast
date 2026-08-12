"use client";

import { useState, useCallback, useMemo } from "react";
import { Recipient } from "@/types/payment";
import { Token } from "@/types/token";
import { DEFAULT_TOKEN } from "@/config/tokens";
import { MAX_RECIPIENTS } from "@/config/constants";
import { generateUUID } from "@/lib/utils";
import { validateRecipientList, BatchValidationResult } from "@/lib/validation";

const createEmptyRecipient = (): Recipient => ({
  id: generateUUID(),
  address: "",
  amount: "",
  isValidAddress: true,
  isValidAmount: true,
});

export function useBroadcast(initialBalance = 2500) {
  const [selectedToken, setSelectedToken] = useState<Token>(DEFAULT_TOKEN);
  const [recipients, setRecipients] = useState<Recipient[]>([
    createEmptyRecipient(),
  ]);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const addRecipient = useCallback(() => {
    if (recipients.length >= MAX_RECIPIENTS) return;
    setRecipients((prev) => [...prev, createEmptyRecipient()]);
  }, [recipients.length]);

  const removeRecipient = useCallback((id: string) => {
    setRecipients((prev) => {
      if (prev.length <= 1) {
        return [createEmptyRecipient()];
      }
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const updateRecipient = useCallback(
    (id: string, field: "address" | "amount", value: string) => {
      setRecipients((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          return {
            ...r,
            [field]: value,
          };
        })
      );
    },
    []
  );

  const setRecipientsBulk = useCallback((newRecipients: Recipient[]) => {
    if (newRecipients.length === 0) {
      setRecipients([createEmptyRecipient()]);
    } else {
      setRecipients(newRecipients.slice(0, MAX_RECIPIENTS));
    }
  }, []);

  const clearRecipients = useCallback(() => {
    setRecipients([createEmptyRecipient()]);
  }, []);

  const validation: BatchValidationResult = useMemo(() => {
    return validateRecipientList(recipients, initialBalance);
  }, [recipients, initialBalance]);

  const isFormFilled = useMemo(() => {
    return (
      recipients.length > 0 &&
      recipients.some((r) => r.address.trim() !== "" || r.amount.trim() !== "")
    );
  }, [recipients]);

  const canSubmit = useMemo(() => {
    return validation.isValid && isFormFilled && recipients.length <= MAX_RECIPIENTS;
  }, [validation.isValid, isFormFilled, recipients.length]);

  return {
    selectedToken,
    setSelectedToken,
    recipients,
    addRecipient,
    removeRecipient,
    updateRecipient,
    setRecipientsBulk,
    clearRecipients,
    validation,
    isCsvModalOpen,
    setIsCsvModalOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    canSubmit,
    maxRecipients: MAX_RECIPIENTS,
  };
}
