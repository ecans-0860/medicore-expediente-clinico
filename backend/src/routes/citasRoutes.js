import express from "express";

import {
    crear,
    listar,
    obtenerPorId,
    obtenerPorPaciente,
    obtenerPorMedico,
    actualizar,
    confirmar,
    cancelar,
    atender,
    eliminar
} from "../controllers/citasController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, crear);

router.get("/", verifyToken, listar);

router.get("/paciente/:id_paciente", verifyToken, obtenerPorPaciente);

router.get("/medico/:id_medico", verifyToken, obtenerPorMedico);

router.get("/:id", verifyToken, obtenerPorId);

router.put("/:id", verifyToken, actualizar);

router.put("/:id/confirmar", verifyToken, confirmar);

router.put("/:id/cancelar", verifyToken, cancelar);

router.put("/:id/atender", verifyToken, atender);

router.delete("/:id", verifyToken, eliminar);

export default router;