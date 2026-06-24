// Seed para Railway / PostgreSQL
// Se ejecuta automáticamente en cada deploy vía `npx prisma db seed`
// IMPORTANT: Borra TODOS los problemas y valoraciones existentes y reinerta
// datos semilla con temática UNI / FIIS. Esto garantiza un estado limpio
// para cada demo, sin reportes de prueba acumulados.
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

// Problemas semilla ambientados en la FIIS (Facultad de Ingeniería Industrial y de Sistemas)
// de la Universidad Nacional de Ingeniería (UNI), Perú.
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
    titulo: "Laboratorio de cómputo de Sistemas sin internet",
    descripcion:
      "El laboratorio de cómputo del pabellón de Industriales (sala S-204) no cuenta con conexión a internet desde hace tres semanas, lo que impide realizar las prácticas de los cursos de Programación I y II, Base de Datos y Estructuras de Datos. Varias secciones de la FIIS se han visto afectadas y los docentes no pueden aplicar evaluaciones prácticas.",
    categoria: "infraestructura",
    ubicacion: "FIIS - Pabellón de Industriales, Sala S-204",
    severidad: 9,
    votos: 8,
    haceDias: 4,
  },
  {
    titulo: "Falta de iluminación en el estacionamiento norte de la UNI",
    descripcion:
      "El estacionamiento norte del campus universitario de la UNI no tiene iluminación adecuada después de las 6pm, generando riesgos de seguridad para estudiantes y docentes de la FIIS que salen tarde después de clases nocturnas o trabajos de laboratorio. Ya se han reportado dos incidentes menores en lo que va del ciclo.",
    categoria: "seguridad",
    ubicacion: "UNI - Estacionamiento Norte",
    severidad: 10,
    votos: 12,
    haceDias: 2,
  },
  {
    titulo: "Trámites de matrícula excesivamente lentos en FIIS",
    descripcion:
      "Los trámites de matrícula en la oficina de registros académicos de la FIIS demoran más de 3 horas por estudiante. Esto afecta especialmente a los cachimbos de Ingeniería Industrial y de Sistemas que no conocen los procesos y llegan mal informados. Las colas empiezan desde las 7am y muchos pierden clases del primer ciclo intentando matricularse.",
    categoria: "estudiantil",
    ubicacion: "FIIS - Oficina de Registros Académicos",
    severidad: 7,
    votos: 6,
    haceDias: 7,
  },
  {
    titulo: "Baños del pabellón de Industriales sin insumos de higiene",
    descripcion:
      "Los baños del pabellón de Industriales, donde funcionan la mayoría de aulas de la FIIS, no cuentan con papel higiénico ni jabón desde hace dos semanas. Esto representa un problema de salubridad para toda la comunidad estudiantil de Ingeniería Industrial y de Sistemas, especialmente en época de exámenes cuando la afluencia es mayor.",
    categoria: "infraestructura",
    ubicacion: "FIIS - Pabellón de Industriales, todos los pisos",
    severidad: 8,
    votos: 5,
    haceDias: 9,
  },
  {
    titulo: "Falta de integración entre cachimbos y veteranos de la FIIS",
    descripcion:
      "No existen espacios formales para que los estudiantes nuevos de Ingeniería Industrial y de Sistemas se integren con los de ciclos superiores. Muchos cachimbos reportan sentirse desorientados durante su primer ciclo en la FIIS, sin conocer sobre horarios, aulas, profesores, ni oportunidades de prácticas. Se requieren mentorías entre veteranos y nuevos.",
    categoria: "social",
    ubicacion: "FIIS - General, Pabellón de Industriales",
    severidad: 6,
    votos: 4,
    haceDias: 12,
  },
  {
    titulo: "Horarios de cursos de Sistemas e Industrial superpuestos",
    descripcion:
      "Varios cursos de las carreras de Ingeniería de Sistemas e Ingeniería Industrial de la FIIS tienen horarios superpuestos, impidiendo a los estudiantes matricularse en su malla curricular planificada. Esto retrasa la graduación de al menos 2 ciclos en algunos casos. Cursos como Investigación de Operaciones y Simulación se cruzan sistemáticamente cada semestre.",
    categoria: "academico",
    ubicacion: "FIIS - Coordinación Académica de Sistemas e Industrial",
    severidad: 7,
    votos: 7,
    haceDias: 5,
  },
  {
    titulo: "Aulas de la FIIS sin ventilación adecuada",
    descripcion:
      "Las aulas A-101, A-102 y A-103 del pabellón de Industriales no cuentan con ventilación suficiente para la cantidad de estudiantes de la FIIS. En horas punta la temperatura supera los 30°C, dificultando la concentración en clases de matemáticas y física que requieren mucha atención. Algunos estudiantes han reportado mareos durante evaluaciones.",
    categoria: "infraestructura",
    ubicacion: "FIIS - Pabellón de Industriales, primer piso",
    severidad: 6,
    votos: 3,
    haceDias: 15,
  },
];

async function main() {
  console.log("→ [SEED] Limpiando base de datos (problemas + valoraciones)...");
  await db.valoracion.deleteMany();
  await db.problema.deleteMany();

  console.log("→ [SEED] Verificando equipo del proyecto...");
  const existeEquipo = await db.equipo.count();
  if (existeEquipo === 0) {
    console.log("→ [SEED] Insertando equipo del proyecto...");
    for (const miembro of EQUIPO) {
      await db.equipo.create({ data: miembro });
    }
  }

  console.log(`→ [SEED] Insertando ${PROBLEMAS_EJEMPLO.length} problemas FIIS-UNI...`);
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

  console.log("✔ [SEED] Base de datos reseteada con datos FIIS-UNI.");
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
