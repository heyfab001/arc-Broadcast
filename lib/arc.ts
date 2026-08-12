import { formatUnits, parseUnits } from "viem";
import { ARC_TESTNET, ARC_CHAIN_ID, ARC_HEX_CHAIN_ID } from "@/config/chains";

/**
 * Standard EIP-3085 parameters for adding Arc Testnet to an EVM wallet
 */
export const ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS = {
  chainId: ARC_HEX_CHAIN_ID,
  chainName: ARC_TESTNET.name,
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: [ARC_TESTNET.rpcUrl],
  blockExplorerUrls: [ARC_TESTNET.explorerUrl],
};

/**
 * Format native Arc USDC atomic units (18 decimals) into a clean user-facing string.
 * Native Arc gas/currency uses 18 decimals internally, with 2–6 decimals displayed.
 */
export function formatArcUsdc(
  rawBalance: bigint | string | undefined | null,
  displayDecimals = 4
): string {
  if (rawBalance === undefined || rawBalance === null) return "0.00";
  try {
    const val = typeof rawBalance === "string" ? BigInt(rawBalance) : rawBalance;
    const formatted = formatUnits(val, 18);
    const num = parseFloat(formatted);
    if (num === 0) return "0.00";
    if (num < 0.0001) return "<0.0001";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: displayDecimals,
    });
  } catch {
    return "0.00";
  }
}

/**
 * Parses user input amount into Arc atomic units (18 decimals)
 */
export function parseArcUsdc(amount: string): bigint {
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return BigInt(0);
  }
  return parseUnits(amount.trim(), 18);
}

/**
 * User-friendly error message parser for Web3/EVM wallet interactions
 */
export function parseWalletErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";

  const errStr = typeof error === "object" && error !== null ? JSON.stringify(error) : String(error);
  const errMsg = (error as { message?: string; shortMessage?: string })?.shortMessage ||
                 (error as { message?: string })?.message ||
                 errStr;

  // User rejected action (EIP-1193 4001)
  if (
    errMsg.includes("User rejected") ||
    errMsg.includes("User denied") ||
    errMsg.includes("4001") ||
    errMsg.includes("rejected the request")
  ) {
    if (errMsg.toLowerCase().includes("switch") || errMsg.toLowerCase().includes("chain")) {
      return "Network switch was cancelled.";
    }
    return "Wallet connection was cancelled.";
  }

  // Chain not added (EIP-1193 4902)
  if (errMsg.includes("4902") || errMsg.includes("Unrecognized chain")) {
    return "Arc Testnet needs to be added to your wallet.";
  }

  // Connector not found
  if (errMsg.includes("ConnectorNotFound") || errMsg.includes("not found")) {
    return "No compatible wallet detected.";
  }

  return "Action could not be completed. Please try again.";
}
