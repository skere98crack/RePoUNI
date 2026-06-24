import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CATEGORIAS } from "@/lib/priority";

// GET /api/stats - estadísticas para el dashboard
export async function GET() {
  const total = await db.problema.count();
  const abiertos = await db.problema.count({ where: { estado: "abierto" } });
  const enProgreso = await db.problema.count({ where: { estado: "en_progreso" } });
  const resueltos = await db.problema.count({ where: { estado: "resuelto" } });
  const totalVotos = await db.problema.aggregate({ _sum: { votos: true } });
  const totalValoraciones = await db.valoracion.count();
  const promedioPrioridad = await db.problema.aggregate({ _avg: { prioridad: true } });

  // Calificaciones de la página
  const totalCalificacionesPagina = await db.calificacionPagina.count();
  const promedioCalificacionPagina = await db.calificacionPagina.aggregate({
    _avg: { puntaje: true },
  });

  // Distribución por categoría
  const porCategoriaRaw = await db.problema.groupBy({
    by: ["categoria"],
    _count: { _all: true },
    _sum: { votos: true },
  });

  const porCategoria = porCategoriaRaw.map((c) => ({
    key: c.categoria,
    label: (CATEGORIAS as Record<string, { label: string }>)[c.categoria]?.label ?? c.categoria,
    count: c._count._all,
    votos: c._sum.votos ?? 0,
  }));

  return NextResponse.json({
    total,
    abiertos,
    enProgreso,
    resueltos,
    totalVotos: totalVotos._sum.votos ?? 0,
    totalValoraciones,
    promedioPrioridad: Math.round((promedioPrioridad._avg.prioridad ?? 0) * 100) / 100,
    totalCalificacionesPagina,
    promedioCalificacionPagina:
      Math.round((promedioCalificacionPagina._avg.puntaje ?? 0) * 100) / 100,
    porCategoria,
  });
}
