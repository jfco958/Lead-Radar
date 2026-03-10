"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import { ProductBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { LEAD_STATUS_LABELS } from "@/types";
import type { Lead, LeadStatus } from "@/types";

const PIPELINE_STAGES: LeadStatus[] = [
  "NEW", "CONTACTED", "IN_ANALYSIS", "PROPOSAL", "NEGOTIATION", "WON",
];

const STAGE_COLORS: Record<LeadStatus, string> = {
  NEW: "border-t-blue-500",
  CONTACTED: "border-t-purple-500",
  IN_ANALYSIS: "border-t-amber-500",
  PROPOSAL: "border-t-pink-500",
  NEGOTIATION: "border-t-emerald-500",
  WON: "border-t-green-500",
  LOST: "border-t-red-500",
  ON_HOLD: "border-t-gray-500",
};

export default function PipelinePage() {
  const [leadsByStage, setLeadsByStage] = useState<Record<string, Lead[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?limit=100");
      const data = await res.json() as { leads: Lead[] };

      const grouped: Record<string, Lead[]> = {};
      PIPELINE_STAGES.forEach((stage) => { grouped[stage] = []; });

      data.leads.forEach((lead) => {
        if (grouped[lead.status]) {
          grouped[lead.status]!.push(lead);
        }
      });

      setLeadsByStage(grouped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-btg-text">
          Pipeline <span className="gradient-text">Comercial</span>
        </h1>
        <p className="text-btg-text-muted text-sm mt-1">
          Vista Kanban del estado de oportunidades
        </p>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((s) => (
            <div key={s} className="w-72 flex-shrink-0 h-96 shimmer rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const leads = leadsByStage[stage] || [];
            const totalAmount = leads.reduce((sum, l) =>
              sum + (l.currency === "USD" ? (l.estimatedAmount || 0) * 4200 : (l.estimatedAmount || 0)), 0
            );
            return (
              <div key={stage} className="w-72 flex-shrink-0">
                {/* Column Header */}
                <div className={`bg-btg-navy-card border border-btg-navy-border border-t-2 ${STAGE_COLORS[stage]} rounded-2xl p-4 mb-3`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-btg-text text-sm">
                      {LEAD_STATUS_LABELS[stage]}
                    </span>
                    <span className="w-6 h-6 bg-btg-navy rounded-full flex items-center justify-center text-xs text-btg-text-muted font-bold">
                      {leads.length}
                    </span>
                  </div>
                  {totalAmount > 0 && (
                    <p className="text-btg-gold text-xs mt-1 font-medium">
                      {formatCurrency(totalAmount)}
                    </p>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <Link key={lead.id} href={`/leads/${lead.id}`}>
                      <Card hover className="p-4 group">
                        <div className="flex items-start gap-2">
                          <Building2 size={14} className="text-btg-text-dim mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-btg-text text-sm font-medium group-hover:text-btg-gold transition-colors truncate">
                              {lead.companyName}
                            </p>
                            <p className="text-btg-text-dim text-xs mt-0.5 truncate">{lead.sector}</p>
                          </div>
                          <ChevronRight size={14} className="text-btg-text-dim flex-shrink-0" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <ProductBadge productType={lead.productType} />
                          <PriorityBadge priority={lead.priority} />
                        </div>
                        {lead.estimatedAmount && (
                          <p className="text-btg-gold text-xs font-semibold mt-2">
                            {formatCurrency(lead.estimatedAmount, lead.currency)}
                          </p>
                        )}
                        <p className="text-btg-text-dim text-xs mt-2">
                          {formatRelativeTime(lead.updatedAt)}
                        </p>
                      </Card>
                    </Link>
                  ))}
                  {leads.length === 0 && (
                    <div className="border-2 border-dashed border-btg-navy-border rounded-xl p-6 text-center">
                      <p className="text-btg-text-dim text-xs">Sin leads</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
