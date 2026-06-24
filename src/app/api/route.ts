import { NextResponse } from "next/server";

// Health check
export async function GET() {
  return NextResponse.json({
    ok: true,
    proyecto: "RePoUNI - Sistema de Registro de Problemas Universitarios",
    version: "1.0.0",
    endpoints: [
      "GET /api/problems",
      "POST /api/problems",
      "GET /api/problems/ranking",
      "POST /api/feedback",
      "GET /api/team",
      "GET /api/stats",
      "GET /api/categorias",
    ],
  });
}
