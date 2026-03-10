"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ArrowRight,
  Radar,
  Building2,
  RefreshCw,
  Award,
} from "lucide-react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import { StatusBadge, ProductBadge } from "@/components/ui/Badge";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  formatCurrency,
  formatRelativeTime,
} from "@/lib/utils";
import type { DashboardMetrics, Lead } from "@/types";
import {
  LEAD_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/types";

const PIE_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#EF4444", "#6B7280", "#22C55E"];

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gold,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  gold?: boolean;
}) {
  return (
    <Card gold={gold} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-btg-text-muted text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${gold ? "gradient-text" : "text-btg-text"}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-btg-text-dim text-xs mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend.value >= 0 ? "text-green-400" : "text-red-400"}`}>
              <TrendingUp size={12} />
              <span>{trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${gold ? "bg-btg-gold/10" : "bg-btg-navy"}`}>
          <Icon size={24} className={gold ? "text-btg-gold" : "text-btg-text-muted"} />
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="h-8 w-64 shimmer rounded-lg" />
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 shimmer rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-64 shimmer rounded-2xl" />
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Error al cargar métricas");
      const data = await res.json() as DashboardMetrics;
      setMetrics(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMetrics();
  }, [fetchMetrics]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg mb-4">{error}</div>
        <button
          onClick={() => void fetchMetrics()}
          className="text-btg-gold hover:underline flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  // Prepare chart data
  const statusChartData = Object.entries(metrics.leadsByStatus || {})
    .map(([status, count]) => ({
      name: LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] || status,
      value: count,
    }))
    .filter((d) => d.value > 0);

  const productChartData = Object.entries(metrics.leadsByProduct || {})
    .map(([product, count]) => ({
      name: PRODUCT_TYPE_LABELS[product as keyof typeof PRODUCT_TYPE_LABELS] || product,
      count,
      short: {
        CREDIT: "Crédito",
        STRUCTURED_DEBT: "D. Struct.",
        PROJECT_FINANCE: "P. Finance",
        GUARANTEE: "Garantías",
        SPECIAL_SITUATIONS: "Sit. Esp.",
      }[product] || product,
    }))
    .filter((d) => d.count > 0);

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-btg-text">
            Dashboard{" "}
            <span className="gradient-text">BTG Lead Radar</span>
          </h1>
          <p className="text-btg-text-muted text-sm mt-1">
            Resumen de oportunidades comerciales · BTG Pactual Colombia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => void fetchMetrics()}
            className="flex items-center gap-2 px-4 py-2 text-btg-text-muted hover:text-btg-text bg-btg-navy-card border border-btg-navy-border rounded-xl text-sm transition-colors"
          >
            <RefreshCw size={14} />
            Actualizar
          </button>
          <Link
            href="/radar"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-btg-navy font-semibold rounded-xl text-sm transition-opacity hover:opacity-90 shadow-gold"
          >
            <Radar size={16} />
            Nuevo Análisis
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          subtitle="En el sistema"
          icon={Users}
        />
        <MetricCard
          title="Leads Activos"
          value={metrics.activeLeads}
          subtitle="En proceso"
          icon={Target}
          trend={{ value: 12, label: "este mes" }}
        />
        <MetricCard
          title="Ganados"
          value={metrics.wonLeads}
          subtitle={`${metrics.conversionRate}% conversión`}
          icon={Award}
        />
        <MetricCard
          title="Cartera Potencial"
          value={formatCurrency(metrics.totalEstimatedAmount)}
          subtitle="Monto total estimado"
          icon={DollarSign}
          gold
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-btg-text">Pipeline por Producto</h2>
            <p className="text-btg-text-muted text-sm mt-1">
              Distribución de leads por tipo de producto
            </p>
          </CardHeader>
          <CardBody>
            {productChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={productChartData} barSize={32}>
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#7A8FA3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#7A8FA3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A2B3E",
                      border: "1px solid #243447",
                      borderRadius: "12px",
                      color: "#E8EDF2",
                    }}
                    labelStyle={{ color: "#E8EDF2" }}
                    formatter={(value: number) => [value, "Leads"]}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {productChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-btg-text-muted">
                <Building2 size={32} className="mb-3 opacity-30" />
                <p className="text-sm">Sin datos aún</p>
                <Link href="/radar" className="text-btg-gold text-xs mt-2 hover:underline">
                  Generar primer análisis
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-btg-text">Estado del Pipeline</h2>
          </CardHeader>
          <CardBody>
            {statusChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A2B3E",
                        border: "1px solid #243447",
                        borderRadius: "12px",
                        color: "#E8EDF2",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {statusChartData.slice(0, 4).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-btg-text-muted text-xs">{item.name}</span>
                      </div>
                      <span className="text-btg-text text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-btg-text-dim text-sm">
                Sin datos
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-btg-text">Leads Recientes</h2>
              <Link
                href="/leads"
                className="flex items-center gap-1 text-btg-gold hover:underline text-sm"
              >
                Ver todos
                <ArrowRight size={14} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {metrics.recentLeads?.length > 0 ? (
              <div className="space-y-3">
                {metrics.recentLeads.map((lead: Lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-btg-navy hover:bg-btg-navy-border transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-btg-navy-border flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-btg-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-btg-text font-medium text-sm truncate">
                          {lead.companyName}
                        </p>
                        <span className="text-btg-text-dim text-xs flex-shrink-0">
                          {formatRelativeTime(lead.createdAt)}
                        </span>
                      </div>
                      <p className="text-btg-text-muted text-xs mt-0.5">{lead.sector}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={lead.status} />
                        <ProductBadge productType={lead.productType} />
                      </div>
                    </div>
                    {lead.estimatedAmount && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-btg-gold text-sm font-semibold">
                          {formatCurrency(lead.estimatedAmount, lead.currency)}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-btg-text-muted">
                <Users size={36} className="mb-4 opacity-30" />
                <p className="text-sm font-medium">Sin leads todavía</p>
                <p className="text-xs text-btg-text-dim mt-1">
                  Usa el Market Radar para generar oportunidades
                </p>
                <Link
                  href="/radar"
                  className="mt-4 flex items-center gap-2 text-btg-gold text-sm hover:underline"
                >
                  <Radar size={14} />
                  Iniciar análisis de mercado
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Top Sectors */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-btg-text">Top Sectores</h2>
            <p className="text-btg-text-muted text-sm mt-1">Por número de leads</p>
          </CardHeader>
          <CardBody className="pt-0">
            {metrics.topSectors?.length > 0 ? (
              <div className="space-y-3">
                {metrics.topSectors.map((item, index) => (
                  <div key={item.sector} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-btg-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-btg-text-muted text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-btg-text text-sm truncate">{item.sector}</p>
                      <div className="mt-1 h-1.5 bg-btg-navy rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-gold transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (item.count / (metrics.topSectors[0]?.count || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-btg-text-muted text-sm font-medium flex-shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-btg-text-dim text-sm">
                Sin datos de sectores
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
