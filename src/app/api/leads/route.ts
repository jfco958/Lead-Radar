import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { LeadStatus, ProductType, Priority, RiskLevel } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeadStatus | null;
    const productType = searchParams.get("productType") as ProductType | null;
    const priority = searchParams.get("priority") as Priority | null;
    const riskLevel = searchParams.get("riskLevel") as RiskLevel | null;
    const search = searchParams.get("search");
    const sector = searchParams.get("sector");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (productType) where.productType = productType;
    if (priority) where.priority = priority;
    if (riskLevel) where.riskLevel = riskLevel;
    if (sector) where.sector = { contains: sector };
    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { sector: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      companyName: string;
      sector: string;
      productType: ProductType;
      description: string;
      estimatedAmount?: number;
      currency?: string;
      riskLevel?: RiskLevel;
      rationale?: string;
      keyFactors?: string[];
      priority?: Priority;
      contactName?: string;
      contactEmail?: string;
      contactPhone?: string;
      contactRole?: string;
      assignedTo?: string;
      analysisId?: string;
    };

    if (!body.companyName || !body.sector || !body.productType || !body.description) {
      return NextResponse.json(
        { error: "Nombre de empresa, sector, tipo de producto y descripción son requeridos" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        companyName: body.companyName,
        sector: body.sector,
        productType: body.productType,
        description: body.description,
        estimatedAmount: body.estimatedAmount ?? null,
        currency: body.currency || "COP",
        riskLevel: body.riskLevel || "MEDIUM",
        rationale: body.rationale || "",
        keyFactors: JSON.stringify(body.keyFactors || []),
        priority: body.priority || "MEDIUM",
        contactName: body.contactName ?? null,
        contactEmail: body.contactEmail ?? null,
        contactPhone: body.contactPhone ?? null,
        contactRole: body.contactRole ?? null,
        assignedTo: body.assignedTo ?? null,
        analysisId: body.analysisId ?? null,
        source: body.analysisId ? "AI_GENERATED" : "MANUAL",
        status: "NEW",
      },
      include: { notes: true },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Error al crear lead" }, { status: 500 });
  }
}
