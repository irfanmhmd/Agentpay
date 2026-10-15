import React, { useState } from 'react';
import { PolicyState } from '../types';

interface PoliciesScreenProps {
  policy: PolicyState;
  onUpdatePolicy: (updated: PolicyState) => void;
  onOpenWhitelistModal: () => void;
  onOpenFreezeModal: () => void;
  onShowToast: (msg: string, isError?: boolean) => void;
  isFrozen: boolean;
}

export const PoliciesScreen: React.FC<PoliciesScreenProps> = ({
  policy,
  onUpdatePolicy,
  onOpenWhitelistModal,
  onOpenFreezeModal,
  onShowToast,
  isFrozen,
}) => {
  const [selectedCap, setSelectedCap] = useState<number>(policy.perTransactionCap);
  const [zeroClick, setZeroClick] = useState<boolean>(policy.zeroClickAutonomy);

  const presets = [1.00, 2.50, 5.00, 10.00];

  const handleCapSelect = (val: number) => {
    setSelectedCap(val);
  };

  const handleToggleZeroClick = () => {
    const nextVal = !zeroClick;
    setZeroClick(nextVal);
    onShowToast(
      nextVal
        ? 'Local UI setting changed. Backend payments remain disabled.'
        : 'Local UI setting changed. No transaction was submitted.',
      true
    );
  };

  const handleSave = () => {
    onUpdatePolicy({
      ...policy,
      perTransactionCap: selectedCap,
      zeroClickAutonomy: zeroClick,
    });
    onShowToast('Policy values saved in this browser session only; backend enforcement is not active.', true);
  };

  const consumedPercent = Math.min(
    100,
    parseFloat(((policy.dailyBudgetSpent / policy.dailyBudgetLimit) * 100).toFixed(1))
  );

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 space-y-4 pb-24 pt-20">
      <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 font-mono text-[11px] text-amber-200">
        UI policy preview only. No spending policy is enforced by the backend yet.
      </div>
      {/* Telemetry Shield Status Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#272b26] border border-[#3d4a43]/60 p-4 shadow-md">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#70f3be]/10 blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#70f3be] animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#70f3be] -ml-3"></span>
            <span className="font-label-caps text-[10px] text-[#70f3be] tracking-wider uppercase">
              ERC-4337 SESSION VALIDATION
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#50d6a3]/20 border border-[#70f3be]/30 text-[#70f3be] font-mono text-[10px] font-semibold">
            STATE: {isFrozen ? 'FROZEN' : 'ENFORCED'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1d211c] border border-[#3d4a43] flex items-center justify-center text-[#70f3be] shadow-inner">
            <span className="material-symbols-outlined text-[24px]">shield_lock</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline text-[17px] text-[#e0e4dc] font-semibold tracking-tight">
              Autonomous Spending Policies
            </h1>
            <p className="font-sans text-[12px] text-[#bccac0] line-clamp-1">
              Hard constraints verified on-chain via smart account kernel.
            </p>
          </div>
        </div>

        <div className="mt-3 pt-1 flex items-center gap-2 text-[#70f3be] font-mono text-[11px] bg-[#0b0f0b]/60 border border-[#272b26] rounded px-2.5 py-1.5">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span className="truncate">Safe &amp; Guardrails Active (Zero Uncapped Autonomous Spending)</span>
        </div>
      </div>

      {/* Interactive Policy Parameter Controls Container */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-[10px] text-[#bccac0] uppercase tracking-wider">
            Configured Limits &amp; Guardrails
          </span>
          <span className="font-mono text-[11px] text-[#c0c9c1]">ACTIVE RULES: 04</span>
        </div>

        {/* Rule 1: Max Single Transaction Cap */}
        <div className="rounded-xl bg-[#1d211c] border border-[#3d4a43]/40 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#272b26] border border-[#3d4a43] flex items-center justify-center text-[#70f3be]">
                <span className="material-symbols-outlined text-[16px]">toll</span>
              </div>
              <div>
                <h2 className="font-headline text-[14px] text-[#e0e4dc] font-semibold leading-tight">
                  Per-Transaction Hard Cap
                </h2>
                <p className="font-mono text-[10px] text-[#bccac0]">RULE-ID: TX_CEILING_MAX</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-headline text-[18px] text-[#70f3be] font-bold tracking-tight">
                ${selectedCap.toFixed(2)}
              </span>
              <span className="font-mono text-[10px] text-[#c0c9c1] block">USDC</span>
            </div>
          </div>

          <p className="font-sans text-[12px] text-[#bccac0] leading-relaxed">
            Any autonomous service call above this limit is automatically rejected at the gateway before
            mempool dispatch.
          </p>

          {/* Preset Pills */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {presets.map((val) => {
              const isSelected = selectedCap === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleCapSelect(val)}
                  className={`py-1.5 rounded font-mono text-[11px] text-center active:scale-95 transition-all ${
                    isSelected
                      ? 'bg-[#70f3be] text-[#003826] font-bold shadow-[0_0_8px_rgba(80,214,163,0.3)]'
                      : 'bg-[#272b26] border border-[#3d4a43]/40 text-[#e0e4dc] hover:bg-[#323631]'
                  }`}
                >
                  ${val.toFixed(2)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rule 2: Daily Cumulative Spending Budget */}
        <div className="rounded-xl bg-[#1d211c] border border-[#3d4a43]/40 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#272b26] border border-[#3d4a43] flex items-center justify-center text-[#70f3be]">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              </div>
              <div>
                <h2 className="font-headline text-[14px] text-[#e0e4dc] font-semibold leading-tight">
                  Daily Cumulative Budget
                </h2>
                <p className="font-mono text-[10px] text-[#bccac0]">ROLLING 24H WINDOW</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-headline text-[18px] text-[#e0e4dc] font-semibold tracking-tight">
                ${policy.dailyBudgetLimit.toFixed(2)}
              </span>
              <span className="font-mono text-[10px] text-[#c0c9c1] block">LIMIT/DAY</span>
            </div>
          </div>

          {/* Linear Gauge Progress Meter */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between items-center font-mono text-[11px]">
              <span className="text-[#e0e4dc]">
                Spent: <strong className="text-[#70f3be] font-semibold">${policy.dailyBudgetSpent.toFixed(2)} USDC</strong>
              </span>
              <span className="text-[#c0c9c1] font-medium">{consumedPercent}% Consumed</span>
            </div>
            <div className="w-full h-2 rounded bg-[#323631] overflow-hidden">
              <div
                className="h-full bg-[#70f3be] rounded transition-all duration-500 shadow-[0_0_8px_rgba(80,214,163,0.5)]"
                style={{ width: `${consumedPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[#bccac0] font-mono text-[10px] pt-0.5">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                Resets in 09h 42m
              </span>
              <span>00:00 UTC epoch</span>
            </div>
          </div>
        </div>

        {/* Rule 3: Autonomous Approval Mode */}
        <div className="rounded-xl bg-[#1d211c] border border-[#3d4a43]/40 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#272b26] border border-[#3d4a43] flex items-center justify-center text-[#70f3be]">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
              </div>
              <div>
                <h2 className="font-headline text-[14px] text-[#e0e4dc] font-semibold leading-tight">
                  Zero-Click Autonomy
                </h2>
                <p className="font-mono text-[10px] text-[#bccac0]">SUB-THRESHOLD INSTANT PASS</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggleZeroClick}
              aria-label="Toggle Zero-Click Autonomy"
              className={`w-12 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                zeroClick ? 'bg-[#50d6a3] justify-end' : 'bg-[#323631] justify-start'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full shadow flex items-center justify-center ${
                  zeroClick ? 'bg-[#002115]' : 'bg-[#bccac0]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[12px] ${
                    zeroClick ? 'text-[#70f3be]' : 'text-[#101410]'
                  }`}
                >
                  {zeroClick ? 'check' : 'close'}
                </span>
              </span>
            </button>
          </div>

          <p className="font-sans text-[12px] text-[#bccac0] leading-relaxed">
            AI agent executes micro-calls without user prompting for any payload strictly below $2.50
            USDC.
          </p>

          {/* Sub-rule Passkey requirement */}
          <div className="flex items-center justify-between bg-[#0b0f0b]/50 border border-[#272b26] rounded-lg p-2.5">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="material-symbols-outlined text-[#70f3be] text-[18px] shrink-0">
                passkey
              </span>
              <span className="font-sans text-[12px] text-[#e0e4dc] truncate">
                Require Passkey for TX &gt; $2.50
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#272b26] border border-[#3d4a43]/50 text-[#70f3be] font-mono text-[10px] shrink-0">
              LOCKED
            </span>
          </div>
        </div>

        {/* Rule 4: Whitelisted Protocols & Domains */}
        <div className="rounded-xl bg-[#1d211c] border border-[#3d4a43]/40 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#272b26] border border-[#3d4a43] flex items-center justify-center text-[#70f3be]">
                <span className="material-symbols-outlined text-[16px]">hub</span>
              </div>
              <div>
                <h2 className="font-headline text-[14px] text-[#e0e4dc] font-semibold leading-tight">
                  Protocol Registry
                </h2>
                <p className="font-mono text-[10px] text-[#bccac0]">CRYPTOGRAPHIC ALLOWLIST</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#272b26] text-[#c0c9c1] font-mono text-[10px]">
              {policy.whitelistedDomains.length} ACTIVE
            </span>
          </div>

          {/* Domain Badges Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[#e0e4dc] font-mono text-[11px]">
            {policy.whitelistedDomains.map((dom) => (
              <span
                key={dom}
                className="px-2 py-1 rounded bg-[#323631] border border-[#3d4a43]/50 whitespace-nowrap"
              >
                {dom}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenWhitelistModal}
            className="w-full py-2 rounded bg-[#272b26] border border-[#3d4a43]/50 text-[#70f3be] font-sans text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-[#323631] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Manage Whitelist &amp; API Keys</span>
          </button>
        </div>
      </div>

      {/* Intercepted Violations Log (Security Audit) */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <span className="font-label-caps text-[10px] text-[#bccac0] uppercase tracking-wider">
              Security Interceptions Log
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#bccac0]">PAST 48H</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Violation 1 */}
          <div className="rounded-xl bg-[#1d211c] border border-[#ffb4ab]/30 p-3.5 flex flex-col gap-2 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#93000a]/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[14px]">block</span>
                </div>
                <span className="font-sans text-[13px] text-[#e0e4dc] font-medium truncate">
                  Unauthorized Web Extractor
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#ffb4ab] font-semibold shrink-0">
                -$12.00 REJECTED
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#bccac0] pl-8">
              <span>Exceeded single transaction ceiling ($5.00)</span>
              <span>12m ago</span>
            </div>
          </div>

          {/* Violation 2 */}
          <div className="rounded-xl bg-[#1d211c] border border-[#ffb4ab]/30 p-3.5 flex flex-col gap-2 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#93000a]/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[14px]">gpp_bad</span>
                </div>
                <span className="font-sans text-[13px] text-[#e0e4dc] font-medium truncate">
                  Unverified Foreign Gateway
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#ffb4ab] font-semibold shrink-0">
                -$0.85 REJECTED
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#bccac0] pl-8">
              <span>Target contract not in verified whitelist registry</span>
              <span>3h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Emergency & Save Controls */}
      <div className="flex flex-col gap-2 pt-2 mb-2">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded bg-[#70f3be] text-[#003826] font-headline text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#50d6a3] active:scale-[0.98] transition-all shadow-[0_0_12px_rgba(80,214,163,0.3)]"
        >
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span>Save Policy Changes</span>
        </button>

        <button
          type="button"
          onClick={onOpenFreezeModal}
          className="w-full h-11 rounded bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] font-sans text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#93000a]/30 active:scale-[0.98] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">lock_reset</span>
          <span>{isFrozen ? 'Manage Frozen Safe' : 'Emergency Freeze Agent Wallet'}</span>
        </button>
      </div>
    </div>
  );
};
