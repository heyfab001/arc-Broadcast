import { formatUnits, parseUnits } from "viem";
import { ARC_TESTNET, ARC_CHAIN_ID, ARC_HEX_CHAIN_ID } from "@/config/chains";

/**
 * Standard EIP-3085 parameters for adding Arc Testnet to an EVM wallet
 */
export const ARC_TESTNET_ADD_ETHEREUM_CHAIN_PARAMS = {
  chainId: ARC_HEX_CHAIN_ID,
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: ["https://rpc.testnet.arc.network"],
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

/**
 * Safe chain ID normalizer handling numbers, hex strings ("0x4d2b22", "0x1"), decimal strings, and BigInt
 */
export function normalizeChainId(chainId: unknown): number | null {
  if (chainId === null || chainId === undefined) return null;
  if (typeof chainId === "number") return isNaN(chainId) ? null : chainId;
  if (typeof chainId === "bigint") return Number(chainId);
  if (typeof chainId === "string") {
    const trimmed = chainId.trim();
    if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) {
      const parsed = parseInt(trimmed, 16);
      return isNaN(parsed) ? null : parsed;
    }
    const parsed = parseInt(trimmed, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Format native Arc USDC atomic units (18 decimals) into a clean user-facing string.
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
  if (!error) return "Couldn't switch networks. Please try again.";

  const errStr = typeof error === "object" && error !== null ? JSON.stringify(error) : String(error);
  const errMsg =
    (error as { message?: string; shortMessage?: string })?.shortMessage ||
    (error as { message?: string })?.message ||
    errStr;

  // User rejected action (EIP-1193 4001)
  if (
    errMsg.includes("User rejected") ||
    errMsg.includes("User denied") ||
    errMsg.includes("4001") ||
    errMsg.includes("rejected the request") ||
    errMsg.toLowerCase().includes("user rejected")
  ) {
    return "Network switch cancelled.";
  }

  // Chain not added (EIP-1193 4902)
  if (errMsg.includes("4902") || errMsg.includes("Unrecognized chain") || errMsg.includes("chain not added")) {
    return "Couldn't add Arc Testnet. Please add it manually in your wallet.";
  }

  // Connector not found
  if (errMsg.includes("ConnectorNotFound") || errMsg.includes("not found")) {
    return "No compatible wallet detected.";
  }

  return "Couldn't switch networks. Please try again.";
}
