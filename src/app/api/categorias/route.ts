import { NextResponse } from "next/server";
import { CATEGORIAS } from "@/lib/priority";

// GET /api/categorias - lista las categorías disponibles
export async function GET() {
  const categorias = Object.entries(CATEGORIAS).map(([key, val]) => ({
    key,
    label: val.label,
    descripcion: val.descripcion,
    peso: val.peso,
  }));
  return NextResponse.json({ categorias });
}
