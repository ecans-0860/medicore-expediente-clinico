import {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita
} from "../services/citasService.js";

export const crear = async (req, res) => {
    try {
        const cita = await crearCita(req.body);

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
        const citas = await obtenerCitas();

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

        if (!cita) {
            return res.status(404).json({
                message: "Cita no encontrada"
            });
        }

        res.json(cita);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const cita = await actualizarCita(req.params.id, req.body);

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