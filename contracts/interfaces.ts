/**
 * Contract interfaces for future Arc smart contract deployment
 * 
 * Target: Arc Testnet (Chain ID 5042002)
 * Native Currency: USDC
 */

export interface IArcBroadcastContract {
  /**
   * Broadcast ERC20 / Native token batch transfer
   * @param token Address of ERC20 token (or 0x0 for native USDC)
   * @param recipients Array of recipient wallet addresses
   * @param amounts Array of token amounts in wei/atomic units
   */
  broadcastTokens(
    token: string,
    recipients: string[],
    amounts: bigint[]
  ): Promise<string>; // returns transaction hash

  /**
   * Broadcast native USDC tokens directly
   */
  broadcastNative(
    recipients: string[],
    amounts: bigint[]
  ): Promise<string>;
}

export interface IArcSecretPayContract {
  /**
   * Deposit tokens with a cryptographic commitment
   * @param commitment Hash of (claimId, secret, recipient salt)
   * @param token Token address
   * @param amount Amount to deposit
   * @param expiry Expiry unix timestamp
   */
  depositSecret(
    commitment: string,
    token: string,
    amount: bigint,
    expiry: number
  ): Promise<string>;

  /**
   * Claim tokens using secret preimage and recipient proof
   */
  claimSecret(
    claimId: string,
    secretProof: string,
    recipient: string
  ): Promise<string>;

  /**
   * Refund expired secret deposit back to original sender
   */
  refundExpired(
    claimId: string
  ): Promise<string>;
}
