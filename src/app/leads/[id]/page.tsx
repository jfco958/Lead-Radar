"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Edit3,
  Trash2,
  Plus,
  Phone,
  Mail,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  AlertTriangle,
  Check,
  X,
  MessageSquare,
  PhoneCall,
  Users,
  ChevronDown,
} from "lucide-react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge, ProductBadge, PriorityBadge, RiskBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input, { Select, Textarea } from "@/components/ui/Input";
import { formatCurrency, formatDate, formatRelativeTime, parseKeyFactors } from "@/lib/utils";
import {
  LEAD_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
  PRIORITY_LABELS,
  NOTE_TYPE_LABELS,
  NOTE_TYPE_ICONS,
  COLOMBIAN_SECTORS,
} from "@/types";
import type {
  Lead,
  Note,
  LeadStatus,
  ProductType,
  Priority,
  RiskLevel,
  NoteType,
} from "@/types";

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "Nuevo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "IN_ANALYSIS", label: "En Análisis" },
  { value: "PROPOSAL", label: "Propuesta" },
  { value: "NEGOTIATION", label: "Negociación" },
  { value: "WON", label: "Ganado" },
  { value: "LOST", label: "Perdido" },
  { value: "ON_HOLD", label: "En Pausa" },
];

const STATUS_PIPELINE: LeadStatus[] = [
  "NEW", "CONTACTED", "IN_ANALYSIS", "PROPOSAL", "NEGOTIATION", "WON",
];

