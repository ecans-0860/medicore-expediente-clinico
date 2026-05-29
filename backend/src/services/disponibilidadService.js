import prisma from "../config/prisma.js";

export const crearDisponibilidad = async (data) => {
    const disponibilidad = await prisma.disponibilidadMedico.create({
        data: {
            id_usuario_medico: Number(data.id_usuario_medico),
            dia_semana: data.dia_semana,
            hora_inicio: data.hora_inicio,
            hora_fin: data.hora_fin,
            estado: data.estado || "ACTIVO"
        },
        include: {
            medico: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            }
        }
    });

    return disponibilidad;
};

export const obtenerDisponibilidades = async () => {
    return await prisma.disponibilidadMedico.findMany({
        include: {
            medico: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            }
        },
        orderBy: [
            { id_usuario_medico: "asc" },
            { dia_semana: "asc" },
            { hora_inicio: "asc" }
        ]
    });
};

export const reemplazarDisponibilidadMedico = async (data) => {
    const { id_usuario_medico, disponibilidades } = data;

    await prisma.disponibilidadMedico.deleteMany({
        where: {
            id_usuario_medico: Number(id_usuario_medico)
        }
    });

    const nuevasDisponibilidades = await prisma.disponibilidadMedico.createMany({
        data: disponibilidades.map((item) => ({
            id_usuario_medico: Number(id_usuario_medico),
            dia_semana: item.dia_semana,
            hora_inicio: item.hora_inicio,
            hora_fin: item.hora_fin,
            estado: item.estado || "ACTIVO"
        }))
    });

    return nuevasDisponibilidades;
};

export const obtenerDisponibilidadPorId = async (id) => {
    const disponibilidad = await prisma.disponibilidadMedico.findUnique({
        where: {
            id_disponibilidad: Number(id)
        },
        include: {
            medico: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            }
        }
    });

    if (!disponibilidad) {
        throw new Error("Disponibilidad no encontrada");
    }

    return disponibilidad;
};

export const obtenerDisponibilidadPorMedico = async (id_usuario_medico) => {
    return await prisma.disponibilidadMedico.findMany({
        where: {
            id_usuario_medico: Number(id_usuario_medico),
            estado: "ACTIVO"
        },
        include: {
            medico: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            }
        },
        orderBy: [
            { dia_semana: "asc" },
            { hora_inicio: "asc" }
        ]
    });
};

export const actualizarDisponibilidad = async (id, data) => {
    await obtenerDisponibilidadPorId(id);

    const disponibilidad = await prisma.disponibilidadMedico.update({
        where: {
            id_disponibilidad: Number(id)
        },
        data: {
            id_usuario_medico: Number(data.id_usuario_medico),
            dia_semana: data.dia_semana,
            hora_inicio: data.hora_inicio,
            hora_fin: data.hora_fin,
            estado: data.estado || "ACTIVO"
        },
        include: {
            medico: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            }
        }
    });

    return disponibilidad;
};

export const cambiarEstadoDisponibilidad = async (id, estado) => {
    await obtenerDisponibilidadPorId(id);

    return await prisma.disponibilidadMedico.update({
        where: {
            id_disponibilidad: Number(id)
        },
        data: {
            estado
        }
    });
};