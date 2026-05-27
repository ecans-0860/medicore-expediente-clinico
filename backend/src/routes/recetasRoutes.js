import express from "express";

import {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar
} from "../controllers/recetasController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, crear);

router.get("/", verifyToken, listar);

router.get("/:id", verifyToken, obtenerPorId);

router.put("/:id", verifyToken, actualizar);

router.delete("/:id", verifyToken, eliminar);

export default router;