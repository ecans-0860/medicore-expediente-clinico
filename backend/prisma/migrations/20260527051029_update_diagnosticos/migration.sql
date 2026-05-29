-- AlterTable
ALTER TABLE "Diagnostico" ADD COLUMN     "codigo_cie10" VARCHAR(20),
ADD COLUMN     "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO';

-- CreateIndex
CREATE INDEX "Diagnostico_estado_idx" ON "Diagnostico"("estado");
