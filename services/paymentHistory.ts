/**
 * Payment History Service
 * Reads and decodes real on-chain events from ArcBatchPayment and ArcSecretPayment
 * contracts on Arc Testnet for the connected wallet address.
 */

import {
  createPublicClient,
  http,
  formatUnits,
  Address,
  Hex,
  parseAbiItem,
} from "viem";
import { ARC_TESTNET_CHAIN } from "@/config/chains";
import { CONTRACTS, DEFAULT_USDC_DECIMALS } from "@/config/contracts";
import { DEFAULT_TOKEN } from "@/config/tokens";
import { Transaction, PaymentStatus } from "@/types/payment";
import { getOnChainClaim } from "./secretPayment";

// Contract deployment reference block on Arc Testnet
export const CONTRACT_DEPLOY_BLOCK = 56633000n;

export const historyPublicClient = createPublicClient({
  chain: ARC_TESTNET_CHAIN,
  transport: http(ARC_TESTNET_CHAIN.rpcUrls.default.http[0], {
    timeout: 10_000,
    retryCount: 2,
  }),
});

// In-memory cache for block timestamps to avoid redundant RPC queries
const blockTimestampCache = new Map<bigint, number>();

async function getBlockTimestamp(blockNumber: bigint): Promise<number> {
  if (blockTimestampCache.has(blockNumber)) {
    return blockTimestampCache.get(blockNumber)!;
  }
  try {
    const block = await historyPublicClient.getBlock({ blockNumber });
    const timestamp = Number(block.timestamp) * 1000;
    blockTimestampCache.set(blockNumber, timestamp);
    return timestamp;
  } catch (err) {
    console.warn(`[HISTORY] Could not fetch timestamp for block ${blockNumber}:`, err);
    return Date.now();
  }
}

/**
 * Fetches and resolves complete real on-chain transaction history for a wallet.
 */
