/*
  Warnings:

  - A unique constraint covering the columns `[id_paciente]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "id_paciente" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_paciente_key" ON "Usuario"("id_paciente");

-- CreateIndex
CREATE INDEX "Usuario_id_paciente_idx" ON "Usuario"("id_paciente");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE SET NULL ON UPDATE CASCADE;
