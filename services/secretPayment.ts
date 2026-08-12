/**
 * Secret Payment Service
 * Handles client-side cryptographic key generation, commitment hashing,
 * and contract interaction for ArcSecretPayment on Arc Testnet.
 */

import {
  createPublicClient,
  http,
  keccak256,
  bytesToHex,
  hexToBytes,
  parseUnits,
  formatUnits,
  Address,
  Hex,
} from "viem";
import { ARC_TESTNET_CHAIN } from "@/config/chains";
import { CONTRACTS, DEFAULT_USDC_DECIMALS } from "@/config/contracts";
import { ArcSecretPaymentAbi } from "@/contracts/abis/ArcSecretPaymentAbi";
import { Erc20Abi } from "@/contracts/abis/ArcBatchPaymentAbi";

export interface OnChainClaim {
  sender: Address;
  token: Address;
  amount: bigint;
  secretHash: Hex;
  expiry: bigint;
  claimed: boolean;
  refunded: boolean;
  claimedBy: Address;
  isExists: boolean;
  isExpired: boolean;
  formattedAmount: string;
}

export const secretPublicClient = createPublicClient({
  chain: ARC_TESTNET_CHAIN,
  transport: http(ARC_TESTNET_CHAIN.rpcUrls.default.http[0]),
});

/**
 * Generates a 32-byte cryptographically secure random secret using Web Crypto API.
 * Never stored server-side.
 */
export function generateSecureSecret(): Hex {
  if (typeof window === "undefined" || !window.crypto) {
    throw new Error("Web Crypto API is required to generate secure secrets.");
  }
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  return bytesToHex(buffer);
}

/**
 * Generates a unique 32-byte claimId using Web Crypto API.
 */
export function generateClaimId(): Hex {
  if (typeof window === "undefined" || !window.crypto) {
    throw new Error("Web Crypto API is required to generate claim IDs.");
  }
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  return bytesToHex(buffer);
}

/**
 * Computes keccak256 hash commitment of the secret preimage.
 */
export function computeSecretHash(secret: Hex): Hex {
  return keccak256(secret);
}

/**
 * Verifies that the ArcSecretPayment contract is deployed and contains valid bytecode.
 */
export async function checkSecretContractBytecode(): Promise<{
  isDeployed: boolean;
  address: Address;
  bytecodeLength: number;
}> {
  const address = CONTRACTS.arcTestnet.secretPayment;

  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return { isDeployed: false, address, bytecodeLength: 0 };
  }

  try {
    const bytecode = await secretPublicClient.getBytecode({ address });
    const isDeployed = Boolean(bytecode && bytecode !== "0x");
    return {
      isDeployed,
      address,
      bytecodeLength: bytecode ? (bytecode.length - 2) / 2 : 0,
    };
  } catch (err) {
    console.error("[SECRET_PAY] Bytecode check failed:", err);
    return { isDeployed: false, address, bytecodeLength: 0 };
  }
}

/**
 * Checks if the sender has approved enough USDC to the ArcSecretPayment contract.
 */
export async function checkSecretAllowance(
  ownerAddress: Address,
  requiredAmount: bigint
): Promise<{
  hasSufficientAllowance: boolean;
  currentAllowance: bigint;
}> {
  try {
    const allowance = (await secretPublicClient.readContract({
      address: CONTRACTS.arcTestnet.usdc,
      abi: Erc20Abi,
      functionName: "allowance",
      args: [ownerAddress, CONTRACTS.arcTestnet.secretPayment],
    })) as bigint;

    return {
      hasSufficientAllowance: allowance >= requiredAmount,
      currentAllowance: allowance,
    };
  } catch (err) {
    console.error("[SECRET_PAY] Failed to read allowance:", err);
    return { hasSufficientAllowance: false, currentAllowance: 0n };
  }
}

/**
 * Queries the on-chain state of a claim from ArcSecretPayment.
 */
export async function getOnChainClaim(claimId: Hex): Promise<OnChainClaim | null> {
  try {
    const data = (await secretPublicClient.readContract({
      address: CONTRACTS.arcTestnet.secretPayment,
      abi: ArcSecretPaymentAbi,
      functionName: "getClaim",
      args: [claimId],
    })) as {
      sender: Address;
      token: Address;
      amount: bigint;
      secretHash: Hex;
      expiry: bigint;
      claimed: boolean;
      refunded: boolean;
      claimedBy: Address;
    };

    const isExists = data.sender !== "0x0000000000000000000000000000000000000000";
    if (!isExists) {
      return null;
    }

    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
    const isExpired = currentTimestamp > data.expiry;
    const formattedAmount = formatUnits(data.amount, DEFAULT_USDC_DECIMALS);

    return {
      ...data,
      isExists,
      isExpired,
      formattedAmount,
    };
  } catch (err) {
    console.error("[SECRET_PAY] Failed to get on-chain claim:", err);
    return null;
  }
}
