import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { getAccounts } from "@/lib/api";
import { ACCOUNT_CONFIG, STATUS_CONFIG } from "@/features/accounts/config";
import { cn, formatCurrency, maskAccountNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TileSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="size-10 rounded-xl bg-muted animate-pulse" />
          <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-36 rounded bg-muted animate-pulse" />
          <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}

// ─── AccountsPage ─────────────────────────────────────────────────────────────

export function AccountsPage() {
  const navigate = useNavigate();

  const {
    data: accounts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  });

  // ── Loading ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl">
        <div className="space-y-2 mb-8">
          <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-44 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TileSkeleton />
          <TileSkeleton />
          <TileSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
        <AlertCircle className="size-10 text-muted-foreground mb-3" />
        <p className="font-semibold text-foreground">Failed to load accounts</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────
  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
        <p className="font-semibold text-foreground">No accounts found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your accounts will appear here once added.
        </p>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-[1800px]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
        <p className="text-muted-foreground mt-0.5">
          {accounts.length} account{accounts.length !== 1 ? "s" : ""}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const cfg = ACCOUNT_CONFIG[account.type];
          const statusCfg = STATUS_CONFIG[account.status];
          return (
            <button
              key={account.id}
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            >
              <Card className="hover:shadow-card-hover transition-shadow h-full">
                <CardContent className="p-6">
                  {/* Icon + status badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center border border-border grayscale group-hover:grayscale-0 group-hover:translate-x-1 transition-all duration-200 ease-out",
                        cfg.iconBg,
                        cfg.hoverBorder,
                      )}
                    >
                      <cfg.Icon className={cn("size-5", cfg.iconColor)} />
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        statusCfg.className,
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Name + type + masked number */}
                  <p className="font-semibold text-foreground leading-snug">
                    {account.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cfg.label} · {maskAccountNumber(account.accountNumber)}
                  </p>

                  {/* Balance */}
                  <p
                    className={cn(
                      "text-2xl font-bold tabular-nums mt-4",
                      account.balance < 0
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {formatCurrency(account.balance)}
                  </p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
