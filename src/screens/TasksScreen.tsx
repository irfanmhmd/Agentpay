import React, { useState, useEffect, useRef } from 'react';
import { TaskItem, PolicyState } from '../types';

interface TasksScreenProps {
  tasks: TaskItem[];
  policy: PolicyState;
  onOpenReport: (task: TaskItem) => void;
  onShowToast: (msg: string, isError?: boolean) => void;
  onIncreaseCap: (taskId: string) => void;
  onAddNewTask: (newTask: TaskItem) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  policy,
  onOpenReport,
  onShowToast,
  onIncreaseCap,
  onAddNewTask,
}) => {
  // Active Execution Pipeline State
  const [pipelineState] = useState<'running' | 'paused' | 'aborted'>('aborted');
  const [step] = useState(0);
  const [stepLabel] = useState('TASK BACKEND NOT CONFIGURED');
  const [spentUsdc] = useState(0);
  const [capUsdc, setCapUsdc] = useState(2.50);
  const [tokSpeed] = useState(0);

  // Terminal Logs
  const [logs, setLogs] = useState<string[]>([
    '[System] Task execution is not configured. No service request or payment was sent.',
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Composer State
  const [prompt, setPrompt] = useState(
    'Research five Web3 startups in autonomous agent payments and prepare a comprehensive intelligence report'
  );
  const [selectedCap, setSelectedCap] = useState<'1.00' | '2.50' | '5.00'>('2.50');
  const [rails, setRails] = useState({
    tavily: true,
    perplexity: true,
    coingecko: false,
    firecrawl: true,
  });

  // History Tab Filter
  const [historyTab, setHistoryTab] = useState<'all' | 'completed' | 'blocked'>('all');

  const handlePauseResume = () => {
    onShowToast('Task execution is not configured.', true);
  };

  const handleAbort = () => {
    onShowToast('No task is running.', true);
  };

  const fillExample = () => {
    const examples = [
      'Map all agentic smart contract protocols deployed on Base Sepolia with active micro-escrow balances over $500.',
      'Scrape latest ERC-7579 modular account pull requests and extract proposed session validation hooks.',
      'Query real-time cross-DEX liquidity spreads on Base Sepolia and simulate flash-loan arbitrage routes.',
    ];
    const picked = examples[Math.floor(Math.random() * examples.length)];
    setPrompt(picked);
    onShowToast('Example prompt injected');
  };

  const handleLaunch = () => {
    if (!prompt.trim()) {
      onShowToast('Please enter an objective prompt', true);
      return;
    }

    onShowToast('Task execution is disabled until the backend agent and payment policy are configured.', true);
  };

  const filteredTasks = tasks.filter((t) => {
    if (historyTab === 'all') return true;
    if (historyTab === 'completed') return t.status === 'completed';
    if (historyTab === 'blocked') return t.status === 'blocked';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 space-y-4 pb-24 pt-20">
      {/* Active Execution Pipeline Banner (Top Card) */}
      <div className="relative overflow-hidden rounded-xl bg-[#272b26] border border-[#3d4a43]/70 p-4 shadow-xl">
        {/* Cybernetic Ambient Glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#70f3be]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-3">
          {/* Card Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 bg-[#1d211c] border border-[#3d4a43]/60 px-2 py-0.5 rounded">
              <span
                className={`w-2 h-2 rounded-full ${
                  pipelineState === 'running'
                    ? 'bg-[#70f3be] animate-ping'
                    : pipelineState === 'paused'
                    ? 'bg-[#c8ead9]'
                    : 'bg-[#ffb4ab]'
                }`}
              ></span>
              <span
                className={`font-label-caps text-[10px] tracking-wider uppercase ${
                  pipelineState === 'running'
                    ? 'text-[#70f3be]'
                    : pipelineState === 'paused'
                    ? 'text-[#c8ead9]'
                    : 'text-[#ffb4ab]'
                }`}
              >
                {pipelineState === 'running'
                  ? 'PIPELINE RUNNING'
                  : pipelineState === 'paused'
                  ? 'WORKFLOW PAUSED'
                  : 'EXECUTION ABORTED'}
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-[#323631] px-2 py-0.5 rounded border border-[#3d4a43]/40">
              <span className="material-symbols-outlined text-[#70f3be] text-[14px]">bolt</span>
              <span className="font-mono text-[11px] text-[#bccac0]">{tokSpeed} tok/s</span>
            </div>
          </div>

          {/* Task Title & Engine */}
          <div>
            <h2 className="font-headline text-[17px] leading-tight text-[#e0e4dc] font-semibold tracking-tight">
              Synthesize Agentic Micropayment Protocols
            </h2>
            <div className="flex items-center space-x-1.5 mt-1 text-[#bccac0]">
              <span className="material-symbols-outlined text-[14px] text-[#70f3be]">psychology</span>
              <span className="font-mono text-[11px] text-[#c0c9c1]">Agent Teena (Groq LLaMA 3.3 70B)</span>
              <span className="text-[#86948b] text-xs">•</span>
              <span className="font-mono text-[11px] text-[#bccac0]">Sub-sec Tool Calling</span>
            </div>
          </div>

          {/* Stepper / Progress Bar (Step 3 of 5) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-label-caps text-[10px] text-[#70f3be]">{stepLabel}</span>
              <span className="font-mono text-[11px] text-[#bccac0]">
                {Math.round((step / 5) * 100)}% COMPLETED
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1d211c] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#70f3be] rounded-full transition-all duration-500 shadow-[0_0_8px_#50d6a3]"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>

            {/* Micro Step Nodes */}
            <div className="grid grid-cols-5 gap-1 pt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-colors ${
                    s < step
                      ? 'bg-[#70f3be]'
                      : s === step
                      ? 'bg-[#70f3be] animate-pulse'
                      : 'bg-[#323631]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Spending Cap Telemetry Bar */}
          <div className="flex items-center justify-between p-2.5 rounded bg-[#0b0f0b] border border-[#272b26]">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[16px] text-[#70f3be]">
                account_balance_wallet
              </span>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-[#bccac0]">SPENT VS CAP</span>
                <span className="font-mono text-[13px] text-[#e0e4dc] font-semibold">
                  ${spentUsdc.toFixed(2)}{' '}
                  <span className="text-[#86948b] text-xs">/ ${capUsdc.toFixed(2)} USDC</span>
                </span>
              </div>
            </div>

            {/* Progress Ring SVG */}
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    className="text-[#323631]"
                    cx="16"
                    cy="16"
                    r="13"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <circle
                    className="text-[#70f3be]"
                    cx="16"
                    cy="16"
                    r="13"
                    fill="transparent"
                    stroke="currentColor"
                    strokeDasharray="81.68"
                    strokeDashoffset={81.68 - (81.68 * (spentUsdc / capUsdc))}
                    strokeWidth="2.5"
                  />
                </svg>
                <span className="absolute font-label-caps text-[9px] text-[#70f3be]">
                  {Math.round((spentUsdc / capUsdc) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Live Streaming Terminal Logs */}
          <div className="rounded bg-[#0b0f0b] p-2.5 space-y-1 font-mono text-[11px] border border-[#272b26]">
            <div className="flex items-center justify-between pb-1 border-b border-[#272b26]">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] animate-ping"></span>
                <span className="font-label-caps text-[9px] text-[#bccac0]">
                  STREAMING AGENT TELEMETRY
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#86948b]">LIVE SYNC</span>
            </div>

            <div className="space-y-1 pt-1 max-h-24 overflow-y-auto font-mono">
              {logs.map((log, i) => (
                <p key={i} className="text-[#bccac0] leading-tight text-[11px]">
                  {log}
                </p>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Action Buttons: Pause & Abort */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handlePauseResume}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded bg-[#1d211c] border border-[#3d4a43]/50 text-[#e0e4dc] hover:bg-[#272b26] active:scale-95 transition-all min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#70f3be]">
                {pipelineState === 'running' ? 'pause_circle' : 'play_circle'}
              </span>
              <span className="font-mono text-[11px] font-semibold">
                {pipelineState === 'running' ? 'PAUSE WORKFLOW' : 'RESUME RUN'}
              </span>
            </button>

            <button
              onClick={handleAbort}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#93000a]/35 active:scale-95 transition-all min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">stop_circle</span>
              <span className="font-mono text-[11px] font-semibold">ABORT RUN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Asset: Stochastic Autonomy Lock */}
      <div className="relative overflow-hidden rounded-xl bg-[#191d18] border border-[#3d4a43]/40 p-3 flex items-center gap-3 shadow-md">
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative bg-[#272b26]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJJIxs7XOfGR07HBEVijm3f4AZtEXL7jnMJ2Pa3rNw6igmdHixzSwrVHuyxiyrHT56znEB-5_sqG6rIb42tzEsYuEJBDsuZtC3rGyAgEoea7_IPDvQKI7GL73pmlWLlOIkgEUaasOFu9Zd8-9NfokNliMkl579cMMKGh1A0wZTI40mFKwRbSwNyNv59PM6iv9JjDpe1YUF0RG8fUmxjt_jcTESUZT2eXVk76cTiFNbCeaQ6_gOKc_K"
            alt="Autonomous cryptographic AI agent node routing micro-transactions across dark glowing emerald neural mesh circuits"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#70f3be]/10 mix-blend-overlay"></div>
        </div>
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#70f3be]">lock_clock</span>
            <span className="font-label-caps text-[9px] text-[#70f3be]">
              STOCHASTIC AUTONOMY LOCK
            </span>
          </div>
          <p className="font-sans text-[12px] text-[#bccac0] line-clamp-2 leading-relaxed">
            Sub-second verification active on Base Sepolia. Zero manual escrow unlocks needed.
          </p>
        </div>
      </div>

      {/* New Autonomous Task Composer */}
      <div className="rounded-xl bg-[#1d211c] border border-[#3d4a43]/50 p-4 space-y-4 shadow-lg">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#272b26]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#50d6a3]/20 flex items-center justify-center text-[#70f3be]">
              <span className="material-symbols-outlined text-[16px]">add_task</span>
            </div>
            <h3 className="font-headline text-[15px] text-[#e0e4dc] font-semibold">Composer</h3>
          </div>
          <button
            onClick={fillExample}
            className="flex items-center space-x-1 bg-[#272b26] border border-[#3d4a43]/40 px-2.5 py-1 rounded text-[#70f3be] hover:bg-[#323631] active:scale-95 transition-all min-h-[30px]"
          >
            <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
            <span className="font-label-caps text-[9px]">EXAMPLE</span>
          </button>
        </div>

        {/* Autonomous Prompt Area */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-label-caps text-[10px] text-[#bccac0]" htmlFor="agent-prompt">
              AGENT OBJECTIVE &amp; INTENT
            </label>
            <span className="font-mono text-[11px] text-[#86948b]">{prompt.length}/500</span>
          </div>
          <div className="relative rounded bg-[#0b0f0b] border border-[#272b26] p-2.5 transition-colors focus-within:border-[#70f3be]/60">
            <textarea
              id="agent-prompt"
              maxLength={500}
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Specify objective and autonomous operational mandate..."
              className="w-full bg-transparent font-mono text-[12px] text-[#e0e4dc] placeholder-[#86948b] focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Autonomous Inference Runtime */}
        <div className="space-y-1.5">
          <label className="font-label-caps text-[10px] text-[#bccac0]">INFERENCE RUNTIME</label>
          <div className="flex items-center justify-between p-2.5 rounded bg-[#0b0f0b] border border-[#272b26]">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#70f3be]/10 border border-[#70f3be]/30 flex items-center justify-center text-[#70f3be]">
                <span className="material-symbols-outlined text-[18px]">memory</span>
              </div>
              <div>
                <div className="font-mono text-[12px] text-[#e0e4dc] font-semibold">Agent Teena</div>
                <div className="font-label-caps text-[9px] text-[#c0c9c1]">
                  GROQ LLAMA 3.3 70B | ULTRA-LOW LATENCY TOOL CALLER
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-[#1d211c] border border-[#3d4a43]/40 px-2 py-0.5 rounded text-[#70f3be]">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              <span className="font-label-caps text-[9px]">LOCKED</span>
            </div>
          </div>
        </div>

        {/* Spending Cap Ceiling Selector */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-label-caps text-[10px] text-[#bccac0]">
              SPENDING CAP CEILING
            </label>
            <span className="font-label-caps text-[10px] text-[#70f3be]">USDC VIA X402</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { val: '1.00', label: 'LITE RUN' },
              { val: '2.50', label: 'RECOMMENDED' },
              { val: '5.00', label: 'DEEP REASONING' },
            ].map((preset) => {
              const isSelected = selectedCap === preset.val;
              return (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setSelectedCap(preset.val as '1.00' | '2.50' | '5.00')}
                  className={`py-2 px-1 text-center rounded transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#50d6a3]/20 border border-[#70f3be] text-[#70f3be] shadow-[0_0_12px_rgba(80,214,163,0.15)] font-bold'
                      : 'bg-[#0b0f0b] border border-[#272b26] text-[#bccac0] hover:bg-[#272b26]'
                  }`}
                >
                  <span
                    className={`font-mono text-[13px] block ${
                      isSelected ? 'text-[#70f3be] font-bold' : 'text-[#e0e4dc]'
                    }`}
                  >
                    ${preset.val}
                  </span>
                  <span
                    className={`font-label-caps text-[9px] ${
                      isSelected ? 'text-[#70f3be]' : 'text-[#86948b]'
                    }`}
                  >
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="font-sans text-[11px] text-[#86948b] flex items-center gap-1 pt-0.5">
            <span className="material-symbols-outlined text-[14px] text-[#bccac0]">info</span>
            <span>Agents stop requesting x402 signatures once ceiling is reached.</span>
          </p>
        </div>

        {/* Authorized x402 Micropayment Rails */}
        <div className="space-y-2">
          <label className="font-label-caps text-[10px] text-[#bccac0]">
            AUTHORIZED X402 MICROPAYMENT RAILS
          </label>
          <div className="space-y-1.5">
            {/* Tool 1 */}
            <label className="flex items-center justify-between p-2.5 rounded bg-[#0b0f0b] border border-[#272b26] cursor-pointer hover:border-[#3d4a43] transition-colors">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={rails.tavily}
                  onChange={(e) => setRails({ ...rails, tavily: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#70f3be] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-[12px] text-[#e0e4dc] font-medium">
                    Tavily Search Engine
                  </span>
                  <span className="font-label-caps text-[9px] text-[#c0c9c1]">
                    SYNCHRONOUS REAL-TIME WEB DATA
                  </span>
                </div>
              </div>
              <div className="font-mono text-[11px] text-[#70f3be] font-semibold">
                $0.25 <span className="text-[#86948b] text-xs">/ query</span>
              </div>
            </label>

            {/* Tool 2 */}
            <label className="flex items-center justify-between p-2.5 rounded bg-[#0b0f0b] border border-[#272b26] cursor-pointer hover:border-[#3d4a43] transition-colors">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={rails.perplexity}
                  onChange={(e) => setRails({ ...rails, perplexity: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#70f3be] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-[12px] text-[#e0e4dc] font-medium">
                    Perplexity Sonar Deep
                  </span>
                  <span className="font-label-caps text-[9px] text-[#c0c9c1]">
                    MULTI-HOP ACADEMIC SYNTHESIS
                  </span>
                </div>
              </div>
              <div className="font-mono text-[11px] text-[#70f3be] font-semibold">
                $0.50 <span className="text-[#86948b] text-xs">/ call</span>
              </div>
            </label>

            {/* Tool 3 */}
            <label className="flex items-center justify-between p-2.5 rounded bg-[#0b0f0b] border border-[#272b26] cursor-pointer hover:border-[#3d4a43] transition-colors">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={rails.coingecko}
                  onChange={(e) => setRails({ ...rails, coingecko: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#70f3be] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-[12px] text-[#e0e4dc] font-medium">
                    CoinGecko Pro Terminal
                  </span>
                  <span className="font-label-caps text-[9px] text-[#86948b]">
                    DEX LIQUIDITY &amp; DEPTH FEED
                  </span>
                </div>
              </div>
              <div className="font-mono text-[11px] text-[#bccac0] font-semibold">
                $0.15 <span className="text-[#86948b] text-xs">/ req</span>
              </div>
            </label>
          </div>
        </div>

        {/* Primary Launch Button */}
        <button
          onClick={handleLaunch}
          className="w-full py-3.5 px-4 rounded bg-[#70f3be] text-[#003826] font-headline text-[14px] font-bold flex items-center justify-center space-x-2 shadow-[0_0_16px_rgba(80,214,163,0.35)] hover:bg-[#50d6a3] active:scale-[0.98] transition-all min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span>Launch Autonomous Task</span>
        </button>
      </div>

      {/* Workflows & Audit History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#70f3be] text-[18px]">history</span>
            <h3 className="font-headline text-[15px] text-[#e0e4dc] font-semibold">
              Workflow History
            </h3>
          </div>
          <span className="font-label-caps text-[10px] text-[#86948b]">
            {tasks.length} TOTAL EXECUTIONS
          </span>
        </div>

        {/* Filter Tab Bar */}
        <div className="flex p-1 bg-[#1d211c] border border-[#272b26] rounded gap-1">
          <button
            onClick={() => setHistoryTab('all')}
            className={`tab-btn flex-1 py-1 px-2 rounded font-label-caps text-[10px] text-center transition-all ${
              historyTab === 'all'
                ? 'bg-[#272b26] text-[#70f3be] font-bold'
                : 'text-[#bccac0] hover:bg-[#272b26]/50'
            }`}
          >
            ALL ({tasks.length})
          </button>
          <button
            onClick={() => setHistoryTab('completed')}
            className={`tab-btn flex-1 py-1 px-2 rounded font-label-caps text-[10px] text-center transition-all ${
              historyTab === 'completed'
                ? 'bg-[#272b26] text-[#70f3be] font-bold'
                : 'text-[#bccac0] hover:bg-[#272b26]/50'
            }`}
          >
            COMPLETED ({tasks.filter((t) => t.status === 'completed').length})
          </button>
          <button
            onClick={() => setHistoryTab('blocked')}
            className={`tab-btn flex-1 py-1 px-2 rounded font-label-caps text-[10px] text-center transition-all ${
              historyTab === 'blocked'
                ? 'bg-[#272b26] text-[#ffb4ab] font-bold'
                : 'text-[#bccac0] hover:bg-[#272b26]/50'
            }`}
          >
            BLOCKED ({tasks.filter((t) => t.status === 'blocked').length})
          </button>
        </div>

        {/* Visual Secondary Graphic Frame */}
        <div className="relative overflow-hidden rounded-lg bg-[#191d18] h-24 p-3 flex items-end border border-[#3d4a43]/40">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4ItFQpr_802-BiEcYkGsD6tlc5sRQKXagSQ434OkwgyGiVOfxyulkzr7fqv3YnihBRcREdnz69hHP1FnwImQgwC509bV5ZglDbdKN7ASjiok70mPQP6q4WgDaYROd8WT_A-dlVw3KuNVXHjaEXFE-TrYGZ3qeSSnoKFW8ic1Bx-HzFM5WeZxpPvhMXpFpsPzhxOwiAFKhNWjiJBNO8iKEewByGcmq9C4xymNy8w2CdEhH5wiUEw')",
            }}
          ></div>
          <div className="relative z-10 w-full flex justify-between items-center">
            <div>
              <span className="font-label-caps text-[9px] text-[#70f3be] block">
                CONSENSUS INTEGRITY
              </span>
              <span className="font-mono text-[12px] text-[#e0e4dc] font-medium">
                100% Non-Custodial Delivery
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#323631]/80 border border-[#3d4a43]/50 px-2 py-0.5 rounded backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be]"></span>
              <span className="font-label-caps text-[9px] text-[#e0e4dc]">SMART CONTRACT: ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-2">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="rounded-lg bg-[#1d211c] border border-[#272b26] p-3 space-y-2 shadow hover:border-[#3d4a43] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      t.status === 'completed' ? 'bg-[#70f3be]' : 'bg-[#ffb4ab]'
                    }`}
                  ></span>
                  <span
                    className={`font-label-caps text-[10px] ${
                      t.status === 'completed' ? 'text-[#70f3be]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {t.status === 'completed' ? 'COMPLETED' : 'CEILING BLOCKED'}
                  </span>
                  <span className="text-[#86948b] text-xs">•</span>
                  <span className="font-mono text-[11px] text-[#86948b]">{t.duration}</span>
                </div>
                <span
                  className={`font-mono text-[13px] font-semibold ${
                    t.status === 'completed' ? 'text-[#70f3be]' : 'text-[#ffb4ab]'
                  }`}
                >
                  ${t.cost.toFixed(2)} {t.cap ? `/ $${t.cap.toFixed(2)}` : 'USDC'}
                </span>
              </div>

              <div>
                <h4 className="font-sans text-[13px] text-[#e0e4dc] font-semibold leading-snug">
                  {t.title}
                </h4>
                <p
                  className={`font-mono text-[11px] mt-0.5 line-clamp-1 ${
                    t.status === 'completed' ? 'text-[#bccac0]' : 'text-[#ffb4ab]/80'
                  }`}
                >
                  {t.errorReason || `Engine: ${t.runtime} • ${t.toolsInvoked} API tools invoked`}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`https://sepolia.basescan.org`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 font-mono text-[11px] text-[#c0c9c1] hover:text-[#70f3be] transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  <span>{t.txHash} (Sepolia)</span>
                </a>

                {t.status === 'completed' ? (
                  <button
                    onClick={() => onOpenReport(t)}
                    className="flex items-center space-x-1 py-1 px-2.5 rounded bg-[#323631] text-[#e0e4dc] hover:bg-[#272b26] active:scale-95 transition-colors min-h-[30px]"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#70f3be]">
                      summarize
                    </span>
                    <span className="font-label-caps text-[9px]">VIEW REPORT</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onIncreaseCap(t.id)}
                    className="flex items-center space-x-1 py-1 px-2.5 rounded bg-[#323631] text-[#e0e4dc] hover:bg-[#272b26] active:scale-95 transition-colors min-h-[30px]"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#bccac0]">
                      replay
                    </span>
                    <span className="font-label-caps text-[9px]">INCREASE CAP</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
