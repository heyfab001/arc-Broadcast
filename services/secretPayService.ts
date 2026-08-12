import { ISecretPayService } from "@/types/services";
import { Token } from "@/types/token";
import { Claim } from "@/types/payment";

export class SecretPayService implements ISecretPayService {
  async createSecretDeposit(
    token: Token,
    amount: string,
    expiryDays: number,
    message?: string
  ): Promise<{ claimId: string; secretKey: string; txHash: string }> {
    // In production, this will generate a client-side random preimage 'secretKey',
    // compute commitmentHash = keccak256(secretKey, claimId),
    // and submit the deposit transaction to the smart contract on Arc Testnet.
    throw new Error("Smart contract deposit not yet activated.");
  }

  async fetchClaimDetails(claimId: string): Promise<Claim | null> {
    // In future step, will query on-chain commitment status from Arc Testnet
    return null;
  }

  async claimSecretPayment(
    claimId: string,
    secretKey: string,
    recipientAddress: string
  ): Promise<{ txHash: string; success: boolean }> {
    // In future step, will submit claiming transaction with secret preimage
    throw new Error("Smart contract claiming not yet activated.");
  }
}

export const secretPayService = new SecretPayService();
