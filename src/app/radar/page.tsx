"use client";

import { useState } from "react";
import {
  Radar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckSquare,
  Square,
  Building2,
  AlertCircle,
  ArrowRight,
  Download,
  BarChart2,
  Loader2,
} from "lucide-react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ProductBadge, RiskBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { COLOMBIAN_SECTORS, PRODUCT_TYPE_LABELS } from "@/types";
import type {
  ProductType,
  AILeadSuggestion,
  AnalysisResult,
} from "@/types";
import Link from "next/link";

const ALL_PRODUCTS: { value: ProductType; label: string; description: string; color: string }[] = [
  {
    value: "CREDIT",
    label: "Crédito",
    description: "Créditos corporativos y líneas de capital de trabajo",
    color: "border-blue-500/30 bg-blue-500/5",
  },
  {
    value: "STRUCTURED_DEBT",
    label: "Deuda Estructurada",
    description: "Bonos, titularizaciones, créditos sindicados",
    color: "border-purple-500/30 bg-purple-500/5",
  },
  {
    value: "PROJECT_FINANCE",
    label: "Project Finance",
    description: "Infraestructura, energía, concesiones",
    color: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    value: "GUARANTEE",
    label: "Garantías",
    description: "Garantías financieras y avales corporativos",
    color: "border-amber-500/30 bg-amber-500/5",
  },
  {
    value: "SPECIAL_SITUATIONS",
    label: "Situaciones Especiales",
    description: "Restructuraciones, M&A financing, distressed",
    color: "border-pink-500/30 bg-pink-500/5",
  },
];

function RadarAnimation() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Outer rings */}
      {[1, 2, 3].map((ring) => (
        <div
          key={ring}
          className="absolute inset-0 rounded-full border border-btg-gold/10"
          style={{ margin: `${ring * 12}px` }}
        />
      ))}
      {/* Sweep */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <div
            className="absolute inset-0 radar-sweep"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(240, 165, 0, 0.15) 60deg, transparent 60deg)",
            }}
          />
        </div>
      </div>
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-3 h-3 bg-btg-gold rounded-full" />
          <div className="absolute inset-0 w-3 h-3 bg-btg-gold rounded-full radar-ping" />
        </div>
      </div>
      {/* Cross lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-btg-gold/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-px bg-btg-gold/10" />
      </div>
      {/* Blips */}
      {[
        { top: "20%", left: "65%", delay: "0s", size: "w-2 h-2" },
        { top: "60%", left: "25%", delay: "0.8s", size: "w-1.5 h-1.5" },
        { top: "35%", left: "40%", delay: "1.6s", size: "w-2 h-2" },
      ].map((blip, i) => (
        <div
          key={i}
          className={`absolute ${blip.size} bg-btg-gold rounded-full pulse-dot`}
          style={{ top: blip.top, left: blip.left, animationDelay: blip.delay }}
        />
      ))}
    </div>
  );
}

