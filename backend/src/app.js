import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import prisma from "./config/prisma.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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