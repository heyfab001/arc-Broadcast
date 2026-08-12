import { IBroadcastService } from "@/types/services";
import { Token } from "@/types/token";
import { Recipient } from "@/types/payment";
import { validateRecipientList } from "@/lib/validation";

export class BroadcastService implements IBroadcastService {
  async executeBatchPayment(
    token: Token,
    recipients: Recipient[],
    options?: { onProgress?: (step: string) => void }
  ): Promise<{ txHash: string; status: string }> {
    // Will execute batch smart contract transaction on Arc Testnet
    throw new Error("Smart contract execution not yet enabled in this step.");
  }

  validateBatch(
    recipients: Recipient[],
    senderBalance: string
  ): {
    isValid: boolean;
    totalAmount: string;
    errors: string[];
  } {
    const numBalance = parseFloat(senderBalance || "0");
    const result = validateRecipientList(recipients, numBalance);
    return {
      isValid: result.isValid,
      totalAmount: result.totalAmount.toString(),
      errors: result.errors,
    };
  }
}

export const broadcastService = new BroadcastService();
