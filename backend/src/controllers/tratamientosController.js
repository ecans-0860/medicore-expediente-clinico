import {
    crearTratamiento,
    obtenerTratamientos,
    obtenerTratamientoPorId,
    actualizarTratamiento,
    anularTratamiento,
    reactivarTratamiento
} from "../services/tratamientosService.js";

export const crear = async (req, res) => {
    try {
        const tratamiento = await crearTratamiento(req.body);

        res.status(201).json({
            message: "Tratamiento creado correctamente",
            tratamiento
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const listar = async (req, res) => {
    try {
        const tratamientos = await obtenerTratamientos(req.usuario);

        res.json(tratamientos);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const tratamiento = await obtenerTratamientoPorId(req.params.id, req.usuario);

        if (!tratamiento) {
            return res.status(404).json({
                message: "Tratamiento no encontrado"
            });
        }

        res.json(tratamiento);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const tratamiento = await actualizarTratamiento(req.params.id, req.body);

        res.json({
            message: "Tratamiento actualizado correctamente",
            tratamiento
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const anular = async (req, res) => {
    try {
        const tratamiento = await anularTratamiento(req.params.id);

        res.json({
            message: "Tratamiento anulado correctamente",
            tratamiento
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const reactivar = async (req, res) => {
    try {
        const tratamiento = await reactivarTratamiento(req.params.id);

        res.json({
            message: "Tratamiento reactivado correctamente",
            tratamiento
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};