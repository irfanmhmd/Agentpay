import React, { useState } from 'react';

interface HeaderProps {
  walletAddress: string;
  onCopyAddress: () => void;
  onOpenSafeModal: () => void;
  connectedAddress: string | null;
  onConnectWallet: () => void;
  walletBusy: boolean;
  chainId: number;
  onSelectNetwork: (chainId: number) => void;
  personalBalances: string;
  unsupportedWalletNetwork: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  walletAddress,
  onCopyAddress,
  onOpenSafeModal,
  connectedAddress,
  onConnectWallet,
  walletBusy,
  chainId,
  onSelectNetwork,
  personalBalances,
  unsupportedWalletNetwork,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyAddress();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0b0f0b]/85 backdrop-blur-xl border-b border-[#272b26] shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="h-16 max-w-xl mx-auto px-4 flex items-center justify-between gap-2">
        {/* Logo and Agent ID */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded bg-[#50d6a3]/20 border border-[#50d6a3]/30 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
            </div>
            <span className="font-headline text-[19px] font-bold text-[#e0e4dc] tracking-tight">
              Agent<span className="text-[#70f3be]">Pay</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#1d211c] border border-[#3d4a43]/50 px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] animate-pulse shadow-[0_0_6px_#50d6a3]"></span>
            <span className="font-label-caps text-[10px] text-amber-300">PAYMENTS OFF</span>
          </div>
        </div>

        {/* Personal wallet identity is separate from the configured AgentPay wallet. */}
        <div className="flex items-center gap-1.5">
          <select
            aria-label="Select network"
            value={chainId}
            onChange={(event) => onSelectNetwork(Number(event.target.value))}
            className="max-w-[92px] sm:max-w-none bg-[#1d211c] border border-[#3d4a43]/40 px-1.5 py-1 rounded font-label-caps text-[10px] text-[#bccac0]"
          >
            <option value={84532}>BASE SEPOLIA</option>
            <option value={8453}>BASE MAINNET</option>
          </select>

          <button
            onClick={onConnectWallet}
            disabled={walletBusy}
            className="bg-[#272b26] border border-[#3d4a43]/60 px-2 py-1 rounded min-h-[30px] text-[10px] text-[#e0e4dc] hover:border-[#70f3be]/50 disabled:opacity-60"
            title="Connect MetaMask. This does not authorize AgentPay payments."
          >
            {walletBusy ? 'Connecting…' : connectedAddress ? <span className="flex flex-col leading-tight">
              <span>{connectedAddress.slice(0, 5)}…{connectedAddress.slice(-4)}</span>
              <span className="font-mono text-[8px] text-[#bccac0] max-w-[90px] truncate">{unsupportedWalletNetwork !== null ? `Unsupported · ${unsupportedWalletNetwork}` : personalBalances}</span>
            </span> : 'Connect MetaMask'}
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-[#1d211c] border border-[#3d4a43]/40 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#77fac4]"></span>
            <span className="font-label-caps text-[10px] text-[#bccac0]">AGENTPAY</span>
          </div>

          {walletAddress && <button
            onClick={handleCopy}
            className="hidden md:flex items-center gap-1 bg-[#272b26] border border-[#3d4a43]/60 px-2 py-1 rounded min-h-[30px] text-[#e0e4dc] hover:border-[#70f3be]/50 active:scale-95 transition-all"
            title="Click to copy Safe Address"
          >
            <span className="font-mono text-[11px] text-[#c0c9c1]">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#bccac0]">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>}

          <button
            onClick={onOpenSafeModal}
            className="w-8 h-8 rounded-full bg-[#70f3be] text-[#003826] flex items-center justify-center font-bold shadow-[0_0_8px_rgba(80,214,163,0.3)] active:scale-95 transition-transform"
            title="Agent Safe Profile & ERC-4337 Status"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
