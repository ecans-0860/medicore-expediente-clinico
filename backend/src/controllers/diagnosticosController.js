import {
    crearDiagnostico,
    obtenerDiagnosticos,
    obtenerDiagnosticoPorId,
    actualizarDiagnostico,
    eliminarDiagnostico
} from "../services/diagnosticosService.js";

export const crear = async (req, res) => {
    try {

        const diagnostico = await crearDiagnostico(req.body);

        res.status(201).json({
            message: "Diagnóstico creado correctamente",
            diagnostico
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const listar = async (req, res) => {
    try {

        const diagnosticos = await obtenerDiagnosticos();

        res.json(diagnosticos);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const diagnostico = await obtenerDiagnosticoPorId(req.params.id);

        if (!diagnostico) {
            return res.status(404).json({
                message: "Diagnóstico no encontrado"
            });
        }

        res.json(diagnostico);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const actualizar = async (req, res) => {
    try {

        const diagnostico = await actualizarDiagnostico(
            req.params.id,
            req.body
        );

        res.json({
            message: "Diagnóstico actualizado correctamente",
            diagnostico
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const eliminar = async (req, res) => {
    try {

        await eliminarDiagnostico(req.params.id);

        res.json({
            message: "Diagnóstico eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};