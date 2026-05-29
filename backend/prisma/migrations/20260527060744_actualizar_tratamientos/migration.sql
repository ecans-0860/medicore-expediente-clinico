/*
  Warnings:

  - You are about to drop the column `consultaMedicaId_consulta` on the `RecetaMedica` table. All the data in the column will be lost.
  - You are about to drop the column `consultaMedicaId_consulta` on the `Tratamiento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecetaMedica" DROP CONSTRAINT "RecetaMedica_consultaMedicaId_consulta_fkey";

-- DropForeignKey
ALTER TABLE "Tratamiento" DROP CONSTRAINT "Tratamiento_consultaMedicaId_consulta_fkey";

-- AlterTable
ALTER TABLE "RecetaMedica" DROP COLUMN "consultaMedicaId_consulta";

-- AlterTable
ALTER TABLE "Tratamiento" DROP COLUMN "consultaMedicaId_consulta",
ADD COLUMN     "dosis" VARCHAR(100),
ADD COLUMN     "duracion" VARCHAR(100),
ADD COLUMN     "frecuencia" VARCHAR(100),
ADD COLUMN     "nombre" VARCHAR(150),
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "tipo" VARCHAR(100),
ADD COLUMN     "via" VARCHAR(50);

-- CreateIndex
CREATE INDEX "Tratamiento_estado_idx" ON "Tratamiento"("estado");

-- CreateIndex
CREATE INDEX "Tratamiento_fecha_inicio_idx" ON "Tratamiento"("fecha_inicio");
