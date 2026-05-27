import prisma from "../config/prisma.js";

export const listarBitacora = async (req, res) => {
    try {
        const bitacora = await prisma.bitacoraActividad.findMany({
            include: {
                usuario: true
            },
            orderBy: {
                fecha_hora: "desc"
            }
        });

        res.json(bitacora);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};