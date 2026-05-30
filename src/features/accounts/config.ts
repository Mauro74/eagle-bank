import {
  Building2,
  PiggyBank,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import type { AccountType, AccountStatus } from "@/types";

export const ACCOUNT_CONFIG = {
  current: {
    label: "Current",
    Icon: Building2,
    iconBg: "bg-success-100",
    iconColor: "text-success-700",
    hoverBorder: "group-hover:border-success-500",
    staticBorder: "border-success-500",
  },
  savings: {
    label: "Savings",
    Icon: PiggyBank,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    hoverBorder: "group-hover:border-pink-500",
    staticBorder: "border-pink-500",
  },
  credit: {
    label: "Credit",
    Icon: CreditCard,
    iconBg: "bg-warning-100",
    iconColor: "text-warning-700",
    hoverBorder: "group-hover:border-warning-500",
    staticBorder: "border-warning-500",
  },
} satisfies Record<
  AccountType,
  {
    label: string;
    Icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    hoverBorder: string;
    staticBorder: string;
  }
>;

export const STATUS_CONFIG = {
  active: { label: "Active", className: "bg-success-100 text-success-700" },
  frozen: { label: "Frozen", className: "bg-warning-100 text-warning-700" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
} satisfies Record<AccountStatus, { label: string; className: string }>;
