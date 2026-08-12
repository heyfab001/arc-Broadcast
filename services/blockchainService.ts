import { IBlockchainService } from "@/types/services";
import { Token, TokenBalance } from "@/types/token";
import { Recipient } from "@/types/payment";
import { ARC_TESTNET } from "@/config/chains";

/**
 * Service orchestrating wallet and network operations
 * Ready to be connected to Wagmi / Viem client in future step
 */
export class BlockchainService implements IBlockchainService {
  async connectWallet(): Promise<{ address: string; chainId: number }> {
    // Contract integration placeholder - will invoke window.ethereum or wagmi connect
    throw new Error("Blockchain integration pending: contracts not yet deployed.");
  }

  async disconnectWallet(): Promise<void> {
    // Contract integration placeholder
  }

  async switchNetwork(targetChainId: number): Promise<void> {
    // Will invoke wagmi switchChain
    if (targetChainId !== ARC_TESTNET.id) {
      throw new Error(`Unsupported network: target must be ${ARC_TESTNET.name} (${ARC_TESTNET.id})`);
    }
  }

  async getBalance(account: string, token: Token): Promise<TokenBalance> {
    // Return empty balance structure before live RPC binding
    return {
      token,
      balance: "0",
      rawBalance: BigInt(0),
      formattedBalance: "0.00",
      usdValue: "0.00",
    };
  }

  async estimateBroadcastGas(token: Token, recipients: Recipient[]): Promise<string> {
    // Estimated fee notice
    return "Calculated before transaction";
  }
}

export const blockchainService = new BlockchainService();
