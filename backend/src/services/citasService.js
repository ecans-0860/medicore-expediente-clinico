import prisma from "../config/prisma.js";

import {
    crearNotificacion,
    crearNotificacionesMultiples
} from "./notificacionesService.js";

const prepararDatosCita = (data) => {
    return {
        id_paciente: Number(data.id_paciente),
        id_usuario: data.id_usuario ? Number(data.id_usuario) : null,
        id_consulta: data.id_consulta ? Number(data.id_consulta) : null,
        fecha_hora: new Date(data.fecha_hora),
        motivo: data.motivo,
        tipo_cita: data.tipo_cita || null,
        modalidad: data.modalidad || null,
        prioridad: data.prioridad || null,
        sintomas: data.sintomas || null,
        estado: data.estado || "PENDIENTE",
        fecha_confirmacion: data.fecha_confirmacion ? new Date(data.fecha_confirmacion) : null,
        fecha_cancelacion: data.fecha_cancelacion ? new Date(data.fecha_cancelacion) : null,
        motivo_cancelacion: data.motivo_cancelacion || null,
        observaciones: data.observaciones || null
    };
};

const obtenerDiaSemana = (fecha) => {
    const dias = [
        "DOMINGO",
        "LUNES",
        "MARTES",
        "MIERCOLES",
        "JUEVES",
        "VIERNES",
        "SABADO"
    ];

    return dias[fecha.getDay()];
};

const obtenerHora = (fecha) => {
    return fecha.toTimeString().slice(0, 5);
};

const validarDisponibilidadMedico = async (id_usuario, fecha_hora) => {
    if (!id_usuario) return;

    const fecha = new Date(fecha_hora);
    const diaSemana = obtenerDiaSemana(fecha);
    const hora = obtenerHora(fecha);

    const disponibilidad = await prisma.disponibilidadMedico.findFirst({
        where: {
            id_usuario_medico: Number(id_usuario),
            dia_semana: diaSemana,
            estado: "ACTIVO",
            hora_inicio: {
                lte: hora
            },
            hora_fin: {
                gt: hora
            }
        }
    });

    if (!disponibilidad) {
        throw new Error("El médico no tiene disponibilidad en ese día y horario");
    }
};

const validarChoqueCita = async (id_usuario, id_paciente, fecha_hora, id_cita = null) => {
    const fechaCita = new Date(fecha_hora);

    const condicionesBase = {
        fecha_hora: fechaCita,
        estado: {
            in: ["PENDIENTE", "CONFIRMADA"]
        },
        ...(id_cita && {
            id_cita: {
                not: Number(id_cita)
            }
        })
    };

    const citaMedico = await prisma.citaMedica.findFirst({
        where: {
            ...condicionesBase,
            id_usuario: Number(id_usuario)
        }
    });

    if (citaMedico) {
        throw new Error("El médico ya tiene una cita registrada en ese horario");
    }

    const citaPaciente = await prisma.citaMedica.findFirst({
        where: {
            ...condicionesBase,
            id_paciente: Number(id_paciente)
        }
    });

    if (citaPaciente) {
        throw new Error("El paciente ya tiene una cita registrada en ese horario");
    }
};

export const crearCita = async (data, usuarioLogueado = null) => {
    const datos = prepararDatosCita({
        ...data,
        id_paciente:
            usuarioLogueado?.rol === "PACIENTE"
                ? usuarioLogueado.id_paciente
                : data.id_paciente,
        estado:
            usuarioLogueado?.rol === "PACIENTE"
                ? "PENDIENTE"
                : data.estado
    });

    await validarDisponibilidadMedico(datos.id_usuario, datos.fecha_hora);
    await validarChoqueCita(
        datos.id_usuario,
        datos.id_paciente,
        datos.fecha_hora
    );

    const cita = await prisma.citaMedica.create({
        data: datos,
        include: {
            paciente: true,
            usuario: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            },
            consulta: true
        }
    });

    const usuarioPaciente = await prisma.usuario.findFirst({
        where: {
            id_paciente: cita.id_paciente
        }
    });

    const administradores = await obtenerUsuariosAdmin();

    await crearNotificacionesMultiples([
        {
            id_usuario: usuarioPaciente?.id_usuario,
            titulo: "Cita médica registrada",
            mensaje: "Tu cita médica fue registrada correctamente.",
            tipo: "CITA",
            url: `/paciente/citas/ver/${cita.id_cita}`
        },
        {
            id_usuario: cita.id_usuario,
            titulo: "Nueva cita médica",
            mensaje: "Se registró una nueva cita médica en tu agenda.",
            tipo: "CITA",
            url: `/citas/ver/${cita.id_cita}`
        },
        ...administradores.map((admin) => ({
            id_usuario: admin.id_usuario,
            titulo: "Nueva cita registrada",
            mensaje: "Se registró una nueva cita médica en el sistema.",
            tipo: "CITA_ADMIN",
            url: `/citas/ver/${cita.id_cita}`
        }))
    ]);

    return cita;
};

const obtenerUsuariosAdmin = async () => {
    return await prisma.usuario.findMany({
        where: {
            rol: {
                nombre: "ADMIN"
            },
            estado: "ACTIVO"
        },
        select: {
            id_usuario: true
        }
    });
};

