export interface Eip1193Provider {
  isMetaMask?: boolean;
  providers?: Eip1193Provider[];
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void;
  removeListener?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void;
}

export interface Eip6963ProviderDetail {
  info: { rdns?: string; name?: string };
  provider: Eip1193Provider;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export const EVM_NETWORKS = {
  84532: {
    chainName: 'Base Sepolia',
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  },
  8453: {
    chainName: 'Base',
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
} as const;

export const USDC_BY_CHAIN: Record<number, `0x${string}`> = {
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};
