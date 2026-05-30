// ─── User ─────────────────────────────────────────────────────────────────────

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  address?: Address;
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

export type AccountType = "current" | "savings" | "credit";

export type AccountStatus = "active" | "frozen" | "closed";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumber: string;
  routingNumber: string;
  createdAt: string;
  status: AccountStatus;
  creditLimit?: number;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalBalance: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
  recentTransactions: Transaction[];
  accounts: Account[];
}

// ─── Transactions ──────────────────────────────────────────────────────────────

export type TransactionType = "debit" | "credit";
export type TransactionStatus = "pending" | "cleared" | "failed";
export type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "utilities"
  | "healthcare"
  | "entertainment"
  | "income"
  | "transfer"
  | "other";

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  category: TransactionCategory;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  merchantName?: string;
}

// ─── API layer ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  address?: Partial<Address>;
}

// ─── Mock API ─────────────────────────────────────────────────────────────────

export interface ErrorScenario {
  code: string;
  message: string;
  statusCode: number;
}

export interface MockFetchOptions {
  simulateError?: boolean | ErrorScenario;
}
