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

// Problemas semilla: NINGUNO.
// El usuario solicitó base de datos completamente limpia para la demo.
// Solo se borra todo en cada deploy, sin insertar problemas.
const PROBLEMAS_EJEMPLO: Array<{
  titulo: string;
  descripcion: string;
  categoria: keyof typeof CATEGORIAS;
  ubicacion: string;
  severidad: number;
  votos: number;
  haceDias: number;
}> = [];

async function main() {
  console.log("→ [SEED] Limpiando base de datos (problemas + valoraciones + calificaciones página)...");
  await db.calificacionPagina.deleteMany();
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

  if (PROBLEMAS_EJEMPLO.length > 0) {
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
  } else {
    console.log("→ [SEED] Sin problemas semilla - base de datos vacía para demo limpia.");
  }

  console.log("✔ [SEED] Base de datos limppiada. Lista para demo.");
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
