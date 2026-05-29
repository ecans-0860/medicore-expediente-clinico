import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaUserInjured,
    FaUserMd,
    FaClipboardList,
    FaCalendarAlt,
    FaFileMedical,
    FaNotesMedical,
    FaStethoscope
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const CitaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();

    const rutaVolver =
        usuario?.rol === "PACIENTE"
            ? "/paciente/citas"
            : "/citas";

    const [cita, setCita] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCita();
    }, []);

    const cargarCita = async () => {
        try {
            const res = await axiosClient.get(`/citas/${id}`);
            setCita(res.data);
        } catch (error) {
            console.error("Error al cargar cita:", error);
        } finally {
            setLoading(false);
        }
    };

    const mostrarDato = (valor) => {
        return valor && valor !== "" ? valor : "Sin información";
    };

    const formatearFechaHora = (fecha) => {
        if (!fecha) return "Sin fecha";

        return new Date(fecha).toLocaleString("es-GT", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const obtenerEstadoStyle = (estado) => {
        if (estado === "PENDIENTE") return styles.estadoPendiente;
        if (estado === "CONFIRMADA") return styles.estadoConfirmada;
        if (estado === "ATENDIDA") return styles.estadoAtendida;
        if (estado === "CANCELADA") return styles.estadoCancelada;
        return styles.badge;
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <p>Cargando cita médica...</p>
            </div>
        );
    }

    if (!cita) {
        return (
            <div style={styles.loadingContainer}>
                <p>No se encontró la cita médica.</p>
            </div>
        );
    }

    const paciente = cita.paciente;
    const medico = cita.usuario;
    const consulta = cita.consulta;
    const expediente = consulta?.expediente;
    const diagnosticos = consulta?.diagnosticos || [];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button
                    style={styles.btnVolver}
                    onClick={() => navigate(rutaVolver)}
                >
                    <FaArrowLeft />
                    Volver
                </button>

                <div>
                    <h1 style={styles.title}>Cita Médica</h1>

                    <p style={styles.subtitle}>
                        Visualización detallada de la cita, paciente, médico y relación clínica.
                    </p>
                </div>

                {usuario?.rol !== "PACIENTE" && (
                    <button
                        style={styles.btnEditar}
                        onClick={() => navigate(`/citas/editar/${cita.id_cita}`)}
                    >
                        <FaEdit />
                        Editar
                    </button>
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaFileMedical />
                    <h2>Información General</h2>
                </div>

                <div style={styles.grid}>
                    <div style={styles.infoBox}>
                        <FaUserInjured style={styles.iconBlue} />
                        <div>
                            <span style={styles.label}>Paciente</span>
                            <p style={styles.value}>
                                {paciente
                                    ? `${paciente.nombres} ${paciente.apellidos}`
                                    : "Paciente no registrado"}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaUserMd style={styles.iconBlue} />
                        <div>
                            <span style={styles.label}>Médico</span>
                            <p style={styles.value}>
                                {mostrarDato(medico?.nombre_completo)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaCalendarAlt style={styles.iconBlue} />
                        <div>
                            <span style={styles.label}>Fecha y hora</span>
                            <p style={styles.value}>
                                {formatearFechaHora(cita.fecha_hora)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaClipboardList style={styles.iconBlue} />
                        <div>
                            <span style={styles.label}>Estado</span>
                            <p style={styles.value}>
                                {mostrarDato(cita.estado)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaCalendarAlt />
                    <h2>Datos de la Cita</h2>
                </div>

                <div style={styles.badgeRow}>
                    <span style={obtenerEstadoStyle(cita.estado)}>
                        {mostrarDato(cita.estado)}
                    </span>

                    <span style={styles.badge}>
                        Tipo: {mostrarDato(cita.tipo_cita)}
                    </span>

                    <span style={styles.badge}>
                        Modalidad: {mostrarDato(cita.modalidad)}
                    </span>

                    <span style={styles.badge}>
                        Prioridad: {mostrarDato(cita.prioridad)}
                    </span>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Motivo de la cita</h3>
                    <p style={styles.text}>
                        {mostrarDato(cita.motivo)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Síntomas reportados</h3>
                    <p style={styles.text}>
                        {mostrarDato(cita.sintomas)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Observaciones</h3>
                    <p style={styles.text}>
                        {mostrarDato(cita.observaciones)}
                    </p>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaUserInjured />
                    <h2>Información del Paciente</h2>
                </div>

                <div style={styles.grid}>
                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>DPI</span>
                            <p style={styles.value}>{mostrarDato(paciente?.dpi)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Teléfono</span>
                            <p style={styles.value}>{mostrarDato(paciente?.telefono)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Tipo de sangre</span>
                            <p style={styles.value}>{mostrarDato(paciente?.tipo_sangre)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Correo</span>
                            <p style={styles.value}>{mostrarDato(paciente?.correo)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaStethoscope />
                    <h2>Consulta Relacionada</h2>
                </div>

                {consulta ? (
                    <>
                        <div style={styles.badgeRow}>
                            <span style={styles.badge}>
                                Expediente: {mostrarDato(expediente?.numero_expediente)}
                            </span>

                            <span style={styles.badge}>
                                Fecha consulta: {formatearFechaHora(consulta.fecha_consulta)}
                            </span>

                            <span style={styles.badge}>
                                Estado: {mostrarDato(consulta.estado)}
                            </span>
                        </div>

                        <div style={styles.item}>
                            <h3 style={styles.itemTitle}>Motivo de consulta</h3>
                            <p style={styles.text}>{mostrarDato(consulta.motivo)}</p>
                        </div>

                        <div style={styles.item}>
                            <h3 style={styles.itemTitle}>Impresión clínica</h3>
                            <p style={styles.text}>{mostrarDato(consulta.impresion_clinica)}</p>
                        </div>

                        <div style={styles.item}>
                            <h3 style={styles.itemTitle}>Plan médico</h3>
                            <p style={styles.text}>{mostrarDato(consulta.plan_medico)}</p>
                        </div>
                    </>
                ) : (
                    <p style={styles.empty}>
                        Esta cita aún no tiene una consulta médica relacionada.
                    </p>
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaNotesMedical />
                    <h2>Diagnósticos Relacionados</h2>
                </div>

                {diagnosticos.length === 0 ? (
                    <p style={styles.empty}>
                        No hay diagnósticos registrados para esta cita.
                    </p>
                ) : (
                    diagnosticos.map((diagnostico) => (
                        <div
                            key={diagnostico.id_diagnostico}
                            style={styles.recordBox}
                        >
                            <h3 style={styles.recordTitle}>
                                {mostrarDato(diagnostico.tipo)}
                            </h3>

                            <p style={styles.text}>
                                {mostrarDato(diagnostico.descripcion)}
                            </p>

                            <p style={styles.smallText}>
                                CIE-10: {mostrarDato(diagnostico.codigo_cie10)}
                            </p>

                            <p style={styles.smallText}>
                                Tratamientos: {diagnostico.tratamientos?.length || 0}
                            </p>

                            <p style={styles.smallText}>
                                Recetas: {diagnostico.recetas?.length || 0}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaClipboardList />
                    <h2>Control de la Cita</h2>
                </div>

                <div style={styles.grid}>
                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Confirmación</span>
                            <p style={styles.value}>
                                {formatearFechaHora(cita.fecha_confirmacion)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Cancelación</span>
                            <p style={styles.value}>
                                {formatearFechaHora(cita.fecha_cancelacion)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Motivo cancelación</span>
                            <p style={styles.value}>
                                {mostrarDato(cita.motivo_cancelacion)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        overflowY: "auto",
        backgroundColor: "#f5f7fb",
        padding: "24px",
        fontFamily: "'Segoe UI', sans-serif"
    },
    loadingContainer: {
        padding: "40px",
        textAlign: "center"
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px"
    },
    btnVolver: {
        backgroundColor: "#0b2c5f",
        color: "#fff",
        border: "none",
        padding: "12px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "600"
    },
    btnEditar: {
        marginLeft: "auto",
        backgroundColor: "#2f80ed",
        color: "#fff",
        border: "none",
        padding: "12px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "600"
    },
    title: {
        color: "#0b2c5f",
        margin: 0
    },
    subtitle: {
        color: "#6c757d",
        marginTop: "5px"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "18px",
        padding: "25px",
        marginBottom: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#0b2c5f",
        marginBottom: "20px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
    },
    infoBox: {
        backgroundColor: "#f8fbff",
        border: "1px solid #dbe8f5",
        borderRadius: "14px",
        padding: "18px",
        display: "flex",
        alignItems: "center",
        gap: "15px"
    },
    iconBlue: {
        color: "#0b5ed7",
        fontSize: "24px"
    },
    label: {
        color: "#6c757d",
        fontSize: "13px"
    },
    value: {
        margin: 0,
        marginTop: "5px",
        fontWeight: "600",
        color: "#0b2c5f"
    },
    item: {
        backgroundColor: "#f8fbff",
        borderRadius: "12px",
        padding: "18px",
        border: "1px solid #e3edf7",
        marginBottom: "15px"
    },
    itemTitle: {
        marginTop: 0,
        color: "#0b2c5f",
        marginBottom: "10px"
    },
    text: {
        margin: 0,
        color: "#374151",
        lineHeight: "1.7",
        whiteSpace: "pre-line"
    },
    badgeRow: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px"
    },
    badge: {
        backgroundColor: "#eef4ff",
        color: "#0b2c5f",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600"
    },
    estadoPendiente: {
        backgroundColor: "#fff4d6",
        color: "#8a5a00",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    estadoConfirmada: {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    estadoAtendida: {
        backgroundColor: "#dff6e4",
        color: "#1f7a3f",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    estadoCancelada: {
        backgroundColor: "#fde2e2",
        color: "#b42318",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    recordBox: {
        backgroundColor: "#f8fbff",
        border: "1px solid #dbe8f5",
        borderRadius: "14px",
        padding: "18px",
        marginBottom: "15px"
    },
    recordTitle: {
        marginTop: 0,
        color: "#0b2c5f"
    },
    smallText: {
        color: "#6c757d",
        marginTop: "10px"
    },
    empty: {
        color: "#6c757d"
    }
};

export default CitaDetalle;