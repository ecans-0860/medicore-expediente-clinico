import {
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    actualizarPaciente,
    eliminarPaciente
} from "../services/pacientesService.js";

import { registrarBitacora } from "../services/bitacoraService.js";

export const crear = async (req, res) => {
    try {

        const paciente = await crearPaciente(req.body);

        await registrarBitacora({
            id_usuario: req.usuario.id_usuario,
            accion: "CREAR_PACIENTE",
            descripcion: `Se creó el paciente ${paciente.nombres} ${paciente.apellidos}`,
            modulo: "Pacientes",
            ip_origen: req.ip
        });

        res.status(201).json({
            message: "Paciente creado correctamente",
            paciente
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const listar = async (req, res) => {
    try {

        const pacientes = await obtenerPacientes();

        res.json(pacientes);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const paciente = await obtenerPacientePorId(req.params.id);

        if (!paciente) {
            return res.status(404).json({
                message: "Paciente no encontrado"
            });
        }

        res.json(paciente);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const actualizar = async (req, res) => {
    try {

        const paciente = await actualizarPaciente(
            req.params.id,
            req.body
        );

        await registrarBitacora({
            id_usuario: req.usuario.id_usuario,
            accion: "ACTUALIZAR_PACIENTE",
            descripcion: `Se actualizó el paciente ${paciente.nombres} ${paciente.apellidos}`,
            modulo: "Pacientes",
            ip_origen: req.ip
        });

        res.json({
            message: "Paciente actualizado correctamente",
            paciente
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const eliminar = async (req, res) => {
    try {

        const paciente = await obtenerPacientePorId(req.params.id);

        await eliminarPaciente(req.params.id);

        await registrarBitacora({
            id_usuario: req.usuario.id_usuario,
            accion: "ELIMINAR_PACIENTE",
            descripcion: paciente
                ? `Se eliminó el paciente ${paciente.nombres} ${paciente.apellidos}`
                : `Se eliminó el paciente con ID ${req.params.id}`,
            modulo: "Pacientes",
            ip_origen: req.ip
        });

        res.json({
            message: "Paciente eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};