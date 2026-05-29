import prisma from "../config/prisma.js";

import { crearNotificacion } from "./notificacionesService.js";

const prepararDatosReceta = (data) => {
    return {
        id_diagnostico: Number(data.id_diagnostico),
        codigo_receta: data.codigo_receta || null,
        medicamentos: data.medicamentos,
        indicaciones: data.indicaciones || null,
        instrucciones_generales: data.instrucciones_generales || null,
        fecha_emision: data.fecha_emision
            ? new Date(data.fecha_emision)
            : new Date(),
        fecha_vigencia: data.fecha_vigencia
            ? new Date(data.fecha_vigencia)
            : null,
        proxima_revision: data.proxima_revision
            ? new Date(data.proxima_revision)
            : null,
        observaciones: data.observaciones || null,
        estado: data.estado || "ACTIVA"
    };
};

const includeReceta = {
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

export const crearReceta = async (data) => {
    const diagnosticoExiste = await prisma.diagnostico.findUnique({
        where: {
            id_diagnostico: Number(data.id_diagnostico)
        }
    });

    if (!diagnosticoExiste) {
        throw new Error("El diagnóstico no existe");
    }

    const receta = await prisma.recetaMedica.create({
        data: prepararDatosReceta(data),
        include: includeReceta
    });

    const usuarioPaciente =
        receta.diagnostico?.consulta?.expediente?.paciente?.usuario;

    await crearNotificacion({
        id_usuario: usuarioPaciente?.id_usuario,
        titulo: "Nueva receta médica",
        mensaje: "Se registró una nueva receta médica en tu expediente.",
        tipo: "RECETA",
        url: `/paciente/recetas/ver/${receta.id_receta}`
    });

    return receta;
};

export const obtenerRecetas = async (usuario) => {

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

    const recetas = await prisma.recetaMedica.findMany({
        where,
        include: includeReceta,
        orderBy: {
            id_receta: "desc"
        }
    });

    return recetas;
};

export const obtenerRecetaPorId = async (id, usuario) => {

    let where = {
        id_receta: Number(id)
    };

    if (usuario.rol === "PACIENTE") {
        where = {
            id_receta: Number(id),
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

    const receta = await prisma.recetaMedica.findFirst({
        where,
        include: includeReceta
    });

    return receta;
};

export const actualizarReceta = async (id, data) => {
    const recetaActual = await prisma.recetaMedica.findUnique({
        where: {
            id_receta: Number(id)
        }
    });

    if (!recetaActual) {
        throw new Error("La receta no existe");
    }

    if (recetaActual.estado === "ANULADA") {
        throw new Error("No se puede modificar una receta anulada");
    }

    const receta = await prisma.recetaMedica.update({
        where: {
            id_receta: Number(id)
        },
        data: prepararDatosReceta(data),
        include: includeReceta
    });

    return receta;
};

export const anularReceta = async (id) => {
    const receta = await prisma.recetaMedica.update({
        where: {
            id_receta: Number(id)
        },
        data: {
            estado: "ANULADA"
        },
        include: includeReceta
    });

    return receta;
};

export const reactivarReceta = async (id) => {
    const receta = await prisma.recetaMedica.update({
        where: {
            id_receta: Number(id)
        },
        data: {
            estado: "ACTIVA"
        },
        include: includeReceta
    });

    return receta;
};