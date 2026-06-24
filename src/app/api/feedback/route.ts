import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/feedback - registra valoración + sugerencia
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemaId, puntaje, comentario, sugerencia } = body;

    if (!problemaId) {
      return NextResponse.json({ error: "ProblemaId es requerido" }, { status: 400 });
    }
    const pts = Number(puntaje);
    if (!pts || pts < 1 || pts > 10) {
      return NextResponse.json({ error: "El puntaje debe estar entre 1 y 10" }, { status: 400 });
    }

    const problema = await db.problema.findUnique({ where: { id: problemaId } });
    if (!problema) {
      return NextResponse.json({ error: "Problema no encontrado" }, { status: 404 });
    }

    const valoracion = await db.valoracion.create({
      data: {
        problemaId,
        puntaje: pts,
        comentario: comentario?.trim() || null,
        sugerencia: sugerencia?.trim() || null,
      },
    });

    return NextResponse.json({ valoracion }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
