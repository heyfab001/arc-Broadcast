import { Recipient } from "@/types/payment";
import { isValidEthereumAddress, isValidAmount } from "./validation";
import { generateUUID } from "./utils";
import { MAX_RECIPIENTS } from "@/config/constants";

export interface CSVParsingResult {
  recipients: Recipient[];
  errors: string[];
  totalParsed: number;
  validCount: number;
}

export function parseRecipientCSV(csvContent: string): CSVParsingResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const errors: string[] = [];
  const recipients: Recipient[] = [];

  if (lines.length === 0) {
    return {
      recipients: [],
      errors: ["The uploaded file is empty."],
      totalParsed: 0,
      validCount: 0,
    };
  }

  // Detect header line
  let startIndex = 0;
  const firstLine = lines[0].toLowerCase();
  if (
    firstLine.includes("address") ||
    firstLine.includes("wallet") ||
    firstLine.includes("amount") ||
    firstLine.includes("recipient")
  ) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    if (recipients.length >= MAX_RECIPIENTS) {
      errors.push(`Stopped parsing at row ${i + 1}: Exceeded limit of ${MAX_RECIPIENTS} recipients.`);
      break;
    }

    const row = lines[i];
    // Split by comma, semicolon, or tab
    const parts = row.split(/[,;\t]/).map((p) => p.trim().replace(/^["']|["']$/g, ""));

    if (parts.length < 2) {
      errors.push(`Row ${i + 1}: Invalid format. Expected 'address,amount'. Found: "${row}"`);
      continue;
    }

    const [address, amount] = parts;
    const isValidAddr = isValidEthereumAddress(address);
    const isValidAmt = isValidAmount(amount);

    recipients.push({
      id: generateUUID(),
      address: address || "",
      amount: amount || "",
      isValidAddress: isValidAddr,
      isValidAmount: isValidAmt,
      errorMessage: !isValidAddr
        ? "Invalid EVM address"
        : !isValidAmt
        ? "Invalid amount"
        : undefined,
    });
  }

  const validCount = recipients.filter((r) => r.isValidAddress && r.isValidAmount).length;

  return {
    recipients,
    errors,
    totalParsed: recipients.length,
    validCount,
  };
}

export function generateSampleCSV(): string {
  return `address,amount
0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7,10.5
0x3B82F62563EB1D4ED81E40AF1E3A8A00F5D48B5C,25.0
0x2563EB1D4ED81E40AF1E3A8A00F5D48B5C3B82F6,5.25`;
}
