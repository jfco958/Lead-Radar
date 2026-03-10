"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Building2,
  Filter,
  X,
  RefreshCw,
  DollarSign,
  ChevronRight,
  Radar,
  Users,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge, ProductBadge, PriorityBadge, RiskBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input, { Select, Textarea } from "@/components/ui/Input";
import { formatCurrency, formatRelativeTime, parseKeyFactors } from "@/lib/utils";
import {
  LEAD_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
  PRIORITY_LABELS,
  COLOMBIAN_SECTORS,
} from "@/types";
import type {
  Lead,
  LeadStatus,
  ProductType,
  Priority,
  RiskLevel,
} from "@/types";

const STATUSES: LeadStatus[] = [
  "NEW", "CONTACTED", "IN_ANALYSIS", "PROPOSAL", "NEGOTIATION", "WON", "LOST", "ON_HOLD",
];

const PRODUCTS: ProductType[] = [
  "CREDIT", "STRUCTURED_DEBT", "PROJECT_FINANCE", "GUARANTEE", "SPECIAL_SITUATIONS",
];

interface CreateLeadForm {
  companyName: string;
  sector: string;
  productType: ProductType;
  description: string;
  estimatedAmount: string;
  currency: string;
  riskLevel: RiskLevel;
  rationale: string;
  priority: Priority;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
}

function CreateLeadModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<CreateLeadForm>({
    companyName: "",
    sector: COLOMBIAN_SECTORS[0],
    productType: "CREDIT",
    description: "",
    estimatedAmount: "",
    currency: "COP",
    riskLevel: "MEDIUM",
    rationale: "",
    priority: "MEDIUM",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactRole: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof CreateLeadForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.description) {
      setError("Nombre de empresa y descripción son requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedAmount: form.estimatedAmount ? parseFloat(form.estimatedAmount) : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error || "Error al crear lead");
      }

      onCreated();
      onClose();
      setForm({
        companyName: "", sector: COLOMBIAN_SECTORS[0], productType: "CREDIT",
        description: "", estimatedAmount: "", currency: "COP", riskLevel: "MEDIUM",
        rationale: "", priority: "MEDIUM", contactName: "", contactEmail: "",
        contactPhone: "", contactRole: "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Lead Manual" size="lg">
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Empresa *"
            placeholder="Nombre de la empresa"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
          <Select
            label="Sector"
            value={form.sector}
            onChange={(e) => update("sector", e.target.value)}
          >
            {COLOMBIAN_SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Producto"
            value={form.productType}
            onChange={(e) => update("productType", e.target.value as ProductType)}
          >
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>{PRODUCT_TYPE_LABELS[p]}</option>
            ))}
          </Select>
          <Select
            label="Prioridad"
            value={form.priority}
            onChange={(e) => update("priority", e.target.value as Priority)}
          >
            {(["LOW", "MEDIUM", "HIGH", "URGENT"] as Priority[]).map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </Select>
        </div>
        <Textarea
          label="Descripción de la Oportunidad *"
          placeholder="Describe la oportunidad específica y el contexto del negocio..."
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <Textarea
          label="Rationale (Por qué BTG)"
          placeholder="¿Por qué es una buena oportunidad para BTG Pactual?"
          rows={2}
          value={form.rationale}
          onChange={(e) => update("rationale", e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Monto Estimado"
            type="number"
            placeholder="5000000000"
            value={form.estimatedAmount}
            onChange={(e) => update("estimatedAmount", e.target.value)}
          />
          <Select
            label="Moneda"
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </Select>
          <Select
            label="Riesgo"
            value={form.riskLevel}
            onChange={(e) => update("riskLevel", e.target.value as RiskLevel)}
          >
            <option value="LOW">Bajo</option>
            <option value="MEDIUM">Medio</option>
            <option value="HIGH">Alto</option>
          </Select>
        </div>

        <div className="border-t border-btg-navy-border pt-4">
          <p className="text-sm font-medium text-btg-text-muted mb-3">Contacto (opcional)</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="Juan Pérez"
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
            />
            <Input
              label="Cargo"
              placeholder="CFO / VP Finanzas"
              value={form.contactRole}
              onChange={(e) => update("contactRole", e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="juan@empresa.com"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
            <Input
              label="Teléfono"
              placeholder="+57 300 000 0000"
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            Crear Lead
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const keyFactors = parseKeyFactors(lead.keyFactors);

  return (
    <Link href={`/leads/${lead.id}`}>
      <Card hover className="p-5 group">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-btg-navy flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-btg-text-muted" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-btg-text group-hover:text-btg-gold transition-colors truncate">
                  {lead.companyName}
                </p>
                <p className="text-btg-text-muted text-sm mt-0.5">{lead.sector}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {lead.estimatedAmount && (
                  <span className="text-btg-gold text-sm font-semibold">
                    {formatCurrency(lead.estimatedAmount, lead.currency)}
                  </span>
                )}
                <ChevronRight
                  size={16}
                  className="text-btg-text-dim group-hover:text-btg-gold transition-colors"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <StatusBadge status={lead.status} />
              <ProductBadge productType={lead.productType} />
              <PriorityBadge priority={lead.priority} />
              <RiskBadge riskLevel={lead.riskLevel} />
            </div>

            {/* Description */}
            <p className="text-btg-text-dim text-xs mt-2 line-clamp-2">
              {lead.description}
            </p>

            {/* Key factors */}
            {keyFactors.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {keyFactors.slice(0, 2).map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2 py-0.5 bg-btg-navy text-btg-text-dim rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-btg-navy-border">
              <span className="text-xs text-btg-text-dim">
                {lead.source === "AI_GENERATED" ? "🤖 IA" : "📝 Manual"} ·{" "}
                {formatRelativeTime(lead.createdAt)}
              </span>
              {lead.assignedTo && (
                <span className="text-xs text-btg-text-muted">{lead.assignedTo}</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (productFilter) params.set("productType", productFilter);
      if (priorityFilter) params.set("priority", priorityFilter);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json() as {
        leads: Lead[];
        pagination: { total: number };
      };
      setLeads(data.leads);
      setTotal(data.pagination.total);
    } catch (e) {
      console.error("Error fetching leads:", e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, productFilter, priorityFilter]);

  useEffect(() => {
    const t = setTimeout(() => void fetchLeads(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchLeads, search]);

  const hasFilters = statusFilter || productFilter || priorityFilter || search;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setProductFilter("");
    setPriorityFilter("");
  };

  return (
    <div className="p-8 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-btg-text">
            Gestión de <span className="gradient-text">Leads</span>
          </h1>
          <p className="text-btg-text-muted text-sm mt-1">
            {total} lead{total !== 1 ? "s" : ""} en total · BTG Pactual Colombia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={() => void fetchLeads()}
          >
            Actualizar
          </Button>
          <Link href="/radar">
            <Button variant="outline" size="sm" icon={<Radar size={14} />}>
              Market Radar
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowCreateModal(true)}
          >
            Nuevo Lead
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-btg-text-dim" />
          <input
            type="text"
            placeholder="Buscar empresa, sector, descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-btg-navy-card border border-btg-navy-border rounded-xl text-btg-text text-sm placeholder-btg-text-dim focus:outline-none focus:border-btg-gold/40 transition-colors"
          />
        </div>

        <Button
          variant={showFilters ? "outline" : "secondary"}
          size="sm"
          icon={<Filter size={14} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
          {hasFilters && (
            <span className="ml-1 w-5 h-5 bg-btg-gold text-btg-navy text-xs rounded-full flex items-center justify-center font-bold">
              !
            </span>
          )}
        </Button>

        {hasFilters && (
          <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={clearFilters}>
            Limpiar
          </Button>
        )}
      </div>

      {/* Filter Row */}
      {showFilters && (
        <div className="flex items-center gap-3 p-4 bg-btg-navy-card border border-btg-navy-border rounded-xl animate-fade-in">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1"
          >
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
            ))}
          </Select>
          <Select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="flex-1"
          >
            <option value="">Todos los productos</option>
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>{PRODUCT_TYPE_LABELS[p]}</option>
            ))}
          </Select>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex-1"
          >
            <option value="">Todas las prioridades</option>
            {(["URGENT", "HIGH", "MEDIUM", "LOW"] as Priority[]).map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </Select>
        </div>
      )}

      {/* Leads Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 shimmer rounded-2xl" />
          ))}
        </div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-btg-navy-card border border-btg-navy-border rounded-full flex items-center justify-center mb-6">
            {hasFilters ? (
              <Filter size={28} className="text-btg-text-dim" />
            ) : (
              <Users size={28} className="text-btg-text-dim" />
            )}
          </div>
          <h3 className="text-btg-text font-semibold text-lg mb-2">
            {hasFilters ? "No hay resultados" : "Sin leads todavía"}
          </h3>
          <p className="text-btg-text-muted text-sm max-w-sm">
            {hasFilters
              ? "Prueba con otros filtros o elimina los actuales"
              : "Usa el Market Radar para generar leads automáticamente con IA, o crea uno manualmente"}
          </p>
          <div className="flex items-center gap-3 mt-6">
            {hasFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            ) : (
              <>
                <Link href="/radar">
                  <Button variant="primary" icon={<Radar size={16} />}>
                    Abrir Market Radar
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  icon={<Plus size={16} />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Lead Manual
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Summary bar */}
      {leads.length > 0 && (
        <div className="flex items-center justify-between text-sm text-btg-text-muted border-t border-btg-navy-border pt-4">
          <span>Mostrando {leads.length} de {total} leads</span>
          <span className="flex items-center gap-2">
            <DollarSign size={14} />
            Potencial total:{" "}
            <span className="text-btg-gold font-semibold">
              {formatCurrency(
                leads.reduce((sum, l) =>
                  sum + (l.currency === "USD" ? (l.estimatedAmount || 0) * 4200 : (l.estimatedAmount || 0)), 0
                )
              )}
            </span>
          </span>
        </div>
      )}

      <CreateLeadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => void fetchLeads()}
      />
    </div>
  );
}
