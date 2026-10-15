import React, { useState } from 'react';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: string[];
  onAddDomain: (domain: string) => void;
  onRemoveDomain: (domain: string) => void;
}

export const WhitelistModal: React.FC<WhitelistModalProps> = ({
  isOpen,
  onClose,
  domains,
  onAddDomain,
  onRemoveDomain,
}) => {
  const [newDomain, setNewDomain] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    if (!clean) return;
    if (domains.includes(clean)) {
      setError('Domain already present in allowlist.');
      return;
    }
    onAddDomain(clean);
    setNewDomain('');
    setError('');
  };

  const filtered = domains.filter((d) => d.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#18201b] border border-[#3d4a43] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#272b26] bg-[#121714]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#70f3be]/20 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <div>
              <h3 className="font-headline text-[15px] font-bold text-[#e0e4dc]">
                Protocol Allowlist &amp; API Keys
              </h3>
              <p className="font-mono text-[11px] text-[#bccac0]">
                Cryptographic session gating
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

        {/* Add new Domain input form */}
        <form onSubmit={handleAdd} className="p-4 border-b border-[#272b26] bg-[#101410] space-y-2">
          <label className="font-label-caps text-[10px] text-[#86948b] uppercase block">
            Authorize New Domain / RPC Host
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 bg-[#191d18] border border-[#3d4a43] rounded px-2.5 py-1.5 focus-within:border-[#70f3be]">
              <input
                type="text"
                placeholder="e.g. api.groq.com or sub.ai"
                value={newDomain}
                onChange={(e) => {
                  setNewDomain(e.target.value);
                  setError('');
                }}
                className="w-full bg-transparent font-mono text-[12px] text-[#e0e4dc] placeholder-[#86948b] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#70f3be] text-[#003826] font-bold rounded text-[11px] font-mono hover:bg-[#50d6a3] active:scale-95 transition-transform"
            >
              Add Host
            </button>
          </div>
          {error && <p className="text-[10px] font-mono text-[#ffb4ab]">{error}</p>}
        </form>

        {/* Filter search */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center bg-[#101410] border border-[#272b26] rounded px-2.5 py-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#86948b] mr-1.5">search</span>
            <input
              type="text"
              placeholder="Search whitelisted domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent font-mono text-[11px] text-[#e0e4dc] placeholder-[#86948b] focus:outline-none"
            />
          </div>
        </div>

        {/* List of Domains */}
        <div className="p-4 overflow-y-auto space-y-2 max-h-60">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-mono text-[11px] text-[#86948b]">
              No whitelisted domains found
            </div>
          ) : (
            filtered.map((dom) => (
              <div
                key={dom}
                className="flex items-center justify-between p-2.5 rounded bg-[#101410] border border-[#272b26]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] shadow-[0_0_4px_#70f3be]"></span>
                  <span className="font-mono text-[12px] text-[#e0e4dc] font-medium">{dom}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#272b26] text-[#bccac0] font-label-caps text-[9px]">
                    ALLOW
                  </span>
                </div>
                <button
                  onClick={() => onRemoveDomain(dom)}
                  className="w-7 h-7 rounded text-[#86948b] hover:text-[#ffb4ab] hover:bg-[#93000a]/20 flex items-center justify-center transition-colors"
                  title="Revoke domain authorization"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#272b26] bg-[#121714] flex justify-between items-center text-[11px] font-mono">
          <span className="text-[#86948b]">Total allowed: {domains.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#272b26] text-[#e0e4dc] hover:bg-[#323631]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
