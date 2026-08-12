import { Recipient } from "@/types/payment";
import { MAX_RECIPIENTS } from "@/config/constants";

/**
 * Validates basic EVM hex address format (0x + 40 hex characters)
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

/**
 * Validates a positive numeric amount
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || amount.trim() === "") return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
}

export interface BatchValidationResult {
  isValid: boolean;
  totalAmount: number;
  recipientCount: number;
  errors: string[];
  duplicateAddresses: string[];
  invalidAddressCount: number;
  invalidAmountCount: number;
}

export function validateRecipientList(
  recipients: Recipient[],
  userBalance?: number
): BatchValidationResult {
  const errors: string[] = [];
  const addressCounts = new Map<string, number>();
  const duplicateAddresses: string[] = [];
  let totalAmount = 0;
  let invalidAddressCount = 0;
  let invalidAmountCount = 0;

  if (!recipients || recipients.length === 0) {
    return {
      isValid: false,
      totalAmount: 0,
      recipientCount: 0,
      errors: ["Please add at least one recipient."],
      duplicateAddresses: [],
      invalidAddressCount: 0,
      invalidAmountCount: 0,
    };
  }

  if (recipients.length > MAX_RECIPIENTS) {
    errors.push(`Maximum allowed recipients is ${MAX_RECIPIENTS}. Currently have ${recipients.length}.`);
  }

  recipients.forEach((r, index) => {
    const trimmedAddr = r.address.trim().toLowerCase();
    
    // Check address validity
    if (!trimmedAddr) {
      invalidAddressCount++;
    } else if (!isValidEthereumAddress(trimmedAddr)) {
      invalidAddressCount++;
    } else {
      // Track duplicate
      const currentCount = addressCounts.get(trimmedAddr) || 0;
      if (currentCount === 1) {
        duplicateAddresses.push(r.address.trim());
      }
      addressCounts.set(trimmedAddr, currentCount + 1);
    }

    // Check amount validity
    if (!isValidAmount(r.amount)) {
      invalidAmountCount++;
    } else {
      totalAmount += parseFloat(r.amount);
    }
  });

  if (invalidAddressCount > 0) {
    errors.push(`${invalidAddressCount} recipient address${invalidAddressCount > 1 ? "es are" : " is"} invalid or empty.`);
  }

  if (invalidAmountCount > 0) {
    errors.push(`${invalidAmountCount} recipient amount${invalidAmountCount > 1 ? "s are" : " is"} invalid or zero.`);
  }

  if (duplicateAddresses.length > 0) {
    errors.push(`Duplicate recipient addresses detected: ${duplicateAddresses.slice(0, 2).join(", ")}${duplicateAddresses.length > 2 ? ` and ${duplicateAddresses.length - 2} more` : ""}.`);
  }

  if (userBalance !== undefined && totalAmount > userBalance) {
    errors.push(`Insufficient balance. Required: ${totalAmount.toFixed(4)}, Available: ${userBalance.toFixed(4)}.`);
  }

  return {
    isValid: errors.length === 0,
    totalAmount,
    recipientCount: recipients.length,
    errors,
    duplicateAddresses,
    invalidAddressCount,
    invalidAmountCount,
  };
}
