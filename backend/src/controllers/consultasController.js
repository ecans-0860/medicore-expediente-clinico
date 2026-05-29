import {
    crearConsulta,
    obtenerConsultas,
    obtenerConsultaPorId,
    actualizarConsulta,
    eliminarConsulta
} from "../services/consultasService.js";

export const crear = async (req, res) => {
    try {

        const idMedico =
            req.usuario.rol === "ADMIN"
                ? req.body.id_usuario_medico
                : req.usuario.id_usuario;

        const consulta = await crearConsulta(
            req.body,
            idMedico
        );

        res.status(201).json({
            message: "Consulta médica creada correctamente",
            consulta
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const listar = async (req, res) => {
    try {

        const consultas = await obtenerConsultas(req.usuario);

        res.json(consultas);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const consulta = await obtenerConsultaPorId(req.params.id, req.usuario);

        if (!consulta) {
            return res.status(404).json({
                message: "Consulta no encontrada"
            });
        }

        res.json(consulta);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const actualizar = async (req, res) => {
    try {

        const consulta = await actualizarConsulta(
            req.params.id,
            req.body
        );

        res.json({
            message: "Consulta actualizada correctamente",
            consulta
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const eliminar = async (req, res) => {
    try {

        await eliminarConsulta(req.params.id);

        res.json({
            message: "Consulta anulada correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};