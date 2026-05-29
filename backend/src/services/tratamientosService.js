import prisma from "../config/prisma.js";

import { crearNotificacion } from "./notificacionesService.js";

const prepararDatosTratamiento = (data) => {
    return {
        id_diagnostico: Number(data.id_diagnostico),
        nombre: data.nombre || null,
        descripcion: data.descripcion,
        indicaciones: data.indicaciones || null,
        tipo: data.tipo || null,
        dosis: data.dosis || null,
        frecuencia: data.frecuencia || null,
        duracion: data.duracion || null,
        via: data.via || null,
        fecha_inicio: data.fecha_inicio
            ? new Date(data.fecha_inicio)
            : null,
        fecha_fin: data.fecha_fin
            ? new Date(data.fecha_fin)
            : null,
        observaciones: data.observaciones || null,
        estado: data.estado || "ACTIVO"
    };
};

const includeTratamiento = {
    diagnostico: {
        include: {
            consulta: {
                include: {
                    expediente: {
                        include: {
                            paciente: {
                                include: {
                                    usuario: true
                                }
                            }
                        }
                    },
                    usuarioMedico: true
                }
            }
        }
    }
};

// Crea un nuevo tratamiento relacionado a un diagnóstico
export const crearTratamiento = async (data) => {
    const tratamiento = await prisma.tratamiento.create({
        data: prepararDatosTratamiento(data),
        include: includeTratamiento
    });

    const usuarioPaciente =
        tratamiento.diagnostico?.consulta?.expediente?.paciente?.usuario;

    await crearNotificacion({
        id_usuario: usuarioPaciente?.id_usuario,
        titulo: "Nuevo tratamiento médico",
        mensaje: "Se registró un nuevo tratamiento en tu expediente clínico.",
        tipo: "TRATAMIENTO",
        url: `/paciente/tratamientos/ver/${tratamiento.id_tratamiento}`
    });

    return tratamiento;
};

// Obtiene todos los tratamientos con su información clínica relacionada
export const obtenerTratamientos = async (usuario) => {

    let where = {};

    if (usuario.rol === "PACIENTE") {
        where = {
            diagnostico: {
                consulta: {
                    expediente: {
                        paciente: {
                            usuario: {
                                id_usuario: Number(usuario.id_usuario)
                            }
                        }
                    }
                }
            }
        };
    }

    const tratamientos = await prisma.tratamiento.findMany({
        where,
        include: includeTratamiento,
        orderBy: {
            id_tratamiento: "desc"
        }
    });

    return tratamientos;
};

// Obtiene un tratamiento por ID con detalle clínico completo
export const obtenerTratamientoPorId = async (id, usuario) => {

    let where = {
        id_tratamiento: Number(id)
    };

    if (usuario.rol === "PACIENTE") {
        where = {
            id_tratamiento: Number(id),
            diagnostico: {
                consulta: {
                    expediente: {
                        paciente: {
                            usuario: {
                                id_usuario: Number(usuario.id_usuario)
                            }
                        }
                    }
                }
            }
        };
    }

    const tratamiento = await prisma.tratamiento.findFirst({
        where,
        include: includeTratamiento
    });

    return tratamiento;
};

// Actualiza la información de un tratamiento
export const actualizarTratamiento = async (id, data) => {
    const tratamiento = await prisma.tratamiento.update({
        where: {
            id_tratamiento: Number(id)
        },
        data: prepararDatosTratamiento(data)
    });

    return tratamiento;
};

// Anula un tratamiento sin eliminarlo físicamente
export const anularTratamiento = async (id) => {
    const tratamiento = await prisma.tratamiento.update({
        where: {
            id_tratamiento: Number(id)
        },
        data: {
            estado: "INACTIVO"
        }
    });

    return tratamiento;
};

// Reactiva un tratamiento anulado
export const reactivarTratamiento = async (id) => {
    const tratamiento = await prisma.tratamiento.update({
        where: {
            id_tratamiento: Number(id)
        },
        data: {
            estado: "ACTIVO"
        }
    });

    return tratamiento;
};