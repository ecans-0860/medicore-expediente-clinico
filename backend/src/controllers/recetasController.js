import {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    anularReceta,
    reactivarReceta
} from "../services/recetasService.js";

// Crea una nueva receta médica
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

// Lista todas las recetas médicas
export const listar = async (req, res) => {
    try {
        const recetas = await obtenerRecetas(req.usuario);

        res.json(recetas);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Obtiene una receta médica por ID
export const obtenerPorId = async (req, res) => {
    try {
        const receta = await obtenerRecetaPorId(req.params.id, req.usuario);

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

// Actualiza una receta médica
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

// Anula una receta médica sin eliminarla de la base de datos
export const anular = async (req, res) => {
    try {
        const receta = await anularReceta(req.params.id);

        res.json({
            message: "Receta anulada correctamente",
            receta
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Reactiva una receta médica anulada
export const reactivar = async (req, res) => {
    try {
        const receta = await reactivarReceta(req.params.id);

        res.json({
            message: "Receta reactivada correctamente",
            receta
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};