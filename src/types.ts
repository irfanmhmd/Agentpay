export type TabType = 'overview' | 'tasks' | 'activity' | 'services' | 'policies';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'web_search' | 'llm_inference' | 'crypto_data' | 'scraping' | 'social';
  categoryLabel: string;
  protocolBadge: 'x402' | 'CORE' | 'STANDBY';
  description: string;
  unitRate: string;
  rateUnit: string;
  rateNumeric: number;
  metricLabel: string;
  metricValue: string;
  latency: string;
  address: string;
  connected: boolean;
  locked?: boolean;
  icon: string;
}

export interface TransactionItem {
  id: string;
  title: string;
  serviceId?: string;
  timestamp: string;
  timeAgo: string;
  blockNumber: number;
  amount: number;
  currency: string;
  gasEth: number;
  txHash: string;
  status: 'confirmed' | 'blocked';
  isBlocked?: boolean;
  violationRule?: string;
  violationReason?: string;
  icon: string;
}

export interface TaskItem {
  id: string;
  title: string;
  runtime: string;
  toolsInvoked: number;
  status: 'completed' | 'blocked' | 'running';
  duration: string;
  cost: number;
  cap?: number;
  txHash: string;
  report?: string;
  errorReason?: string;
}

export interface PolicyState {
  perTransactionCap: number;
  dailyBudgetLimit: number;
  dailyBudgetSpent: number;
  zeroClickAutonomy: boolean;
  requirePasskeyThreshold: number;
  whitelistedDomains: string[];
}
