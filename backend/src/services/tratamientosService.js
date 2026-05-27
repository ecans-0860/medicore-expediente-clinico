import prisma from "../config/prisma.js";

export const crearTratamiento = async (data) => {

    const tratamiento = await prisma.tratamiento.create({
        data
    });

    return tratamiento;
};

export const obtenerTratamientos = async () => {

    const tratamientos = await prisma.tratamiento.findMany({
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
            id_tratamiento: "desc"
        }
    });

    return tratamientos;
};

export const obtenerTratamientoPorId = async (id) => {

    const tratamiento = await prisma.tratamiento.findUnique({
        where: {
            id_tratamiento: Number(id)
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

    return tratamiento;
};

export const actualizarTratamiento = async (id, data) => {

    const tratamiento = await prisma.tratamiento.update({
        where: {
            id_tratamiento: Number(id)
        },
        data
    });

    return tratamiento;
};

export const eliminarTratamiento = async (id) => {

    await prisma.tratamiento.delete({
        where: {
            id_tratamiento: Number(id)
        }
    });

    return true;
};