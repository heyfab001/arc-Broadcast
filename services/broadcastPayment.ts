import { createPublicClient, http, formatUnits, parseUnits, isAddress } from "viem";
import { arcTestnetChain } from "@/config/chains";
import { ERC20_ABI } from "@/contracts/abis/ArcBatchPaymentAbi";
import { CONTRACTS, DEFAULT_USDC_DECIMALS } from "@/config/contracts";

export const publicClient = createPublicClient({
  chain: arcTestnetChain,
  transport: http("https://rpc.testnet.arc.network"),
});

/**
 * Checks if bytecode exists at the given contract address on Arc Testnet
 */
export async function checkContractBytecode(contractAddress: `0x${string}`): Promise<boolean> {
  if (!contractAddress || !isAddress(contractAddress)) return false;
  try {
    const bytecode = await publicClient.getBytecode({ address: contractAddress });
    return !!bytecode && bytecode !== "0x" && bytecode.length > 2;
  } catch (err) {
    console.error("[Broadcast Service] Error checking contract bytecode:", err);
    return false;
  }
}

/**
 * Reads token decimals from the ERC-20 contract (fixed to 6 for Arc USDC ERC-20)
 */
export async function getUsdcDecimals(tokenAddress: `0x${string}` = CONTRACTS.arcTestnet.usdc): Promise<number> {
  try {
    const decimals = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    });
    return Number(decimals);
  } catch (err) {
    console.warn("[Broadcast Service] Could not fetch decimals directly, using default 6:", err);
    return DEFAULT_USDC_DECIMALS;
  }
}

/**
 * Checks current ERC-20 token allowance granted by user to spender contract
 */
export async function checkAllowance(
  owner: `0x${string}`,
  spender: `0x${string}`,
  tokenAddress: `0x${string}` = CONTRACTS.arcTestnet.usdc
): Promise<bigint> {
  if (!owner || !spender || !isAddress(owner) || !isAddress(spender)) return BigInt(0);
  try {
    const allowance = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [owner, spender],
    });
    return allowance;
  } catch (err) {
    console.warn("[Broadcast Service] Error checking allowance:", err);
    return BigInt(0);
  }
}

/**
 * Reads user's ERC-20 token balance directly from the contract
 */
export async function getErc20Balance(
  account: `0x${string}`,
  tokenAddress: `0x${string}` = CONTRACTS.arcTestnet.usdc
): Promise<{ raw: bigint; formatted: string; decimals: number }> {
  if (!account || !isAddress(account)) {
    return { raw: BigInt(0), formatted: "0.00", decimals: DEFAULT_USDC_DECIMALS };
  }
  try {
    const decimals = await getUsdcDecimals(tokenAddress);
    const raw = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [account],
    });
    const formatted = formatUnits(raw, decimals);
    return { raw, formatted, decimals };
  } catch (err) {
    console.warn("[Broadcast Service] Error reading ERC20 balance:", err);
    return { raw: BigInt(0), formatted: "0.00", decimals: DEFAULT_USDC_DECIMALS };
  }
}

/**
 * Converts user decimal string amount into atomic token units based on decimals (6 for USDC)
 */
export function toAtomicAmount(amountStr: string, decimals: number = DEFAULT_USDC_DECIMALS): bigint {
  if (!amountStr || isNaN(Number(amountStr)) || Number(amountStr) <= 0) {
    return BigInt(0);
  }
  return parseUnits(amountStr.trim(), decimals);
}
