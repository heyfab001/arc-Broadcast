/**
 * Arc Testnet Smart Contract Addresses
 * 
 * Target: Arc Testnet (Chain ID 5042002)
 * Explorer: https://testnet.arcscan.app
 */

export const CONTRACTS = {
  arcTestnet: {
    // Official Arc Testnet USDC ERC-20 interface contract
    usdc: "0x3600000000000000000000000000000000000000" as `0x${string}`,
    
    // Real deployed ArcBatchPayment contract address on Arc Testnet (DO NOT CHANGE)
    batchPayment: "0x91C0a4dDCe2AD63F217eEc8a5829ae7f2A814c78" as `0x${string}`,

    // Real deployed ArcSecretPayment contract address on Arc Testnet (DO NOT CHANGE)
    secretPayment: "0xCa3F0f03a33bF36e93ECaE6014da989Da3199e0D" as `0x${string}`,
  },
} as const;

export const DEFAULT_USDC_DECIMALS = 6;