export async function fetchUserOnChainHistory(userAddress: Address): Promise<{
  transactions: Transaction[];
  isBatchDeployed: boolean;
  isSecretDeployed: boolean;
}> {
  const normalizedUser = userAddress.toLowerCase() as Address;
  console.log(`[HISTORY DEBUG] Starting on-chain query for wallet: ${userAddress}`);

  // 1. Get latest block
  const currentBlock = await historyPublicClient.getBlockNumber();
  console.log(`[HISTORY DEBUG] Latest block: ${currentBlock.toString()}`);

  // Bounded safe search range: from contract creation block to latest
  const fromBlock = currentBlock > 20000n ? currentBlock - 20000n : CONTRACT_DEPLOY_BLOCK;
  const safeFromBlock = fromBlock > CONTRACT_DEPLOY_BLOCK ? fromBlock : CONTRACT_DEPLOY_BLOCK;
  console.log(`[HISTORY DEBUG] Querying block range: ${safeFromBlock} -> ${currentBlock}`);

  const batchContract = CONTRACTS.arcTestnet.batchPayment;
  const secretContract = CONTRACTS.arcTestnet.secretPayment;

  // 2. Check bytecodes
  const [batchBytecode, secretBytecode] = await Promise.all([
    historyPublicClient.getBytecode({ address: batchContract }).catch(() => null),
    historyPublicClient.getBytecode({ address: secretContract }).catch(() => null),
  ]);

  const isBatchDeployed = Boolean(batchBytecode && batchBytecode !== "0x");
  const isSecretDeployed = Boolean(secretBytecode && secretBytecode !== "0x");

  console.log(`[HISTORY DEBUG] Batch contract (${batchContract}) bytecode: ${isBatchDeployed ? "YES" : "NO"}`);
  console.log(`[HISTORY DEBUG] Secret contract (${secretContract}) bytecode: ${isSecretDeployed ? "YES" : "NO"}`);

  const transactions: Transaction[] = [];

  // ABI Event Definitions
  const batchEvent = parseAbiItem(
    "event BatchTransfer(address indexed sender, address indexed token, uint256 recipientCount, uint256 totalAmount, bytes32 indexed batchId)"
  );
  const claimCreatedEvent = parseAbiItem(
    "event ClaimCreated(bytes32 indexed claimId, address indexed sender, address indexed token, uint256 amount, bytes32 secretHash, uint256 expiry)"
  );
  const claimedEvent = parseAbiItem(
    "event Claimed(bytes32 indexed claimId, address indexed receiver, address indexed token, uint256 amount)"
  );
  const refundedEvent = parseAbiItem(
    "event Refunded(bytes32 indexed claimId, address indexed sender, address indexed token, uint256 amount)"
  );

  // 3. Parallel log queries across all contract events
  const [batchLogsResult, createdLogsResult, claimedLogsResult, refundedLogsResult] =
    await Promise.allSettled([
      isBatchDeployed
        ? historyPublicClient.getLogs({
            address: batchContract,
            event: batchEvent,
            fromBlock: safeFromBlock,
            toBlock: currentBlock,
          })
        : Promise.resolve([]),
      isSecretDeployed
        ? historyPublicClient.getLogs({
            address: secretContract,
            event: claimCreatedEvent,
            fromBlock: safeFromBlock,
            toBlock: currentBlock,
          })
        : Promise.resolve([]),
      isSecretDeployed
        ? historyPublicClient.getLogs({
            address: secretContract,
            event: claimedEvent,
            fromBlock: safeFromBlock,
            toBlock: currentBlock,
          })
        : Promise.resolve([]),
      isSecretDeployed
        ? historyPublicClient.getLogs({
            address: secretContract,
            event: refundedEvent,
            fromBlock: safeFromBlock,
            toBlock: currentBlock,
          })
        : Promise.resolve([]),
    ]);

  const batchLogs = batchLogsResult.status === "fulfilled" ? batchLogsResult.value : [];
  const createdLogs = createdLogsResult.status === "fulfilled" ? createdLogsResult.value : [];
  const claimedLogs = claimedLogsResult.status === "fulfilled" ? claimedLogsResult.value : [];
  const refundedLogs = refundedLogsResult.status === "fulfilled" ? refundedLogsResult.value : [];

  const rawLogsCount = batchLogs.length + createdLogs.length + claimedLogs.length + refundedLogs.length;
  console.log(`[HISTORY DEBUG] Raw logs fetched from Arc Testnet: ${rawLogsCount}`);

  // 4. Process BatchTransfer events
  for (const log of batchLogs as any[]) {
    if (
      log.args?.sender &&
      log.args.sender.toLowerCase() === normalizedUser &&
      log.args.totalAmount
    ) {
      const timestamp = await getBlockTimestamp(log.blockNumber);
      transactions.push({
        id: `batch-${log.transactionHash}-${log.args.batchId || "0"}`,
        type: "broadcast",
        status: "confirmed",
        token: DEFAULT_TOKEN,
        amount: formatUnits(log.args.totalAmount, DEFAULT_USDC_DECIMALS),
        recipientCount: Number(log.args.recipientCount || 0n),
        senderAddress: log.args.sender,
        timestamp,
        txHash: log.transactionHash,
        batchId: log.args.batchId,
        blockNumber: log.blockNumber,
      });
    }
  }

  // 5. Process ClaimCreated events (Secret payments created by this wallet)
  for (const log of createdLogs as any[]) {
    if (
      log.args?.sender &&
      log.args.sender.toLowerCase() === normalizedUser &&
      log.args.claimId &&
      log.args.amount
    ) {
      const timestamp = await getBlockTimestamp(log.blockNumber);
      const claimId = log.args.claimId;

      // Resolve real on-chain status
      let status: PaymentStatus = "available";
      try {
        const onChainData = await getOnChainClaim(claimId);
        if (onChainData) {
          if (onChainData.claimed) {
            status = "claimed";
          } else if (onChainData.refunded) {
            status = "refunded";
          } else if (onChainData.isExpired) {
            status = "expired";
          } else {
            status = "available";
          }
        }
      } catch (err) {
        console.warn("[HISTORY] Could not resolve live claim status:", err);
      }

      transactions.push({
        id: `secret-${log.transactionHash}-${claimId}`,
        type: "secret_pay",
        status,
        token: DEFAULT_TOKEN,
        amount: formatUnits(log.args.amount, DEFAULT_USDC_DECIMALS),
        senderAddress: log.args.sender,
        timestamp,
        txHash: log.transactionHash,
        claimId,
        blockNumber: log.blockNumber,
        expiryTimestamp: Number(log.args.expiry || 0n) * 1000,
      });
    }
  }

  // 6. Process Claimed events (Claims received by this wallet)
  for (const log of claimedLogs as any[]) {
    if (
      log.args?.receiver &&
      log.args.receiver.toLowerCase() === normalizedUser &&
      log.args.amount
    ) {
      const timestamp = await getBlockTimestamp(log.blockNumber);
      transactions.push({
        id: `claim-${log.transactionHash}-${log.args.claimId || "0"}`,
        type: "claim",
        status: "claimed",
        token: DEFAULT_TOKEN,
        amount: formatUnits(log.args.amount, DEFAULT_USDC_DECIMALS),
        targetAddress: log.args.receiver,
        timestamp,
        txHash: log.transactionHash,
        claimId: log.args.claimId,
        blockNumber: log.blockNumber,
      });
    }
  }

  // 7. Process Refunded events (Refunds reclaimed by this wallet)
  for (const log of refundedLogs as any[]) {
    if (
      log.args?.sender &&
      log.args.sender.toLowerCase() === normalizedUser &&
      log.args.amount
    ) {
      const timestamp = await getBlockTimestamp(log.blockNumber);
      transactions.push({
        id: `refund-${log.transactionHash}-${log.args.claimId || "0"}`,
        type: "refund",
        status: "refunded",
        token: DEFAULT_TOKEN,
        amount: formatUnits(log.args.amount, DEFAULT_USDC_DECIMALS),
        senderAddress: log.args.sender,
        timestamp,
        txHash: log.transactionHash,
        claimId: log.args.claimId,
        blockNumber: log.blockNumber,
      });
    }
  }

  console.log(`[HISTORY DEBUG] Wallet-filtered transactions: ${transactions.length}`);

  // 8. Sort newest first
  transactions.sort((a, b) => {
    if (a.blockNumber && b.blockNumber && a.blockNumber !== b.blockNumber) {
      return b.blockNumber > a.blockNumber ? 1 : -1;
    }
    return b.timestamp - a.timestamp;
  });

  return {
    transactions,
    isBatchDeployed,
    isSecretDeployed,
  };
}
