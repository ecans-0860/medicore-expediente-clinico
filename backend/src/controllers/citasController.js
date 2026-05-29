import {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    obtenerCitasPorPaciente,
    obtenerCitasPorMedico,
    actualizarCita,
    confirmarCita,
    cancelarCita,
    marcarCitaAtendida,
    eliminarCita
} from "../services/citasService.js";

export const crear = async (req, res) => {
    try {
        console.log("USUARIO EN CITA:", req.usuario);

        const cita = await crearCita(req.body, req.usuario);

        res.status(201).json({
            message: "Cita médica creada correctamente",
            cita
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const listar = async (req, res) => {
    try {

        const citas = await obtenerCitas(req.usuario);

        res.json(citas);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const cita = await obtenerCitaPorId(req.params.id);

        res.json(cita);

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};

export const obtenerPorPaciente = async (req, res) => {
    try {

        const citas = await obtenerCitasPorPaciente(
            req.params.id_paciente
        );

        res.json(citas);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorMedico = async (req, res) => {
    try {

        const citas = await obtenerCitasPorMedico(
            req.params.id_medico
        );

        res.json(citas);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const actualizar = async (req, res) => {
    try {

        const cita = await actualizarCita(
            req.params.id,
            req.body
        );

        res.json({
            message: "Cita médica actualizada correctamente",
            cita
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const confirmar = async (req, res) => {
    try {

        const cita = await confirmarCita(req.params.id);

        res.json({
            message: "Cita confirmada correctamente",
            cita
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const cancelar = async (req, res) => {
    try {

        const cita = await cancelarCita(
            req.params.id,
            req.body.motivo_cancelacion
        );

        res.json({
            message: "Cita cancelada correctamente",
            cita
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const atender = async (req, res) => {
    try {

        const cita = await marcarCitaAtendida(req.params.id);

        res.json({
            message: "Cita marcada como atendida",
            cita
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const eliminar = async (req, res) => {
    try {

        await eliminarCita(req.params.id);

        res.json({
            message: "Cita médica eliminada correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};