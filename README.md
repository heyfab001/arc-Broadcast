# Arc Broadcast Payment & Secret Pay dApp

[![Arc Testnet](https://img.shields.io/badge/Arc%20Testnet-Chain%20ID%205042002-blue.svg)](https://testnet.arcscan.app)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black.svg)](https://nextjs.org/)
[![Foundry](https://img.shields.io/badge/Foundry-passing%2021%2F21%20tests-green.svg)](https://book.getfoundry.sh/)

Production-quality Web3 payment dApp built on **Arc Testnet** featuring atomic batch disbursements and zero-knowledge private secret claim escrows.

---

## Features

### 1. Broadcast Payment (Atomic Batch Transfers)
- Disburse Arc USDC payments to **1–100 wallet addresses** in a single atomic transaction.
- Zero custody: tokens are pulled and immediately distributed in one execution.
- Real-time gas estimation, dynamic CSV import/manual entry, and balance validation.

### 2. Secret Pay (Zero-Knowledge Escrow Claims)
- Senders deposit tokens into smart contract escrow by committing to `keccak256(secret)`.
- Client-side 256-bit cryptographically secure key generation via Web Crypto API.
- Generates private claim links formatted as `/claim/<claimId>#<secret>`. The URL hash fragment (`#`) is never sent to servers.
- Receivers connect any EVM wallet and claim the funds directly to their address.
- Senders can reclaim expired unclaimed deposits (`refundExpired`).

### 3. Live On-Chain Payment History
- Live blockchain explorer reading decoded `BatchTransfer`, `ClaimCreated`, `Claimed`, and `Refunded` events directly from Arc Testnet.
- Fast parallel query engine with in-memory block timestamp caching.
- Instant search and multi-tab filtering (`All`, `Broadcast`, `Secret Pay`, `Claims`).
- One-click transaction hash copying and direct links to **ArcScan**.

---

## Arc Testnet Configuration

| Parameter | Value |
|---|---|
| **Chain Name** | Arc Testnet |
| **Chain ID** | `5042002` (`0x4CF4B2`) |
| **RPC Endpoint** | `https://rpc.testnet.arc.network` |
| **WebSocket RPC** | `wss://rpc.testnet.arc.network` |
| **Native Gas Token** | USDC (18 decimals in EVM format) |
| **Official USDC ERC-20** | `0x3600000000000000000000000000000000000000` (6 decimals) |
| **Block Explorer** | [https://testnet.arcscan.app](https://testnet.arcscan.app) |

---

## Deployed Smart Contracts (Arc Testnet)

- **`ArcBatchPayment`**: [`0x91C0a4dDCe2AD63F217eEc8a5829ae7f2A814c78`](https://testnet.arcscan.app/address/0x91C0a4dDCe2AD63F217eEc8a5829ae7f2A814c78)
  - Deployment Tx: [`0x7e1ba90c02f077192ddf13984901d6fad8aa122defe0a9a61578e31af1ad05a6`](https://testnet.arcscan.app/tx/0x7e1ba90c02f077192ddf13984901d6fad8aa122defe0a9a61578e31af1ad05a6)
- **`ArcSecretPayment`**: [`0xCa3F0f03a33bF36e93ECaE6014da989Da3199e0D`](https://testnet.arcscan.app/address/0xCa3F0f03a33bF36e93ECaE6014da989Da3199e0D)
  - Deployment Tx: [`0xd6dbf9f62b403bd5816daa421910bc6ea6e4a55864d78ef31b6ea4b5b9700ef1`](https://testnet.arcscan.app/tx/0xd6dbf9f62b403bd5816daa421910bc6ea6e4a55864d78ef31b6ea4b5b9700ef1)

---

## Smart Contract Testing (Foundry)

Run the comprehensive unit test suite covering all 21 test cases:

```bash
forge build
forge test -vvv
```

```text
Ran 11 tests for test/ArcSecretPayment.t.sol:ArcSecretPaymentTest
[PASS] test_ClaimSuccessfully()
[PASS] test_CreateClaim()
[PASS] test_RevertWhen_ClaimAfterExpiry()
[PASS] test_RevertWhen_ClaimTwice()
[PASS] test_RevertWhen_DuplicateClaimId()
[PASS] test_RevertWhen_InvalidExpiry()
[PASS] test_RevertWhen_NonSenderRefund()
[PASS] test_RevertWhen_RefundBeforeExpiry()
[PASS] test_RevertWhen_WrongSecret()
[PASS] test_RevertWhen_ZeroAmount()
[PASS] test_SenderRefundAfterExpiry()

Ran 10 tests for test/ArcBatchPayment.t.sol:ArcBatchPaymentTest
[PASS] test_EmitsBatchTransferEvent()
[PASS] test_Max100RecipientsTransfer()
[PASS] test_MultipleRecipientsTransfer()
[PASS] test_RevertWhen_ArrayLengthMismatch()
[PASS] test_RevertWhen_EmptyRecipients()
[PASS] test_RevertWhen_Exceeds100Recipients()
[PASS] test_RevertWhen_ZeroAddressRecipient()
[PASS] test_RevertWhen_ZeroAmount()
[PASS] test_SingleRecipientTransfer()
[PASS] test_TotalAmountTransferredExact()

Suite result: ok. 21 passed; 0 failed; 0 skipped (21 total tests)
```

---

## Local Development Setup

### 1. Prerequisites
- Node.js >= 18.18
- Foundry (`forge`, `cast`)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_ARC_BATCH_PAYMENT_ADDRESS="0x91C0a4dDCe2AD63F217eEc8a5829ae7f2A814c78"
NEXT_PUBLIC_ARC_SECRET_PAYMENT_ADDRESS="0xCa3F0f03a33bF36e93ECaE6014da989Da3199e0D"
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License
MIT
