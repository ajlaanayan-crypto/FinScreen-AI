export interface StockMetric {
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  color?: string;
}

export interface FinancialQuarter {
  period: string;
  sales: number;
  expenses: number;
  opm: number;
  otherIncome: number;
  interest: number;
  depreciation: number;
  pbt: number;
  tax: number;
  netProfit: number;
  eps: number;
}

export interface BalanceSheetYear {
  year: string;
  shareCapital: number;
  reserves: number;
  borrowings: number;
  otherLiabilities: number;
  totalLiabilities: number;
  fixedAssets: number;
  cwip: number;
  investments: number;
  otherAssets: number;
  totalAssets: number;
}

export interface PeerData {
  name: string;
  cmp: number;
  pe: number;
  marketCap: number;
  dividendYield: number;
  roce: number;
  roe: number;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  marketCap: number;
  highLow: string;
  stockPE: number;
  bookValue: number;
  dividendYield: number;
  roce: number;
  roe: number;
  faceValue: number;
  about: string;
  quarters: FinancialQuarter[];
  balanceSheet: BalanceSheetYear[];
  peers: PeerData[];
}

export enum TabType {
  QUARTERS = 'QUARTERS',
  PROFIT_LOSS = 'PROFIT_LOSS',
  BALANCE_SHEET = 'BALANCE_SHEET',
  CASH_FLOW = 'CASH_FLOW',
  RATIOS = 'RATIOS',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}