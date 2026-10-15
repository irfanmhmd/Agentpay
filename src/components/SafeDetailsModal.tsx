import React from 'react';

interface SafeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  chainId: number;
}

export const SafeDetailsModal: React.FC<SafeDetailsModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  chainId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#18201b] border border-[#3d4a43] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#272b26] bg-[#121714] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#50d6a3]/20 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-headline text-[15px] font-bold text-[#e0e4dc]">
                AgentPay Wallet
              </h3>
              <p className="font-mono text-[11px] text-[#bccac0]">
                Dedicated backend wallet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#272b26] text-[#bccac0] hover:text-[#e0e4dc] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 font-mono text-[12px] text-[#e0e4dc] max-h-[70vh] overflow-y-auto">
          <div className="p-3 rounded-lg border bg-amber-400/10 border-amber-300/30 text-amber-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span className="font-bold">PAYMENTS DISABLED · BACKEND NOT CONFIGURED</span>
            </div>
          </div>

          {/* Details array */}
          <div className="space-y-2 bg-[#101410] p-3 rounded-lg border border-[#272b26]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#86948b]">Configured address:</span>
              <span className="text-[#70f3be] font-bold break-all">{walletAddress}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#86948b]">Network:</span>
              <span className="text-[#c0c9c1]">{chainId === 8453 ? 'Base (8453)' : 'Base Sepolia (84532)'}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#86948b]">Signer:</span>
              <span className="text-[#c0c9c1]">Not configured</span>
            </div>
          </div>

          <p className="text-[10px] text-[#86948b] leading-normal">
            This address is configured on the backend. Connecting MetaMask does not grant it signing permission. No autonomous transaction has been enabled or submitted.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#272b26] bg-[#121714] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#70f3be] text-[#003826] font-bold font-mono text-[11px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
