export interface Token {
  address: string; // 0x0... or 'native'
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  isNative?: boolean;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  rawBalance: bigint;
  formattedBalance: string;
  usdValue?: string;
}
