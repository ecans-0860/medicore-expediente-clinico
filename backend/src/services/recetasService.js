import prisma from "../config/prisma.js";

export const crearReceta = async (data) => {

    const receta = await prisma.recetaMedica.create({
        data
    });

    return receta;
};

export const obtenerRecetas = async () => {

    const recetas = await prisma.recetaMedica.findMany({
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
            id_receta: "desc"
        }
    });

    return recetas;
};

export const obtenerRecetaPorId = async (id) => {

    const receta = await prisma.recetaMedica.findUnique({
        where: {
            id_receta: Number(id)
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

    return receta;
};

export const actualizarReceta = async (id, data) => {

    const receta = await prisma.recetaMedica.update({
        where: {
            id_receta: Number(id)
        },
        data
    });

    return receta;
};

export const eliminarReceta = async (id) => {

    await prisma.recetaMedica.delete({
        where: {
            id_receta: Number(id)
        }
    });

    return true;
};