export const NETWORKS = {
  '84532': {
    chainId: 84532,
    network: 'Base Sepolia',
    rpcEnv: 'BASE_SEPOLIA_RPC_URL',
    usdcEnv: 'BASE_SEPOLIA_USDC_ADDRESS',
    defaultRpc: 'https://sepolia.base.org',
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    explorer: 'https://sepolia.basescan.org',
  },
  '8453': {
    chainId: 8453,
    network: 'Base',
    rpcEnv: 'BASE_MAINNET_RPC_URL',
    usdcEnv: 'BASE_MAINNET_USDC_ADDRESS',
    defaultRpc: 'https://mainnet.base.org',
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    explorer: 'https://basescan.org',
  },
} as const;

export type SupportedChainId = keyof typeof NETWORKS;

export function getNetwork(chainId: string | undefined) {
  if (!chainId || !(chainId in NETWORKS)) return null;
  return NETWORKS[chainId as SupportedChainId];
}