function EditLeadModal({
  lead,
  isOpen,
  onClose,
  onUpdated,
}: {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
}) {
  const [form, setForm] = useState({
    companyName: lead.companyName,
    sector: lead.sector,
    productType: lead.productType as ProductType,
    description: lead.description,
    estimatedAmount: lead.estimatedAmount?.toString() || "",
    currency: lead.currency,
    riskLevel: lead.riskLevel as RiskLevel,
    rationale: lead.rationale,
    priority: lead.priority as Priority,
    contactName: lead.contactName || "",
    contactEmail: lead.contactEmail || "",
    contactPhone: lead.contactPhone || "",
    contactRole: lead.contactRole || "",
    assignedTo: lead.assignedTo || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedAmount: form.estimatedAmount ? parseFloat(form.estimatedAmount) : null,
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updated = await res.json() as Lead;
      onUpdated(updated);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Lead" size="lg">
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Empresa"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
          <Select
            label="Sector"
            value={form.sector}
            onChange={(e) => update("sector", e.target.value)}
          >
            {COLOMBIAN_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Producto"
            value={form.productType}
            onChange={(e) => update("productType", e.target.value)}
          >
            {Object.entries(PRODUCT_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
          <Select
            label="Prioridad"
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
          >
            {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        </div>
        <Textarea
          label="Descripción"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <Textarea
          label="Rationale"
          rows={2}
          value={form.rationale}
          onChange={(e) => update("rationale", e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Monto Estimado"
            type="number"
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
            onChange={(e) => update("riskLevel", e.target.value)}
          >
            <option value="LOW">Bajo</option>
            <option value="MEDIUM">Medio</option>
            <option value="HIGH">Alto</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Contacto"
            value={form.contactName}
            placeholder="Nombre del contacto"
            onChange={(e) => update("contactName", e.target.value)}
          />
          <Input
            label="Cargo"
            value={form.contactRole}
            placeholder="CFO / VP Finanzas"
            onChange={(e) => update("contactRole", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={form.contactEmail}
            placeholder="contacto@empresa.com"
            onChange={(e) => update("contactEmail", e.target.value)}
          />
          <Input
            label="Teléfono"
            value={form.contactPhone}
            placeholder="+57 300 000 0000"
            onChange={(e) => update("contactPhone", e.target.value)}
          />
        </div>
        <Input
          label="Asignado a"
          value={form.assignedTo}
          placeholder="Nombre del ejecutivo"
          onChange={(e) => update("assignedTo", e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function NoteItem({ note }: { note: Note }) {
  const icon = NOTE_TYPE_ICONS[note.type] || "📝";
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-btg-navy flex items-center justify-center flex-shrink-0 text-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-btg-text text-sm font-medium">{note.author}</span>
            <span className="text-btg-text-dim text-xs">
              {NOTE_TYPE_LABELS[note.type]}
            </span>
          </div>
          <span className="text-btg-text-dim text-xs flex-shrink-0">
            {formatRelativeTime(note.createdAt)}
          </span>
        </div>
        <p className="text-btg-text-muted text-sm mt-1 leading-relaxed">{note.content}</p>
      </div>
    </div>
  );
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Notes
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<NoteType>("NOTE");
  const [noteAuthor, setNoteAuthor] = useState("Usuario");
  const [addingNote, setAddingNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchLead = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${resolvedParams.id}`);
      if (!res.ok) {
        router.push("/leads");
        return;
      }
      const data = await res.json() as Lead;
      setLead(data);
    } catch {
      router.push("/leads");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    void fetchLead();
  }, [fetchLead]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    setShowStatusDropdown(false);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json() as Lead;
        setLead(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!lead) return;
    try {
      await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
      router.push("/leads");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async () => {
    if (!lead || !noteContent.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: noteContent,
          type: noteType,
          author: noteAuthor,
        }),
      });
      if (res.ok) {
        const note = await res.json() as Note;
        setLead((prev) =>
          prev ? { ...prev, notes: [note, ...(prev.notes || [])] } : prev
        );
        setNoteContent("");
        setAddingNote(false);
        setNoteType("NOTE");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 shimmer rounded-lg" />
        <div className="h-48 shimmer rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-96 shimmer rounded-2xl" />
          <div className="h-96 shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!lead) return null;

  const keyFactors = parseKeyFactors(lead.keyFactors);
  const currentStatusIndex = STATUS_PIPELINE.indexOf(lead.status);

  return (
    <div className="p-8 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/leads"
            className="p-2 text-btg-text-muted hover:text-btg-text hover:bg-btg-navy-card rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-btg-text">{lead.companyName}</h1>
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-btg-text-muted text-sm mt-0.5">
              {lead.sector} · Creado {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit3 size={14} />}
            onClick={() => setShowEditModal(true)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {/* Pipeline Status */}
      <Card>
        <div className="px-6 py-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STATUS_PIPELINE.map((status, index) => {
              const isPassed = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isNext = index === currentStatusIndex + 1;

              return (
                <div key={status} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => void handleStatusChange(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      isCurrent
                        ? "bg-btg-gold text-btg-navy font-bold"
                        : isPassed
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : isNext
                        ? "bg-btg-navy-card border border-btg-navy-border text-btg-text-muted hover:border-btg-gold/30 cursor-pointer"
                        : "bg-btg-navy text-btg-text-dim border border-btg-navy-border opacity-50 cursor-pointer"
                    }`}
                  >
                    {isPassed && <span className="mr-1">✓</span>}
                    {LEAD_STATUS_LABELS[status]}
                  </button>
                  {index < STATUS_PIPELINE.length - 1 && (
                    <div className={`w-6 h-px mx-1 ${isPassed || isCurrent ? "bg-btg-gold/40" : "bg-btg-navy-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Special states */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-btg-text-dim text-xs">Mover a:</span>
            {(["LOST", "ON_HOLD"] as LeadStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => void handleStatusChange(s)}
                className={`px-3 py-1 rounded-lg text-xs border transition-colors ${
                  lead.status === s
                    ? "bg-red-500/20 border-red-500/40 text-red-400"
                    : "border-btg-navy-border text-btg-text-dim hover:border-btg-navy-border hover:text-btg-text-muted"
                }`}
              >
                {LEAD_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-btg-text">Oportunidad</h2>
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-2">
                  Descripción
                </h3>
                <p className="text-btg-text-muted text-sm leading-relaxed">
                  {lead.description}
                </p>
              </div>
              {lead.rationale && (
                <div>
                  <h3 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-2">
                    Por qué BTG Pactual
                  </h3>
                  <p className="text-btg-text-muted text-sm leading-relaxed">
                    {lead.rationale}
                  </p>
                </div>
              )}
              {keyFactors.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-btg-text-muted uppercase tracking-wide mb-2">
                    Factores Clave
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keyFactors.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2.5 py-1 bg-btg-navy border border-btg-navy-border rounded-full text-btg-text-muted"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Notes & Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-btg-text">
                  Notas y Actividad
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => setAddingNote(!addingNote)}
                >
                  Agregar Nota
                </Button>
              </div>
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              {/* Add note form */}
              {addingNote && (
                <div className="p-4 bg-btg-navy rounded-xl border border-btg-navy-border space-y-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Tipo"
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as NoteType)}
                    >
                      {Object.entries(NOTE_TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>
                          {NOTE_TYPE_ICONS[v as NoteType]} {l}
                        </option>
                      ))}
                    </Select>
                    <Input
                      label="Autor"
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <Textarea
                    label="Nota"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Escribe tu nota aquí..."
                    rows={3}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X size={14} />}
                      onClick={() => { setAddingNote(false); setNoteContent(""); }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={savingNote}
                      icon={<Check size={14} />}
                      onClick={handleAddNote}
                      disabled={!noteContent.trim()}
                    >
                      Guardar Nota
                    </Button>
                  </div>
                </div>
              )}

              {/* Notes list */}
              {lead.notes && lead.notes.length > 0 ? (
                <div className="space-y-4">
                  {lead.notes.map((note) => (
                    <NoteItem key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-btg-text-muted">
                  <MessageSquare size={28} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Sin notas todavía</p>
                  <p className="text-xs text-btg-text-dim mt-1">
                    Agrega una nota para registrar la actividad
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-btg-text">Información</h2>
            </CardHeader>
            <CardBody className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-btg-text-muted text-sm">Producto</span>
                  <ProductBadge productType={lead.productType} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-btg-text-muted text-sm">Prioridad</span>
                  <PriorityBadge priority={lead.priority} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-btg-text-muted text-sm">Riesgo</span>
                  <RiskBadge riskLevel={lead.riskLevel} />
                </div>
                {lead.estimatedAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-btg-text-muted text-sm">Monto Estimado</span>
                    <div className="flex items-center gap-1 text-btg-gold font-semibold text-sm">
                      <DollarSign size={14} />
                      {formatCurrency(lead.estimatedAmount, lead.currency)}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-btg-text-muted text-sm">Fuente</span>
                  <span className="text-btg-text-muted text-xs">
                    {lead.source === "AI_GENERATED" ? "🤖 Market Radar" : "📝 Manual"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-btg-text-muted text-sm">Creado</span>
                  <div className="flex items-center gap-1 text-btg-text-muted text-xs">
                    <Calendar size={12} />
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-btg-text-muted text-sm">Actualizado</span>
                  <div className="flex items-center gap-1 text-btg-text-muted text-xs">
                    <Calendar size={12} />
                    {formatRelativeTime(lead.updatedAt)}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-btg-text-muted" />
                <h2 className="text-base font-semibold text-btg-text">Contacto</h2>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              {lead.contactName || lead.contactEmail || lead.contactPhone || lead.contactRole ? (
                <div className="space-y-3">
                  {lead.contactName && (
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-btg-text-dim flex-shrink-0" />
                      <span className="text-btg-text text-sm">{lead.contactName}</span>
                    </div>
                  )}
                  {lead.contactRole && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-btg-text-dim flex-shrink-0" />
                      <span className="text-btg-text-muted text-sm">{lead.contactRole}</span>
                    </div>
                  )}
                  {lead.contactEmail && (
                    <a
                      href={`mailto:${lead.contactEmail}`}
                      className="flex items-center gap-2 text-btg-gold hover:underline"
                    >
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="text-sm truncate">{lead.contactEmail}</span>
                    </a>
                  )}
                  {lead.contactPhone && (
                    <a
                      href={`tel:${lead.contactPhone}`}
                      className="flex items-center gap-2 text-btg-text-muted hover:text-btg-text"
                    >
                      <Phone size={14} className="flex-shrink-0" />
                      <span className="text-sm">{lead.contactPhone}</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <User size={24} className="mx-auto mb-2 text-btg-text-dim opacity-50" />
                  <p className="text-btg-text-dim text-sm">Sin información de contacto</p>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-btg-gold text-xs mt-2 hover:underline"
                  >
                    Agregar contacto
                  </button>
                </div>
              )}
              {lead.assignedTo && (
                <div className="mt-3 pt-3 border-t border-btg-navy-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-btg-gold/20 flex items-center justify-center">
                      <span className="text-btg-gold text-xs font-bold">
                        {lead.assignedTo.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-btg-text-muted text-sm">{lead.assignedTo}</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-btg-text">Acciones Rápidas</h2>
            </CardHeader>
            <CardBody className="pt-0 space-y-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<PhoneCall size={14} />}
                className="w-full justify-start"
                onClick={() => {
                  setNoteType("CALL");
                  setAddingNote(true);
                }}
              >
                Registrar Llamada
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Mail size={14} />}
                className="w-full justify-start"
                onClick={() => {
                  setNoteType("EMAIL");
                  setAddingNote(true);
                }}
              >
                Registrar Email
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Users size={14} />}
                className="w-full justify-start"
                onClick={() => {
                  setNoteType("MEETING");
                  setAddingNote(true);
                }}
              >
                Registrar Reunión
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {lead && (
        <EditLeadModal
          lead={lead}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => setLead(updated)}
        />
      )}

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Eliminar Lead"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/10 rounded-xl flex-shrink-0">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-btg-text text-sm">
                ¿Estás seguro de que deseas eliminar el lead de{" "}
                <strong>{lead.companyName}</strong>?
              </p>
              <p className="text-btg-text-muted text-xs mt-1">
                Esta acción no se puede deshacer. Se eliminarán todas las notas asociadas.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} icon={<Trash2 size={14} />}>
              Eliminar Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
