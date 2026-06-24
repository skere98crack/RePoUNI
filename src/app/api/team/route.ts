import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/team - lista el equipo del proyecto
export async function GET() {
  const equipo = await db.equipo.findMany({
    orderBy: { orden: "asc" },
  });
  return NextResponse.json({ equipo });
}
