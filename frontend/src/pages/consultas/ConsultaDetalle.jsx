import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaUserInjured,
    FaUserMd,
    FaFileMedical,
    FaHeartbeat,
    FaClipboardList
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ConsultaDetalle = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();

    const esPaciente = usuario?.rol === "PACIENTE";

    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarConsulta();
    }, []);

    const cargarConsulta = async () => {

        try {

            const res = await axiosClient.get(`/consultas/${id}`);

            setConsulta(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
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
                <p>Cargando consulta médica...</p>
            </div>
        );
    }

    if (!consulta) {
        return (
            <div style={styles.loadingContainer}>
                <p>No se encontró la consulta.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            <div style={styles.header}>

                <button
                    style={styles.btnVolver}
                    onClick={() =>
                        navigate(
                            esPaciente
                                ? "/paciente/consultas"
                                : "/consultas"
                        )
                    }
                >
                    <FaArrowLeft />
                    Volver
                </button>

                <div>
                    <h1 style={styles.title}>
                        Consulta Médica
                    </h1>

                    <p style={styles.subtitle}>
                        Visualización clínica detallada de la consulta.
                    </p>
                </div>

            </div>

            {/* INFORMACIÓN GENERAL */}
            <div style={styles.card}>

                <div style={styles.cardHeader}>
                    <FaFileMedical />
                    <h2>Información General</h2>
                </div>

                <div style={styles.grid}>

                    <div style={styles.infoBox}>
                        <FaUserInjured style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>
                                Paciente
                            </span>

                            <p style={styles.value}>
                                {consulta.expediente?.paciente?.nombres}{" "}
                                {consulta.expediente?.paciente?.apellidos}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaUserMd style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>
                                Médico
                            </span>

                            <p style={styles.value}>
                                {consulta.usuarioMedico?.nombre_completo}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaClipboardList style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>
                                Expediente
                            </span>

                            <p style={styles.value}>
                                {consulta.expediente?.numero_expediente}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaHeartbeat style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>
                                Fecha consulta
                            </span>

                            <p style={styles.value}>
                                {formatearFecha(consulta.fecha_consulta)}
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {/* CONSULTA */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    Información Clínica
                </h2>

                <div style={styles.section}>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>
                            Motivo de consulta
                        </h3>

                        <p style={styles.text}>
                            {consulta.motivo || "Sin información"}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>
                            Enfermedad actual
                        </h3>

                        <p style={styles.text}>
                            {consulta.enfermedad_actual || "Sin información"}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>
                            Examen físico
                        </h3>

                        <p style={styles.text}>
                            {consulta.examen_fisico || "Sin información"}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>
                            Impresión clínica
                        </h3>

                        <p style={styles.text}>
                            {consulta.impresion_clinica || "Sin información"}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>
                            Plan médico
                        </h3>

                        <p style={styles.text}>
                            {consulta.plan_medico || "Sin información"}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>
                            Observaciones
                        </h3>

                        <p style={styles.text}>
                            {consulta.observaciones || "Sin información"}
                        </p>
                    </div>

                </div>

            </div>

            {/* SIGNOS VITALES */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    Signos Vitales
                </h2>

                <div style={styles.vitalesGrid}>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Peso
                        </span>

                        <strong>
                            {consulta.peso || "--"}
                        </strong>
                    </div>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Talla
                        </span>

                        <strong>
                            {consulta.talla || "--"}
                        </strong>
                    </div>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Presión arterial
                        </span>

                        <strong>
                            {consulta.presion_arterial || "--"}
                        </strong>
                    </div>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Temperatura
                        </span>

                        <strong>
                            {consulta.temperatura || "--"}
                        </strong>
                    </div>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Frecuencia cardíaca
                        </span>

                        <strong>
                            {consulta.frecuencia_cardiaca || "--"}
                        </strong>
                    </div>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Frecuencia respiratoria
                        </span>

                        <strong>
                            {consulta.frecuencia_respiratoria || "--"}
                        </strong>
                    </div>

                    <div style={styles.vitalBox}>
                        <span style={styles.vitalLabel}>
                            Saturación O₂
                        </span>

                        <strong>
                            {consulta.saturacion_oxigeno || "--"}
                        </strong>
                    </div>

                </div>

            </div>

            {/* DIAGNÓSTICOS */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    Diagnósticos
                </h2>

                {consulta.diagnosticos?.length === 0 ? (
                    <p style={styles.empty}>
                        No hay diagnósticos registrados.
                    </p>
                ) : (
                    consulta.diagnosticos.map((diag) => (
                        <div
                            key={diag.id_diagnostico}
                            style={styles.recordBox}
                        >
                            <h3 style={styles.recordTitle}>
                                {diag.tipo || "Diagnóstico"}
                            </h3>

                            <p style={styles.text}>
                                {diag.descripcion}
                            </p>
                        </div>
                    ))
                )}

            </div>

            {/* TRATAMIENTOS */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    Tratamientos
                </h2>

                {!consulta.diagnosticos?.flatMap((diag) => diag.tratamientos || []).length ? (
                    <p style={styles.empty}>
                        No hay tratamientos registrados.
                    </p>
                ) : (
                    consulta.diagnosticos
                        ?.flatMap((diag) => diag.tratamientos || [])
                        .map((trat) => (
                            <div
                                key={trat.id_tratamiento}
                                style={styles.recordBox}
                            >
                                <h3 style={styles.recordTitle}>
                                    Tratamiento
                                </h3>

                                <p style={styles.text}>
                                    {trat.descripcion}
                                </p>

                                <p style={styles.smallText}>
                                    {trat.indicaciones}
                                </p>
                            </div>
                        ))
                )}

            </div>

            {/* RECETAS */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    Recetas Médicas
                </h2>

                {!consulta.diagnosticos?.flatMap((diag) => diag.recetas || []).length ? (
                    <p style={styles.empty}>
                        No hay recetas registradas.
                    </p>
                ) : (
                    consulta.diagnosticos
                        ?.flatMap((diag) => diag.recetas || [])
                        .map((receta) => (
                            <div
                                key={receta.id_receta}
                                style={styles.recordBox}
                            >
                                <h3 style={styles.recordTitle}>
                                    Medicamentos
                                </h3>

                                <p style={styles.text}>
                                    {receta.medicamentos}
                                </p>

                                <p style={styles.smallText}>
                                    {receta.indicaciones}
                                </p>
                            </div>
                        ))
                )}

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
        border: "1px solid #e3edf7"
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

    vitalesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px"
    },

    vitalBox: {
        backgroundColor: "#f8fbff",
        border: "1px solid #dbe8f5",
        borderRadius: "14px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    vitalLabel: {
        color: "#6c757d",
        fontSize: "13px"
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

export default ConsultaDetalle;