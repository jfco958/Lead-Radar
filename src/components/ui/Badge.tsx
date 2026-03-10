import { cn } from "@/lib/utils";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  RISK_LABELS,
  RISK_COLORS,
} from "@/types";
import type {
  LeadStatus,
  ProductType,
  Priority,
  RiskLevel,
} from "@/types";

interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge className={LEAD_STATUS_COLORS[status]}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ProductBadge({ productType }: { productType: ProductType }) {
  return (
    <Badge className={PRODUCT_TYPE_COLORS[productType]}>
      {PRODUCT_TYPE_LABELS[productType]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge className={PRIORITY_COLORS[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const icons = { LOW: "↓", MEDIUM: "→", HIGH: "↑" };
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", RISK_COLORS[riskLevel])}>
      <span>{icons[riskLevel]}</span>
      <span>Riesgo {RISK_LABELS[riskLevel]}</span>
    </span>
  );
}

export default Badge;
