-- CreateTable
CREATE TABLE "CalificacionPagina" (
    "id" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT,
    "codigoAlumno" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalificacionPagina_pkey" PRIMARY KEY ("id")
);
