import prisma from "../config/prisma.js";

import { crearNotificacion } from "./notificacionesService.js";

// Crear diagnóstico
export const crearDiagnostico = async (data) => {
    const diagnostico = await prisma.diagnostico.create({
        data: {
            id_consulta: Number(data.id_consulta),
            descripcion: data.descripcion,
            tipo: data.tipo || null,
            codigo_cie10: data.codigo_cie10 || null,
            observaciones: data.observaciones || null
        },
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
                    }
                }
            }
        }
    });

    const usuarioPaciente =
        diagnostico.consulta?.expediente?.paciente?.usuario;

    await crearNotificacion({
        id_usuario: usuarioPaciente?.id_usuario,
        titulo: "Nuevo diagnóstico médico",
        mensaje: "Se registró un nuevo diagnóstico en tu expediente clínico.",
        tipo: "DIAGNOSTICO",
        url: `/paciente/consultas/ver/${diagnostico.id_consulta}`
    });

    return diagnostico;
};

// Obtener todos los diagnósticos
export const obtenerDiagnosticos = async () => {
    const diagnosticos = await prisma.diagnostico.findMany({
        include: {
            consulta: {
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    },
                    usuarioMedico: true
                }
            },
            tratamientos: true,
            recetas: true
        },
        orderBy: {
            id_diagnostico: "desc"
        }
    });

    return diagnosticos;
};

// Obtener diagnóstico por ID
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
                    },
                    usuarioMedico: true
                }
            },
            tratamientos: true,
            recetas: true
        }
    });

    return diagnostico;
};

// Actualizar diagnóstico
export const actualizarDiagnostico = async (id, data) => {
    const diagnostico = await prisma.diagnostico.update({
        where: {
            id_diagnostico: Number(id)
        },
        data: {
            id_consulta: Number(data.id_consulta),
            descripcion: data.descripcion,
            tipo: data.tipo || null,
            codigo_cie10: data.codigo_cie10 || null,
            observaciones: data.observaciones || null
        }
    });

    return diagnostico;
};

// Anular diagnóstico
export const anularDiagnostico = async (id) => {
    const diagnostico = await prisma.diagnostico.update({
        where: {
            id_diagnostico: Number(id)
        },
        data: {
            estado: "INACTIVO"
        }
    });

    return diagnostico;
};

// Reactivar diagnóstico
export const reactivarDiagnostico = async (id) => {
    const diagnostico = await prisma.diagnostico.update({
        where: {
            id_diagnostico: Number(id)
        },
        data: {
            estado: "ACTIVO"
        }
    });

    return diagnostico;
};