function LeadSuggestionCard({
  lead,
  index,
  onSave,
  saved,
}: {
  lead: AILeadSuggestion;
  index: number;
  onSave: (lead: AILeadSuggestion) => void;
  saved: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="animate-slide-in" style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}>
    <Card className="card-hover h-full">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-btg-navy flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 size={18} className="text-btg-text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-btg-text">{lead.companyName}</h3>
                <PriorityBadge priority={lead.priority} />
              </div>
              <p className="text-btg-text-muted text-sm mt-0.5">{lead.sector}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <ProductBadge productType={lead.productType} />
                <RiskBadge riskLevel={lead.riskLevel} />
                {lead.estimatedAmount && (
                  <span className="text-btg-gold text-sm font-semibold">
                    {formatCurrency(lead.estimatedAmount, lead.currency)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-btg-text-muted hover:text-btg-text transition-colors flex-shrink-0"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Opportunity preview */}
        <p className="text-btg-text-muted text-sm mt-3 line-clamp-2">
          {lead.opportunity}
        </p>

        {/* Key factors */}
        {lead.keyFactors?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {lead.keyFactors.slice(0, 3).map((factor) => (
              <span
                key={factor}
                className="text-xs px-2 py-0.5 bg-btg-navy text-btg-text-muted rounded-full border border-btg-navy-border"
              >
                {factor}
              </span>
            ))}
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-btg-navy-border space-y-3 animate-fade-in">
            <div>
              <h4 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-1.5">
                Descripción de la Oportunidad
              </h4>
              <p className="text-btg-text-muted text-sm leading-relaxed">
                {lead.opportunity}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-1.5">
                Por qué BTG Pactual
              </h4>
              <p className="text-btg-text-muted text-sm leading-relaxed">
                {lead.rationale}
              </p>
            </div>
            {lead.contactSuggestions && (
              <div>
                <h4 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-1.5">
                  Contacto Sugerido
                </h4>
                <p className="text-btg-text-muted text-sm">{lead.contactSuggestions}</p>
              </div>
            )}
            {lead.keyFactors?.length > 3 && (
              <div>
                <h4 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-1.5">
                  Factores Clave
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {lead.keyFactors.map((factor) => (
                    <span
                      key={factor}
                      className="text-xs px-2 py-0.5 bg-btg-navy text-btg-text-muted rounded-full border border-btg-navy-border"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-btg-navy-border">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-btg-text-muted text-xs hover:text-btg-text transition-colors"
          >
            {expanded ? "Ver menos" : "Ver más detalles"}
          </button>
          <Button
            variant={saved ? "secondary" : "primary"}
            size="sm"
            icon={saved ? <CheckSquare size={14} /> : <Plus size={14} />}
            onClick={() => !saved && onSave(lead)}
            disabled={saved}
          >
            {saved ? "Guardado" : "Agregar Lead"}
          </Button>
        </div>
      </div>
    </Card>
    </div>
  );
}

export default function RadarPage() {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [marketContext, setMarketContext] = useState("");
  const [numberOfLeads, setNumberOfLeads] = useState(6);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedLeads, setSavedLeads] = useState<Set<number>>(new Set());
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const toggleProduct = (product: ProductType) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSectors.length === 0 || selectedProducts.length === 0 || !marketContext.trim()) {
      setError("Por favor selecciona al menos un sector, un producto y describe el contexto de mercado.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setSavedLeads(new Set());

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectors: selectedSectors,
          products: selectedProducts,
          marketContext,
          numberOfLeads,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error || "Error al realizar el análisis");
      }

      const data = await res.json() as AnalysisResult;
      setAnalysisResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveLead = async (lead: AILeadSuggestion, index: number) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: lead.companyName,
          sector: lead.sector,
          productType: lead.productType,
          description: lead.opportunity,
          estimatedAmount: lead.estimatedAmount,
          currency: lead.currency,
          riskLevel: lead.riskLevel,
          rationale: lead.rationale,
          keyFactors: lead.keyFactors,
          priority: lead.priority,
          contactRole: lead.contactSuggestions,
          analysisId: analysisResult?.analysisId,
        }),
      });

      if (res.ok) {
        setSavedLeads((prev) => new Set([...prev, index]));
      }
    } catch (e) {
      console.error("Error saving lead:", e);
    }
  };

  const handleSaveAll = async () => {
    if (!analysisResult) return;

    const unsaved = analysisResult.leads.filter((_, i) => !savedLeads.has(i));
    for (let i = 0; i < analysisResult.leads.length; i++) {
      if (!savedLeads.has(i)) {
        await handleSaveLead(analysisResult.leads[i]!, i);
      }
    }

    return unsaved.length;
  };

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-btg-gold/10 rounded-xl">
              <Radar size={24} className="text-btg-gold" />
            </div>
            <h1 className="text-2xl font-bold text-btg-text">
              Market <span className="gradient-text">Radar</span>
            </h1>
          </div>
          <p className="text-btg-text-muted text-sm mt-1 ml-14">
            Análisis inteligente de mercado con IA · Genera leads calificados para BTG Pactual Colombia
          </p>
        </div>
      </div>

      {!analysisResult ? (
        /* Analysis Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Radar animation + info */}
          <div className="flex flex-col items-center justify-center">
            <RadarAnimation />
            <div className="mt-6 text-center space-y-2">
              <p className="text-btg-text font-semibold">BTG Lead Intelligence</p>
              <p className="text-btg-text-muted text-sm max-w-xs">
                Claude AI analiza el mercado colombiano en tiempo real para identificar las mejores oportunidades
              </p>
            </div>
            <div className="mt-6 space-y-2 w-full">
              {[
                "Análisis profundo del mercado",
                "Leads específicos y accionables",
                "Montos y riesgos estimados",
                "Contactos sugeridos",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-btg-text-muted">
                  <Sparkles size={12} className="text-btg-gold flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-btg-text">
                  1. Productos de Interés
                </h2>
                <p className="text-btg-text-muted text-sm mt-1">
                  Selecciona los productos de BTG Pactual para los que deseas generar leads
                </p>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_PRODUCTS.map((product) => {
                    const selected = selectedProducts.includes(product.value);
                    return (
                      <button
                        key={product.value}
                        onClick={() => toggleProduct(product.value)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? `${product.color} border-opacity-100`
                            : "border-btg-navy-border bg-btg-navy hover:bg-btg-navy-border"
                        }`}
                      >
                        {selected ? (
                          <CheckSquare size={16} className="text-btg-gold mt-0.5 flex-shrink-0" />
                        ) : (
                          <Square size={16} className="text-btg-text-dim mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${selected ? "text-btg-text" : "text-btg-text-muted"}`}>
                            {product.label}
                          </p>
                          <p className="text-xs text-btg-text-dim mt-0.5">
                            {product.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Sectors */}
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-btg-text">
                  2. Sectores Económicos
                </h2>
                <p className="text-btg-text-muted text-sm mt-1">
                  Elige los sectores del mercado colombiano a analizar
                </p>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {COLOMBIAN_SECTORS.map((sector) => {
                    const selected = selectedSectors.includes(sector);
                    return (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                          selected
                            ? "bg-btg-gold/15 border-btg-gold/40 text-btg-gold"
                            : "bg-btg-navy border-btg-navy-border text-btg-text-muted hover:border-btg-gold/20 hover:text-btg-text"
                        }`}
                      >
                        {sector}
                      </button>
                    );
                  })}
                </div>
                {selectedSectors.length > 0 && (
                  <p className="text-btg-text-dim text-xs mt-3">
                    {selectedSectors.length} sector{selectedSectors.length !== 1 ? "es" : ""} seleccionado{selectedSectors.length !== 1 ? "s" : ""}
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Context & Config */}
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-btg-text">
                  3. Contexto y Configuración
                </h2>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Textarea
                  label="Contexto del Mercado"
                  placeholder="Describe el contexto específico: coyuntura macroeconómica, tendencias sectoriales, oportunidades identificadas, eventos recientes (reformas, proyectos de ley, inversiones anunciadas)..."
                  rows={4}
                  value={marketContext}
                  onChange={(e) => setMarketContext(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-btg-text-muted mb-1.5">
                    Número de Leads a Generar
                  </label>
                  <div className="flex items-center gap-3">
                    {[4, 6, 8, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNumberOfLeads(n)}
                        className={`w-12 h-10 rounded-xl border text-sm font-medium transition-all ${
                          numberOfLeads === n
                            ? "bg-btg-gold/15 border-btg-gold/40 text-btg-gold"
                            : "bg-btg-navy border-btg-navy-border text-btg-text-muted hover:border-btg-gold/20"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              variant="primary"
              size="lg"
              loading={isAnalyzing}
              className="w-full"
              onClick={handleAnalyze}
              icon={isAnalyzing ? undefined : <Radar size={18} />}
            >
              {isAnalyzing ? "Analizando mercado con Claude AI..." : "Iniciar Análisis de Mercado"}
            </Button>

            {isAnalyzing && (
              <div className="text-center text-btg-text-muted text-sm animate-pulse">
                Claude está analizando el mercado colombiano y generando leads calificados...
                <br />
                <span className="text-xs text-btg-text-dim">Esto puede tomar 30-60 segundos</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6 animate-fade-in">
          {/* Results header */}
          <Card gold>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-btg-gold/10 rounded-xl">
                    <Sparkles size={24} className="text-btg-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-btg-text">
                      Análisis Completado
                    </h2>
                    <p className="text-btg-text-muted text-sm mt-1">
                      {analysisResult.totalOpportunities} oportunidades identificadas ·{" "}
                      <span className="text-btg-gold">
                        {formatCurrency(analysisResult.estimatedTotalAmount)} potencial total
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedProducts.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-0.5 bg-btg-navy border border-btg-navy-border rounded-full text-btg-text-muted"
                        >
                          {PRODUCT_TYPE_LABELS[p]}
                        </span>
                      ))}
                      {selectedSectors.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 bg-btg-navy border border-btg-navy-border rounded-full text-btg-text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download size={14} />}
                    onClick={handleSaveAll}
                  >
                    Guardar Todos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAnalysisResult(null)}
                  >
                    Nuevo Análisis
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Market Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={18} className="text-btg-gold" />
                  <h3 className="text-lg font-semibold text-btg-text">
                    Análisis de Mercado
                  </h3>
                </div>
                <button
                  onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                  className="text-btg-text-muted text-sm hover:text-btg-text transition-colors flex items-center gap-1"
                >
                  {showFullAnalysis ? "Ver menos" : "Ver completo"}
                  {showFullAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className={`analysis-prose text-btg-text-muted text-sm leading-relaxed ${!showFullAnalysis ? "line-clamp-4" : ""}`}>
                {analysisResult.marketOverview.split("\n").map((para, i) => (
                  para.trim() && <p key={i} className="mb-3">{para}</p>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Lead suggestions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-btg-text">
                Leads Identificados
              </h3>
              <span className="text-btg-text-muted text-sm">
                {savedLeads.size}/{analysisResult.leads.length} guardados
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analysisResult.leads.map((lead, index) => (
                <LeadSuggestionCard
                  key={index}
                  lead={lead}
                  index={index}
                  onSave={(l) => handleSaveLead(l, index)}
                  saved={savedLeads.has(index)}
                />
              ))}
            </div>
          </div>

          {/* CTA to Leads */}
          {savedLeads.size > 0 && (
            <Card className="bg-gradient-card border-btg-gold/20 p-6 text-center">
              <p className="text-btg-text font-semibold mb-2">
                {savedLeads.size} lead{savedLeads.size !== 1 ? "s" : ""} guardado{savedLeads.size !== 1 ? "s" : ""} exitosamente
              </p>
              <p className="text-btg-text-muted text-sm mb-4">
                Ve a la gestión de leads para hacer seguimiento y actualizar el estado
              </p>
              <Link href="/leads">
                <Button variant="primary" icon={<ArrowRight size={16} />}>
                  Ver mis Leads
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
