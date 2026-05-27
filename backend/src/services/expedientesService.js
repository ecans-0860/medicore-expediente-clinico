import prisma from "../config/prisma.js";

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

    const expediente = await prisma.expedienteClinico.create({
        data: {
            id_paciente: idPaciente,
            numero_expediente: numeroExpediente,
            motivo_apertura: data.motivo_apertura,
            estado: data.estado || "ACTIVO",
            observaciones: data.observaciones
        },
        include: {
            paciente: true,
            antecedentes: true,
            alergias: true
        }
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

export const obtenerExpedientePorId = async (id) => {
    const expediente = await prisma.expedienteClinico.findUnique({
        where: {
            id_expediente: Number(id)
        },
        include: {
            paciente: true,
            consultas: true,
            antecedentes: true,
            alergias: true
        }
    });

    return expediente;
};

export const actualizarExpediente = async (id, data) => {
    const expediente = await prisma.expedienteClinico.update({
        where: {
            id_expediente: Number(id)
        },
        data: {
            motivo_apertura: data.motivo_apertura,
            estado: data.estado,
            observaciones: data.observaciones
        },
        include: {
            paciente: true,
            antecedentes: true,
            alergias: true
        }
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