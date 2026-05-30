import { use } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  AlertCircle,
  CreditCard,
  Plus,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { UserContext } from "@/features/auth/context";
import { ACCOUNT_CONFIG } from "@/features/accounts/config";
import { getDashboard } from "@/lib/api";
import { cn, formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-2xl font-bold tabular-nums truncate">{value}</p>
          </div>
          <div className={cn("shrink-0 rounded-xl p-2.5", iconBg)}>
            <Icon className={cn("size-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-8 w-36 rounded bg-muted animate-pulse" />
          </div>
          <div className="size-10 rounded-xl bg-muted animate-pulse shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

// Shared by account rows (circle=false) and transaction rows (circle=true)
function RowSkeleton({ circle = false }: { circle?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div
        className={cn(
          "size-9 shrink-0 bg-muted animate-pulse",
          circle ? "rounded-full" : "rounded-lg",
        )}
      />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        <div className="h-3 w-24 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-4 w-16 rounded bg-muted animate-pulse" />
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ─── DashboardPage ────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();
  const user = use(UserContext);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  // ── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1800px] space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-52 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-muted animate-pulse" />
        </div>

        <section>
          <div className="h-4 w-16 rounded bg-muted animate-pulse mb-3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </section>

        <section>
          <div className="h-4 w-28 rounded bg-muted animate-pulse mb-3" />
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {Array.from({ length: 3 }, (_, i) => (
                  <RowSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="h-4 w-40 rounded bg-muted animate-pulse mb-3" />
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }, (_, i) => (
                  <RowSkeleton key={i} circle />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
        <AlertCircle className="size-10 text-muted-foreground mb-3" />
        <p className="font-semibold text-foreground">
          Failed to load dashboard
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────
  if (data && data.accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
        <CreditCard className="size-10 text-muted-foreground mb-3" />
        <p className="font-semibold text-foreground">No accounts yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first account to start tracking your finances.
        </p>
        <Button className="mt-4" onClick={() => navigate("/accounts")}>
          Add account
        </Button>
      </div>
    );
  }

  if (!data) return null;

  // ── Success ──────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-[1800px] space-y-8">
      {/* Welcome — full width, above the grid */}
      <header>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {user?.firstName}
        </h1>
        <p className="text-muted-foreground mt-0.5">
          Here's your financial overview for this month.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_100px] gap-8 items-start">
        {/* ── Left column: main content ────────────────────────── */}
        <div className="space-y-8">
          {/* Summary cards */}
          <section aria-label="Financial summary">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total balance"
                value={formatCurrency(data.totalBalance)}
                icon={Wallet}
                iconBg="bg-brand-100"
                iconColor="text-brand-700"
              />
              <StatCard
                title="Monthly deposits"
                value={formatCurrency(data.monthlyDeposits)}
                icon={TrendingUp}
                iconBg="bg-success-100"
                iconColor="text-success-700"
              />
              <StatCard
                title="Monthly withdrawals"
                value={formatCurrency(data.monthlyWithdrawals)}
                icon={TrendingDown}
                iconBg="bg-warning-100"
                iconColor="text-warning-700"
              />
              <StatCard
                title="Recent transactions"
                value={String(data.recentTransactions.length)}
                icon={ArrowLeftRight}
                iconBg="bg-secondary"
                iconColor="text-muted-foreground"
              />
            </div>
          </section>

          {/* Accounts */}
          <section aria-label="Your accounts">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Your accounts
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {data.accounts.map((account) => {
                    const cfg = ACCOUNT_CONFIG[account.type];
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => navigate(`/accounts/${account.id}`)}
                        className="group w-full flex items-center gap-3 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer text-left"
                      >
                        <div
                          className={cn(
                            "size-9 rounded-lg flex items-center justify-center shrink-0 border border-border grayscale group-hover:grayscale-0 group-hover:translate-x-1 transition-all duration-200 ease-out",
                            cfg.iconBg,
                            cfg.hoverBorder,
                          )}
                        >
                          <cfg.Icon className={cn("size-4", cfg.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {account.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cfg.label} ·{" "}
                            {maskAccountNumber(account.accountNumber)}
                          </p>
                        </div>
                        <p
                          className={cn(
                            "text-sm font-semibold tabular-nums shrink-0",
                            account.balance < 0
                              ? "text-destructive"
                              : "text-foreground",
                          )}
                        >
                          {formatCurrency(account.balance)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent transactions */}
          <section aria-label="Recent transactions">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Recent transactions
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {data.recentTransactions.map((txn) => (
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
                      <p
                        className={cn(
                          "text-sm font-semibold tabular-nums shrink-0",
                          txn.type === "credit"
                            ? "text-success-600"
                            : "text-foreground",
                        )}
                      >
                        {txn.type === "credit" ? "+" : "−"}
                        {formatCurrency(txn.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* ── Right column / below on mobile: Quick actions ─────── */}
        <aside aria-label="Quick actions" className="space-y-3 mt-4">
          {/* <h2 className="text-sm font-medium text-muted-foreground">
            Quick actions
          </h2> */}
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-3">
            <button
              type="button"
              onClick={() => navigate("/accounts")}
              className="group flex flex-col items-center gap-2 py-3 lg:py-4 w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="size-12 lg:size-14 rounded-full bg-brand-500 text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                <ArrowLeftRight className="size-6" />
              </div>
              <span className="text-xs text-center text-foreground font-medium">
                New Transfer
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/accounts")}
              className="group flex flex-col items-center gap-2 py-3 lg:py-4 w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="size-12 lg:size-14 rounded-full bg-gold-500 text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                <Receipt className="size-6" />
              </div>
              <span className="text-xs text-center text-foreground font-medium">
                Pay Bill
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/accounts")}
              className="group flex flex-col items-center gap-2 py-3 lg:py-4 w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="size-12 lg:size-14 rounded-full bg-brand-800 text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                <Plus className="size-6" />
              </div>
              <span className="text-xs text-center text-foreground font-medium">
                Add Account
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
