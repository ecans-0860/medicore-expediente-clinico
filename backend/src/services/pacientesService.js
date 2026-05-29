import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const prepararDatosPaciente = (data) => {
    return {
        nombres: data.nombres,
        apellidos: data.apellidos,
        dpi: data.dpi,
        fecha_nacimiento: data.fecha_nacimiento
            ? new Date(data.fecha_nacimiento)
            : null,
        sexo: data.sexo || null,
        telefono: data.telefono || null,
        correo: data.correo || null,
        direccion: data.direccion || null,
        tipo_sangre: data.tipo_sangre || null,
        estado_civil: data.estado_civil || null,
        ocupacion: data.ocupacion || null,
        contacto_emergencia_nombre: data.contacto_emergencia_nombre || null,
        contacto_emergencia_telefono: data.contacto_emergencia_telefono || null,
        contacto_emergencia_parentesco: data.contacto_emergencia_parentesco || null,
        aseguradora: data.aseguradora || null,
        numero_seguro: data.numero_seguro || null,
        observaciones: data.observaciones || null,
        estado: data.estado || "ACTIVO"
    };
};

export const crearPaciente = async (data, usuarioSesion) => {
    const pacienteExiste = await prisma.paciente.findUnique({
        where: {
            dpi: data.dpi
        }
    });

    if (pacienteExiste) {
        throw new Error("Ya existe un paciente registrado con este DPI");
    }

    if (data.crear_usuario_paciente) {
        if (usuarioSesion.rol !== "MEDICO" && usuarioSesion.rol !== "ADMIN") {
            throw new Error("No tienes permisos para crear usuario de paciente");
        }

        if (!data.usuario_correo || !data.usuario_password || !data.confirmar_password) {
            throw new Error("Debe completar correo, contraseña y confirmación");
        }

        if (data.usuario_password !== data.confirmar_password) {
            throw new Error("Las contraseñas no coinciden");
        }
    }

    const resultado = await prisma.$transaction(async (tx) => {
        const paciente = await tx.paciente.create({
            data: prepararDatosPaciente(data)
        });

        let usuarioPaciente = null;

        if (data.crear_usuario_paciente) {
            const rolPaciente = await tx.rol.findUnique({
                where: {
                    nombre: "PACIENTE"
                }
            });

            if (!rolPaciente) {
                throw new Error("No existe el rol PACIENTE");
            }

            const usuarioYaAsociado = await tx.usuario.findUnique({
                where: {
                    id_paciente: paciente.id_paciente
                }
            });

            if (usuarioYaAsociado) {
                throw new Error("Este paciente ya tiene un usuario asociado");
            }

            let correoFinal = data.usuario_correo;

            const correoExiste = await tx.usuario.findUnique({
                where: {
                    correo: correoFinal
                }
            });

            if (correoExiste) {

                const anioNacimiento = new Date(
                    data.fecha_nacimiento
                ).getFullYear();

                const partes = correoFinal.split("@");

                correoFinal =
                    `${partes[0]}${anioNacimiento}@${partes[1]}`;
            }

            const password_hash = await bcrypt.hash(data.usuario_password, 10);

            usuarioPaciente = await tx.usuario.create({
                data: {
                    nombre_completo: `${paciente.nombres} ${paciente.apellidos}`,
                    correo: correoFinal,
                    password_hash,
                    id_rol: rolPaciente.id_rol,
                    id_paciente: paciente.id_paciente,
                    estado: "ACTIVO"
                },
                include: {
                    rol: true,
                    paciente: true
                }
            });
        }

        return {
            paciente,
            usuarioPaciente
        };
    });

    return resultado;
};

export const obtenerPacientes = async () => {
    const pacientes = await prisma.paciente.findMany({
        orderBy: {
            fecha_registro: "desc"
        }
    });

    return pacientes;
};

export const obtenerPacientePorId = async (id) => {
    const paciente = await prisma.paciente.findUnique({
        where: {
            id_paciente: Number(id)
        },
        include: {
            expediente: true,
            citas: true,
            usuario: true
        }
    });

    return paciente;
};

export const actualizarPaciente = async (id, data) => {
    const pacienteActual = await prisma.paciente.findUnique({
        where: {
            id_paciente: Number(id)
        }
    });

    if (!pacienteActual) {
        throw new Error("Paciente no encontrado");
    }

    if (data.dpi && data.dpi !== pacienteActual.dpi) {
        const dpiExiste = await prisma.paciente.findUnique({
            where: {
                dpi: data.dpi
            }
        });

        if (dpiExiste) {
            throw new Error("Ya existe otro paciente registrado con este DPI");
        }
    }

    const paciente = await prisma.paciente.update({
        where: {
            id_paciente: Number(id)
        },
        data: prepararDatosPaciente(data)
    });

    return paciente;
};

export const eliminarPaciente = async (id) => {
    const paciente = await prisma.paciente.findUnique({
        where: {
            id_paciente: Number(id)
        }
    });

    if (!paciente) {
        throw new Error("Paciente no encontrado");
    }

    await prisma.paciente.update({
        where: {
            id_paciente: Number(id)
        },
        data: {
            estado: "INACTIVO"
        }
    });

    return true;
};