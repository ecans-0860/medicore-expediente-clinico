import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaUserInjured,
    FaUserMd,
    FaClipboardList,
    FaStethoscope,
    FaNotesMedical,
    FaPills,
    FaCalendarAlt,
    FaFileMedical
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const TratamientoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();

    const esPaciente = usuario?.rol === "PACIENTE";

    const rutaVolver =
        esPaciente
            ? "/paciente/tratamientos"
            : "/tratamientos";

    const [tratamiento, setTratamiento] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarTratamiento();
    }, []);

    const cargarTratamiento = async () => {
        try {
            const res = await axiosClient.get(`/tratamientos/${id}`);
            setTratamiento(res.data);
        } catch (error) {
            console.error("Error al cargar tratamiento:", error);
        } finally {
            setLoading(false);
        }
    };

    const mostrarDato = (valor) => {
        return valor && valor !== "" ? valor : "Sin información";
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Sin fecha";

        return new Date(fecha).toLocaleDateString("es-GT", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <p>Cargando tratamiento médico...</p>
            </div>
        );
    }

    if (!tratamiento) {
        return (
            <div style={styles.loadingContainer}>
                <p>No se encontró el tratamiento.</p>
            </div>
        );
    }

    const diagnostico = tratamiento.diagnostico;
    const consulta = diagnostico?.consulta;
    const expediente = consulta?.expediente;
    const paciente = expediente?.paciente;
    const medico = consulta?.usuarioMedico;

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
                    <h1 style={styles.title}>Tratamiento Médico</h1>

                    <p style={styles.subtitle}>
                        Visualización clínica detallada del tratamiento indicado.
                    </p>
                </div>

                {!esPaciente && (
                    <button
                        style={styles.btnEditar}
                        onClick={() =>
                            navigate(`/tratamientos/editar/${tratamiento.id_tratamiento}`)
                        }
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
                        <FaClipboardList style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>Expediente</span>
                            <p style={styles.value}>
                                {mostrarDato(expediente?.numero_expediente)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaStethoscope style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>Consulta</span>
                            <p style={styles.value}>
                                {formatearFecha(consulta?.fecha_consulta)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaPills />
                    <h2>Tratamiento</h2>
                </div>

                <div style={styles.badgeRow}>
                    <span
                        style={
                            tratamiento.estado === "ACTIVO"
                                ? styles.estadoActivo
                                : styles.estadoInactivo
                        }
                    >
                        {tratamiento.estado}
                    </span>

                    <span style={styles.badge}>
                        Tipo: {mostrarDato(tratamiento.tipo)}
                    </span>

                    <span style={styles.badge}>
                        Vía: {mostrarDato(tratamiento.via)}
                    </span>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Nombre</h3>
                    <p style={styles.text}>
                        {mostrarDato(tratamiento.nombre)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Descripción</h3>
                    <p style={styles.text}>
                        {mostrarDato(tratamiento.descripcion)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Indicaciones</h3>
                    <p style={styles.text}>
                        {mostrarDato(tratamiento.indicaciones)}
                    </p>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaCalendarAlt />
                    <h2>Plan y duración</h2>
                </div>

                <div style={styles.grid}>
                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Dosis</span>
                            <p style={styles.value}>{mostrarDato(tratamiento.dosis)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Frecuencia</span>
                            <p style={styles.value}>{mostrarDato(tratamiento.frecuencia)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Duración</span>
                            <p style={styles.value}>{mostrarDato(tratamiento.duracion)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Fecha inicio</span>
                            <p style={styles.value}>{formatearFecha(tratamiento.fecha_inicio)}</p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Fecha fin</span>
                            <p style={styles.value}>{formatearFecha(tratamiento.fecha_fin)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaNotesMedical />
                    <h2>Diagnóstico relacionado</h2>
                </div>

                <div style={styles.badgeRow}>
                    <span
                        style={
                            diagnostico?.estado === "ACTIVO"
                                ? styles.estadoActivo
                                : styles.estadoInactivo
                        }
                    >
                        {mostrarDato(diagnostico?.estado)}
                    </span>

                    <span style={styles.badge}>
                        Tipo: {mostrarDato(diagnostico?.tipo)}
                    </span>

                    <span style={styles.badge}>
                        CIE-10: {mostrarDato(diagnostico?.codigo_cie10)}
                    </span>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Descripción del diagnóstico</h3>
                    <p style={styles.text}>{mostrarDato(diagnostico?.descripcion)}</p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Observaciones del diagnóstico</h3>
                    <p style={styles.text}>{mostrarDato(diagnostico?.observaciones)}</p>
                </div>
            </div>

            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Consulta relacionada</h2>

                <div style={styles.section}>
                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>Motivo de consulta</h3>
                        <p style={styles.text}>{mostrarDato(consulta?.motivo)}</p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>Impresión clínica</h3>
                        <p style={styles.text}>{mostrarDato(consulta?.impresion_clinica)}</p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>Plan médico</h3>
                        <p style={styles.text}>{mostrarDato(consulta?.plan_medico)}</p>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaClipboardList />
                    <h2>Observaciones generales</h2>
                </div>

                <div style={styles.item}>
                    <p style={styles.text}>
                        {mostrarDato(tratamiento.observaciones)}
                    </p>
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
    sectionTitle: {
        color: "#0b2c5f",
        marginBottom: "20px"
    },
    section: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
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
        lineHeight: "1.7"
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
    estadoActivo: {
        backgroundColor: "#dff6e4",
        color: "#1f7a3f",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    estadoInactivo: {
        backgroundColor: "#fde2e2",
        color: "#b42318",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    }
};

export default TratamientoDetalle;