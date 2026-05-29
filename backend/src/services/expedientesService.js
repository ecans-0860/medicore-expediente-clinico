import prisma from "../config/prisma.js";

const prepararAntecedentes = (id_expediente, antecedentes = []) => {
    return antecedentes
        .filter((item) => item.tipo && item.descripcion)
        .map((item) => ({
            id_expediente,
            tipo: item.tipo,
            descripcion: item.descripcion,
            observaciones: item.observaciones || null,
            estado: item.estado || "ACTIVO"
        }));
};

const prepararAlergias = (id_expediente, alergias = []) => {
    return alergias
        .filter((item) => item.sustancia)
        .map((item) => ({
            id_expediente,
            sustancia: item.sustancia,
            reaccion: item.reaccion || null,
            severidad: item.severidad || null,
            observaciones: item.observaciones || null,
            estado: item.estado || "ACTIVO"
        }));
};

const prepararMedicamentos = (id_expediente, medicamentos = []) => {
    return medicamentos
        .filter((item) => item.nombre)
        .map((item) => ({
            id_expediente,
            nombre: item.nombre,
            dosis: item.dosis || null,
            frecuencia: item.frecuencia || null,
            via: item.via || null,
            observaciones: item.observaciones || null,
            estado: item.estado || "ACTIVO"
        }));
};

const prepararHabitos = (id_expediente, habitos = []) => {
    return habitos
        .filter((item) => item.tipo)
        .map((item) => ({
            id_expediente,
            tipo: item.tipo,
            descripcion: item.descripcion || null,
            frecuencia: item.frecuencia || null,
            estado: item.estado || "ACTIVO"
        }));
};

const prepararVacunas = (id_expediente, vacunas = []) => {
    return vacunas
        .filter((item) => item.nombre)
        .map((item) => ({
            id_expediente,
            nombre: item.nombre,
            dosis: item.dosis || null,
            fecha_aplicacion: item.fecha_aplicacion
                ? new Date(item.fecha_aplicacion)
                : null,
            observaciones: item.observaciones || null,
            estado: item.estado || "ACTIVO"
        }));
};

const prepararDocumentos = (id_expediente, documentos = []) => {
    return documentos
        .filter((item) => item.nombre)
        .map((item) => ({
            id_expediente,
            nombre: item.nombre,
            tipo: item.tipo || null,
            archivo_url: item.archivo_url || null,
            descripcion: item.descripcion || null,
            estado: item.estado || "ACTIVO"
        }));
};

const includeExpedienteCompleto = {
    paciente: {
        include: {
            usuario: true
        }
    },
    consultas: true,
    antecedentes: true,
    alergias: true,
    medicamentos_actuales: true,
    habitos: true,
    vacunas: true,
    documentos_clinicos: true
};

const guardarDatosClinicos = async (tx, id_expediente, data) => {
    const antecedentes = prepararAntecedentes(id_expediente, data.antecedentes);
    const alergias = prepararAlergias(id_expediente, data.alergias);
    const medicamentos = prepararMedicamentos(id_expediente, data.medicamentos_actuales);
    const habitos = prepararHabitos(id_expediente, data.habitos);
    const vacunas = prepararVacunas(id_expediente, data.vacunas);
    const documentos = prepararDocumentos(id_expediente, data.documentos_clinicos);

    if (antecedentes.length > 0) {
        await tx.antecedenteMedico.createMany({ data: antecedentes });
    }

    if (alergias.length > 0) {
        await tx.alergia.createMany({ data: alergias });
    }

    if (medicamentos.length > 0) {
        await tx.medicamentoActual.createMany({ data: medicamentos });
    }

    if (habitos.length > 0) {
        await tx.habitoPaciente.createMany({ data: habitos });
    }

    if (vacunas.length > 0) {
        await tx.vacunaPaciente.createMany({ data: vacunas });
    }

    if (documentos.length > 0) {
        await tx.documentoClinico.createMany({ data: documentos });
    }
};

const eliminarDatosClinicos = async (tx, id_expediente) => {
    await tx.antecedenteMedico.deleteMany({ where: { id_expediente } });
    await tx.alergia.deleteMany({ where: { id_expediente } });
    await tx.medicamentoActual.deleteMany({ where: { id_expediente } });
    await tx.habitoPaciente.deleteMany({ where: { id_expediente } });
    await tx.vacunaPaciente.deleteMany({ where: { id_expediente } });
    //await tx.documentoClinico.deleteMany({ where: { id_expediente } });
};

export const crearExpediente = async (data) => {
    const idPaciente = Number(data.id_paciente);

    const expedienteExistente = await prisma.expedienteClinico.findUnique({
        where: {
            id_paciente: idPaciente
        }
    });

    if (expedienteExistente) {
        throw new Error("El paciente ya tiene un expediente clínico");
    }

    const numeroExpediente =
        data.numero_expediente || `EXP-${idPaciente}-${Date.now()}`;

    const expediente = await prisma.$transaction(async (tx) => {
        const nuevoExpediente = await tx.expedienteClinico.create({
            data: {
                id_paciente: idPaciente,
                numero_expediente: numeroExpediente,
                motivo_apertura: data.motivo_apertura,
                estado: data.estado || "ACTIVO",
                observaciones: data.observaciones || null
            }
        });

        await guardarDatosClinicos(tx, nuevoExpediente.id_expediente, data);

        return await tx.expedienteClinico.findUnique({
            where: {
                id_expediente: nuevoExpediente.id_expediente
            },
            include: includeExpedienteCompleto
        });

    }, {
        timeout: 15000
    });

    return expediente;
};

export const obtenerExpedientes = async () => {
    const expedientes = await prisma.expedienteClinico.findMany({
        include: {
            paciente: true
        },
        orderBy: {
            id_expediente: "desc"
        }
    });

    return expedientes;
};

export const obtenerExpedientesPorUsuarioPaciente = async (id_usuario) => {

    const expedientes = await prisma.expedienteClinico.findMany({
        where: {
            paciente: {
                usuario: {
                    id_usuario: Number(id_usuario)
                }
            }
        },
        include: {
            paciente: true
        },
        orderBy: {
            id_expediente: "desc"
        }
    });

    return expedientes;
};

export const obtenerExpedientePorId = async (id) => {
    const expediente = await prisma.expedienteClinico.findUnique({
        where: {
            id_expediente: Number(id)
        },
        include: includeExpedienteCompleto
    });

    return expediente;
};

export const actualizarExpediente = async (id, data) => {
    const idExpediente = Number(id);

    const expedienteActual = await prisma.expedienteClinico.findUnique({
        where: {
            id_expediente: idExpediente
        }
    });

    if (!expedienteActual) {
        throw new Error("Expediente no encontrado");
    }

    const expediente = await prisma.$transaction(async (tx) => {
        await tx.expedienteClinico.update({
            where: {
                id_expediente: idExpediente
            },
            data: {
                motivo_apertura: data.motivo_apertura,
                estado: data.estado || "ACTIVO",
                observaciones: data.observaciones || null
            }
        });

        await eliminarDatosClinicos(tx, idExpediente);

        await guardarDatosClinicos(tx, idExpediente, data);

        return await tx.expedienteClinico.findUnique({
            where: {
                id_expediente: idExpediente
            },
            include: includeExpedienteCompleto
        });
    });

    return expediente;
};

export const eliminarExpediente = async (id) => {
    const expediente = await prisma.expedienteClinico.update({
        where: {
            id_expediente: Number(id)
        },
        data: {
            estado: "INACTIVO"
        }
    });

    return expediente;
};