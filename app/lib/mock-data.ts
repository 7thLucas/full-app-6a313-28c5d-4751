// Mock data for AZHAR platform demo — used across all dashboard views

export type ComplianceStatus = "Halal" | "Haram" | "Mashbooh";
export type TransactionCategory =
  | "Trade / Commerce"
  | "Real Estate"
  | "Alcohol & Spirits"
  | "Gambling / Maysir"
  | "Conventional Weapons & Defence"
  | "Pork & Non-Halal Food"
  | "Tobacco Products"
  | "Adult Entertainment"
  | "Conventional Interest (Riba)"
  | "Drugs & Narcotics"
  | "Healthcare"
  | "Islamic Finance"
  | "Technology"
  | "Education"
  | "Agriculture";

export interface Transaction {
  id: string;
  date: string;
  hijriDate: string;
  description: string;
  amount: number;
  currency: string;
  category: TransactionCategory;
  status: ComplianceStatus;
  counterparty: string;
  branch: string;
  fatwaNref?: string;
  reasonCode?: string;
}

export interface Investment {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  revenueFromHaram: number;       // %
  debtToAssets: number;           // %
  interestIncome: number;         // %
  complianceRating: "Fully Compliant" | "Conditionally Compliant" | "Non-Compliant";
  purificationAmount?: number;    // % of dividend to purify if conditionally compliant
  marketCap?: string;
}

export interface ZakatAsset {
  type: string;
  description: string;
  value: number;
  currency: string;
  qualifiesForZakat: boolean;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2026-001",
    date: "2026-06-15",
    hijriDate: "19 Dhu al-Hijja 1447",
    description: "Trade receivable — Al-Manar Textile Group",
    amount: 250000,
    currency: "USD",
    category: "Trade / Commerce",
    status: "Halal",
    counterparty: "Al-Manar Textile Group",
    branch: "Kuala Lumpur HQ",
    fatwaNref: "AAOIFI-FAS-1",
  },
  {
    id: "TXN-2026-002",
    date: "2026-06-15",
    hijriDate: "19 Dhu al-Hijja 1447",
    description: "Dividend income — Constellation Brands (Beer & Wine)",
    amount: 15000,
    currency: "USD",
    category: "Alcohol & Spirits",
    status: "Haram",
    counterparty: "Constellation Brands Inc.",
    branch: "Singapore Branch",
    reasonCode: "HARAM-001: Revenue from prohibited goods (Alcohol)",
    fatwaNref: "AAOIFI-SS-21",
  },
  {
    id: "TXN-2026-003",
    date: "2026-06-14",
    hijriDate: "18 Dhu al-Hijja 1447",
    description: "Interest receipt — Conventional bond coupon",
    amount: 8500,
    currency: "USD",
    category: "Conventional Interest (Riba)",
    status: "Haram",
    counterparty: "JP Morgan Treasury",
    branch: "Dubai Office",
    reasonCode: "HARAM-007: Riba-based income (interest)",
    fatwaNref: "AAOIFI-SS-9",
  },
  {
    id: "TXN-2026-004",
    date: "2026-06-14",
    hijriDate: "18 Dhu al-Hijja 1447",
    description: "Murabahah financing — Al-Fajr Construction",
    amount: 1200000,
    currency: "MYR",
    category: "Islamic Finance",
    status: "Halal",
    counterparty: "Al-Fajr Construction Sdn Bhd",
    branch: "Kuala Lumpur HQ",
    fatwaNref: "BNM-FIN-2023",
  },
  {
    id: "TXN-2026-005",
    date: "2026-06-14",
    hijriDate: "18 Dhu al-Hijja 1447",
    description: "Tobacco distributor payment — Asia Tobacco Trading",
    amount: 45000,
    currency: "USD",
    category: "Tobacco Products",
    status: "Mashbooh",
    counterparty: "Asia Tobacco Trading LLC",
    branch: "Jakarta Office",
    reasonCode: "MASHBOOH-003: Mixed revenue — predominant tobacco trade (review required)",
    fatwaNref: "OIC-FIQH-2019",
  },
  {
    id: "TXN-2026-006",
    date: "2026-06-13",
    hijriDate: "17 Dhu al-Hijja 1447",
    description: "Musharakah equity investment — GreenTech MENA Fund",
    amount: 500000,
    currency: "USD",
    category: "Islamic Finance",
    status: "Halal",
    counterparty: "GreenTech MENA Fund LP",
    branch: "Abu Dhabi Office",
    fatwaNref: "AAOIFI-FAS-4",
  },
  {
    id: "TXN-2026-007",
    date: "2026-06-13",
    hijriDate: "17 Dhu al-Hijja 1447",
    description: "Online gambling platform revenue share",
    amount: 32000,
    currency: "USD",
    category: "Gambling / Maysir",
    status: "Haram",
    counterparty: "PokerStars Digital Ltd",
    branch: "Singapore Branch",
    reasonCode: "HARAM-002: Maysir — gambling and speculative activity",
    fatwaNref: "AAOIFI-SS-21",
  },
  {
    id: "TXN-2026-008",
    date: "2026-06-12",
    hijriDate: "16 Dhu al-Hijja 1447",
    description: "Agricultural commodity financing — date palm harvest",
    amount: 175000,
    currency: "SAR",
    category: "Agriculture",
    status: "Halal",
    counterparty: "Al-Madina Date Farms",
    branch: "Riyadh Branch",
    fatwaNref: "AAOIFI-FAS-20",
  },
  {
    id: "TXN-2026-009",
    date: "2026-06-12",
    hijriDate: "16 Dhu al-Hijja 1447",
    description: "Weapons manufacturing equity stake",
    amount: 89000,
    currency: "USD",
    category: "Conventional Weapons & Defence",
    status: "Haram",
    counterparty: "Raytheon Technologies",
    branch: "London Office",
    reasonCode: "HARAM-003: Conventional weapons manufacturing",
    fatwaNref: "AAOIFI-SS-21",
  },
  {
    id: "TXN-2026-010",
    date: "2026-06-12",
    hijriDate: "16 Dhu al-Hijja 1447",
    description: "Ijarah lease — logistics fleet Al-Baraka",
    amount: 320000,
    currency: "USD",
    category: "Islamic Finance",
    status: "Halal",
    counterparty: "Al-Baraka Logistics",
    branch: "Kuala Lumpur HQ",
    fatwaNref: "AAOIFI-FAS-8",
  },
];

