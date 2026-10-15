import React, { useState } from 'react';
import { TransactionItem } from '../types';

interface ActivityScreenProps {
  transactions: TransactionItem[];
  walletAddress: string;
  onShowToast: (msg: string, isError?: boolean) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  transactions,
  walletAddress,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'blocked' | 'today'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    if (filter === 'confirmed' && t.status !== 'confirmed') return false;
    if (filter === 'blocked' && t.status !== 'blocked') return false;
    if (filter === 'today' && !t.timeAgo.includes('min') && !t.timeAgo.includes('hr')) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.txHash.toLowerCase().includes(q) ||
      (t.violationRule && t.violationRule.toLowerCase().includes(q))
    );
  });

  const handleExportCsv = () => {
    const headers = ['TxHash', 'Timestamp', 'Title', 'AmountUSDC', 'GasETH', 'Status', 'BlockNumber', 'Violation'];
    const rows = transactions.map((t) => [
      t.txHash,
      t.timestamp,
      `"${t.title}"`,
      t.amount,
      t.gasEth,
      t.status,
      t.blockNumber,
      `"${t.violationReason || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agent_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast('Ledger CSV exported.');
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 space-y-4 pb-24 pt-20">
      {/* Live Stream Header Sub-bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-5 h-5">
            <span className="absolute w-3 h-3 rounded-full bg-[#70f3be]/20 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#70f3be] shadow-[0_0_8px_#70f3be]"></span>
          </div>
          <span className="font-label-caps text-[10px] text-[#70f3be] tracking-wider uppercase">
            Verified Transaction History
          </span>
          <span className="font-mono text-[11px] text-[#bccac0]/60">{transactions.length} records</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#272b26] border border-[#3d4a43]/50 px-2 py-0.5 rounded-full">
          <span className="material-symbols-outlined text-[13px] text-[#70f3be]">security</span>
          <span className="font-label-caps text-[9px] text-[#e0e4dc]">PAYMENTS DISABLED</span>
        </div>
      </div>

      {/* Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Stat 1: Pool Balance */}
        <div className="bg-[#191d18] border border-[#3d4a43]/40 p-3 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[9px] text-[#bccac0] uppercase">Agent Pool</span>
            <span className="material-symbols-outlined text-[16px] text-[#70f3be]">
              account_balance_wallet
            </span>
          </div>
          <div className="mt-2">
            <div className="font-headline text-[18px] text-[#e0e4dc] tracking-tight font-bold">
              Not loaded
            </div>
            <p className="font-mono text-[11px] text-[#bccac0] flex items-center gap-1 mt-0.5">
              Wallet balance is not available here
            </p>
          </div>
        </div>

        {/* Stat 2: Sepolia Gas */}
        <div className="bg-[#191d18] border border-[#3d4a43]/40 p-3 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[9px] text-[#bccac0] uppercase">Sepolia L2 Gas</span>
            <span className="material-symbols-outlined text-[16px] text-[#c1e3d2]">
              local_gas_station
            </span>
          </div>
          <div className="mt-2">
            <div className="font-headline text-[18px] text-[#e0e4dc] tracking-tight font-bold">
              Not loaded
            </div>
            <p className="font-mono text-[11px] text-[#bccac0] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[12px] text-[#70f3be]">bolt</span>
              No transaction fees recorded
            </p>
          </div>
        </div>

        {/* Stat 3: Authorized */}
        <div className="bg-[#191d18] border border-[#3d4a43]/40 p-3 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[9px] text-[#bccac0] uppercase">Authorized</span>
            <span className="material-symbols-outlined text-[16px] text-[#70f3be]">verified</span>
          </div>
          <div className="mt-2">
            <div className="font-headline text-[18px] text-[#e0e4dc] tracking-tight font-bold">
              {transactions.length} <span className="font-mono text-[11px] text-[#bccac0] font-normal">records</span>
            </div>
            <p className="font-mono text-[11px] text-[#70f3be] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] shadow-[0_0_4px_#70f3be]"></span>
              <span>Verified records only</span>
            </p>
          </div>
        </div>

        {/* Stat 4: Guardrails */}
        <div className="bg-[#191d18] border border-[#ffb4ab]/30 p-3 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[9px] text-[#bccac0] uppercase">Guardrails</span>
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">
              shield_with_heart
            </span>
          </div>
          <div className="mt-2">
            <div className="font-headline text-[18px] text-[#ffb4ab] tracking-tight font-bold">
              0 <span className="font-mono text-[11px] text-[#ffb4ab] font-normal">policy events</span>
            </div>
            <p className="font-mono text-[11px] text-[#bccac0] flex items-center gap-1 mt-0.5">
              Policy backend not active
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Area */}
      <div className="flex flex-col gap-2">
        {/* Cryptographic Search Input */}
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#86948b] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Tx (0x...), service, or endpoint..."
            className="w-full bg-[#0b0f0b] text-[#e0e4dc] font-mono text-[12px] pl-10 pr-10 py-2.5 rounded-lg placeholder-[#86948b]/50 border border-[#272b26] focus:outline-none focus:border-[#70f3be]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 text-[#86948b] hover:text-[#e0e4dc]"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Filter Pills Scrollable Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-label-caps text-[10px] transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#70f3be] text-[#003826] font-bold shadow-sm'
                : 'bg-[#272b26] text-[#bccac0] hover:text-[#e0e4dc]'
            }`}
          >
            ALL (31)
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 rounded-full font-label-caps text-[10px] transition-all whitespace-nowrap ${
              filter === 'confirmed'
                ? 'bg-[#70f3be] text-[#003826] font-bold shadow-sm'
                : 'bg-[#272b26] text-[#bccac0] hover:text-[#e0e4dc]'
            }`}
          >
            CONFIRMED (28)
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`px-3 py-1.5 rounded-full font-label-caps text-[10px] transition-all whitespace-nowrap flex items-center gap-1 ${
              filter === 'blocked'
                ? 'bg-[#ffb4ab] text-[#690005] font-bold shadow-sm'
                : 'bg-[#272b26] text-[#ffb4ab] hover:bg-[#93000a]/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
            BLOCKED (3)
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-full font-label-caps text-[10px] transition-all whitespace-nowrap ${
              filter === 'today'
                ? 'bg-[#70f3be] text-[#003826] font-bold shadow-sm'
                : 'bg-[#272b26] text-[#bccac0] hover:text-[#e0e4dc]'
            }`}
          >
            TODAY
          </button>
        </div>
      </div>

      {/* Transaction Stream List */}
      <div className="flex flex-col space-y-2">
        {filtered.map((tx) => {
          const isBlocked = tx.status === 'blocked';
          return (
            <div
              key={tx.id}
              className={`p-3 rounded-lg flex flex-col gap-2 transition-colors border ${
                isBlocked
                  ? 'bg-gradient-to-r from-[#93000a]/15 via-[#191d18] to-[#191d18] border-[#ffb4ab]/30'
                  : 'bg-[#191d18] border-[#3d4a43]/40 hover:border-[#70f3be]/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded flex items-center justify-center shadow-inner ${
                      isBlocked
                        ? 'bg-[#93000a]/20 text-[#ffb4ab]'
                        : 'bg-[#272b26] text-[#70f3be]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-headline text-[13px] font-semibold truncate ${
                          isBlocked ? 'text-[#ffb4ab]' : 'text-[#e0e4dc]'
                        }`}
                      >
                        {tx.title}
                      </span>
                      {!isBlocked && (
                        <span className="bg-[#70f3be]/10 text-[#70f3be] px-1.5 py-0.2 rounded font-label-caps text-[9px]">
                          x402
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-[#bccac0] flex items-center gap-1.5 mt-0.5">
                      {isBlocked ? (
                        <>
                          <span className="text-[#ffb4ab] font-medium">INTERCEPTED</span>
                          <span>•</span>
                          <span>{tx.timeAgo}</span>
                        </>
                      ) : (
                        <>
                          <span>{tx.timeAgo}</span>
                          <span>•</span>
                          <span className="text-[#c0c9c1] font-mono">Blk #{tx.blockNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span
                    className={`font-mono text-[13px] font-semibold ${
                      isBlocked ? 'text-[#ffb4ab] line-through font-bold' : 'text-[#70f3be]'
                    }`}
                  >
                    {isBlocked ? `$${tx.amount.toFixed(2)} USDC` : `-${tx.amount.toFixed(2)} USDC`}
                  </span>
                  {isBlocked ? (
                    <span className="font-label-caps text-[9px] text-[#77fac4] bg-[#272b26] px-1 py-0.5 rounded">
                      0 GAS LEAK
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-[#bccac0]/70">
                      Gas {tx.gasEth} ETH
                    </span>
                  )}
                </div>
              </div>

              {/* Execution Proof or Interception Details */}
              {isBlocked ? (
                <div className="bg-[#0b0f0b]/80 p-2.5 rounded border border-[#ffb4ab]/20 flex items-start gap-2 text-[#e0e4dc]">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[16px] shrink-0 mt-0.5">
                    shield_with_heart
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[9px] text-[#ffb4ab]">
                      {tx.violationRule}
                    </span>
                    <p className="font-sans text-[11px] text-[#bccac0] mt-0.5 leading-relaxed">
                      {tx.violationReason}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1 mt-0.5 bg-[#0b0f0b]/50 px-2.5 py-1.5 rounded border border-[#272b26]">
                  <div className="flex items-center gap-1.5 text-[#bccac0]">
                    <span className="material-symbols-outlined text-[14px] text-[#70f3be]">
                      check_circle
                    </span>
                    <span className="font-mono text-[11px]">
                      Tx: <span className="text-[#c0c9c1]">{tx.txHash}</span>
                    </span>
                  </div>
                  <a
                    href="https://sepolia.basescan.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-label-caps text-[9px] text-[#70f3be] hover:underline flex items-center gap-0.5"
                  >
                    <span>BASE SEPOLIA</span>
                    <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* On-Chain Safe Verification Footer & Audit Card */}
      <div className="bg-[#191d18] border border-[#3d4a43]/50 p-3 rounded-xl flex flex-col space-y-3 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#70f3be]/20 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
            </div>
            <div>
              <div className="font-label-caps text-[10px] text-[#e0e4dc] font-semibold tracking-wider uppercase">
                ERC-4337 Smart Account
              </div>
              <div className="font-mono text-[11px] text-[#bccac0] flex items-center gap-1">
                <span>Contract:</span>
                <span className="text-[#70f3be] font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] inline-block"></span>
                <span className="text-[#70f3be] font-bold">(Verified)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#272b26] border border-[#3d4a43]/40 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px] text-[#c1e3d2]">lock</span>
            <span className="font-label-caps text-[9px] text-[#c1e3d2]">ZK-SNARK</span>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCsv}
          className="w-full bg-[#70f3be] text-[#003826] font-headline text-[13px] font-bold py-3 rounded flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_0_12px_rgba(80,214,163,0.25)] hover:bg-[#50d6a3]"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Tax &amp; Audit CSV</span>
        </button>
      </div>
    </div>
  );
};
