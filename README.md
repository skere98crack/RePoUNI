# RePoUNI · Sistema de Registro de Problemas Universitarios

Plataforma web para que los estudiantes de la universidad reporten, clasifiquen y prioricen problemas de infraestructura, seguridad, ámbito social, estudiantil y académico. El sistema aplica un algoritmo de priorización para identificar automáticamente los problemas más latentes por resolver.

> Proyecto académico — Entrega de avance: Semana 13 · Entrega final: Semana 15

---

## Tabla de contenidos

- [Contexto](#contexto)
- [Características principales](#características-principales)
- [Algoritmo de prioridad](#algoritmo-de-prioridad)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Equipo del proyecto](#equipo-del-proyecto)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Endpoints de la API](#endpoints-de-la-api)
- [Semilla de datos](#semilla-de-datos)
- [Cronograma y entregables](#cronograma-y-entregables)

---

## Contexto

Es común que los estudiantes nuevos (cachimbos) enfrenten dificultades al iniciar la vida universitaria: trámites desconocidos, infraestructura deficiente, falta de integración social, problemas académicos no resueltos. La universidad necesita un canal donde la comunidad estudiantil pueda reportar estos problemas de manera estructurada y donde la administración pueda identificar cuáles requieren atención prioritaria.

RePoUNI resuelve este problema mediante una plataforma centralizada que combina el reporte ciudadano estudiantil con un algoritmo de priorización que pondera severidad, frecuencia y recencia.

---

## Características principales

- **Registro estructurado de problemas** con clasificación por categoría (Infraestructura, Social, Estudiantil, Académico, Seguridad, Otros).
- **Algoritmo de priorización automática** que calcula un puntaje de 0 a 10 para cada problema.
- **Ranking en tiempo real** ordenado por prioridad, con filtros por categoría y criterios de ordenamiento alternativos (más recientes, más votados).
- **Votación colaborativa**: si un estudiante reporta un problema que ya existe, su reporte se suma como voto en lugar de duplicar el problema.
- **Sistema de valoración** de 1 a 10 con comentarios y sugerencias para medir el criterio de éxito del proyecto.
- **Trazabilidad de estado**: cada problema pasa por `abierto → en_progreso → resuelto`.
- **Diseño responsive** con soporte para móviles, tablets y escritorio.

---

## Algoritmo de prioridad

Cada problema recibe un puntaje de **0 a 10** calculado con la siguiente fórmula:

```
P = (Severidad × Peso / 10) × 0.40  +  Votos × 0.35  +  Recencia × 0.25
```

Donde:

- **Severidad (1-10)**: reportada por el estudiante al registrar el problema.
- **Peso por categoría**: refleja el impacto institucional.

| Categoría        | Peso | Justificación                                   |
| ---------------- | ---- | ----------------------------------------------- |
| Seguridad        | 10   | Riesgo físico directo para estudiantes          |
| Infraestructura  | 8    | Afecta la operación académica diaria            |
| Estudiantil      | 7    | Trámites y bienestar estudiantil                |
| Académico        | 7    | Afecta el progreso curricular                   |
| Social           | 6    | Integración y convivencia                       |
| Otros            | 4    | Problemas no clasificados                       |

- **Votos**: cantidad de estudiantes que reportan el mismo problema (saturación a los 10 votos).
- **Recencia**: factor que decae con el tiempo (`10 - días/3`), de modo que problemas sin actividad reciente pierden prioridad.

Implementación: [`src/lib/priority.ts`](src/lib/priority.ts)

---

## Stack tecnológico

| Capa            | Tecnología                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                               |
| Lenguaje        | TypeScript 5                                          |
| Estilos         | Tailwind CSS 4 + shadcn/ui (New York)                 |
| Base de datos   | SQLite + Prisma ORM 6                                 |
| Iconos          | lucide-react                                          |
| Validación      | Zod                                                   |
| Estado cliente  | React hooks nativos (sin librerías externas)          |

---

## Estructura del proyecto

```
.
├── prisma/
│   └── schema.prisma              # Modelos: Problema, Valoracion, Equipo
├── scripts/
│   └── seed.ts                    # Semilla con 7 problemas + 5 miembros del equipo
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Layout raíz, metadata SEO en español
│   │   ├── page.tsx               # Página principal (todas las secciones)
│   │   ├── globals.css            # Tailwind + variables de tema
│   │   └── api/
│   │       ├── route.ts           # Health check
│   │       ├── problems/
│   │       │   ├── route.ts       # GET/POST problemas
│   │       │   └── ranking/route.ts
│   │       ├── feedback/route.ts  # POST valoraciones
│   │       ├── team/route.ts      # GET equipo
│   │       ├── stats/route.ts     # GET estadísticas para dashboard
│   │       └── categorias/route.ts
│   ├── components/
│   │   ├── sections/
│   │   │   ├── header.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── registro-form.tsx  # Formulario de reporte
│   │   │   ├── ranking.tsx        # Ranking priorizado
│   │   │   ├── servicios.tsx      # Categorías + fórmula
│   │   │   ├── equipo.tsx         # Equipo del proyecto
│   │   │   ├── feedback.tsx       # Formulario de valoración
│   │   │   └── footer.tsx
│   │   ├── shared/
│   │   │   └── categorias.ts      # Constantes y helpers compartidos
│   │   └── ui/                    # shadcn/ui (componentes base)
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── lib/
│       ├── db.ts                  # Cliente Prisma singleton
│       └── priority.ts            # Algoritmo de priorización
├── .env.example
├── .gitignore
├── components.json                # Configuración shadcn/ui
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Equipo del proyecto

| Integrante                              | Rol            |
| --------------------------------------- | -------------- |
| Perez Diaz Michael Xavier               | Diseño         |
| Rodriguez Juan José                     | Base de datos  |
| Salazar Chamorro Josué Caleb            | Frontend       |
| Torres Caballa Carlos Javier            | Clasificación  |
| De la Cruz Crispín Jhon Gabriel         | Backend        |

---

## Instalación y ejecución local

### Requisitos

- Node.js 18+ (recomendado 20+)
- npm, pnpm o bun
- SQLite (incluido por defecto en Prisma)

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/skere98crack/RePoUNI.git
   cd RePoUNI
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   pnpm install
   # o
   bun install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Esto crea una base de datos SQLite local en `prisma/dev.db`.

4. **Crear la base de datos y aplicar el esquema**

   ```bash
   npm run db:push
   ```

5. **(Opcional) Cargar datos de ejemplo**

   ```bash
   npm run seed
   ```

   Esto inserta 7 problemas de ejemplo y los 5 miembros del equipo.

6. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Compilar para producción

```bash
npm run build
npm run start
```

---

## Endpoints de la API

| Método | Ruta                      | Descripción                                                |
| ------ | ------------------------- | ---------------------------------------------------------- |
| GET    | `/api`                    | Health check                                               |
| GET    | `/api/problems`           | Lista problemas (filtros: `categoria`, `estado`, `orden`)  |
| POST   | `/api/problems`           | Crea un problema o suma voto si ya existe                  |
| GET    | `/api/problems/ranking`   | Top 10 problemas por prioridad                             |
| POST   | `/api/feedback`           | Registra una valoración (1-10) + comentario + sugerencia   |
| GET    | `/api/team`               | Lista el equipo del proyecto                               |
| GET    | `/api/stats`              | Estadísticas agregadas para el dashboard                   |
| GET    | `/api/categorias`         | Lista las categorías disponibles con sus pesos             |

### Ejemplo de creación de problema

```bash
curl -X POST http://localhost:3000/api/problems \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Laboratorio sin internet",
    "descripcion": "El laboratorio L-204 no tiene conexión desde hace 3 semanas.",
    "categoria": "infraestructura",
    "ubicacion": "Facultad de Ingeniería - Lab L-204",
    "severidad": 9
  }'
```

---

## Semilla de datos

El script `scripts/seed.ts` carga datos realistas para demostración:

- **5 miembros del equipo** con sus roles asignados.
- **7 problemas de ejemplo** distribuidos en todas las categorías, con distintos niveles de severidad, votos y antigüedad (para que el algoritmo produzca un ranking variado).

Para ejecutarlo:

```bash
npm run seed
```

---

## Cronograma y entregables

| Hito                  | Semana | Entregable                                                |
| --------------------- | ------ | --------------------------------------------------------- |
| Avance                | 13     | Documento del avance                                      |
| Entrega final         | 15     | Documento final + 2 videos (ejecución + explicación)      |

---

## Licencia

Proyecto académico. Uso educativo bajo contexto de la universidad.
