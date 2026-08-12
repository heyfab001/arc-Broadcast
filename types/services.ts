import { Token, TokenBalance } from "./token";
import { Recipient, BroadcastPayment, SecretPayment, Claim } from "./payment";
import { NetworkConfig } from "./wallet";

export interface IBlockchainService {
  connectWallet(): Promise<{ address: string; chainId: number }>;
  disconnectWallet(): Promise<void>;
  switchNetwork(targetChainId: number): Promise<void>;
  getBalance(account: string, token: Token): Promise<TokenBalance>;
  estimateBroadcastGas(token: Token, recipients: Recipient[]): Promise<string>;
}

export interface IBroadcastService {
  executeBatchPayment(
    token: Token,
    recipients: Recipient[],
    options?: { onProgress?: (step: string) => void }
  ): Promise<{ txHash: string; status: string }>;
  validateBatch(
    recipients: Recipient[],
    senderBalance: string
  ): {
    isValid: boolean;
    totalAmount: string;
    errors: string[];
  };
}

export interface ISecretPayService {
  createSecretDeposit(
    token: Token,
    amount: string,
    expiryDays: number,
    message?: string
  ): Promise<{ claimId: string; secretKey: string; txHash: string }>;
  fetchClaimDetails(claimId: string): Promise<Claim | null>;
  claimSecretPayment(
    claimId: string,
    secretKey: string,
    recipientAddress: string
  ): Promise<{ txHash: string; success: boolean }>;
}
