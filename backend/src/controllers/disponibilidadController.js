import {
    crearDisponibilidad,
    obtenerDisponibilidades,
    obtenerDisponibilidadPorId,
    obtenerDisponibilidadPorMedico,
    actualizarDisponibilidad,
    cambiarEstadoDisponibilidad,
    reemplazarDisponibilidadMedico
} from "../services/disponibilidadService.js";

export const crear = async (req, res) => {
    try {
        const disponibilidad = await crearDisponibilidad(req.body);

        res.status(201).json({
            message: "Disponibilidad registrada correctamente",
            disponibilidad
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar disponibilidad",
            error: error.message
        });
    }
};

export const reemplazarPorMedico = async (req, res) => {
    try {
        const disponibilidad = await reemplazarDisponibilidadMedico({
            id_usuario_medico: req.params.id_medico,
            disponibilidades: req.body.disponibilidades
        });

        res.json({
            message: "Disponibilidad médica actualizada correctamente",
            disponibilidad
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al reemplazar disponibilidad médica",
            error: error.message
        });
    }
};

export const listar = async (req, res) => {
    try {
        const disponibilidades = await obtenerDisponibilidades();
        res.json(disponibilidades);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener disponibilidades",
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const disponibilidad = await obtenerDisponibilidadPorId(req.params.id);
        res.json(disponibilidad);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

export const obtenerPorMedico = async (req, res) => {
    try {
        const disponibilidades = await obtenerDisponibilidadPorMedico(
            req.params.id_medico
        );

        res.json(disponibilidades);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener disponibilidad del médico",
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const disponibilidad = await actualizarDisponibilidad(
            req.params.id,
            req.body
        );

        res.json({
            message: "Disponibilidad actualizada correctamente",
            disponibilidad
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar disponibilidad",
            error: error.message
        });
    }
};

export const desactivar = async (req, res) => {
    try {
        const disponibilidad = await cambiarEstadoDisponibilidad(
            req.params.id,
            "INACTIVO"
        );

        res.json({
            message: "Disponibilidad desactivada correctamente",
            disponibilidad
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al desactivar disponibilidad",
            error: error.message
        });
    }
};

export const activar = async (req, res) => {
    try {
        const disponibilidad = await cambiarEstadoDisponibilidad(
            req.params.id,
            "ACTIVO"
        );

        res.json({
            message: "Disponibilidad activada correctamente",
            disponibilidad
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al activar disponibilidad",
            error: error.message
        });
    }
};