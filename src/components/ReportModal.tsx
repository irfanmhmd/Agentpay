import React from 'react';
import { TaskItem } from '../types';

interface ReportModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onCopyReport: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  task,
  onClose,
  onCopyReport,
}) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#18201b] border border-[#3d4a43] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#272b26] bg-[#121714]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#50d6a3]/20 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[18px]">summarize</span>
            </div>
            <div>
              <h3 className="font-headline text-[15px] font-bold text-[#e0e4dc]">
                Autonomous Intelligence Report
              </h3>
              <p className="font-mono text-[11px] text-[#bccac0]">
                Task ID: {task.id} · {task.runtime}
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

        {/* Status Ribbon */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0b0f0b] border-b border-[#272b26] text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                task.status === 'completed' ? 'bg-[#70f3be]' : 'bg-[#ffb4ab]'
              }`}
            />
            <span
              className={`font-semibold uppercase ${
                task.status === 'completed' ? 'text-[#70f3be]' : 'text-[#ffb4ab]'
              }`}
            >
              {task.status}
            </span>
            <span className="text-[#86948b]">•</span>
            <span className="text-[#c0c9c1]">{task.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#70f3be] font-bold">${task.cost.toFixed(2)} USDC</span>
            <span className="text-[#86948b]">|</span>
            <span className="text-[#c0c9c1]">{task.toolsInvoked} tools called</span>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-4 overflow-y-auto space-y-3 font-mono text-[12px] leading-relaxed text-[#e0e4dc]">
          <div>
            <span className="font-label-caps text-[10px] text-[#86948b] block mb-1">
              TASK TITLE
            </span>
            <h4 className="font-sans font-semibold text-[14px] text-[#e0e4dc]">
              {task.title}
            </h4>
          </div>

          {task.errorReason && (
            <div className="bg-[#93000a]/20 border border-[#ffb4ab]/40 rounded-lg p-3 text-[#ffb4ab]">
              <span className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Halt Constraint:
              </span>
              <p className="mt-1 text-[11px]">{task.errorReason}</p>
            </div>
          )}

          <div className="bg-[#101410] rounded-lg p-3 border border-[#272b26] whitespace-pre-wrap font-mono text-[11px] text-[#bccac0]">
            {task.report || 'Detailed execution logs finalized on Base Sepolia.'}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#101410] p-2.5 rounded border border-[#272b26]">
              <span className="font-label-caps text-[9px] text-[#86948b] block">
                ON-CHAIN PROOF
              </span>
              <span className="text-[#70f3be] text-[11px]">{task.txHash}</span>
            </div>
            <div className="bg-[#101410] p-2.5 rounded border border-[#272b26]">
              <span className="font-label-caps text-[9px] text-[#86948b] block">
                PROTOCOL STANDARD
              </span>
              <span className="text-[#c0c9c1] text-[11px]">x402 Autopay v2.4</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-[#272b26] bg-[#121714]">
          <a
            href={`https://sepolia.basescan.org`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono text-[#70f3be] hover:underline"
          >
            <span>Verify on BaseScan</span>
            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyReport}
              className="px-3 py-1.5 rounded bg-[#272b26] text-[#e0e4dc] hover:bg-[#323631] text-[11px] font-mono flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#70f3be] text-[#003826] font-bold text-[11px] font-mono hover:bg-[#50d6a3]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
