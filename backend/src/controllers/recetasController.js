import {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta
} from "../services/recetasService.js";

export const crear = async (req, res) => {
    try {

        const receta = await crearReceta(req.body);

        res.status(201).json({
            message: "Receta médica creada correctamente",
            receta
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const listar = async (req, res) => {
    try {

        const recetas = await obtenerRecetas();

        res.json(recetas);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const receta = await obtenerRecetaPorId(req.params.id);

        if (!receta) {
            return res.status(404).json({
                message: "Receta no encontrada"
            });
        }

        res.json(receta);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const actualizar = async (req, res) => {
    try {

        const receta = await actualizarReceta(
            req.params.id,
            req.body
        );

        res.json({
            message: "Receta actualizada correctamente",
            receta
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const eliminar = async (req, res) => {
    try {

        await eliminarReceta(req.params.id);

        res.json({
            message: "Receta eliminada correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};