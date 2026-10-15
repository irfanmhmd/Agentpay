import React, { useState } from 'react';
import { ServiceItem } from '../types';

interface ServicesScreenProps {
  services: ServiceItem[];
  onToggleService: (serviceId: string) => void;
  onAddCustomService: (newService: ServiceItem) => void;
  onShowToast: (msg: string, isError?: boolean) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  services,
  onToggleService,
  onAddCustomService,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customFormOpen, setCustomFormOpen] = useState(false);

  // Custom Form State
  const [customUrl, setCustomUrl] = useState('');
  const [customCap, setCustomCap] = useState('0.50');
  const [customSafe, setCustomSafe] = useState('');

  const connectedCount = services.filter((s) => s.connected).length;

  const categories = [
    { id: 'all', label: 'ALL', count: services.length },
    {
      id: 'web_search',
      label: 'WEB SEARCH',
      count: services.filter((s) => s.category === 'web_search').length,
    },
    {
      id: 'llm_inference',
      label: 'LLM INFERENCE',
      count: services.filter((s) => s.category === 'llm_inference').length,
    },
    {
      id: 'crypto_data',
      label: 'CRYPTO DATA',
      count: services.filter((s) => s.category === 'crypto_data').length,
    },
    {
      id: 'scraping',
      label: 'SCRAPING',
      count: services.filter((s) => s.category === 'scraping').length,
    },
    {
      id: 'social',
      label: 'SOCIAL',
      count: services.filter((s) => s.category === 'social').length,
    },
  ];

  const filtered = services.filter((s) => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.categoryLabel.toLowerCase().includes(q)
    );
  });

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      onShowToast('Please provide an endpoint URL', true);
      return;
    }

    const hostName = customUrl.replace(/^https?:\/\//, '').split('/')[0];
    const newSvc: ServiceItem = {
      id: `custom-${Date.now()}`,
      name: hostName || 'Custom x402 Endpoint',
      category: 'web_search',
      categoryLabel: 'CUSTOM API',
      protocolBadge: 'x402',
      description: `Proprietary x402 Endpoint: ${customUrl}`,
      unitRate: `$${parseFloat(customCap || '0.50').toFixed(2)}`,
      rateUnit: '/ call',
      rateNumeric: parseFloat(customCap || '0.50'),
      metricLabel: 'SUCCESS',
      metricValue: '99.0%',
      latency: '190ms',
      address: customSafe || '0x9E2...7A11',
      connected: true,
      icon: 'api',
    };

    onAddCustomService(newSvc);
    setCustomUrl('');
    setCustomCap('0.50');
    setCustomSafe('');
    setCustomFormOpen(false);
    onShowToast('Added to the local UI list only. No provider verification or backend allowlisting was performed.', true);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 space-y-4 pb-24 pt-20">
      <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 font-mono text-[11px] text-amber-200">
        Provider entries are UI examples. None are verified or allowlisted by the backend.
      </div>
      {/* Header & Summary Context */}
      <div className="relative overflow-hidden bg-[#1d211c] border border-[#3d4a43]/50 rounded-xl p-4 shadow-lg">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#70f3be]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#70f3be] animate-ping"></span>
            <span className="font-label-caps text-[10px] text-[#70f3be] tracking-widest uppercase">
              Autonomous Service Registry
            </span>
          </div>
          <h1 className="font-headline text-[22px] font-bold text-[#e0e4dc] tracking-tight">
            Paid Services Catalog
          </h1>
          <p className="font-sans text-[12px] text-[#bccac0] leading-relaxed max-w-sm">
            x402-enabled endpoints pre-authenticated for autonomous agent micro-settlement on Base
            Sepolia.
          </p>
        </div>

        {/* Quick Stats Metric Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 bg-[#191d18]/60 border border-[#272b26] rounded-lg p-2.5">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-label-caps text-[9px] text-[#bccac0]">AVAILABLE</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline text-[18px] font-bold text-[#e0e4dc]">
                {services.length}
              </span>
              <span className="font-mono text-[11px] text-[#70f3be]">APIs</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-[#272b26]">
            <span className="font-label-caps text-[9px] text-[#bccac0]">CONNECTED</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline text-[18px] font-bold text-[#70f3be]">
                {String(connectedCount).padStart(2, '0')}
              </span>
              <span className="material-symbols-outlined text-[#70f3be] text-[14px]">link</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-label-caps text-[9px] text-[#bccac0]">AVG LATENCY</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline text-[18px] font-bold text-[#e0e4dc]">180</span>
              <span className="font-mono text-[11px] text-[#c0c9c1]">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-col space-y-2">
        {/* Search Field */}
        <div className="relative flex items-center bg-[#0b0f0b] border border-[#272b26] rounded-lg p-1 shadow-sm">
          <span className="material-symbols-outlined text-[#86948b] text-[18px] pl-2 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search APIs, LLM tools, or data feeds..."
            className="w-full bg-transparent font-mono text-[12px] text-[#e0e4dc] placeholder-[#86948b] px-2.5 py-1.5 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-[#86948b] hover:text-[#e0e4dc] pr-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-left ${
                  isActive
                    ? 'bg-[#70f3be] text-[#003826] font-bold shadow-sm'
                    : 'bg-[#272b26] text-[#bccac0] hover:text-[#e0e4dc]'
                }`}
              >
                <span className="font-label-caps text-[9px]">{cat.label}</span>
                <span
                  className={`font-mono text-[10px] px-1 rounded-full ${
                    isActive ? 'bg-[#003826]/20' : 'bg-[#1d211c]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Marketplace Grid / List */}
      <div className="flex flex-col space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="relative bg-[#191d18] border border-[#3d4a43]/40 rounded-xl p-3.5 shadow-md hover:border-[#70f3be]/40 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                    item.connected ? 'bg-[#323631] text-[#70f3be]' : 'bg-[#272b26] text-[#86948b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-headline text-[14px] font-bold text-[#e0e4dc] truncate">
                      {item.name}
                    </h2>
                    <span
                      className={`font-label-caps text-[9px] px-1.5 py-0.2 rounded uppercase ${
                        item.protocolBadge === 'CORE'
                          ? 'bg-[#a6c7b6] text-[#365447] font-semibold'
                          : item.protocolBadge === 'x402'
                          ? 'bg-[#50d6a3]/20 text-[#70f3be]'
                          : 'bg-[#272b26] text-[#bccac0]'
                      }`}
                    >
                      {item.protocolBadge}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] text-[#bccac0]">{item.description}</span>
                </div>
              </div>

              {/* Toggle Switch */}
              {item.locked ? (
                <div className="flex items-center gap-1 bg-[#272b26] border border-[#3d4a43]/50 px-2 py-1 rounded text-[#bccac0] cursor-not-allowed">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  <span className="font-label-caps text-[9px] font-bold">SYSTEM</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleService(item.id)}
                  aria-label={`Toggle ${item.name}`}
                  className={`relative w-12 h-6 rounded-full transition-colors flex items-center p-0.5 active:scale-95 ${
                    item.connected ? 'bg-[#70f3be]' : 'bg-[#323631]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      item.connected
                        ? 'translate-x-6 bg-[#003826]'
                        : 'translate-x-0 bg-[#bccac0]'
                    }`}
                  ></span>
                </button>
              )}
            </div>

            {/* Rate & Telemetry Specs Strip */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-1 bg-[#0b0f0b]/80 border border-[#272b26] rounded-lg p-2">
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-[#bccac0]">UNIT RATE</span>
                <span className="font-mono text-[12px] font-semibold text-[#70f3be]">
                  {item.unitRate} <span className="text-[#86948b] font-normal">{item.rateUnit}</span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-[#bccac0]">
                  {item.metricLabel}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.connected ? 'bg-[#70f3be]' : 'bg-[#86948b]'
                    }`}
                  ></span>
                  <span className="font-mono text-[12px] text-[#e0e4dc]">
                    {item.metricValue}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-[#bccac0]">LATENCY</span>
                <span className="font-mono text-[12px] text-[#c0c9c1]">{item.latency}</span>
              </div>
            </div>

            {/* Status Line */}
            <div className="flex items-center justify-between mt-2 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.connected
                      ? 'bg-[#70f3be] shadow-[0_0_8px_#50d6a3]'
                      : 'bg-[#86948b]'
                  }`}
                ></span>
                <span
                  className={`font-mono text-[11px] ${
                    item.connected ? 'text-[#70f3be]' : 'text-[#86948b]'
                  }`}
                >
                  {item.connected ? 'Whitelisted · Auto-Debit Ready' : 'Not Connected · Standby'}
                </span>
              </div>

              {item.connected ? (
                <span className="font-mono text-[11px] text-[#86948b]">{item.address}</span>
              ) : (
                <button
                  onClick={() => onToggleService(item.id)}
                  className="font-label-caps text-[9px] text-[#70f3be] hover:underline uppercase"
                >
                  Connect &amp; Whitelist
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom x402 Endpoint Form Card */}
      <div className="relative bg-[#191d18] border border-[#3d4a43]/50 rounded-xl p-4 shadow-md">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setCustomFormOpen(!customFormOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#70f3be]/10 border border-[#70f3be]/30 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <h3 className="font-headline text-[14px] font-semibold text-[#e0e4dc]">
                Add Custom x402 Endpoint
              </h3>
              <p className="font-sans text-[11px] text-[#bccac0]">
                Integrate proprietary HTTP 402 micro-settlement URLs
              </p>
            </div>
          </div>
          <span
            className={`material-symbols-outlined text-[#bccac0] transition-transform ${
              customFormOpen ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </div>

        {/* Collapsible Form */}
        {customFormOpen && (
          <form onSubmit={handleAddCustom} className="flex flex-col space-y-3 pt-3 mt-2 border-t border-[#272b26]">
            <div className="flex flex-col space-y-1">
              <label className="font-label-caps text-[10px] text-[#bccac0] uppercase">
                Endpoint URL (Paywalled target)
              </label>
              <div className="flex items-center bg-[#0b0f0b] border border-[#272b26] rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-[#86948b] text-[16px] mr-2">
                  link
                </span>
                <input
                  type="url"
                  required
                  placeholder="https://api.myagent.dev/v1/compute/x402"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-transparent font-mono text-[12px] text-[#e0e4dc] placeholder-[#86948b] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col space-y-1">
                <label className="font-label-caps text-[10px] text-[#bccac0] uppercase">
                  Max Cap per Call
                </label>
                <div className="flex items-center bg-[#0b0f0b] border border-[#272b26] rounded-lg px-3 py-2">
                  <span className="font-mono text-[12px] text-[#70f3be] mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.50"
                    value={customCap}
                    onChange={(e) => setCustomCap(e.target.value)}
                    className="w-full bg-transparent font-mono text-[12px] text-[#e0e4dc] placeholder-[#86948b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-label-caps text-[10px] text-[#bccac0] uppercase">
                  Receiver Safe Address
                </label>
                <div className="flex items-center bg-[#0b0f0b] border border-[#272b26] rounded-lg px-3 py-2">
                  <input
                    type="text"
                    placeholder="0x91C..."
                    value={customSafe}
                    onChange={(e) => setCustomSafe(e.target.value)}
                    className="w-full bg-transparent font-mono text-[12px] text-[#e0e4dc] placeholder-[#86948b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCustomFormOpen(false)}
                className="px-3 py-1.5 rounded font-label-caps text-[10px] text-[#bccac0] hover:text-[#e0e4dc]"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-[#70f3be] text-[#003826] px-4 py-2 rounded font-headline text-[12px] font-bold shadow-md hover:bg-[#50d6a3] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>VERIFY &amp; WHITELIST</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
