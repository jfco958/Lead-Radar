// ─── Product Types ────────────────────────────────────────────────────────────
export type ProductType =
  | "CREDIT"
  | "STRUCTURED_DEBT"
  | "PROJECT_FINANCE"
  | "GUARANTEE"
  | "SPECIAL_SITUATIONS";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  CREDIT: "Crédito",
  STRUCTURED_DEBT: "Deuda Estructurada",
  PROJECT_FINANCE: "Project Finance",
  GUARANTEE: "Garantías",
  SPECIAL_SITUATIONS: "Situaciones Especiales",
};

export const PRODUCT_TYPE_COLORS: Record<ProductType, string> = {
  CREDIT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  STRUCTURED_DEBT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  PROJECT_FINANCE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  GUARANTEE: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  SPECIAL_SITUATIONS: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

// ─── Lead Status ──────────────────────────────────────────────────────────────
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_ANALYSIS"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "ON_HOLD";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  IN_ANALYSIS: "En Análisis",
  PROPOSAL: "Propuesta",
  NEGOTIATION: "Negociación",
  WON: "Ganado",
  LOST: "Perdido",
  ON_HOLD: "En Pausa",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CONTACTED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  IN_ANALYSIS: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PROPOSAL: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  NEGOTIATION: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  WON: "bg-green-500/20 text-green-400 border-green-500/30",
  LOST: "bg-red-500/20 text-red-400 border-red-500/30",
  ON_HOLD: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

// ─── Priority ─────────────────────────────────────────────────────────────────
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  MEDIUM: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  URGENT: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ─── Risk Level ───────────────────────────────────────────────────────────────
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export const RISK_LABELS: Record<RiskLevel, string> = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: "text-green-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-red-400",
};

// ─── Lead Source ──────────────────────────────────────────────────────────────
export type LeadSource = "MANUAL" | "AI_GENERATED";

// ─── Note Type ────────────────────────────────────────────────────────────────
export type NoteType = "NOTE" | "CALL" | "EMAIL" | "MEETING" | "STATUS_CHANGE";

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  NOTE: "Nota",
  CALL: "Llamada",
  EMAIL: "Email",
  MEETING: "Reunión",
  STATUS_CHANGE: "Cambio de Estado",
};

export const NOTE_TYPE_ICONS: Record<NoteType, string> = {
  NOTE: "📝",
  CALL: "📞",
  EMAIL: "📧",
  MEETING: "🤝",
  STATUS_CHANGE: "🔄",
};

// ─── Data Models ──────────────────────────────────────────────────────────────
export interface Lead {
  id: string;
  companyName: string;
  sector: string;
  productType: ProductType;
  status: LeadStatus;
  priority: Priority;
  description: string;
  estimatedAmount?: number | null;
  currency: string;
  riskLevel: RiskLevel;
  rationale: string;
  keyFactors: string; // JSON string
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactRole?: string | null;
  assignedTo?: string | null;
  analysisId?: string | null;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
}

export interface Note {
  id: string;
  leadId: string;
  content: string;
  author: string;
  type: NoteType;
  createdAt: string;
}

export interface Analysis {
  id: string;
  sectors: string; // JSON string
  products: string; // JSON string
  marketContext: string;
  fullAnalysis: string;
  leadsGenerated: number;
  totalAmount: number;
  createdAt: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────
export interface AILeadSuggestion {
  companyName: string;
  sector: string;
  productType: ProductType;
  opportunity: string;
  estimatedAmount?: number;
  currency: string;
  riskLevel: RiskLevel;
  rationale: string;
  priority: Priority;
  keyFactors: string[];
  contactSuggestions: string;
}

export interface AnalysisResult {
  analysisId: string;
  marketOverview: string;
  leads: AILeadSuggestion[];
  totalOpportunities: number;
  estimatedTotalAmount: number;
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export interface DashboardMetrics {
  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  totalEstimatedAmount: number;
  leadsByStatus: Record<string, number>;
  leadsByProduct: Record<string, number>;
  conversionRate: number;
  recentLeads: Lead[];
  topSectors: { sector: string; count: number }[];
}

// ─── Filter Options ───────────────────────────────────────────────────────────
export interface LeadFilters {
  status?: LeadStatus;
  productType?: ProductType;
  priority?: Priority;
  riskLevel?: RiskLevel;
  search?: string;
  sector?: string;
}

// ─── Colombian Sectors ────────────────────────────────────────────────────────
export const COLOMBIAN_SECTORS = [
  "Energía y Petróleo",
  "Infraestructura y Construcción",
  "Agroindustria",
  "Manufactura",
  "Telecomunicaciones",
  "Retail y Consumo Masivo",
  "Salud y Farmacéutica",
  "Transporte y Logística",
  "Minería",
  "Sector Financiero",
  "Tecnología",
  "Turismo y Hotelería",
  "Inmobiliario",
  "Educación",
  "Servicios Públicos",
] as const;

export type ColombianSector = (typeof COLOMBIAN_SECTORS)[number];
