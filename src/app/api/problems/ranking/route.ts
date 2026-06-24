import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/problems/ranking - top problemas ordenados por prioridad
export async function GET() {
  const problemas = await db.problema.findMany({
    orderBy: { prioridad: "desc" },
    take: 10,
    include: { _count: { select: { valoraciones: true } } },
  });

  return NextResponse.json({ ranking: problemas });
}
