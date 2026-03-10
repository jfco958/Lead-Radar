import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("GET /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Error al obtener lead" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;

    // Check if lead exists
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    const prevStatus = existing.status;
    const newStatus = body.status as string | undefined;

    // Update lead
    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.companyName !== undefined && { companyName: body.companyName as string }),
        ...(body.sector !== undefined && { sector: body.sector as string }),
        ...(body.productType !== undefined && { productType: body.productType as string }),
        ...(body.status !== undefined && { status: body.status as string }),
        ...(body.priority !== undefined && { priority: body.priority as string }),
        ...(body.description !== undefined && { description: body.description as string }),
        ...(body.estimatedAmount !== undefined && { estimatedAmount: body.estimatedAmount as number | null }),
        ...(body.currency !== undefined && { currency: body.currency as string }),
        ...(body.riskLevel !== undefined && { riskLevel: body.riskLevel as string }),
        ...(body.rationale !== undefined && { rationale: body.rationale as string }),
        ...(body.keyFactors !== undefined && { keyFactors: JSON.stringify(body.keyFactors) }),
        ...(body.contactName !== undefined && { contactName: body.contactName as string | null }),
        ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail as string | null }),
        ...(body.contactPhone !== undefined && { contactPhone: body.contactPhone as string | null }),
        ...(body.contactRole !== undefined && { contactRole: body.contactRole as string | null }),
        ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo as string | null }),
      },
      include: { notes: { orderBy: { createdAt: "desc" } } },
    });

    // Auto-create status change note if status changed
    if (newStatus && newStatus !== prevStatus) {
      const statusLabels: Record<string, string> = {
        NEW: "Nuevo",
        CONTACTED: "Contactado",
        IN_ANALYSIS: "En Análisis",
        PROPOSAL: "Propuesta",
        NEGOTIATION: "Negociación",
        WON: "Ganado",
        LOST: "Perdido",
        ON_HOLD: "En Pausa",
      };
      await prisma.note.create({
        data: {
          leadId: id,
          content: `Estado actualizado de "${statusLabels[prevStatus] || prevStatus}" a "${statusLabels[newStatus] || newStatus}"`,
          type: "STATUS_CHANGE",
          author: "Sistema",
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Error al actualizar lead" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Error al eliminar lead" }, { status: 500 });
  }
}
