-- AlterTable
ALTER TABLE "ConsultaMedica" ADD COLUMN     "enfermedad_actual" TEXT,
ADD COLUMN     "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
ADD COLUMN     "examen_fisico" TEXT,
ADD COLUMN     "impresion_clinica" TEXT,
ADD COLUMN     "plan_medico" TEXT,
ADD COLUMN     "saturacion_oxigeno" VARCHAR(20),
ADD COLUMN     "tipo_consulta" VARCHAR(50);

-- CreateIndex
CREATE INDEX "ConsultaMedica_estado_idx" ON "ConsultaMedica"("estado");
