import prisma from "../config/prisma.js";

export const registrarBitacora = async ({
    id_usuario,
    accion,
    descripcion,
    modulo,
    ip_origen
}) => {
    try {
        await prisma.bitacoraActividad.create({
            data: {
                id_usuario,
                accion,
                descripcion,
                modulo,
                ip_origen
            }
        });
    } catch (error) {
        console.error("Error al registrar bitácora:", error.message);
    }
};