// ─── Investments ──────────────────────────────────────────────────────────────

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: "INV-001",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    revenueFromHaram: 0.1,
    debtToAssets: 18.2,
    interestIncome: 1.4,
    complianceRating: "Fully Compliant",
    marketCap: "$3.1T",
  },
  {
    id: "INV-002",
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Technology / Retail",
    revenueFromHaram: 2.3,
    debtToAssets: 25.1,
    interestIncome: 4.2,
    complianceRating: "Conditionally Compliant",
    purificationAmount: 2.3,
    marketCap: "$2.1T",
  },
  {
    id: "INV-003",
    ticker: "BATS",
    name: "British American Tobacco",
    sector: "Tobacco",
    revenueFromHaram: 100,
    debtToAssets: 55.4,
    interestIncome: 12.3,
    complianceRating: "Non-Compliant",
    marketCap: "$68B",
  },
  {
    id: "INV-004",
    ticker: "NOVO",
    name: "Novo Nordisk A/S",
    sector: "Healthcare / Pharmaceuticals",
    revenueFromHaram: 0.0,
    debtToAssets: 22.8,
    interestIncome: 0.9,
    complianceRating: "Fully Compliant",
    marketCap: "$450B",
  },
  {
    id: "INV-005",
    ticker: "CSGN",
    name: "Credit Suisse Group AG",
    sector: "Conventional Banking",
    revenueFromHaram: 65.2,
    debtToAssets: 88.9,
    interestIncome: 72.1,
    complianceRating: "Non-Compliant",
    marketCap: "$12B",
  },
  {
    id: "INV-006",
    ticker: "AIIB",
    name: "Asian Infrastructure Fund (Sukuk)",
    sector: "Islamic Finance",
    revenueFromHaram: 0.0,
    debtToAssets: 15.2,
    interestIncome: 0.0,
    complianceRating: "Fully Compliant",
    marketCap: "$5.2B",
  },
  {
    id: "INV-007",
    ticker: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive / Technology",
    revenueFromHaram: 0.0,
    debtToAssets: 28.3,
    interestIncome: 2.8,
    complianceRating: "Conditionally Compliant",
    purificationAmount: 0.5,
    marketCap: "$1.1T",
  },
  {
    id: "INV-008",
    ticker: "LVMH",
    name: "LVMH Moet Hennessy",
    sector: "Luxury Goods / Alcohol",
    revenueFromHaram: 18.5,
    debtToAssets: 31.2,
    interestIncome: 3.1,
    complianceRating: "Non-Compliant",
    marketCap: "$320B",
  },
];

// ─── Branch compliance scores ─────────────────────────────────────────────────

export const MOCK_BRANCH_SCORES = [
  { branch: "Kuala Lumpur HQ", score: 94, flagged: 2, total: 45 },
  { branch: "Dubai Office", score: 88, flagged: 5, total: 38 },
  { branch: "Singapore Branch", score: 72, flagged: 9, total: 32 },
  { branch: "Riyadh Branch", score: 97, flagged: 1, total: 28 },
  { branch: "Jakarta Office", score: 81, flagged: 6, total: 31 },
  { branch: "London Office", score: 69, flagged: 11, total: 35 },
];

// ─── THE AZHAR stablecoin reserves ───────────────────────────────────────────

export const AZHAR_RESERVES = {
  totalReserves: 4200000000,  // $4.2B
  currency: "USD",
  lastAudited: "2026-06-14",
  components: [
    { label: "Gold Reserves (Musharakah)", percentage: 35, value: 1470000000, color: "#C9A84C" },
    { label: "Sovereign Fiat (OIC Nations)", percentage: 40, value: 1680000000, color: "#1A6B4A" },
    { label: "Real-World Assets (Ijarah)", percentage: 15, value: 630000000, color: "#27AE60" },
    { label: "Sukuk Portfolio", percentage: 10, value: 420000000, color: "#5A6B7B" },
  ],
  collateralizationRatio: 102.4,
};

// ─── Summary stats ────────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
  totalTransactionsScreened: 1847,
  halalCount: 1562,
  haramCount: 183,
  mashboohCount: 102,
  complianceScore: 91.2,
  zakatDue: 125000,
  zakatCurrency: "USD",
  activeAlerts: 7,
  pendingReviews: 23,
};
