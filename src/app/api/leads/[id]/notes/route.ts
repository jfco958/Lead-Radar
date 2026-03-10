import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NoteType } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = await prisma.note.findMany({
      where: { leadId: id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET notes error:", error);
    return NextResponse.json({ error: "Error al obtener notas" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as {
      content: string;
      author?: string;
      type?: NoteType;
    };

    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: "El contenido de la nota es requerido" },
        { status: 400 }
      );
    }

    // Verify lead exists
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    const note = await prisma.note.create({
      data: {
        leadId: id,
        content: body.content,
        author: body.author || "Usuario",
        type: body.type || "NOTE",
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST notes error:", error);
    return NextResponse.json({ error: "Error al crear nota" }, { status: 500 });
  }
}
