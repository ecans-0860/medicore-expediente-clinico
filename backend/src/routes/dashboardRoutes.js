import express from "express";
import { obtenerResumenDashboard } from "../controllers/dashboardController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/resumen", verifyToken, obtenerResumenDashboard);

export default router;