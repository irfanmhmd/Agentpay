import React from 'react';
import { TabType, PolicyState } from '../types';

interface OverviewScreenProps {
  onNavigate: (tab: TabType) => void;
  policy: PolicyState;
  onShowToast: (msg: string) => void;
  wallet: {
    address: string;
    balanceStatus?: string;
    ethBalance?: string | null;
    usdcBalance?: string | null;
    error?: string;
    balanceErrors?: Record<string, string>;
  };
  chainId: number;
  backendStatus: 'checking' | 'active' | 'offline';
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigate,
  policy,
  wallet,
  chainId,
  backendStatus,
}) => (
  <div className="flex flex-col w-full max-w-xl mx-auto px-4 space-y-4 pb-24 pt-20">
    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
      <span className="bg-amber-400/10 border border-amber-300/30 px-2.5 py-1 rounded-full font-label-caps text-[10px] text-amber-200 tracking-wider">
        PAYMENT EXECUTION DISABLED
      </span>
      <span className="bg-[#1d211c] border border-[#3d4a43]/40 px-2 py-1 rounded font-mono text-[11px] text-[#bccac0]">
        {chainId === 8453 ? 'BASE · 8453' : 'BASE SEPOLIA · 84532'}
      </span>
      <span className={`border px-2.5 py-1 rounded-full font-label-caps text-[10px] tracking-wider ${backendStatus === 'active' ? 'border-[#70f3be]/30 text-[#70f3be]' : 'border-amber-300/30 text-amber-200'}`}>
        API {backendStatus.toUpperCase()}
      </span>
    </div>

    <section className="bg-[#191d18] border border-[#3d4a43]/50 rounded-xl p-4 space-y-3">
      <div>
        <h1 className="font-headline text-[25px] leading-8 text-[#e0e4dc] font-bold tracking-tight">
          AgentPay wallet status
        </h1>
        <p className="font-sans text-[13px] text-[#bccac0] leading-relaxed mt-2">
          MetaMask is a separate identity wallet. Connecting it does not authorize AgentPay to sign or spend. Backend API status is shown above; task execution and payments remain disabled until their services are implemented.
        </p>
      </div>
      <div className="bg-[#101410] border border-[#272b26] rounded-lg p-3">
        <span className="font-label-caps text-[9px] text-[#86948b] block">DEDICATED AGENTPAY ADDRESS</span>
        <span className="font-mono text-[12px] text-[#e0e4dc] break-all">
          {wallet.address || wallet.error || 'Not configured'}
        </span>
        <span className="font-mono text-[10px] text-[#86948b] block mt-1">
          Balance status: {wallet.balanceStatus ?? 'unavailable'} · ETH {wallet.ethBalance ?? '—'} · USDC {wallet.usdcBalance ?? '—'}
        </span>
        {wallet.balanceErrors && Object.values(wallet.balanceErrors).map((error) => (
          <span key={error} className="font-sans text-[10px] text-amber-200 block">{error}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#101410] border border-[#272b26] rounded-lg p-3">
          <span className="font-label-caps text-[9px] text-[#86948b] block">SPENDING POLICY</span>
          <span className="font-mono text-[12px] text-amber-200">Backend not active</span>
        </div>
        <div className="bg-[#101410] border border-[#272b26] rounded-lg p-3">
          <span className="font-label-caps text-[9px] text-[#86948b] block">UI LIMIT · NOT ENFORCED</span>
          <span className="font-mono text-[12px] text-[#e0e4dc]">{policy.dailyBudgetLimit.toFixed(2)} USDC</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onNavigate('tasks')} className="flex-1 bg-[#272b26] text-[#bccac0] font-headline text-[13px] font-bold py-2.5 rounded-lg border border-[#3d4a43]/50">
          Task execution unavailable
        </button>
        <button onClick={() => onNavigate('activity')} className="flex items-center justify-center gap-1 bg-[#272b26] text-[#70f3be] font-headline text-[13px] py-2.5 px-3 rounded-lg border border-[#3d4a43]/50">
          <span className="material-symbols-outlined text-[16px]">receipt_long</span> Ledger
        </button>
      </div>
    </section>

    <section className="bg-[#191d18] border border-[#3d4a43]/40 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-[15px] font-semibold text-[#e0e4dc]">Verified transactions</h2>
        <span className="font-mono text-[11px] text-[#86948b]">0</span>
      </div>
      <p className="font-sans text-[12px] text-[#86948b] mt-2">No verified AgentPay transactions are recorded.</p>
    </section>
  </div>
);
