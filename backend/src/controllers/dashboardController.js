import prisma from "../config/prisma.js";

export const obtenerResumenDashboard = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.count();
    const expedientes = await prisma.expedienteClinico.count();

    const citas = await prisma.citaMedica.count({
      where: {
        estado: {
          in: ["PENDIENTE", "CONFIRMADA"]
        }
      }
    });

    const usuarios = await prisma.usuario.count();

    res.json({
      pacientes,
      expedientes,
      citas,
      usuarios,
      notificaciones: 0
    });

  } catch (error) {
    console.log("ERROR DASHBOARD:", error);

    res.status(500).json({
      message: "Error al obtener resumen del dashboard",
      error: error.message
    });
  }
};