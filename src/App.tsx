import { useEffect, useState } from 'react';
import { Eip1193Provider, Eip6963ProviderDetail, EVM_NETWORKS, USDC_BY_CHAIN } from './ethereum';
import { TabType, ServiceItem, TransactionItem, TaskItem, PolicyState } from './types';
import {
  INITIAL_SERVICES,
  INITIAL_POLICIES,
} from './mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { ReportModal } from './components/ReportModal';
import { WhitelistModal } from './components/WhitelistModal';
import { FreezeModal } from './components/FreezeModal';
import { SafeDetailsModal } from './components/SafeDetailsModal';
import { OverviewScreen } from './screens/OverviewScreen';
import { TasksScreen } from './screens/TasksScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { PoliciesScreen } from './screens/PoliciesScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [policy, setPolicy] = useState<PolicyState>(INITIAL_POLICIES);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  // Modals & Popovers
  const [reportTask, setReportTask] = useState<TaskItem | null>(null);
  const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [safeModalOpen, setSafeModalOpen] = useState(false);
  const [agentWallet, setAgentWallet] = useState<{
    address: string;
    balanceStatus?: string;
    ethBalance?: string | null;
    usdcBalance?: string | null;
    error?: string;
    balanceErrors?: Record<string, string>;
  }>({ address: '' });
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<Eip1193Provider | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);
  const [chainId, setChainId] = useState(84532);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'active' | 'offline'>('checking');
  const [walletChainId, setWalletChainId] = useState(84532);
  const [unsupportedWalletNetwork, setUnsupportedWalletNetwork] = useState(false);
  const [personalBalances, setPersonalBalances] = useState('Reading balances…');

  // Toast
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = (message: string, isError: boolean = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  useEffect(() => {
    let alive = true;
    fetch('/api/health')
      .then((response) => { if (!response.ok) throw new Error('API unavailable'); return response.json(); })
      .then((data) => { if (alive) setBackendStatus(data.ok ? 'active' : 'offline'); })
      .catch(() => { if (alive) setBackendStatus('offline'); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    fetch(`/api/wallet?chainId=${chainId}`)
      .then((response) => response.json())
      .then((data) => { if (alive) setAgentWallet({
        address: data.address ?? '',
        balanceStatus: data.balanceStatus,
        ethBalance: data.ethBalance,
        usdcBalance: data.usdcBalance,
        error: data.error,
        balanceErrors: data.balanceErrors,
      }); })
      .catch(() => { if (alive) setAgentWallet({ address: '', error: 'Wallet API is unavailable.' }); });
    return () => { alive = false; };
  }, [chainId]);

  useEffect(() => {
    const legacy = window.ethereum;
    const legacyMetaMask = legacy?.providers?.find((provider) => provider.isMetaMask) ??
      (legacy?.isMetaMask ? legacy : null);
    if (legacyMetaMask) setWalletProvider(legacyMetaMask);
    const announce = (event: Event) => {
      const detail = (event as CustomEvent<Eip6963ProviderDetail>).detail;
      if (detail?.provider && detail.info?.rdns === 'io.metamask') setWalletProvider(detail.provider);
    };
    window.addEventListener('eip6963:announceProvider', announce as EventListener);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    return () => window.removeEventListener('eip6963:announceProvider', announce as EventListener);
  }, []);

  useEffect(() => {
    const provider = walletProvider;
    if (!provider) return;
    provider.request({ method: 'eth_accounts' }).then((accounts) => {
      const list = accounts as string[];
      setConnectedAddress(list[0] ?? null);
    }).catch(() => setConnectedAddress(null));
    provider.request({ method: 'eth_chainId' }).then((id) => {
      const parsed = Number.parseInt(String(id), 16);
      setWalletChainId(parsed);
      if (parsed === 84532 || parsed === 8453) {
        setChainId(parsed);
        setUnsupportedWalletNetwork(false);
      } else setUnsupportedWalletNetwork(true);
    }).catch(() => undefined);

    const onAccountsChanged = (accounts: unknown) => setConnectedAddress((accounts as string[])[0] ?? null);
    const onChainChanged = (id: unknown) => {
      const parsed = Number.parseInt(String(id), 16);
      setWalletChainId(parsed);
      if (parsed === 84532 || parsed === 8453) {
        setChainId(parsed);
        setUnsupportedWalletNetwork(false);
      } else setUnsupportedWalletNetwork(true);
    };
    provider.on?.('accountsChanged', onAccountsChanged);
    provider.on?.('chainChanged', onChainChanged);
    return () => {
      provider.removeListener?.('accountsChanged', onAccountsChanged);
      provider.removeListener?.('chainChanged', onChainChanged);
    };
  }, [walletProvider]);

  useEffect(() => {
    let alive = true;
    const provider = walletProvider;
    if (!connectedAddress || !provider || unsupportedWalletNetwork || !USDC_BY_CHAIN[walletChainId]) {
      setPersonalBalances(connectedAddress ? `Unsupported network (${walletChainId})` : '');
      return;
    }
    const padded = connectedAddress.slice(2).toLowerCase().padStart(64, '0');
    Promise.all([
      provider.request({ method: 'eth_getBalance', params: [connectedAddress, 'latest'] }),
      provider.request({ method: 'eth_call', params: [{ to: USDC_BY_CHAIN[walletChainId], data: `0x70a08231${padded}` }, 'latest'] }),
    ]).then(([ethValue, tokenValue]) => {
      const eth = (BigInt(String(ethValue)) / 10n ** 14n).toString().padStart(5, '0');
      const ethText = `${eth.slice(0, -4) || '0'}.${eth.slice(-4)}`;
      const rawUsdc = BigInt(String(tokenValue));
      const usdcText = `${rawUsdc / 1_000_000n}.${(rawUsdc % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '') || '0'}`;
      if (alive) setPersonalBalances(`${ethText} ETH · ${usdcText} USDC`);
    }).catch(() => { if (alive) setPersonalBalances('Balance unavailable'); });
    return () => { alive = false; };
  }, [connectedAddress, chainId, walletChainId, unsupportedWalletNetwork, walletProvider]);

  const handleConnectWallet = async () => {
    setWalletBusy(true);
    try {
      let provider = walletProvider;
      const legacy = window.ethereum;
      provider ??= legacy?.providers?.find((candidate) => candidate.isMetaMask) ??
        (legacy?.isMetaMask ? legacy : null);
      if (!provider) {
        provider = await new Promise<Eip1193Provider | null>((resolve) => {
          let complete = false;
          const finish = (found: Eip1193Provider | null) => {
            if (complete) return;
            complete = true;
            window.removeEventListener('eip6963:announceProvider', onAnnounce as EventListener);
            window.clearTimeout(timeout);
            resolve(found);
          };
          const onAnnounce = (event: Event) => {
            const detail = (event as CustomEvent<Eip6963ProviderDetail>).detail;
            if (detail?.info?.rdns === 'io.metamask') finish(detail.provider);
          };
          const timeout = window.setTimeout(() => finish(null), 500);
          window.addEventListener('eip6963:announceProvider', onAnnounce as EventListener);
          window.dispatchEvent(new Event('eip6963:requestProvider'));
        });
      }
      if (!provider) throw new Error('MetaMask was not detected in this browser tab.');
      setWalletProvider(provider);
      const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
      setConnectedAddress(accounts[0] ?? null);
      const id = await provider.request({ method: 'eth_chainId' });
      const parsed = Number.parseInt(String(id), 16);
      setWalletChainId(parsed);
      if (parsed === 84532 || parsed === 8453) {
        setChainId(parsed);
        setUnsupportedWalletNetwork(false);
      } else {
        setUnsupportedWalletNetwork(true);
        showToast(`Connected wallet is on unsupported chain ${parsed}.`, true);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'MetaMask connection was not completed.', true);
    } finally {
      setWalletBusy(false);
    }
  };

  const handleSelectNetwork = async (nextChainId: number) => {
    if (nextChainId !== 84532 && nextChainId !== 8453) return;
    if (walletProvider) {
      const hexChainId = `0x${nextChainId.toString(16)}`;
      try {
        await walletProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChainId }] });
      } catch (error) {
        const code = (error as { code?: number }).code;
        if (code === 4902) {
          try {
            await walletProvider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: hexChainId, ...EVM_NETWORKS[nextChainId] }] });
          } catch {
            showToast('Network was not added to your wallet.', true);
            return;
          }
        } else {
          showToast('Network switch was not completed.', true);
          return;
        }
      }
    }
    setChainId(nextChainId);
    setWalletChainId(nextChainId);
    setUnsupportedWalletNetwork(false);
  };

  const walletAddress = agentWallet.address;

  const handleCopyAddress = () => {
    if (!walletAddress) {
      showToast('AgentPay wallet address is not configured.', true);
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(walletAddress);
    }
    showToast('Safe address copied to clipboard');
  };

  const handleToggleService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const nextState = !s.connected;
          showToast(`Local provider display changed for ${s.name}. Backend allowlist is not configured.`, true);
          return { ...s, connected: nextState };
        }
        return s;
      })
    );
  };

  const handleAddCustomService = (newService: ServiceItem) => {
    setServices((prev) => [newService, ...prev]);
    // Also add to whitelist domains if not present
    const domain = newService.name.toLowerCase();
    if (!policy.whitelistedDomains.includes(domain)) {
      setPolicy((prev) => ({
        ...prev,
        whitelistedDomains: [...prev.whitelistedDomains, domain],
      }));
    }
  };

  const handleAddNewTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleIncreaseCap = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
            cost: (t.cap || 1.0) + 1.0,
            cap: undefined,
            errorReason: undefined,
            duration: '1m 45s',
            report: `### Task Completed with Increased Cap
**Status:** Cap raised to $2.00 USDC. Execution resumed and concluded successfully.
**Result:** 5 zero-knowledge verifier nodes audited. Finality proven on Base Sepolia.`,
          };
        }
        return t;
      })
    );
    showToast('Cap raised by $1.00 USDC. Task resumed & completed!');
  };

  const handleAddDomain = (domain: string) => {
    setPolicy((prev) => ({
      ...prev,
      whitelistedDomains: [...prev.whitelistedDomains, domain],
    }));
    showToast(`Domain ${domain} added to the local UI list only.`, true);
  };

  const handleRemoveDomain = (domain: string) => {
    setPolicy((prev) => ({
      ...prev,
      whitelistedDomains: prev.whitelistedDomains.filter((d) => d !== domain),
    }));
    showToast(`Domain ${domain} removed from allowlist`, true);
  };

  const handleConfirmFreeze = () => {
    const next = !isFrozen;
    setIsFrozen(next);
    showToast(next ? 'Local freeze flag set. No on-chain revocation was sent.' : 'Local freeze flag cleared.');
  };

  return (
    <div className="min-h-screen bg-[#101410] text-[#e0e4dc] font-sans flex flex-col relative selection:bg-[#70f3be]/30 selection:text-[#70f3be]">
      {/* Top Header */}
      <Header
        walletAddress={walletAddress}
        onCopyAddress={handleCopyAddress}
        onOpenSafeModal={() => setSafeModalOpen(true)}
        connectedAddress={connectedAddress}
        onConnectWallet={handleConnectWallet}
        walletBusy={walletBusy}
        chainId={chainId}
        onSelectNetwork={handleSelectNetwork}
        personalBalances={personalBalances}
        unsupportedWalletNetwork={unsupportedWalletNetwork ? walletChainId : null}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {currentTab === 'overview' && (
          <OverviewScreen
            onNavigate={(tab) => setCurrentTab(tab)}
            policy={policy}
            onShowToast={showToast}
            wallet={agentWallet}
            chainId={chainId}
            backendStatus={backendStatus}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            policy={policy}
            onOpenReport={(t) => setReportTask(t)}
            onShowToast={showToast}
            onIncreaseCap={handleIncreaseCap}
            onAddNewTask={handleAddNewTask}
          />
        )}

        {currentTab === 'activity' && (
          <ActivityScreen
            transactions={transactions}
            walletAddress={walletAddress || 'AgentPay wallet not configured'}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'services' && (
          <ServicesScreen
            services={services}
            onToggleService={handleToggleService}
            onAddCustomService={handleAddCustomService}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'policies' && (
          <PoliciesScreen
            policy={policy}
            onUpdatePolicy={(p) => setPolicy(p)}
            onOpenWhitelistModal={() => setWhitelistModalOpen(true)}
            onOpenFreezeModal={() => setFreezeModalOpen(true)}
            onShowToast={showToast}
            isFrozen={isFrozen}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        activeCount={{ tasks: tasks.filter((t) => t.status === 'running').length }}
      />

      {/* Modals */}
      <ReportModal
        task={reportTask}
        onClose={() => setReportTask(null)}
        onCopyReport={() => {
          if (reportTask?.report && navigator.clipboard) {
            navigator.clipboard.writeText(reportTask.report);
            showToast('Report markdown copied to clipboard');
          }
        }}
      />

      <WhitelistModal
        isOpen={whitelistModalOpen}
        onClose={() => setWhitelistModalOpen(false)}
        domains={policy.whitelistedDomains}
        onAddDomain={handleAddDomain}
        onRemoveDomain={handleRemoveDomain}
      />

      <FreezeModal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        onConfirmFreeze={handleConfirmFreeze}
        isFrozen={isFrozen}
      />

      <SafeDetailsModal
        isOpen={safeModalOpen}
        onClose={() => setSafeModalOpen(false)}
        walletAddress={walletAddress || 'Not configured'}
        chainId={chainId}
      />

      {/* Floating Feedback Toast */}
      <Toast message={toast?.message || null} isError={toast?.isError} />
    </div>
  );
}
