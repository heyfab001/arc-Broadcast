export const MAX_RECIPIENTS = 100;
export const MIN_RECIPIENTS = 1;

export const APP_NAME = "Arc Broadcast Payment";
export const APP_DESCRIPTION = "Batch payments and private claims on Arc.";

// Emergency Security Freeze: Active during audits (Currently Unfrozen)
export const TRANSACTIONS_FROZEN = false;
export const TRANSACTIONS_FROZEN_MESSAGE = "Transactions are currently paused for security audit. Wallet connection is read-only.";

export const CLAIM_EXPIRY_OPTIONS = [
  { label: "1 Hour", value: 1 / 24 },
  { label: "24 Hours", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
];

export const DEMO_WALLET_ADDRESS = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
