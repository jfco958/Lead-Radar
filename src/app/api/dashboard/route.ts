import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalLeads,
      activeLeads,
      wonLeads,
      allLeads,
      recentLeads,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          status: { notIn: ["WON", "LOST"] },
        },
      }),
      prisma.lead.count({ where: { status: "WON" } }),
      prisma.lead.findMany({
        select: {
          status: true,
          productType: true,
          estimatedAmount: true,
          sector: true,
          currency: true,
        },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
    ]);

    // Leads by status
    const leadsByStatus: Record<string, number> = {};
    allLeads.forEach((l) => {
      leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1;
    });

    // Leads by product
    const leadsByProduct: Record<string, number> = {};
    allLeads.forEach((l) => {
      leadsByProduct[l.productType] = (leadsByProduct[l.productType] || 0) + 1;
    });

    // Total estimated amount (normalize USD to COP approx)
    const USD_TO_COP = 4200;
    let totalEstimatedAmount = 0;
    allLeads.forEach((l) => {
      if (l.estimatedAmount) {
        const amount = l.currency === "USD"
          ? l.estimatedAmount * USD_TO_COP
          : l.estimatedAmount;
        totalEstimatedAmount += amount;
      }
    });

    // Conversion rate
    const conversionRate =
      totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    // Top sectors
    const sectorCount: Record<string, number> = {};
    allLeads.forEach((l) => {
      sectorCount[l.sector] = (sectorCount[l.sector] || 0) + 1;
    });
    const topSectors = Object.entries(sectorCount)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      totalLeads,
      activeLeads,
      wonLeads,
      totalEstimatedAmount,
      leadsByStatus,
      leadsByProduct,
      conversionRate,
      recentLeads,
      topSectors,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: "Error al obtener métricas" }, { status: 500 });
  }
}
