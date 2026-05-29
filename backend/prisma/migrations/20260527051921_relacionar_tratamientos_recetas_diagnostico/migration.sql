/*
  Warnings:

  - You are about to drop the column `id_consulta` on the `RecetaMedica` table. All the data in the column will be lost.
  - You are about to drop the column `id_consulta` on the `Tratamiento` table. All the data in the column will be lost.
  - Added the required column `id_diagnostico` to the `RecetaMedica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_diagnostico` to the `Tratamiento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecetaMedica" DROP CONSTRAINT "RecetaMedica_id_consulta_fkey";

-- DropForeignKey
ALTER TABLE "Tratamiento" DROP CONSTRAINT "Tratamiento_id_consulta_fkey";

-- DropIndex
DROP INDEX "RecetaMedica_id_consulta_idx";

-- DropIndex
DROP INDEX "Tratamiento_id_consulta_idx";

-- AlterTable
ALTER TABLE "RecetaMedica" DROP COLUMN "id_consulta",
ADD COLUMN     "consultaMedicaId_consulta" INTEGER,
ADD COLUMN     "id_diagnostico" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tratamiento" DROP COLUMN "id_consulta",
ADD COLUMN     "consultaMedicaId_consulta" INTEGER,
ADD COLUMN     "id_diagnostico" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "RecetaMedica_id_diagnostico_idx" ON "RecetaMedica"("id_diagnostico");

-- CreateIndex
CREATE INDEX "Tratamiento_id_diagnostico_idx" ON "Tratamiento"("id_diagnostico");

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_id_diagnostico_fkey" FOREIGN KEY ("id_diagnostico") REFERENCES "Diagnostico"("id_diagnostico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_consultaMedicaId_consulta_fkey" FOREIGN KEY ("consultaMedicaId_consulta") REFERENCES "ConsultaMedica"("id_consulta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaMedica" ADD CONSTRAINT "RecetaMedica_id_diagnostico_fkey" FOREIGN KEY ("id_diagnostico") REFERENCES "Diagnostico"("id_diagnostico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaMedica" ADD CONSTRAINT "RecetaMedica_consultaMedicaId_consulta_fkey" FOREIGN KEY ("consultaMedicaId_consulta") REFERENCES "ConsultaMedica"("id_consulta") ON DELETE SET NULL ON UPDATE CASCADE;
