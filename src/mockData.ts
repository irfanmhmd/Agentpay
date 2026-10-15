import { ServiceItem, TransactionItem, TaskItem, PolicyState } from './types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'tavily',
    name: 'Tavily AI Search',
    category: 'web_search',
    categoryLabel: 'WEB SEARCH',
    protocolBadge: 'x402',
    description: 'Real-time Autonomous Web Grounding',
    unitRate: '$0.25',
    rateUnit: '/ query',
    rateNumeric: 0.25,
    metricLabel: 'SUCCESS',
    metricValue: '99.8%',
    latency: '240ms',
    address: '0x44B...e71A',
    connected: true,
    icon: 'travel_explore'
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar',
    category: 'llm_inference',
    categoryLabel: 'LLM INFERENCE',
    protocolBadge: 'x402',
    description: 'Multi-hop Citations & Reasoning',
    unitRate: '$0.50',
    rateUnit: '/ call',
    rateNumeric: 0.50,
    metricLabel: 'SUCCESS',
    metricValue: '99.4%',
    latency: '820ms',
    address: '0x81C...9A02',
    connected: true,
    icon: 'troubleshoot'
  },
  {
    id: 'groq',
    name: 'Groq LLaMA 3.3',
    category: 'llm_inference',
    categoryLabel: 'LLM INFERENCE',
    protocolBadge: 'CORE',
    description: 'Ultra-Fast LPU Inference Runtime',
    unitRate: '$0.0001',
    rateUnit: '/ 1k',
    rateNumeric: 0.0001,
    metricLabel: 'VELOCITY',
    metricValue: '520 tok/s',
    latency: '42ms',
    address: '0x000...ROOT',
    connected: true,
    locked: true,
    icon: 'bolt'
  },
  {
    id: 'coingecko',
    name: 'CoinGecko Pro',
    category: 'crypto_data',
    categoryLabel: 'CRYPTO DATA',
    protocolBadge: 'STANDBY',
    description: 'CEX/DEX Liquidity & Pricing Terminal',
    unitRate: '$0.15',
    rateUnit: '/ req',
    rateNumeric: 0.15,
    metricLabel: 'RELIABILITY',
    metricValue: '99.9%',
    latency: '110ms',
    address: '0x12F...990B',
    connected: false,
    icon: 'currency_bitcoin'
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl Scraper',
    category: 'scraping',
    categoryLabel: 'SCRAPING',
    protocolBadge: 'x402',
    description: 'Clean Markdown & Headless Parsing',
    unitRate: '$0.30',
    rateUnit: '/ page',
    rateNumeric: 0.30,
    metricLabel: 'SUCCESS',
    metricValue: '98.9%',
    latency: '1.2s',
    address: '0x62E...113C',
    connected: true,
    icon: 'local_fire_department'
  },
  {
    id: 'exa',
    name: 'Exa AI Search',
    category: 'web_search',
    categoryLabel: 'WEB SEARCH',
    protocolBadge: 'STANDBY',
    description: 'Embedding-Based Neural Discovery',
    unitRate: '$0.20',
    rateUnit: '/ query',
    rateNumeric: 0.20,
    metricLabel: 'RELIABILITY',
    metricValue: '99.1%',
    latency: '310ms',
    address: '0x992...38DA',
    connected: false,
    icon: 'hub'
  },
  {
    id: 'serpapi',
    name: 'SerpApi Engine',
    category: 'web_search',
    categoryLabel: 'WEB SEARCH',
    protocolBadge: 'x402',
    description: 'Google SERP Structured Parsing',
    unitRate: '$0.40',
    rateUnit: '/ query',
    rateNumeric: 0.40,
    metricLabel: 'SUCCESS',
    metricValue: '99.9%',
    latency: '350ms',
    address: '0x53A...119F',
    connected: true,
    icon: 'search'
  },
  {
    id: 'pinecone',
    name: 'Pinecone Vector DB',
    category: 'llm_inference',
    categoryLabel: 'LLM INFERENCE',
    protocolBadge: 'x402',
    description: 'Sub-millisecond Vector Similarity',
    unitRate: '$0.12',
    rateUnit: '/ 10k',
    rateNumeric: 0.12,
    metricLabel: 'UPTIME',
    metricValue: '99.95%',
    latency: '38ms',
    address: '0x4C1...9102',
    connected: true,
    icon: 'memory'
  },
  {
    id: 'dune',
    name: 'Dune Analytics SQL',
    category: 'crypto_data',
    categoryLabel: 'CRYPTO DATA',
    protocolBadge: 'STANDBY',
    description: 'Decentralized On-Chain SQL Execution',
    unitRate: '$0.45',
    rateUnit: '/ query',
    rateNumeric: 0.45,
    metricLabel: 'RELIABILITY',
    metricValue: '99.3%',
    latency: '1.8s',
    address: '0x99C...2310',
    connected: false,
    icon: 'database'
  },
  {
    id: 'dexscreener',
    name: 'DexScreener Stream',
    category: 'crypto_data',
    categoryLabel: 'CRYPTO DATA',
    protocolBadge: 'STANDBY',
    description: 'Instant Token Pairs & Mempool Spikes',
    unitRate: '$0.10',
    rateUnit: '/ min',
    rateNumeric: 0.10,
    metricLabel: 'LATENCY',
    metricValue: '65ms',
    latency: '65ms',
    address: '0x18D...FA42',
    connected: false,
    icon: 'show_chart'
  },
  {
    id: 'brightdata',
    name: 'BrightData Residential',
    category: 'scraping',
    categoryLabel: 'SCRAPING',
    protocolBadge: 'STANDBY',
    description: 'Anti-Bot Captcha Bypass Web Crawl',
    unitRate: '$0.75',
    rateUnit: '/ MB',
    rateNumeric: 0.75,
    metricLabel: 'BYPASS',
    metricValue: '99.7%',
    latency: '980ms',
    address: '0x883...BC11',
    connected: false,
    icon: 'vpn_lock'
  },
  {
    id: 'farcaster',
    name: 'Farcaster Hub API',
    category: 'social',
    categoryLabel: 'SOCIAL',
    protocolBadge: 'STANDBY',
    description: 'Decentralized Social Feed & Casts',
    unitRate: '$0.05',
    rateUnit: '/ 100 casts',
    rateNumeric: 0.05,
    metricLabel: 'RELIABILITY',
    metricValue: '99.8%',
    latency: '140ms',
    address: '0x712...D80E',
    connected: false,
    icon: 'share'
  },
  {
    id: 'twitter',
    name: 'X (Twitter) v2 Firehose',
    category: 'social',
    categoryLabel: 'SOCIAL',
    protocolBadge: 'STANDBY',
    description: 'Live Social Sentiment & Mentions',
    unitRate: '$0.35',
    rateUnit: '/ batch',
    rateNumeric: 0.35,
    metricLabel: 'UPTIME',
    metricValue: '98.5%',
    latency: '410ms',
    address: '0xAA1...5409',
    connected: false,
    icon: 'chat'
  },
  {
    id: 'groq_whisper',
    name: 'Groq Whisper Large v3',
    category: 'llm_inference',
    categoryLabel: 'LLM INFERENCE',
    protocolBadge: 'x402',
    description: 'Real-time Autonomous Speech Transcription',
    unitRate: '$0.03',
    rateUnit: '/ audio min',
    rateNumeric: 0.03,
    metricLabel: 'SPEED',
    metricValue: '216x RT',
    latency: '85ms',
    address: '0x000...WSPR',
    connected: true,
    icon: 'mic'
  }
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    title: 'Tavily AI Search API',
    serviceId: 'tavily',
    timestamp: '2026-10-15T02:45:00Z',
    timeAgo: '2 mins ago',
    blockNumber: 18921043,
    amount: 0.25,
    currency: 'USDC',
    gasEth: 0.00004,
    txHash: '0x89d2...71e4',
    status: 'confirmed',
    icon: 'manage_search'
  },
  {
    id: 'tx-2',
    title: 'CoinGecko Pro Feed',
    serviceId: 'coingecko',
    timestamp: '2026-10-15T02:33:00Z',
    timeAgo: '14 mins ago',
    blockNumber: 18920982,
    amount: 0.15,
    currency: 'USDC',
    gasEth: 0.00003,
    txHash: '0x33b1...e98a',
    status: 'confirmed',
    icon: 'candlestick_chart'
  },
  {
    id: 'tx-3',
    title: 'Unauthorized Scraper API',
    timestamp: '2026-10-15T01:47:00Z',
    timeAgo: '1 hr ago',
    blockNumber: 18920710,
    amount: 12.00,
    currency: 'USDC',
    gasEth: 0.00000,
    txHash: '0x0000...BLOCKED',
    status: 'blocked',
    isBlocked: true,
    violationRule: 'POLICY VIOLATION #LIMIT_EXCEEDED',
    violationReason: 'Single-tx limit ($5.00 USDC max) exceeded. Intercepted at RPC Gateway. Zero gas penalty applied.',
    icon: 'block'
  },
  {
    id: 'tx-4',
    title: 'Perplexity Sonar Research',
    serviceId: 'perplexity',
    timestamp: '2026-10-14T23:47:00Z',
    timeAgo: '3 hours ago',
    blockNumber: 18920412,
    amount: 0.50,
    currency: 'USDC',
    gasEth: 0.00004,
    txHash: '0x14f9...45cb',
    status: 'confirmed',
    icon: 'neurology'
  },
  {
    id: 'tx-5',
    title: 'Firecrawl Web Extraction',
    serviceId: 'firecrawl',
    timestamp: '2026-10-14T21:47:00Z',
    timeAgo: '5 hours ago',
    blockNumber: 18919870,
    amount: 0.30,
    currency: 'USDC',
    gasEth: 0.00003,
    txHash: '0x76c2...11d0',
    status: 'confirmed',
    icon: 'hub'
  },
  {
    id: 'tx-6',
    title: 'Prompt Extraction Endpoint',
    timestamp: '2026-10-14T19:47:00Z',
    timeAgo: '7 hrs ago',
    blockNumber: 18919102,
    amount: 0.85,
    currency: 'USDC',
    gasEth: 0.00000,
    txHash: '0x0000...REJECTED',
    status: 'blocked',
    isBlocked: true,
    violationRule: 'POLICY VIOLATION #UNWHITELISTED_HOST',
    violationReason: 'Unwhitelisted target hostname intercepted prior to contract dispatch. Session token quarantined.',
    icon: 'dangerous'
  },
  {
    id: 'tx-7',
    title: 'Vector Embeddings Sync',
    serviceId: 'pinecone',
    timestamp: '2026-10-14T15:20:00Z',
    timeAgo: '11 hrs ago',
    blockNumber: 18918230,
    amount: 1.20,
    currency: 'USDC',
    gasEth: 0.00006,
    txHash: '0x4c1e...9102',
    status: 'confirmed',
    icon: 'memory'
  },
  {
    id: 'tx-8',
    title: 'SerpApi Live Query',
    serviceId: 'serpapi',
    timestamp: '2026-10-14T12:10:00Z',
    timeAgo: '14 hrs ago',
    blockNumber: 18917800,
    amount: 0.40,
    currency: 'USDC',
    gasEth: 0.00004,
    txHash: '0x9b3a...5821',
    status: 'confirmed',
    icon: 'travel_explore'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Autonomous Arbitrage Liquidity Scanning & Cross-DEX Pathing',
    runtime: 'Agent Teena (Groq LLaMA 3.3 70B)',
    toolsInvoked: 7,
    status: 'completed',
    duration: '2m 14s',
    cost: 1.75,
    txHash: '0x9f82...b134',
    report: `### Autonomous Intelligence Report
**Execution Scope:** Cross-DEX Liquidity on Base Sepolia vs Mainnet Pools
**Target Assets:** WETH, USDC, cbETH, AERO
**Findings:**
1. Uniswap v3 0.05% fee pool displays a 14 bps spread delta relative to Aerodrome slipstream.
2. Intercepted 3 potential frontrunning hops, rerouted via flash loan simulation.
3. Total micro-calls invoked: 4 Tavily deep queries ($1.00), 1 Perplexity reasoning step ($0.50), 1 CoinGecko depth check ($0.15), 1 Groq LPU synthesis ($0.10).
**Settlement Hash:** 0x9f82...b134 on Base Sepolia. Status: Non-custodial 100% verified.`
  },
  {
    id: 'task-2',
    title: 'Tavily Web Ingestion: ERC-4337 Account Abstraction Delta Analysis',
    runtime: 'Agent Teena (Groq LLaMA 3.3 70B)',
    toolsInvoked: 2,
    status: 'completed',
    duration: '48s',
    cost: 0.50,
    txHash: '0x3b11...90cc',
    report: `### ERC-4337 Smart Account Kernel Audit
**Objective:** Compare session validation constraints across Biconomy v2, Safe Core, and Kernel v3.
**Execution Summary:**
- Retrieved 8 GitHub release diffs via Tavily ($0.25).
- Executed Perplexity citation verification on ERC-7579 modular account compliance ($0.25).
- Output: Standardized session key permissions schema compatible with x402 auto-payment envelopes.`
  },
  {
    id: 'task-3',
    title: 'Autonomous Multi-Chain Stress Test on Zero-Knowledge Verifiers',
    runtime: 'Agent Teena (Groq LLaMA 3.3 70B)',
    toolsInvoked: 3,
    status: 'blocked',
    duration: '1m 12s',
    cost: 1.00,
    cap: 1.00,
    txHash: '0x45fe...7aa1',
    errorReason: 'Halted: Agent requested $0.50 Sonar Deep call exceeding $1.00 budget ceiling.',
    report: `### Task Execution Halted: Policy Constraint
**Halt Trigger:** Spending cap ceiling limit reached ($1.00 USDC allocated, 3 micro-calls settled).
**Prevented Action:** Additional $0.50 Perplexity reasoning call refused by local smart account kernel.
**Recommended Remedy:** Increase task spending cap in composer or raise Per-Transaction ceiling.`
  }
];

export const INITIAL_POLICIES: PolicyState = {
  perTransactionCap: 5.00,
  dailyBudgetLimit: 50.00,
  dailyBudgetSpent: 14.20,
  zeroClickAutonomy: true,
  requirePasskeyThreshold: 2.50,
  whitelistedDomains: [
    'tavily.com',
    'perplexity.ai',
    'coingecko.com',
    'groq.api',
    'firecrawl.dev',
    'base-rpc.org',
    'pinecone.io'
  ]
};

export const SECURITY_VIOLATIONS = [
  {
    id: 'sec-1',
    title: 'Unauthorized Web Extractor',
    amount: 12.00,
    reason: 'Exceeded single transaction ceiling ($5.00)',
    timeAgo: '12m ago',
    icon: 'block'
  },
  {
    id: 'sec-2',
    title: 'Unverified Foreign Gateway',
    amount: 0.85,
    reason: 'Target contract not in verified whitelist registry',
    timeAgo: '3h ago',
    icon: 'gpp_bad'
  }
];
