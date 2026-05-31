import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { getAccount, getTransactions } from "@/lib/api";
import { ACCOUNT_CONFIG, STATUS_CONFIG } from "@/features/accounts/config";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TransactionCategory, TransactionType } from "@/types";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  food: { label: "Food", className: "bg-warning-100 text-warning-700" },
  transport: { label: "Transport", className: "bg-brand-100 text-brand-700" },
  shopping: {
    label: "Shopping",
    className: "bg-secondary text-secondary-foreground",
  },
  utilities: {
    label: "Utilities",
    className: "bg-muted text-muted-foreground",
  },
  healthcare: {
    label: "Healthcare",
    className: "bg-danger-100 text-danger-700",
  },
  entertainment: {
    label: "Entertainment",
    className: "bg-secondary text-secondary-foreground",
  },
  income: { label: "Income", className: "bg-success-100 text-success-700" },
  transfer: { label: "Transfer", className: "bg-brand-100 text-brand-700" },
  other: { label: "Other", className: "bg-muted text-muted-foreground" },
} satisfies Record<TransactionCategory, { label: string; className: string }>;

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterOption = "all" | TransactionType;
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

const PAGE_SIZE = 10;

// ─── AccountDetailPage ────────────────────────────────────────────────────────

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [page, setPage] = useState(1);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const accountQuery = useQuery({
    queryKey: ["accounts", id],
    queryFn: () => getAccount(id!),
    enabled: Boolean(id),
  });

  const txnQuery = useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getTransactions(id!),
    enabled: Boolean(id),
  });

  if (!id) return <Navigate to="/accounts" replace />;

  // ── Account loading ────────────────────────────────────────────
  if (accountQuery.isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl space-y-6">
        <div className="h-9 w-28 rounded bg-muted animate-pulse" />
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-36 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="h-10 w-36 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Account error ──────────────────────────────────────────────
  if (accountQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
        <AlertCircle className="size-10 text-muted-foreground mb-3" />
        <p className="font-semibold text-foreground">Account not found</p>
        <p className="text-sm text-muted-foreground mt-1">
          {accountQuery.error instanceof Error
            ? accountQuery.error.message
            : "Something went wrong"}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/accounts")}
        >
          Back to accounts
        </Button>
      </div>
    );
  }

  const account = accountQuery.data!;
  const cfg = ACCOUNT_CONFIG[account.type];
  const statusCfg = STATUS_CONFIG[account.status];

  // ── Client-side filter → sort → paginate ──────────────────────
  const allTxns = txnQuery.data ?? [];

  const filtered =
    filter === "all" ? allTxns : allTxns.filter((t) => t.type === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "date-asc")
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort === "amount-desc") return b.amount - a.amount;
    if (sort === "amount-asc") return a.amount - b.amount;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // date-desc default
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (f: FilterOption) => {
    setFilter(f);
    setPage(1);
  };
  const updateSort = (s: SortOption) => {
    setSort(s);
    setPage(1);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => navigate("/accounts")}
      >
        <ArrowLeft className="size-4" />
        Accounts
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-12 rounded-xl flex items-center justify-center border border-border",
                  cfg.iconBg,
                  cfg.staticBorder,
                )}
              >
                <cfg.Icon className={cn("size-6", cfg.iconColor)} />
              </div>
              <div>
                <p className="font-semibold text-lg leading-tight">
                  {account.name}
                </p>
                <p className="text-sm text-muted-foreground">{cfg.label}</p>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                statusCfg.className,
              )}
            >
              {statusCfg.label}
            </span>
          </div>

          <p
            className={cn(
              "text-4xl font-bold tabular-nums mb-6",
              account.balance < 0 ? "text-destructive" : "text-foreground",
            )}
          >
            {formatCurrency(account.balance)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account no.</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm font-medium whitespace-nowrap">
                  {showAccountNumber
                    ? account.accountNumber.replace(/(.{4})/g, "$1 ").trim()
                    : `•••• •••• ${account.accountNumber.slice(-4)}`}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAccountNumber((p) => !p)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showAccountNumber
                      ? "Hide account number"
                      : "Show account number"
                  }
                >
                  {showAccountNumber ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Sort Code</p>
              <p className="font-medium mt-0.5">{account.routingNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Opened</p>
              <p className="font-medium mt-0.5">
                {formatDate(account.createdAt)}
              </p>
            </div>
            {account.creditLimit !== undefined && (
              <>
                <div>
                  <p className="text-muted-foreground">Credit limit</p>
                  <p className="font-medium mt-0.5">
                    {formatCurrency(account.creditLimit)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available credit</p>
                  <p className="font-medium mt-0.5">
                    {formatCurrency(account.creditLimit + account.balance)}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Transactions
        </h2>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          {/* Filter toggle */}
          <div className="flex items-center rounded-lg border bg-background p-0.5 gap-0.5">
            {(["all", "credit", "debit"] as const).map((f) => (
              <button
                key={f}
                onClick={() => updateFilter(f)}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <label htmlFor="sort-select" className="sr-only">
            Sort transactions
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => updateSort(e.target.value as SortOption)}
            className="sm:ml-auto text-sm border border-input rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount: high to low</option>
            <option value="amount-asc">Amount: low to high</option>
          </select>
        </div>

        {/* Transaction list card */}
        {txnQuery.isLoading ? (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4">
                    <div className="size-9 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-14 rounded-full bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : txnQuery.isError ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <AlertCircle className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {txnQuery.error instanceof Error
                  ? txnQuery.error.message
                  : "Failed to load transactions"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => txnQuery.refetch()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {paged.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No {filter !== "all" ? filter : ""} transactions found.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {paged.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center gap-3 px-6 py-4"
                    >
                      <div
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center shrink-0",
                          txn.type === "credit" ? "bg-success-100" : "bg-muted",
                        )}
                      >
                        {txn.type === "credit" ? (
                          <ArrowDownLeft className="size-4 text-success-600" />
                        ) : (
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {txn.merchantName ?? txn.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.date)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p
                          className={cn(
                            "text-sm font-semibold tabular-nums",
                            txn.type === "credit"
                              ? "text-success-600"
                              : "text-foreground",
                          )}
                        >
                          {txn.type === "credit" ? "+" : "−"}
                          {formatCurrency(txn.amount)}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            CATEGORY_CONFIG[txn.category].className,
                          )}
                        >
                          {CATEGORY_CONFIG[txn.category].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {sorted.length > PAGE_SIZE && (
                <div className="flex items-center justify-between px-6 py-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, sorted.length)} of{" "}
                    {sorted.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
