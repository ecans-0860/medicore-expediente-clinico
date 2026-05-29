import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaFolderOpen,
    FaUserInjured,
    FaClipboardList,
    FaAllergies,
    FaStethoscope,
    FaFileMedical,
    FaPills,
    FaHeartbeat,
    FaSyringe
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ExpedienteDetalle = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { usuario } = useAuth();
    const esPaciente = usuario?.rol === "PACIENTE";

    const [expediente, setExpediente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerExpediente();
    }, [id]);

    const obtenerExpediente = async () => {
        try {
            const response = await axiosClient.get(`/expedientes/${id}`);
            setExpediente(response.data);
        } catch (error) {
            console.error("Error al obtener expediente:", error);
            setMensaje("Error al cargar la información del expediente");
        } finally {
            setLoading(false);
        }
    };

    const mostrarDato = (valor) => {
        return valor && valor !== "" ? valor : "No registrado";
    };

    const styles = {
        container: {
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#f5f7fb",
            padding: "24px",
            fontFamily: "'Segoe UI', sans-serif"
        },
        topBar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
        },
        title: {
            fontSize: "30px",
            color: "#102b5c",
            margin: 0
        },
        actions: {
            display: "flex",
            gap: "12px"
        },
        backButton: {
            backgroundColor: "#ffffff",
            border: "1px solid #dbe3ee",
            borderRadius: "10px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#102b5c"
        },
        editButton: {
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        headerCard: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },
        headerTitle: {
            fontSize: "26px",
            color: "#102b5c",
            margin: 0
        },
        headerSub: {
            color: "#6b7890",
            marginTop: "8px",
            fontSize: "14px"
        },
        estadoActivo: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold"
        },
        estadoInactivo: {
            backgroundColor: "#fde2e2",
            color: "#b42318",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 330px)",
            gap: "22px",
            alignItems: "start",
            paddingBottom: "50px"
        },
        card: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5",
            width: "330px",
            minHeight: "210px",
            boxSizing: "border-box"
        },
        cardTitle: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#102b5c",
            fontSize: "19px",
            marginTop: 0,
            marginBottom: "18px",
            borderBottom: "1px solid #edf1f7",
            paddingBottom: "12px"
        },
        icon: {
            color: "#2f80ed"
        },
        row: {
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            padding: "10px 0",
            borderBottom: "1px solid #f0f3f8"
        },
        label: {
            color: "#6b7890",
            fontWeight: "600",
            fontSize: "14px"
        },
        value: {
            color: "#26364f",
            fontSize: "14px",
            textAlign: "right"
        },
        textValue: {
            color: "#26364f",
            fontSize: "14px",
            lineHeight: "1.6"
        },
        emptyText: {
            color: "#6b7890",
            fontSize: "14px"
        },
        listItem: {
            padding: "12px 0",
            borderBottom: "1px solid #f0f3f8",
            color: "#26364f",
            fontSize: "14px"
        },
        loading: {
            backgroundColor: "#ffffff",
            padding: "25px",
            borderRadius: "14px",
            color: "#102b5c",
            fontWeight: "bold"
        },
        popup: {
            position: "fixed",
            top: "25px",
            right: "25px",
            backgroundColor: "#ffffff",
            color: "#102b5c",
            border: "1px solid #dbe3ee",
            borderLeft: "5px solid #eb5757",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            fontWeight: "bold",
            zIndex: 9999
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    Cargando información del expediente...
                </div>
            </div>
        );
    }

    if (!expediente) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    No se encontró información del expediente.
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {mensaje && <div style={styles.popup}>{mensaje}</div>}

            <div style={styles.topBar}>
                <h1 style={styles.title}>Detalle del Expediente</h1>

                <div style={styles.actions}>
                    <button
                        style={styles.backButton}
                        onClick={() =>
                            navigate(esPaciente ? "/paciente/expediente" : "/expedientes")
                        }
                    >
                        <FaArrowLeft />
                        Regresar
                    </button>

                    {!esPaciente && (
                        <button
                            style={styles.editButton}
                            onClick={() =>
                                navigate(`/expedientes/editar/${expediente.id_expediente}`)
                            }
                        >
                            <FaEdit />
                            Editar expediente
                        </button>
                    )}
                </div>
            </div>

            <section style={styles.headerCard}>
                <div>
                    <h2 style={styles.headerTitle}>
                        Expediente {mostrarDato(expediente.numero_expediente)}
                    </h2>

                    <p style={styles.headerSub}>
                        Paciente:{" "}
                        {expediente.paciente
                            ? `${expediente.paciente.nombres} ${expediente.paciente.apellidos}`
                            : "No registrado"}{" "}
                        | Apertura:{" "}
                        {expediente.fecha_apertura
                            ? new Date(expediente.fecha_apertura).toLocaleDateString()
                            : "No registrado"}
                    </p>
                </div>

                <span
                    style={
                        expediente.estado === "ACTIVO"
                            ? styles.estadoActivo
                            : styles.estadoInactivo
                    }
                >
                    {mostrarDato(expediente.estado)}
                </span>
            </section>

            <section style={styles.grid}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaFolderOpen style={styles.icon} />
                        Información del expediente
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>No. expediente</span>
                        <span style={styles.value}>
                            {mostrarDato(expediente.numero_expediente)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Fecha apertura</span>
                        <span style={styles.value}>
                            {expediente.fecha_apertura
                                ? new Date(expediente.fecha_apertura).toLocaleDateString()
                                : "No registrado"}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Estado</span>
                        <span style={styles.value}>
                            {mostrarDato(expediente.estado)}
                        </span>
                    </div>

                    <div>
                        <p style={styles.label}>Motivo apertura</p>
                        <p style={styles.textValue}>
                            {mostrarDato(expediente.motivo_apertura)}
                        </p>
                    </div>

                    <div>
                        <p style={styles.label}>Observaciones</p>
                        <p style={styles.textValue}>
                            {mostrarDato(expediente.observaciones)}
                        </p>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaUserInjured style={styles.icon} />
                        Datos del paciente
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Nombre</span>
                        <span style={styles.value}>
                            {expediente.paciente
                                ? `${expediente.paciente.nombres} ${expediente.paciente.apellidos}`
                                : "No registrado"}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>DPI</span>
                        <span style={styles.value}>
                            {mostrarDato(expediente.paciente?.dpi)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Teléfono</span>
                        <span style={styles.value}>
                            {mostrarDato(expediente.paciente?.telefono)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Tipo sangre</span>
                        <span style={styles.value}>
                            {mostrarDato(expediente.paciente?.tipo_sangre)}
                        </span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaClipboardList style={styles.icon} />
                        Antecedentes médicos
                    </h2>

                    {expediente.antecedentes?.length > 0 ? (
                        expediente.antecedentes.map((antecedente) => (
                            <div
                                key={antecedente.id_antecedente}
                                style={styles.listItem}
                            >
                                <strong>{antecedente.tipo}</strong>
                                <br />
                                {antecedente.descripcion}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>
                            No hay antecedentes registrados.
                        </p>
                    )}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaAllergies style={styles.icon} />
                        Alergias
                    </h2>

                    {expediente.alergias?.length > 0 ? (
                        expediente.alergias.map((alergia) => (
                            <div
                                key={alergia.id_alergia}
                                style={styles.listItem}
                            >
                                <strong>{alergia.sustancia}</strong>
                                <br />
                                Severidad: {mostrarDato(alergia.severidad)}
                                <br />
                                Reacción: {mostrarDato(alergia.reaccion)}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>
                            No hay alergias registradas.
                        </p>
                    )}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaStethoscope style={styles.icon} />
                        Consultas relacionadas
                    </h2>

                    {expediente.consultas?.length > 0 ? (
                        expediente.consultas.map((consulta) => (
                            <div
                                key={consulta.id_consulta}
                                style={styles.listItem}
                            >
                                <strong>
                                    {consulta.fecha_consulta
                                        ? new Date(consulta.fecha_consulta).toLocaleDateString()
                                        : "Fecha no registrada"}
                                </strong>
                                <br />
                                Motivo: {mostrarDato(consulta.motivo)}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>
                            No hay consultas registradas.
                        </p>
                    )}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaPills style={styles.icon} />
                        Medicamentos actuales
                    </h2>

                    {expediente.medicamentos_actuales?.length > 0 ? (
                        expediente.medicamentos_actuales.map((med) => (
                            <div key={med.id_medicamento} style={styles.listItem}>
                                <strong>{mostrarDato(med.nombre)}</strong>
                                <br />
                                Dosis: {mostrarDato(med.dosis)}
                                <br />
                                Frecuencia: {mostrarDato(med.frecuencia)}
                                <br />
                                Vía: {mostrarDato(med.via)}
                                <br />
                                Observaciones: {mostrarDato(med.observaciones)}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>No hay medicamentos registrados.</p>
                    )}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaHeartbeat style={styles.icon} />
                        Hábitos del paciente
                    </h2>

                    {expediente.habitos?.length > 0 ? (
                        expediente.habitos.map((habito) => (
                            <div key={habito.id_habito} style={styles.listItem}>
                                <strong>{mostrarDato(habito.tipo)}</strong>
                                <br />
                                Descripción: {mostrarDato(habito.descripcion)}
                                <br />
                                Frecuencia: {mostrarDato(habito.frecuencia)}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>No hay hábitos registrados.</p>
                    )}
                </div>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaSyringe style={styles.icon} />
                        Vacunas
                    </h2>

                    {expediente.vacunas?.length > 0 ? (
                        expediente.vacunas.map((vacuna) => (
                            <div key={vacuna.id_vacuna} style={styles.listItem}>
                                <strong>{mostrarDato(vacuna.nombre)}</strong>
                                <br />
                                Dosis: {mostrarDato(vacuna.dosis)}
                                <br />
                                Fecha aplicación:{" "}
                                {vacuna.fecha_aplicacion
                                    ? new Date(vacuna.fecha_aplicacion).toLocaleDateString()
                                    : "No registrado"}
                                <br />
                                Observaciones: {mostrarDato(vacuna.observaciones)}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>No hay vacunas registradas.</p>
                    )}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaFileMedical style={styles.icon} />
                        Documentos clínicos
                    </h2>

                    {expediente.documentos_clinicos?.length > 0 ? (
                        expediente.documentos_clinicos.map((doc) => (
                            <div key={doc.id_documento} style={styles.listItem}>
                                <strong>{mostrarDato(doc.nombre)}</strong>
                                <br />
                                Tipo: {mostrarDato(doc.tipo)}
                                <br />
                                Descripción: {mostrarDato(doc.descripcion)}
                                <br />

                                {doc.archivo_url ? (
                                    <a
                                        href={`http://localhost:3000${doc.archivo_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            backgroundColor: "#0b2c5f",
                                            color: "#ffffff",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            textDecoration: "none",
                                            fontWeight: "bold",
                                            marginTop: "10px",
                                            display: "inline-block"
                                        }}
                                    >
                                        Ver documento
                                    </a>
                                ) : (
                                    <span>No hay archivo adjunto</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={styles.emptyText}>
                            No hay documentos clínicos registrados.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ExpedienteDetalle;