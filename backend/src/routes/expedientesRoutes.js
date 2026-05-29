import express from "express";

import {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar
} from "../controllers/expedientesController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

import uploadDocumentos from "../middlewares/uploadDocumentos.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    uploadDocumentos.array("documentos_clinicos"),
    crear
);

router.get("/", verifyToken, listar);

router.get("/:id", verifyToken, obtenerPorId);

router.put(
    "/:id",
    verifyToken,
    uploadDocumentos.array("documentos_clinicos"),
    actualizar
);

router.delete("/:id", verifyToken, eliminar);

export default router;