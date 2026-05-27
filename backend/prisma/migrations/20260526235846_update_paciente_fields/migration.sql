-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "aseguradora" VARCHAR(100),
ADD COLUMN     "contacto_emergencia_nombre" VARCHAR(150),
ADD COLUMN     "contacto_emergencia_parentesco" VARCHAR(50),
ADD COLUMN     "contacto_emergencia_telefono" VARCHAR(20),
ADD COLUMN     "estado_civil" VARCHAR(30),
ADD COLUMN     "numero_seguro" VARCHAR(100),
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "ocupacion" VARCHAR(100),
ADD COLUMN     "tipo_sangre" VARCHAR(10);

-- CreateIndex
CREATE INDEX "Paciente_estado_idx" ON "Paciente"("estado");

-- CreateIndex
CREATE INDEX "Paciente_fecha_registro_idx" ON "Paciente"("fecha_registro");
