import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calcularPrioridad, CATEGORIAS, type CategoriaKey } from "@/lib/priority";

// GET /api/problems - lista todos los problemas, opcionalmente filtrados
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get("categoria");
  const estado = searchParams.get("estado");
  const orden = searchParams.get("orden") ?? "prioridad"; // prioridad | recientes | votos

  const where: Record<string, unknown> = {};
  if (categoria && categoria !== "todas") where.categoria = categoria;
  if (estado && estado !== "todos") where.estado = estado;

  const orderBy =
    orden === "recientes"
      ? { createdAt: "desc" as const }
      : orden === "votos"
        ? { votos: "desc" as const }
        : { prioridad: "desc" as const };

  const problemas = await db.problema.findMany({
    where,
    orderBy,
    include: { _count: { select: { valoraciones: true } } },
    take: 50,
  });

  return NextResponse.json({ problemas });
}

// POST /api/problems - crea un nuevo problema
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, descripcion, categoria, ubicacion, codigoAlumno, severidad } = body;

    if (!titulo || titulo.trim().length < 5) {
      return NextResponse.json({ error: "El título debe tener al menos 5 caracteres" }, { status: 400 });
    }
    if (!descripcion || descripcion.trim().length < 15) {
      return NextResponse.json({ error: "La descripción debe tener al menos 15 caracteres" }, { status: 400 });
    }
    if (!categoria || !(categoria in CATEGORIAS)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }
    const sev = Number(severidad) || 5;
    if (sev < 1 || sev > 10) {
      return NextResponse.json({ error: "La severidad debe estar entre 1 y 10" }, { status: 400 });
    }

    // Verificar si ya existe un problema similar (mismo título) para acumular votos
    const existente = await db.problema.findFirst({
      where: { titulo: titulo.trim() },
    });

    if (existente) {
      const actualizado = await db.problema.update({
        where: { id: existente.id },
        data: {
          votos: existente.votos + 1,
          prioridad: calcularPrioridad({
            severidad: existente.severidad,
            categoria: existente.categoria,
            votos: existente.votos + 1,
            createdAt: existente.createdAt,
          }),
        },
      });
      return NextResponse.json({ problema: actualizado, duplicado: true });
    }

    const nuevo = await db.problema.create({
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria as CategoriaKey,
        ubicacion: ubicacion?.trim() || null,
        codigoAlumno: codigoAlumno?.trim() || null,
        severidad: sev,
        votos: 1,
        estado: "abierto",
        prioridad: calcularPrioridad({
          severidad: sev,
          categoria,
          votos: 1,
          createdAt: new Date(),
        }),
      },
    });

    return NextResponse.json({ problema: nuevo, duplicado: false }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
