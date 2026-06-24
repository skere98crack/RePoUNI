-- CreateTable
CREATE TABLE "Problema" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "ubicacion" TEXT,
    "codigoAlumno" TEXT,
    "severidad" INTEGER NOT NULL DEFAULT 5,
    "estado" TEXT NOT NULL DEFAULT 'abierto',
    "prioridad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "votos" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valoracion" (
    "id" TEXT NOT NULL,
    "problemaId" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT,
    "sugerencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Valoracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Problema_categoria_idx" ON "Problema"("categoria");

-- CreateIndex
CREATE INDEX "Problema_prioridad_idx" ON "Problema"("prioridad");

-- CreateIndex
CREATE INDEX "Problema_estado_idx" ON "Problema"("estado");

-- CreateIndex
CREATE INDEX "Valoracion_problemaId_idx" ON "Valoracion"("problemaId");

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_problemaId_fkey" FOREIGN KEY ("problemaId") REFERENCES "Problema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
