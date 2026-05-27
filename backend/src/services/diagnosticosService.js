import prisma from "../config/prisma.js";

export const crearDiagnostico = async (data) => {

    const diagnostico = await prisma.diagnostico.create({
        data
    });

    return diagnostico;
};

export const obtenerDiagnosticos = async () => {

    const diagnosticos = await prisma.diagnostico.findMany({
        include: {
            consulta: {
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    }
                }
            }
        },
        orderBy: {
            id_diagnostico: "desc"
        }
    });

    return diagnosticos;
};

export const obtenerDiagnosticoPorId = async (id) => {

    const diagnostico = await prisma.diagnostico.findUnique({
        where: {
            id_diagnostico: Number(id)
        },
        include: {
            consulta: {
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    }
                }
            }
        }
    });

    return diagnostico;
};

export const actualizarDiagnostico = async (id, data) => {

    const diagnostico = await prisma.diagnostico.update({
        where: {
            id_diagnostico: Number(id)
        },
        data
    });

    return diagnostico;
};

export const eliminarDiagnostico = async (id) => {

    await prisma.diagnostico.delete({
        where: {
            id_diagnostico: Number(id)
        }
    });

    return true;
};