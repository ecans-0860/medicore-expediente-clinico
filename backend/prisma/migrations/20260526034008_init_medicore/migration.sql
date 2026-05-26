-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "ultimo_acceso" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id_paciente" SERIAL NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "dpi" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "telefono" VARCHAR(20),
    "direccion" VARCHAR(255),
    "sexo" VARCHAR(20),
    "correo" VARCHAR(150),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id_paciente")
);

-- CreateTable
CREATE TABLE "ExpedienteClinico" (
    "id_expediente" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "numero_expediente" VARCHAR(50) NOT NULL,
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpedienteClinico_pkey" PRIMARY KEY ("id_expediente")
);

-- CreateTable
CREATE TABLE "ConsultaMedica" (
    "id_consulta" SERIAL NOT NULL,
    "id_expediente" INTEGER NOT NULL,
    "id_usuario_medico" INTEGER NOT NULL,
    "fecha_consulta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT NOT NULL,
    "observaciones" TEXT,
    "signos_vitales" TEXT,
    "peso" VARCHAR(20),
    "talla" VARCHAR(20),
    "presion_arterial" VARCHAR(20),
    "temperatura" VARCHAR(20),
    "frecuencia_cardiaca" VARCHAR(20),
    "frecuencia_respiratoria" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultaMedica_pkey" PRIMARY KEY ("id_consulta")
);

-- CreateTable
CREATE TABLE "AntecedenteMedico" (
    "id_antecedente" SERIAL NOT NULL,
    "id_expediente" INTEGER NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AntecedenteMedico_pkey" PRIMARY KEY ("id_antecedente")
);

-- CreateTable
CREATE TABLE "Alergia" (
    "id_alergia" SERIAL NOT NULL,
    "id_expediente" INTEGER NOT NULL,
    "sustancia" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "severidad" VARCHAR(50),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alergia_pkey" PRIMARY KEY ("id_alergia")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id_diagnostico" SERIAL NOT NULL,
    "id_consulta" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(100),
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id_diagnostico")
);

-- CreateTable
CREATE TABLE "Tratamiento" (
    "id_tratamiento" SERIAL NOT NULL,
    "id_consulta" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "indicaciones" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tratamiento_pkey" PRIMARY KEY ("id_tratamiento")
);

-- CreateTable
CREATE TABLE "RecetaMedica" (
    "id_receta" SERIAL NOT NULL,
    "id_consulta" INTEGER NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "indicaciones" TEXT,
    "medicamentos" TEXT NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecetaMedica_pkey" PRIMARY KEY ("id_receta")
);

-- CreateTable
CREATE TABLE "CitaMedica" (
    "id_cita" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "id_usuario" INTEGER,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitaMedica_pkey" PRIMARY KEY ("id_cita")
);

-- CreateTable
CREATE TABLE "BitacoraActividad" (
    "id_bitacora" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "accion" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "modulo" VARCHAR(100),
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origen" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BitacoraActividad_pkey" PRIMARY KEY ("id_bitacora")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE INDEX "Usuario_id_rol_idx" ON "Usuario"("id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_dpi_key" ON "Paciente"("dpi");

-- CreateIndex
CREATE INDEX "Paciente_nombres_idx" ON "Paciente"("nombres");

-- CreateIndex
CREATE INDEX "Paciente_apellidos_idx" ON "Paciente"("apellidos");

-- CreateIndex
CREATE INDEX "Paciente_dpi_idx" ON "Paciente"("dpi");

-- CreateIndex
CREATE UNIQUE INDEX "ExpedienteClinico_id_paciente_key" ON "ExpedienteClinico"("id_paciente");

-- CreateIndex
CREATE UNIQUE INDEX "ExpedienteClinico_numero_expediente_key" ON "ExpedienteClinico"("numero_expediente");

-- CreateIndex
CREATE INDEX "ExpedienteClinico_id_paciente_idx" ON "ExpedienteClinico"("id_paciente");

-- CreateIndex
CREATE INDEX "ExpedienteClinico_numero_expediente_idx" ON "ExpedienteClinico"("numero_expediente");

-- CreateIndex
CREATE INDEX "ConsultaMedica_id_expediente_idx" ON "ConsultaMedica"("id_expediente");

-- CreateIndex
CREATE INDEX "ConsultaMedica_id_usuario_medico_idx" ON "ConsultaMedica"("id_usuario_medico");

-- CreateIndex
CREATE INDEX "ConsultaMedica_fecha_consulta_idx" ON "ConsultaMedica"("fecha_consulta");

-- CreateIndex
CREATE INDEX "AntecedenteMedico_id_expediente_idx" ON "AntecedenteMedico"("id_expediente");

-- CreateIndex
CREATE INDEX "Alergia_id_expediente_idx" ON "Alergia"("id_expediente");

-- CreateIndex
CREATE INDEX "Diagnostico_id_consulta_idx" ON "Diagnostico"("id_consulta");

-- CreateIndex
CREATE INDEX "Tratamiento_id_consulta_idx" ON "Tratamiento"("id_consulta");

-- CreateIndex
CREATE INDEX "RecetaMedica_id_consulta_idx" ON "RecetaMedica"("id_consulta");

-- CreateIndex
CREATE INDEX "CitaMedica_id_paciente_idx" ON "CitaMedica"("id_paciente");

-- CreateIndex
CREATE INDEX "CitaMedica_id_usuario_idx" ON "CitaMedica"("id_usuario");

-- CreateIndex
CREATE INDEX "CitaMedica_fecha_hora_idx" ON "CitaMedica"("fecha_hora");

-- CreateIndex
CREATE INDEX "BitacoraActividad_id_usuario_idx" ON "BitacoraActividad"("id_usuario");

-- CreateIndex
CREATE INDEX "BitacoraActividad_fecha_hora_idx" ON "BitacoraActividad"("fecha_hora");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpedienteClinico" ADD CONSTRAINT "ExpedienteClinico_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaMedica" ADD CONSTRAINT "ConsultaMedica_id_expediente_fkey" FOREIGN KEY ("id_expediente") REFERENCES "ExpedienteClinico"("id_expediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaMedica" ADD CONSTRAINT "ConsultaMedica_id_usuario_medico_fkey" FOREIGN KEY ("id_usuario_medico") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntecedenteMedico" ADD CONSTRAINT "AntecedenteMedico_id_expediente_fkey" FOREIGN KEY ("id_expediente") REFERENCES "ExpedienteClinico"("id_expediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alergia" ADD CONSTRAINT "Alergia_id_expediente_fkey" FOREIGN KEY ("id_expediente") REFERENCES "ExpedienteClinico"("id_expediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_id_consulta_fkey" FOREIGN KEY ("id_consulta") REFERENCES "ConsultaMedica"("id_consulta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_id_consulta_fkey" FOREIGN KEY ("id_consulta") REFERENCES "ConsultaMedica"("id_consulta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaMedica" ADD CONSTRAINT "RecetaMedica_id_consulta_fkey" FOREIGN KEY ("id_consulta") REFERENCES "ConsultaMedica"("id_consulta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitaMedica" ADD CONSTRAINT "CitaMedica_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitaMedica" ADD CONSTRAINT "CitaMedica_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BitacoraActividad" ADD CONSTRAINT "BitacoraActividad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
