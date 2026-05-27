import {
    crearExpediente,
    obtenerExpedientes,
    obtenerExpedientePorId,
    actualizarExpediente,
    eliminarExpediente
} from "../services/expedientesService.js";

export const crear = async (req, res) => {
    try {

        const expediente = await crearExpediente(req.body);

        res.status(201).json({
            message: "Expediente clínico creado correctamente",
            expediente
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const listar = async (req, res) => {
    try {

        const expedientes = await obtenerExpedientes();

        res.json(expedientes);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const expediente = await obtenerExpedientePorId(req.params.id);

        if (!expediente) {
            return res.status(404).json({
                message: "Expediente no encontrado"
            });
        }

        res.json(expediente);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const actualizar = async (req, res) => {
    try {

        const expediente = await actualizarExpediente(
            req.params.id,
            req.body
        );

        res.json({
            message: "Expediente actualizado correctamente",
            expediente
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const eliminar = async (req, res) => {
    try {

        await eliminarExpediente(req.params.id);

        res.json({
            message: "Expediente desactivado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};