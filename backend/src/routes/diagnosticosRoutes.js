import express from "express";

import {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    anular,
    reactivar
} from "../controllers/diagnosticosController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, crear);

router.get("/", verifyToken, listar);

router.get("/:id", verifyToken, obtenerPorId);

router.put("/:id", verifyToken, actualizar);

router.put("/:id/anular", verifyToken, anular);

router.put("/:id/reactivar", verifyToken, reactivar);

export default router;