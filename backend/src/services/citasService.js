import prisma from "../config/prisma.js";

export const crearCita = async (data) => {
    const cita = await prisma.citaMedica.create({
        data
    });

    return cita;
};

export const obtenerCitas = async () => {
    const citas = await prisma.citaMedica.findMany({
        include: {
            paciente: true,
            usuario: true
        },
        orderBy: {
            fecha_hora: "asc"
        }
    });

    return citas;
};

export const obtenerCitaPorId = async (id) => {
    const cita = await prisma.citaMedica.findUnique({
        where: {
            id_cita: Number(id)
        },
        include: {
            paciente: true,
            usuario: true
        }
    });

    return cita;
};

export const actualizarCita = async (id, data) => {
    const cita = await prisma.citaMedica.update({
        where: {
            id_cita: Number(id)
        },
        data
    });

    return cita;
};

export const eliminarCita = async (id) => {
    await prisma.citaMedica.delete({
        where: {
            id_cita: Number(id)
        }
    });

    return true;
};