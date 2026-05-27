import prisma from "../config/prisma.js";

export const crearConsulta = async (data) => {

    const consulta = await prisma.consultaMedica.create({
        data
    });

    return consulta;
};

export const obtenerConsultas = async () => {

    const consultas = await prisma.consultaMedica.findMany({
        include: {
            expediente: {
                include: {
                    paciente: true
                }
            },
            usuarioMedico: true,
            diagnosticos: true,
            tratamientos: true,
            recetas: true
        },
        orderBy: {
            id_consulta: "desc"
        }
    });

    return consultas;
};

export const obtenerConsultaPorId = async (id) => {

    const consulta = await prisma.consultaMedica.findUnique({
        where: {
            id_consulta: Number(id)
        },
        include: {
            expediente: {
                include: {
                    paciente: true
                }
            },
            usuarioMedico: true,
            diagnosticos: true,
            tratamientos: true,
            recetas: true
        }
    });

    return consulta;
};

export const actualizarConsulta = async (id, data) => {

    const consulta = await prisma.consultaMedica.update({
        where: {
            id_consulta: Number(id)
        },
        data
    });

    return consulta;
};

export const eliminarConsulta = async (id) => {

    await prisma.consultaMedica.delete({
        where: {
            id_consulta: Number(id)
        }
    });

    return true;
};