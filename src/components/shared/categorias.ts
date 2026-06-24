// Categorías compartidas entre componentes
export const CATEGORIAS_LIST = [
  {
    key: "infraestructura",
    label: "Infraestructura",
    descripcion: "Aulas, laboratorios, mobiliario, servicios higiénicos",
    peso: 8,
    icon: "Building2",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    key: "social",
    label: "Social",
    descripcion: "Convivencia, integración, eventos estudiantiles",
    peso: 6,
    icon: "Users",
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    key: "estudiantil",
    label: "Estudiantil",
    descripcion: "Trámites, matrícula, bienestar estudiantil",
    peso: 7,
    icon: "GraduationCap",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    key: "academico",
    label: "Académico",
    descripcion: "Docencia, evaluaciones, sílabos, horarios",
    peso: 7,
    icon: "BookOpen",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    key: "seguridad",
    label: "Seguridad",
    descripcion: "Riesgos físicos, emergencias, vigilancia",
    peso: 10,
    icon: "ShieldAlert",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    key: "otros",
    label: "Otros",
    descripcion: "Cualquier otro problema no clasificado",
    peso: 4,
    icon: "MoreHorizontal",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
] as const;

export type CategoriaItem = (typeof CATEGORIAS_LIST)[number];

export const NIVELES_PRIORIDAD: Record<string, { label: string; className: string }> = {
  Critico: { label: "Crítico", className: "bg-red-100 text-red-700 border-red-200" },
  Alto: { label: "Alto", className: "bg-orange-100 text-orange-700 border-orange-200" },
  Medio: { label: "Medio", className: "bg-amber-100 text-amber-700 border-amber-200" },
  Bajo: { label: "Bajo", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export function nivelPrioridad(puntaje: number): keyof typeof NIVELES_PRIORIDAD {
  if (puntaje >= 8) return "Critico";
  if (puntaje >= 6) return "Alto";
  if (puntaje >= 4) return "Medio";
  return "Bajo";
}

export function getCategoria(key: string): CategoriaItem | undefined {
  return CATEGORIAS_LIST.find((c) => c.key === key);
}

export const ROLES_META: Record<string, { color: string; descripcion: string }> = {
  Diseño: {
    color: "bg-pink-100 text-pink-700 border-pink-200",
    descripcion: "Diseño de interfaz, experiencia de usuario y prototipado visual del sistema.",
  },
  "Base de datos": {
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    descripcion: "Modelado de datos, esquema Prisma y consultas optimizadas.",
  },
  Frontend: {
    color: "bg-sky-100 text-sky-700 border-sky-200",
    descripcion: "Implementación de la interfaz con Next.js, Tailwind y shadcn/ui.",
  },
  Clasificación: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    descripcion: "Definición de categorías y algoritmo de priorización de problemas.",
  },
  Backend: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    descripcion: "API REST, lógica de negocio y persistencia de problemas y valoraciones.",
  },
};
