import { useAuth } from "../../context/AuthContext";
import {
  FaHome,
  FaFolderOpen,
  FaPrescriptionBottleAlt,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaStethoscope,
  FaPills
} from "react-icons/fa";


import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/medicore-Copy.png";
import NotificacionesDropdown from "../../components/notificaciones/NotificacionesDropdown";

const DashboardPaciente = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [resumenPaciente, setResumenPaciente] = useState({
    citasPendientes: 0,
    proximasCitas: 0,
    recetasActivas: 0
  });

  useEffect(() => {
    obtenerResumenPaciente();
  }, []);

  const obtenerResumenPaciente = async () => {
    try {

      const citasRes = await axiosClient.get("/citas");

      const recetasRes = await axiosClient.get("/recetas");

      const ahora = new Date();

      const citasPendientes = citasRes.data.filter(
        (cita) => cita.estado === "PENDIENTE"
      ).length;

      const proximasCitas = citasRes.data.filter(
        (cita) =>
          ["PENDIENTE", "CONFIRMADA"].includes(cita.estado) &&
          new Date(cita.fecha_hora) >= ahora
      ).length;

      const recetasActivas = recetasRes.data.filter(
        (receta) => receta.estado === "ACTIVA"
      ).length;

      setResumenPaciente({
        citasPendientes,
        proximasCitas,
        recetasActivas
      });

    } catch (error) {

      console.error(
        "Error al obtener resumen del paciente:",
        error
      );

    }
  };

  const modulos = [
    { nombre: "Inicio", icono: <FaHome />, ruta: "/dashboard-paciente" },
    { nombre: "Mis citas", icono: <FaCalendarAlt />, ruta: "/paciente/citas" },
    { nombre: "Programar cita", icono: <FaPlus />, ruta: "/paciente/citas/crear" },
    { nombre: "Mi expediente", icono: <FaFolderOpen />, ruta: "/paciente/expediente" },
    { nombre: "Mis consultas", icono: <FaStethoscope />, ruta: "/paciente/consultas" },
    { nombre: "Mis recetas", icono: <FaPrescriptionBottleAlt />, ruta: "/paciente/recetas" },
    { nombre: "Mis tratamientos", icono: <FaPills />, ruta: "/paciente/tratamientos" }
  ];
  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f5f7fb",
      fontFamily: "'Segoe UI', sans-serif"
    },
    sidebar: {
      width: "250px",
      background: "linear-gradient(180deg, #062b5f 0%, #031b3d 100%)",
      color: "#fff",
      padding: "25px 18px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    logo: {
      textAlign: "center",
      marginBottom: "35px"
    },
    logoImage: {
      width: "95px",
      marginBottom: "14px",
      backgroundColor: "#ffffff",
      padding: "10px",
      borderRadius: "14px",
      boxShadow: "0 8px 18px rgba(0,0,0,0.18)"
    },
    logoTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      margin: 0
    },
    logoSubtitle: {
      fontSize: "12px",
      opacity: 0.8,
      marginTop: "8px"
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "13px 14px",
      borderRadius: "8px",
      marginBottom: "8px",
      cursor: "pointer",
      fontSize: "15px",
      color: "#eef4ff"
    },
    activeItem: {
      backgroundColor: "#f4bd4f",
      color: "#08234d",
      fontWeight: "bold"
    },
    logout: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "13px",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      cursor: "pointer",
      fontSize: "14px"
    },
    main: {
      flex: 1,
      padding: "25px 35px"
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e1e7f0",
      paddingBottom: "18px",
      marginBottom: "25px"
    },
    title: {
      fontSize: "30px",
      color: "#102b5c",
      margin: 0
    },
    userBox: {
      display: "flex",
      alignItems: "center",
      gap: "18px",
      color: "#102b5c",
      fontWeight: "bold"
    },
    welcomeCard: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "25px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      marginBottom: "25px",
      border: "1px solid #e8edf5"
    },
    welcomeTitle: {
      color: "#102b5c",
      fontSize: "24px",
      marginBottom: "8px"
    },
    welcomeText: {
      color: "#6b7890",
      margin: 0
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "18px",
      marginBottom: "25px"
    },
    statCard: {
      backgroundColor: "#ffffff",
      padding: "22px",
      borderRadius: "14px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      border: "1px solid #e8edf5"
    },
    statIcon: {
      fontSize: "28px",
      color: "#2f80ed",
      marginBottom: "12px"
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#102b5c",
      margin: 0
    },
    statLabel: {
      color: "#6b7890",
      marginTop: "5px"
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px"
    },
    panel: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      border: "1px solid #e8edf5"
    },
    panelTitle: {
      color: "#102b5c",
      marginTop: 0,
      marginBottom: "18px"
    },
    activityItem: {
      padding: "13px 0",
      borderBottom: "1px solid #edf1f7",
      color: "#33415c",
      fontSize: "14px"
    },
    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px"
    },
    quickButton: {
      backgroundColor: "#f8fafd",
      border: "1px solid #e1e7f0",
      borderRadius: "12px",
      padding: "18px",
      textAlign: "center",
      color: "#102b5c",
      fontWeight: "bold",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>
            <img src={logo} alt="MediCore" style={styles.logoImage} />

            <h2 style={styles.logoTitle}>MediCore</h2>

            <p style={styles.logoSubtitle}>
              Sistema de Expediente Clínico Electrónico
            </p>
          </div>

          {modulos.map((modulo, index) => (
            <div
              key={index}
              onClick={() => navigate(modulo.ruta)}
              style={{
                ...styles.menuItem,
                ...(modulo.ruta === "/dashboard-paciente" ? styles.activeItem : {})
              }}
            >
              {modulo.icono}
              <span>{modulo.nombre}</span>
            </div>
          ))}
        </div>

        <div style={styles.logout} onClick={logout}>
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </div>
      </aside>

      <main style={styles.main}>
        <nav style={styles.navbar}>
          <h1 style={styles.title}>Portal del Paciente</h1>

          <div style={styles.userBox}>
            <NotificacionesDropdown />

            <FaUserCircle size={35} />
            <span>{usuario?.rol}</span>
          </div>
        </nav>

        <section style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>
            Bienvenido, {usuario?.nombre_completo}
          </h2>

          <p style={styles.welcomeText}>
            Desde este portal puedes consultar tu información médica, revisar tus citas
            y programar nuevas atenciones con el personal médico.
          </p>
        </section>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FaClock />
            </div>
            <h3 style={styles.statNumber}>
              {resumenPaciente.citasPendientes}
            </h3>
            <p style={styles.statLabel}>Citas pendientes</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FaCalendarAlt />
            </div>
            <h3 style={styles.statNumber}>
              {resumenPaciente.proximasCitas}
            </h3>
            <p style={styles.statLabel}>Próximas citas</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FaPrescriptionBottleAlt />
            </div>
            <h3 style={styles.statNumber}>
              {resumenPaciente.recetasActivas}
            </h3>
            <p style={styles.statLabel}>Recetas activas</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FaCheckCircle />
            </div>
            <h3 style={styles.statNumber}>Activo</h3>
            <p style={styles.statLabel}>Estado del expediente</p>
          </div>
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Información del portal</h3>

            <div style={styles.activityItem}>
              Puedes programar una nueva cita médica desde el botón de acciones rápidas.
            </div>

            <div style={styles.activityItem}>
              Tus citas aparecerán con estado pendiente hasta que sean confirmadas por el médico.
            </div>

            <div style={styles.activityItem}>
              Las recetas y el historial clínico estarán disponibles según la información registrada por el personal médico.
            </div>

            <div style={styles.activityItem}>
              Este portal muestra únicamente tu información personal y médica autorizada.
            </div>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Acciones rápidas</h3>

            <div style={styles.quickGrid}>
              <div
                style={styles.quickButton}
                onClick={() => navigate("/paciente/citas/crear")}
              >
                Programar cita
              </div>

              <div
                style={styles.quickButton}
                onClick={() => navigate("/paciente/citas")}
              >
                Ver mis citas
              </div>

              <div
                style={styles.quickButton}
                onClick={() => navigate("/paciente/expediente")}
              >
                Ver expediente
              </div>

              <div
                style={styles.quickButton}
                onClick={() => navigate("/paciente/consultas")}
              >
                Ver consultas
              </div>

              <div
                style={styles.quickButton}
                onClick={() => navigate("/paciente/recetas")}
              >
                Ver recetas
              </div>

              <div
                style={styles.quickButton}
                onClick={() => navigate("/paciente/tratamientos")}
              >
                Ver tratamientos
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPaciente;