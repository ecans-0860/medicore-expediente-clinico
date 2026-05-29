import {
    crearExpediente,
    obtenerExpedientes,
    obtenerExpedientePorId,
    obtenerExpedientesPorUsuarioPaciente,
    actualizarExpediente,
    eliminarExpediente
} from "../services/expedientesService.js";

import { registrarBitacora } from "../services/bitacoraService.js";

const prepararBodyConArchivos = (body, files = []) => {
    const data = { ...body };

    data.antecedentes = JSON.parse(body.antecedentes || "[]");
    data.alergias = JSON.parse(body.alergias || "[]");
    data.medicamentos_actuales = JSON.parse(body.medicamentos_actuales || "[]");
    data.habitos = JSON.parse(body.habitos || "[]");
    data.vacunas = JSON.parse(body.vacunas || "[]");
    data.documentos_clinicos = JSON.parse(body.documentos_clinicos || "[]");

    data.documentos_clinicos = data.documentos_clinicos.map((doc, index) => ({
        ...doc,
        archivo_url: files[index]
            ? `/uploads/documentos_clinicos/${files[index].filename}`
            : doc.archivo_url || null
    }));

    return data;
};

export const crear = async (req, res) => {
    try {

        const data = prepararBodyConArchivos(req.body, req.files);

        const expediente = await crearExpediente(data);

        await registrarBitacora({
            id_usuario: req.usuario.id_usuario,
            accion: "CREAR_EXPEDIENTE",
            descripcion: `Se creó el expediente clínico ${expediente.numero_expediente}`,
            modulo: "Expedientes",
            ip_origen: req.ip
        });

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

        if (req.usuario.rol === "PACIENTE") {
            const expedientesPaciente = await obtenerExpedientesPorUsuarioPaciente(
                req.usuario.id_usuario
            );

            return res.json(expedientesPaciente);
        }

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

        if (
            req.usuario.rol === "PACIENTE" &&
            expediente.paciente?.usuario?.id_usuario !== req.usuario.id_usuario
        ) {
            return res.status(403).json({
                message: "No tienes permiso para ver este expediente"
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

        const data = prepararBodyConArchivos(req.body, req.files);

        const expediente = await actualizarExpediente(
            req.params.id,
            data
        );
        await registrarBitacora({
            id_usuario: req.usuario.id_usuario,
            accion: "ACTUALIZAR_EXPEDIENTE",
            descripcion: `Se actualizó el expediente clínico ${expediente.numero_expediente}`,
            modulo: "Expedientes",
            ip_origen: req.ip
        });

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

        const expediente = await eliminarExpediente(req.params.id);

        await registrarBitacora({
            id_usuario: req.usuario.id_usuario,
            accion: "ELIMINAR_EXPEDIENTE",
            descripcion: `Se desactivó el expediente clínico ${expediente.numero_expediente}`,
            modulo: "Expedientes",
            ip_origen: req.ip
        });

        res.json({
            message: "Expediente desactivado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};