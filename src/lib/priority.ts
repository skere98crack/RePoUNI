// Algoritmo de Prioridad para Problemas Universitarios
// Puntaje = severidadPonderada * 0.40 + votos * 0.35 + recencia * 0.25
// La severidad se pondera por categoría (factor de impacto institucional)

export const CATEGORIAS = {
  infraestructura: { label: "Infraestructura", peso: 8, descripcion: "Aulas, laboratorios, mobiliario, servicios higiénicos" },
  social: { label: "Social", peso: 6, descripcion: "Convivencia, integración, eventos estudiantiles" },
  estudiantil: { label: "Estudiantil", peso: 7, descripcion: "Trámites, matrícula, bienestar estudiantil" },
  academico: { label: "Académico", peso: 7, descripcion: "Docencia, evaluaciones, sílabos, horarios" },
  seguridad: { label: "Seguridad", peso: 10, descripcion: "Riesgos físicos, emergencias, vigilancia" },
  otros: { label: "Otros", peso: 4, descripcion: "Cualquier otro problema no clasificado" },
} as const;

export type CategoriaKey = keyof typeof CATEGORIAS;

/**
 * Calcula el puntaje de prioridad de un problema.
 * Rango: 0 - 10
 *
 * Fórmula:
 *   severidadPonderada = (severidad * pesoCategoria / 10)   // normalizado a 0-10
 *   factorVotos = min(votos / 10, 1) * 10                   // 10 votos = saturación
 *   factorRecencia = max(10 - diasDesdeCreacion / 3, 0)     // decae con el tiempo
 *
 *   prioridad = severidadPonderada * 0.40 + factorVotos * 0.35 + factorRecencia * 0.25
 */
export function calcularPrioridad(params: {
  severidad: number;
  categoria: string;
  votos: number;
  createdAt: Date;
  ahora?: Date;
}): number {
  const { severidad, categoria, votos, createdAt, ahora = new Date() } = params;
  const peso = (CATEGORIAS as Record<string, { peso: number }>)[categoria]?.peso ?? 4;

  const severidadNorm = Math.min(10, Math.max(1, severidad));
  const severidadPonderada = (severidadNorm * peso) / 10;

  const factorVotos = Math.min(votos / 10, 1) * 10;

  const diasTranscurridos = (ahora.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const factorRecencia = Math.max(10 - diasTranscurridos / 3, 0);

  const prioridad = severidadPonderada * 0.4 + factorVotos * 0.35 + factorRecencia * 0.25;

  return Math.round(prioridad * 100) / 100;
}

export function nivelPrioridad(puntaje: number): {
  nivel: "Crítico" | "Alto" | "Medio" | "Bajo";
  color: string;
} {
  if (puntaje >= 8) return { nivel: "Crítico", color: "text-red-600 bg-red-50 border-red-200" };
  if (puntaje >= 6) return { nivel: "Alto", color: "text-orange-600 bg-orange-50 border-orange-200" };
  if (puntaje >= 4) return { nivel: "Medio", color: "text-amber-600 bg-amber-50 border-amber-200" };
  return { nivel: "Bajo", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
}
