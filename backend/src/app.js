import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import prisma from "./config/prisma.js";

import authRoutes from "./routes/authRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import pacientesRoutes from "./routes/pacientesRoutes.js";
import expedientesRoutes from "./routes/expedientesRoutes.js";
import consultasRoutes from "./routes/consultasRoutes.js";
import diagnosticosRoutes from "./routes/diagnosticosRoutes.js";
import tratamientosRoutes from "./routes/tratamientosRoutes.js";
import recetasRoutes from "./routes/recetasRoutes.js";
import citasRoutes from "./routes/citasRoutes.js";
import bitacoraRoutes from "./routes/bitacoraRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import disponibilidadRoutes from "./routes/disponibilidadRoutes.js";
import notificacionesRoutes from "./routes/notificacionesRoutes.js";



dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

/*RUTAS*/

app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/usuarios", usuariosRoutes);

app.use("/api/pacientes", pacientesRoutes);

app.use("/api/expedientes", expedientesRoutes);

app.use("/api/consultas", consultasRoutes);

app.use("/api/diagnosticos", diagnosticosRoutes);

app.use("/api/tratamientos", tratamientosRoutes);

app.use("/api/recetas", recetasRoutes);

app.use("/api/citas", citasRoutes);

app.use("/api/bitacora", bitacoraRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/disponibilidad", disponibilidadRoutes);

app.use("/api/notificaciones", notificacionesRoutes);

/*RUTA PRINCIPAL*/

app.get("/", async (req, res) => {

    try {

        await prisma.$connect();

        res.json({
            message: "MediCore API funcionando correctamente",
            database: "Conectada correctamente a Railway"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al conectar con la base de datos"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});