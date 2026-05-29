import express from "express";

import {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    anular,
    reactivar
} from "../controllers/tratamientosController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, crear);

router.get("/", verifyToken, listar);

router.get("/:id", verifyToken, obtenerPorId);

router.put("/:id", verifyToken, actualizar);

router.patch("/:id/anular", verifyToken, anular);

router.patch("/:id/reactivar", verifyToken, reactivar);

export default router;