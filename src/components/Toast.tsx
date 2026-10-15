import React from 'react';

interface ToastProps {
  message: string | null;
  isError?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isError = false }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center justify-center pointer-events-none animate-slideUp">
      <div className="max-w-md w-full bg-[#18201b]/95 border border-[#3d4a43] text-[#e0e4dc] px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 backdrop-blur-xl">
        <span
          className={`material-symbols-outlined text-[18px] shrink-0 ${
            isError ? 'text-[#ffb4ab]' : 'text-[#70f3be]'
          }`}
        >
          {isError ? 'error' : 'check_circle'}
        </span>
        <span className="font-mono text-[12px] truncate">{message}</span>
      </div>
    </div>
  );
};
