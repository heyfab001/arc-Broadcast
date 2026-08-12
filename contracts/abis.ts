/**
 * Standard ABI definitions for future viem / wagmi integration on Arc Testnet
 */

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

export const ARC_BROADCAST_ABI = [
  {
    type: "function",
    name: "broadcastPayment",
    stateMutability: "payable",
    inputs: [
      { name: "token", type: "address" },
      { name: "recipients", type: "address[]" },
      { name: "amounts", type: "uint256[]" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const;

export const ARC_SECRET_PAY_ABI = [
  {
    type: "function",
    name: "createSecretPayment",
    stateMutability: "payable",
    inputs: [
      { name: "commitmentHash", type: "bytes32" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "expiry", type: "uint64" },
    ],
    outputs: [{ name: "paymentId", type: "bytes32" }],
  },
  {
    type: "function",
    name: "claimSecretPayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "paymentId", type: "bytes32" },
      { name: "secretKey", type: "bytes32" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const;
