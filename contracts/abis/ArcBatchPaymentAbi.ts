export const ARC_BATCH_PAYMENT_ABI = [
  {
    type: "function",
    name: "batchTransfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "recipients", type: "address[]" },
      { name: "amounts", type: "uint256[]" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "MAX_RECIPIENTS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "MIN_RECIPIENTS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "BatchTransfer",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "recipientCount", type: "uint256", indexed: false },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "batchId", type: "bytes32", indexed: true },
    ],
  },
  {
    type: "event",
    name: "SingleRecipientTransfer",
    inputs: [
      { name: "batchId", type: "bytes32", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "error",
    name: "ArrayLengthMismatch",
    inputs: [
      { name: "recipientsLength", type: "uint256" },
      { name: "amountsLength", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidRecipientCount",
    inputs: [{ name: "count", type: "uint256" }],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address" }],
  },
  {
    type: "error",
    name: "ZeroAddressRecipient",
    inputs: [{ name: "index", type: "uint256" }],
  },
  {
    type: "error",
    name: "ZeroAddressToken",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroAmount",
    inputs: [{ name: "index", type: "uint256" }],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export const Erc20Abi = ERC20_ABI;
export const ArcBatchPaymentAbi = ARC_BATCH_PAYMENT_ABI;
