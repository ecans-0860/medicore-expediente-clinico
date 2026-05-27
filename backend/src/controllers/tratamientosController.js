import {
    crearTratamiento,
    obtenerTratamientos,
    obtenerTratamientoPorId,
    actualizarTratamiento,
    eliminarTratamiento
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

        const tratamientos = await obtenerTratamientos();

        res.json(tratamientos);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const tratamiento = await obtenerTratamientoPorId(req.params.id);

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

        const tratamiento = await actualizarTratamiento(
            req.params.id,
            req.body
        );

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

export const eliminar = async (req, res) => {
    try {

        await eliminarTratamiento(req.params.id);

        res.json({
            message: "Tratamiento eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};