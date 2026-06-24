// Seed para Railway / PostgreSQL
// Se ejecuta automáticamente en cada deploy vía `npx prisma db seed`
import { PrismaClient } from "@prisma/client";
import { calcularPrioridad, CATEGORIAS } from "../src/lib/priority";

const db = new PrismaClient();

const EQUIPO = [
  { nombre: "Perez Diaz Michael Xavier", rol: "Diseño", orden: 1 },
  { nombre: "Rodriguez Juan José", rol: "Base de datos", orden: 2 },
  { nombre: "Salazar Chamorro Josué Caleb", rol: "Frontend", orden: 3 },
  { nombre: "Torres Caballa Carlos Javier", rol: "Clasificación", orden: 4 },
  { nombre: "De la Cruz Crispín Jhon Gabriel", rol: "Backend", orden: 5 },
];

const PROBLEMAS_EJEMPLO: Array<{
  titulo: string;
  descripcion: string;
  categoria: keyof typeof CATEGORIAS;
  ubicacion: string;
  severidad: number;
  votos: number;
  haceDias: number;
}> = [
  {
    titulo: "Laboratorio de cómputo sin internet",
    descripcion:
      "El laboratorio L-204 de la Facultad de Ingeniería no cuenta con conexión a internet desde hace tres semanas, lo que impide realizar las prácticas de programación. Varias secciones se han visto afectadas y los docentes no pueden aplicar evaluaciones.",
    categoria: "infraestructura",
    ubicacion: "Facultad de Ingeniería - Lab L-204",
    severidad: 9,
    votos: 8,
    haceDias: 4,
  },
  {
    titulo: "Falta de iluminación en estacionamiento norte",
    descripcion:
      "El estacionamiento norte no tiene iluminación adecuada después de las 6pm, generando riesgos de seguridad para estudiantes y docentes que salen tarde. Ya se han reportado dos incidentes menores.",
    categoria: "seguridad",
    ubicacion: "Estacionamiento Norte",
    severidad: 10,
    votos: 12,
    haceDias: 2,
  },
  {
    titulo: "Trámites de matrícula excesivamente lentos",
    descripcion:
      "Los trámites de matrícula en la oficina de registros académicos demoran más de 3 horas por estudiante. Esto afecta especialmente a los cachimbos que no conocen los procesos y llegan mal informados.",
    categoria: "estudiantil",
    ubicacion: "Oficina de Registros Académicos",
    severidad: 7,
    votos: 6,
    haceDias: 7,
  },
  {
    titulo: "Baños sin insumos de higiene",
    descripcion:
      "Los baños del pabellón B no cuentan con papel higiénico ni jabón desde hace dos semanas. Esto representa un problema de salubridad para toda la comunidad estudiantil.",
    categoria: "infraestructura",
    ubicacion: "Pabellón B - todos los pisos",
    severidad: 8,
    votos: 5,
    haceDias: 9,
  },
  {
    titulo: "Falta de integración entre cachimbos y veteranos",
    descripcion:
      "No existen espacios formales para que los estudiantes nuevos se integren con los de ciclos superiores. Muchos cachimbos reportan sentirse desorientados durante su primer ciclo.",
    categoria: "social",
    ubicacion: "General - Campus central",
    severidad: 6,
    votos: 4,
    haceDias: 12,
  },
  {
    titulo: "Horarios de clases superpuestos",
    descripcion:
      "Varios cursos de carreras afines tienen horarios superpuestos, impidiendo a los estudiantes matricularse en su malla curricular planificada. Esto retrasa la graduación de al menos 2 ciclos.",
    categoria: "academico",
    ubicacion: "Facultad de Ingeniería de Sistemas",
    severidad: 7,
    votos: 7,
    haceDias: 5,
  },
  {
    titulo: "Aulas sin ventilación adecuada",
    descripcion:
      "Las aulas A-101, A-102 y A-103 no cuentan con ventilación suficiente para la cantidad de estudiantes. En horas punta la temperatura supera los 30°C, dificultando la concentración.",
    categoria: "infraestructura",
    ubicacion: "Pabellón A - primer piso",
    severidad: 6,
    votos: 3,
    haceDias: 15,
  },
];

async function main() {
  console.log("→ [SEED] Verificando datos existentes...");
  const existeEquipo = await db.equipo.count();
  if (existeEquipo > 0) {
    console.log(`→ [SEED] Ya hay ${existeEquipo} miembros del equipo. Seed omitido (idempotente).`);
    return;
  }

  console.log("→ [SEED] Insertando equipo del proyecto...");
  for (const miembro of EQUIPO) {
    await db.equipo.create({ data: miembro });
  }

  console.log(`→ [SEED] Insertando ${PROBLEMAS_EJEMPLO.length} problemas de ejemplo...`);
  const ahora = new Date();
  for (const p of PROBLEMAS_EJEMPLO) {
    const createdAt = new Date(ahora.getTime() - p.haceDias * 24 * 60 * 60 * 1000);
    const prioridad = calcularPrioridad({
      severidad: p.severidad,
      categoria: p.categoria,
      votos: p.votos,
      createdAt,
      ahora,
    });
    await db.problema.create({
      data: {
        titulo: p.titulo,
        descripcion: p.descripcion,
        categoria: p.categoria,
        ubicacion: p.ubicacion,
        severidad: p.severidad,
        votos: p.votos,
        prioridad,
        estado: "abierto",
      },
    });
  }

  console.log("✔ [SEED] Completado.");
}

main()
  .catch((e) => {
    console.error("[SEED] Error:", e);
    // No salir con código de error para no romper el deploy si ya hay datos
    process.exit(0);
  })
  .finally(async () => {
    await db.$disconnect();
  });
