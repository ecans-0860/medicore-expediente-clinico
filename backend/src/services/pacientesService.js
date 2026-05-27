import prisma from "../config/prisma.js";

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

export const crearPaciente = async (data) => {
    const pacienteExiste = await prisma.paciente.findUnique({
        where: {
            dpi: data.dpi
        }
    });

    if (pacienteExiste) {
        throw new Error("Ya existe un paciente registrado con este DPI");
    }

    const paciente = await prisma.paciente.create({
        data: prepararDatosPaciente(data)
    });

    return paciente;
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