export const obtenerCitas = async (usuarioLogueado) => {
    const where = {};

    if (usuarioLogueado?.rol === "MEDICO") {
        where.id_usuario = Number(usuarioLogueado.id_usuario);
    }

    if (usuarioLogueado?.rol === "PACIENTE") {
        where.id_paciente = Number(usuarioLogueado.id_paciente);
    }

    return await prisma.citaMedica.findMany({
        where,
        include: {
            paciente: true,
            usuario: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            },
            consulta: true
        },
        orderBy: {
            fecha_hora: "asc"
        }
    });
};

export const obtenerCitaPorId = async (id) => {
    const cita = await prisma.citaMedica.findUnique({
        where: {
            id_cita: Number(id)
        },
        include: {
            paciente: true,
            usuario: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            },
            consulta: {
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    },
                    diagnosticos: {
                        include: {
                            tratamientos: true,
                            recetas: true
                        }
                    }
                }
            }
        }
    });

    if (!cita) {
        throw new Error("Cita no encontrada");
    }

    return cita;
};

export const obtenerCitasPorPaciente = async (id_paciente) => {
    return await prisma.citaMedica.findMany({
        where: {
            id_paciente: Number(id_paciente)
        },
        include: {
            usuario: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            },
            consulta: true
        },
        orderBy: {
            fecha_hora: "desc"
        }
    });
};

export const obtenerCitasPorMedico = async (id_usuario) => {
    return await prisma.citaMedica.findMany({
        where: {
            id_usuario: Number(id_usuario)
        },
        include: {
            paciente: true,
            consulta: true
        },
        orderBy: {
            fecha_hora: "asc"
        }
    });
};

export const actualizarCita = async (id, data) => {
    await obtenerCitaPorId(id);

    const datos = prepararDatosCita(data);

    await validarDisponibilidadMedico(datos.id_usuario, datos.fecha_hora);
    await validarChoqueCita(
        datos.id_usuario,
        datos.id_paciente,
        datos.fecha_hora,
        id
    );

    const cita = await prisma.citaMedica.update({
        where: {
            id_cita: Number(id)
        },
        data: datos,
        include: {
            paciente: true,
            usuario: {
                select: {
                    id_usuario: true,
                    nombre_completo: true,
                    correo: true
                }
            },
            consulta: true
        }
    });

    return cita;
};

export const confirmarCita = async (id) => {
    const citaActual = await obtenerCitaPorId(id);

    const cita = await prisma.citaMedica.update({
        where: {
            id_cita: Number(id)
        },
        data: {
            estado: "CONFIRMADA",
            fecha_confirmacion: new Date()
        }
    });

    const usuarioPaciente = await prisma.usuario.findFirst({
        where: {
            id_paciente: citaActual.id_paciente
        }
    });

    await crearNotificacion({
        id_usuario: usuarioPaciente?.id_usuario,
        titulo: "Cita confirmada",
        mensaje: "Tu cita médica fue confirmada.",
        tipo: "CITA_CONFIRMADA",
        url: `/paciente/citas/ver/${cita.id_cita}`
    });

    return cita;
};

export const cancelarCita = async (id, motivo_cancelacion) => {
    const citaActual = await obtenerCitaPorId(id);

    const cita = await prisma.citaMedica.update({
        where: {
            id_cita: Number(id)
        },
        data: {
            estado: "CANCELADA",
            fecha_cancelacion: new Date(),
            motivo_cancelacion: motivo_cancelacion || "Sin motivo especificado"
        }
    });

    const usuarioPaciente = await prisma.usuario.findFirst({
        where: {
            id_paciente: citaActual.id_paciente
        }
    });

    const administradores = await obtenerUsuariosAdmin();

    await crearNotificacionesMultiples([
        {
            id_usuario: usuarioPaciente?.id_usuario,
            titulo: "Cita cancelada",
            mensaje: "Tu cita médica fue cancelada.",
            tipo: "CITA_CANCELADA",
            url: `/paciente/citas/ver/${cita.id_cita}`
        },
        {
            id_usuario: citaActual.id_usuario,
            titulo: "Cita cancelada",
            mensaje: "Una cita médica asignada fue cancelada.",
            tipo: "CITA_CANCELADA",
            url: `/citas/ver/${cita.id_cita}`
        },
        ...administradores.map((admin) => ({
            id_usuario: admin.id_usuario,
            titulo: "Cita cancelada",
            mensaje: "Se canceló una cita médica en el sistema.",
            tipo: "CITA_ADMIN",
            url: `/citas/ver/${cita.id_cita}`
        }))
    ]);

    return cita;
};

export const marcarCitaAtendida = async (id) => {
    const citaActual = await obtenerCitaPorId(id);

    const cita = await prisma.citaMedica.update({
        where: {
            id_cita: Number(id)
        },
        data: {
            estado: "ATENDIDA"
        }
    });

    const usuarioPaciente = await prisma.usuario.findFirst({
        where: {
            id_paciente: citaActual.id_paciente
        }
    });

    await crearNotificacion({
        id_usuario: usuarioPaciente?.id_usuario,
        titulo: "Cita atendida",
        mensaje: "Tu cita médica fue marcada como atendida.",
        tipo: "CITA_ATENDIDA",
        url: `/paciente/citas/ver/${cita.id_cita}`
    });

    return cita;
};
export const eliminarCita = async (id) => {
    await obtenerCitaPorId(id);

    await prisma.citaMedica.delete({
        where: {
            id_cita: Number(id)
        }
    });

    return true;
};