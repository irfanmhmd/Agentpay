import React from 'react';

interface FreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmFreeze: () => void;
  isFrozen: boolean;
}

export const FreezeModal: React.FC<FreezeModalProps> = ({
  isOpen,
  onClose,
  onConfirmFreeze,
  isFrozen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#18201b] border border-[#ffb4ab]/40 rounded-xl shadow-2xl p-5 space-y-4">
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-center justify-center text-[#ffb4ab] mx-auto">
          <span className="material-symbols-outlined text-[28px]">
            {isFrozen ? 'lock' : 'lock_reset'}
          </span>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-headline text-[18px] font-bold text-[#e0e4dc]">
            {isFrozen ? 'Local freeze flag is set' : 'Set local freeze flag?'}
          </h3>
          <p className="font-sans text-[13px] text-[#bccac0] leading-relaxed">
            This control only changes the dashboard state. No on-chain freeze, signer revocation, or transaction is implemented.
          </p>
        </div>

        <div className="bg-[#101410] rounded-lg p-3 border border-[#272b26] space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-[#86948b]">
            <span>Target Safe:</span>
            <span className="text-[#e0e4dc]">Configured AgentPay wallet</span>
          </div>
          <div className="flex justify-between text-[#86948b]">
            <span>Kernel Standard:</span>
            <span className="text-[#70f3be]">Not configured</span>
          </div>
          <div className="flex justify-between text-[#86948b]">
            <span>Active Rails:</span>
            <span className="text-[#ffb4ab]">0 · payments disabled</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded bg-[#272b26] text-[#e0e4dc] font-mono text-[12px] font-medium hover:bg-[#323631]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmFreeze();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded font-mono text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform ${
              isFrozen
                ? 'bg-[#70f3be] text-[#003826] hover:bg-[#50d6a3]'
                : 'bg-[#ffb4ab] text-[#690005] hover:bg-[#ffdad6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFrozen ? 'lock_open' : 'lock_reset'}
            </span>
            <span>{isFrozen ? 'Clear local flag' : 'Set local flag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
