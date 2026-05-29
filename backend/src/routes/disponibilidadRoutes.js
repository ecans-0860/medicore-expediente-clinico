import express from "express";
import {
    crear,
    listar,
    obtenerPorId,
    obtenerPorMedico,
    actualizar,
    desactivar,
    activar,
    reemplazarPorMedico
} from "../controllers/disponibilidadController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, crear);
router.get("/", verifyToken, listar);
router.get("/medico/:id_medico", verifyToken, obtenerPorMedico);

router.put("/medico/:id_medico/reemplazar", verifyToken, reemplazarPorMedico);

router.get("/:id", verifyToken, obtenerPorId);
router.put("/:id", verifyToken, actualizar);
router.put("/:id/desactivar", verifyToken, desactivar);
router.put("/:id/activar", verifyToken, activar);

export default router;