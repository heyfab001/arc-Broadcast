import { Token } from "./token";

export type PaymentStatus =
  | "pending"
  | "submitted"
  | "confirmed"
  | "failed"
  | "claimed"
  | "expired"
  | "available"
  | "refunded"
  | "cancelled";

export type PaymentType = "broadcast" | "secret_pay" | "claim" | "refund";

export interface Recipient {
  id: string;
  address: string;
  amount: string;
  isValidAddress?: boolean;
  isValidAmount?: boolean;
  errorMessage?: string;
}

export interface BroadcastPayment {
  id: string;
  token: Token;
  sender: string;
  recipients: Recipient[];
  totalAmount: string;
  status: PaymentStatus;
  timestamp: number;
  txHash?: string;
  networkId: number;
}

export interface SecretPayment {
  id: string;
  token: Token;
  sender: string;
  amount: string;
  expiryTimestamp: number;
  message?: string;
  status: PaymentStatus;
  timestamp: number;
  claimId: string;
  commitmentHash?: string;
  txHash?: string;
  networkId: number;
}

export interface Claim {
  claimId: string;
  paymentId: string;
  token: Token;
  amount: string;
  sender: string;
  recipient?: string;
  expiryTimestamp: number;
  status: "available" | "claimed" | "expired";
  createdAt: number;
  claimedAt?: number;
  claimTxHash?: string;
  message?: string;
}

export interface Transaction {
  id: string;
  type: PaymentType;
  status: PaymentStatus;
  token: Token;
  amount: string;
  recipientCount?: number;
  targetAddress?: string;
  senderAddress?: string;
  timestamp: number;
  txHash?: string;
  claimId?: string;
  batchId?: string;
  blockNumber?: bigint;
  expiryTimestamp?: number;
}
