import type { Request, Response } from 'express';
import { getNetwork, NETWORKS } from './networks.js';

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;
const BALANCE_OF_SELECTOR = '70a08231';

type RpcResponse<T> = { result?: T; error?: { message?: string } };

async function rpc<T>(rpcUrl: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`RPC returned HTTP ${response.status}`);
  const payload = (await response.json()) as RpcResponse<T>;
  if (payload.error || payload.result === undefined) {
    throw new Error(payload.error?.message ?? 'RPC response did not contain a result');
  }
  return payload.result;
}

function formatUnits(value: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = (value % base).toString().padStart(decimals, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export async function getWallet(_request: Request, response: Response) {
  const chainIdParam = Array.isArray(_request.query.chainId) ? undefined : _request.query.chainId;
  const config = getNetwork(typeof chainIdParam === 'string' ? chainIdParam : '84532');
  if (!config) {
    response.status(400).json({ ok: false, error: 'Unsupported network. Use Base Sepolia (84532) or Base (8453).' });
    return;
  }

  const address = process.env.AGENTPAY_WALLET_ADDRESS?.trim();
  if (!address || !ADDRESS_PATTERN.test(address)) {
    response.status(503).json({
      ok: false,
      error: 'AgentPay wallet address is not configured or is invalid.',
      configurationRequired: ['AGENTPAY_WALLET_ADDRESS'],
    });
    return;
  }

  const rpcUrl = process.env[config.rpcEnv]?.trim() || config.defaultRpc;

  try {
    const chainId = await rpc<string>(rpcUrl, 'eth_chainId', []);
    if (Number.parseInt(chainId, 16) !== config.chainId) {
      response.json({
        ok: true,
        address,
        network: config.network,
        chainId: config.chainId,
        balanceStatus: 'unavailable',
        balanceError: 'Configured RPC is not connected to Base Sepolia.',
        ethBalance: null,
        usdcBalance: null,
      });
      return;
    }

    let ethBalance: string | null = null;
    let usdcBalance: string | null = null;
    const balanceErrors: Record<string, string> = {};
    try {
      const ethHex = await rpc<string>(rpcUrl, 'eth_getBalance', [address, 'latest']);
      ethBalance = formatUnits(BigInt(ethHex), 18);
    } catch (error) {
      balanceErrors.eth = error instanceof Error ? error.message : 'Unable to read ETH balance.';
    }

    const configuredToken = process.env[config.usdcEnv]?.trim();
    const tokenAddress = configuredToken || config.usdcAddress;
    if (!ADDRESS_PATTERN.test(tokenAddress) || tokenAddress.toLowerCase() !== config.usdcAddress.toLowerCase()) {
      balanceErrors.usdc = `Configured ${config.network} USDC contract address is invalid or does not match Circle USDC.`;
    } else {
      try {
      const paddedAddress = address.slice(2).toLowerCase().padStart(64, '0');
      const data = `0x${BALANCE_OF_SELECTOR}${paddedAddress}`;
      const tokenHex = await rpc<string>(rpcUrl, 'eth_call', [{ to: tokenAddress, data }, 'latest']);
      usdcBalance = formatUnits(BigInt(tokenHex), 6);
      } catch (error) {
        balanceErrors.usdc = error instanceof Error ? error.message : 'Unable to read USDC balance.';
      }
    }

    response.json({
      ok: true,
      address,
      network: config.network,
      chainId: config.chainId,
      balanceStatus: ethBalance !== null && usdcBalance !== null ? 'available' :
        ethBalance !== null || usdcBalance !== null ? 'partial' : 'unavailable',
      ethBalance,
      usdcBalance,
      ...(Object.keys(balanceErrors).length ? { balanceErrors } : {}),
    });
  } catch (error) {
    response.json({
      ok: true,
      address,
      network: config.network,
      chainId: config.chainId,
      balanceStatus: 'unavailable',
      balanceError: error instanceof Error ? error.message : 'Unable to read wallet balances.',
      ethBalance: null,
      usdcBalance: null,
    });
  }
}

export function getNetworks(_request: Request, response: Response) {
  response.json({
    ok: true,
    activeNetwork: process.env.ACTIVE_NETWORK === 'base-mainnet' ? '8453' : '84532',
    networks: Object.values(NETWORKS).map(({ chainId, network, usdcAddress, explorer }) => ({
      chainId,
      network,
      usdcAddress,
      explorer,
      autonomousPaymentsEnabled:
        chainId === 8453
          ? process.env.MAINNET_AUTONOMOUS_PAYMENTS_ENABLED === 'true' && process.env.MAINNET_ENABLED === 'true'
          : process.env.AUTONOMOUS_PAYMENTS_ENABLED === 'true',
    })),
    mainnetEnabled: process.env.MAINNET_ENABLED === 'true',
  });
}
