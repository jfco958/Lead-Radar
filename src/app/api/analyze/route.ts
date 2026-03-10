import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runMarketAnalysis } from "@/lib/claude";
import type { ProductType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      sectors: string[];
      products: ProductType[];
      marketContext: string;
      numberOfLeads?: number;
      saveLeads?: boolean;
    };

    const { sectors, products, marketContext, numberOfLeads = 8, saveLeads = false } = body;

    if (!sectors?.length || !products?.length || !marketContext?.trim()) {
      return NextResponse.json(
        { error: "Sectores, productos y contexto de mercado son requeridos" },
        { status: 400 }
      );
    }

    // Run Claude market analysis
    const analysisResult = await runMarketAnalysis({
      sectors,
      products,
      marketContext,
      numberOfLeads,
    });

    // Calculate total amount
    const estimatedTotalAmount = analysisResult.leads.reduce(
      (sum, lead) => sum + (lead.estimatedAmount || 0),
      0
    );
    analysisResult.estimatedTotalAmount = estimatedTotalAmount;

    // Save analysis to DB
    const analysis = await prisma.analysis.create({
      data: {
        sectors: JSON.stringify(sectors),
        products: JSON.stringify(products),
        marketContext,
        fullAnalysis: analysisResult.marketOverview,
        leadsGenerated: analysisResult.leads.length,
        totalAmount: estimatedTotalAmount,
      },
    });

    // Optionally save leads
    if (saveLeads && analysisResult.leads.length > 0) {
      await prisma.lead.createMany({
        data: analysisResult.leads.map((lead) => ({
          companyName: lead.companyName,
          sector: lead.sector,
          productType: lead.productType,
          description: lead.opportunity,
          estimatedAmount: lead.estimatedAmount ?? null,
          currency: lead.currency || "COP",
          riskLevel: lead.riskLevel,
          rationale: lead.rationale,
          keyFactors: JSON.stringify(lead.keyFactors || []),
          priority: lead.priority,
          status: "NEW",
          analysisId: analysis.id,
          source: "AI_GENERATED",
          contactName: null,
          contactEmail: null,
          contactPhone: null,
          contactRole: lead.contactSuggestions || null,
        })),
      });
    }

    return NextResponse.json({
      analysisId: analysis.id,
      marketOverview: analysisResult.marketOverview,
      leads: analysisResult.leads,
      totalOpportunities: analysisResult.leads.length,
      estimatedTotalAmount,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Error al realizar el análisis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
