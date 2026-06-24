import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/page-feedback - lista todas las calificaciones de la página
export async function GET() {
  const calificaciones = await db.calificacionPagina.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const total = calificaciones.length;
  const promedio =
    total > 0
      ? Math.round((calificaciones.reduce((s, c) => s + c.puntaje, 0) / total) * 100) / 100
      : 0;

  return NextResponse.json({ calificaciones, total, promedio });
}

// POST /api/page-feedback - crea una nueva calificación de la página
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { puntaje, comentario, codigoAlumno } = body;

    const pts = Number(puntaje);
    if (!pts || pts < 1 || pts > 10) {
      return NextResponse.json(
        { error: "El puntaje debe estar entre 1 y 10" },
        { status: 400 },
      );
    }

    if (comentario && comentario.length > 500) {
      return NextResponse.json(
        { error: "El comentario no puede exceder 500 caracteres" },
        { status: 400 },
      );
    }

    if (codigoAlumno && codigoAlumno.length > 20) {
      return NextResponse.json(
        { error: "El código de alumno no puede exceder 20 caracteres" },
        { status: 400 },
      );
    }

    const calificacion = await db.calificacionPagina.create({
      data: {
        puntaje: pts,
        comentario: comentario?.trim() || null,
        codigoAlumno: codigoAlumno?.trim() || null,
      },
    });

    return NextResponse.json({ calificacion }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
