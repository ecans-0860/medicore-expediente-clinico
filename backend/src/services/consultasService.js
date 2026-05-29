import prisma from "../config/prisma.js";

import { crearNotificacion } from "./notificacionesService.js";

const includeConsulta = {
    expediente: {
        include: {
            paciente: {
                include: {
                    usuario: true
                }
            }
        }
    },
    usuarioMedico: true,
    diagnosticos: {
        include: {
            tratamientos: true,
            recetas: true
        }
    }
};

export const crearConsulta = async (data, idUsuarioMedico) => {

    const consulta = await prisma.consultaMedica.create({
        data: {
            ...data,
            id_expediente: Number(data.id_expediente),
            id_usuario_medico: Number(idUsuarioMedico)
        },
        include: includeConsulta
    });

    const usuarioPaciente =
        consulta.expediente?.paciente?.usuario;

    await crearNotificacion({
        id_usuario: usuarioPaciente?.id_usuario,
        titulo: "Nueva consulta médica",
        mensaje: "Se registró una nueva consulta médica en tu expediente clínico.",
        tipo: "CONSULTA",
        url: `/paciente/consultas/ver/${consulta.id_consulta}`
    });

    return consulta;
};

export const obtenerConsultas = async (usuario) => {

    let where = {};

    if (usuario.rol === "MEDICO") {
        where.id_usuario_medico = Number(usuario.id_usuario);
    }

    if (usuario.rol === "PACIENTE") {
        where = {
            expediente: {
                paciente: {
                    usuario: {
                        id_usuario: Number(usuario.id_usuario)
                    }
                }
            }
        };
    }

    const consultas = await prisma.consultaMedica.findMany({
        where,
        include: includeConsulta,
        orderBy: {
            fecha_consulta: "desc"
        }
    });

    return consultas;
};

export const obtenerConsultaPorId = async (id, usuario) => {

    let where = {
        id_consulta: Number(id)
    };

    if (usuario.rol === "MEDICO") {
        where.id_usuario_medico = Number(usuario.id_usuario);
    }

    if (usuario.rol === "PACIENTE") {
        where = {
            id_consulta: Number(id),
            expediente: {
                paciente: {
                    usuario: {
                        id_usuario: Number(usuario.id_usuario)
                    }
                }
            }
        };
    }

    const consulta = await prisma.consultaMedica.findFirst({
        where,
        include: includeConsulta
    });

    return consulta;
};

export const actualizarConsulta = async (id, data) => {

    const consulta = await prisma.consultaMedica.update({
        where: {
            id_consulta: Number(id)
        },
        data: {
            ...data,
            id_expediente: data.id_expediente ? Number(data.id_expediente) : undefined
        },
        include: includeConsulta
    });

    return consulta;
};

export const eliminarConsulta = async (id) => {

    const consulta = await prisma.consultaMedica.update({
        where: {
            id_consulta: Number(id)
        },
        data: {
            estado: "INACTIVA"
        },
        include: includeConsulta
    });

    return consulta;
};