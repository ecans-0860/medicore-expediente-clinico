import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaUserInjured,
    FaHeartbeat,
    FaPhoneAlt,
    FaShieldAlt,
    FaClipboardList
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const PacienteDetalle = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerPaciente();
    }, [id]);

    const obtenerPaciente = async () => {
        try {
            const response = await axiosClient.get(`/pacientes/${id}`);
            setPaciente(response.data);
        } catch (error) {
            console.error("Error al obtener paciente:", error);
            setMensaje("Error al cargar la información del paciente");
        } finally {
            setLoading(false);
        }
    };

    const mostrarDato = (valor) => {
        return valor && valor !== "" ? valor : "No registrado";
    };

    const styles = {
        container: {
            minHeight: "100vh",
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
        patientHeader: {
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
        patientName: {
            fontSize: "26px",
            color: "#102b5c",
            margin: 0
        },
        patientSub: {
            color: "#6b7890",
            marginTop: "8px",
            fontSize: "14px"
        },
        estado: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
            gap: "22px"
        },
        card: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5"
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
                <div style={styles.loading}>Cargando información del paciente...</div>
            </div>
        );
    }

    if (!paciente) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>No se encontró información del paciente.</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {mensaje && <div style={styles.popup}>{mensaje}</div>}

            <div style={styles.topBar}>
                <h1 style={styles.title}>Detalle del Paciente</h1>

                <div style={styles.actions}>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/pacientes")}
                    >
                        <FaArrowLeft />
                        Regresar
                    </button>

                    <button
                        style={styles.editButton}
                        onClick={() => navigate(`/pacientes/editar/${paciente.id_paciente}`)}
                    >
                        <FaEdit />
                        Editar paciente
                    </button>
                </div>
            </div>

            <section style={styles.patientHeader}>
                <div>
                    <h2 style={styles.patientName}>
                        {paciente.nombres} {paciente.apellidos}
                    </h2>

                    <p style={styles.patientSub}>
                        DPI: {mostrarDato(paciente.dpi)} | Registro:{" "}
                        {paciente.fecha_registro
                            ? new Date(paciente.fecha_registro).toLocaleDateString()
                            : "No registrado"}
                    </p>
                </div>

                <span style={styles.estado}>
                    {mostrarDato(paciente.estado)}
                </span>
            </section>

            <section style={styles.grid}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaUserInjured style={styles.icon} />
                        Datos personales
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Fecha nacimiento</span>
                        <span style={styles.value}>
                            {paciente.fecha_nacimiento
                                ? new Date(paciente.fecha_nacimiento).toLocaleDateString()
                                : "No registrado"}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Sexo</span>
                        <span style={styles.value}>{mostrarDato(paciente.sexo)}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Estado civil</span>
                        <span style={styles.value}>{mostrarDato(paciente.estado_civil)}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Ocupación</span>
                        <span style={styles.value}>{mostrarDato(paciente.ocupacion)}</span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaPhoneAlt style={styles.icon} />
                        Contacto
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Teléfono</span>
                        <span style={styles.value}>{mostrarDato(paciente.telefono)}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Correo</span>
                        <span style={styles.value}>{mostrarDato(paciente.correo)}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Dirección</span>
                        <span style={styles.value}>{mostrarDato(paciente.direccion)}</span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaHeartbeat style={styles.icon} />
                        Información médica
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Tipo de sangre</span>
                        <span style={styles.value}>{mostrarDato(paciente.tipo_sangre)}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Observaciones</span>
                        <span style={styles.value}>{mostrarDato(paciente.observaciones)}</span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaPhoneAlt style={styles.icon} />
                        Contacto emergencia
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Nombre</span>
                        <span style={styles.value}>
                            {mostrarDato(paciente.contacto_emergencia_nombre)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Teléfono</span>
                        <span style={styles.value}>
                            {mostrarDato(paciente.contacto_emergencia_telefono)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Parentesco</span>
                        <span style={styles.value}>
                            {mostrarDato(paciente.contacto_emergencia_parentesco)}
                        </span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaShieldAlt style={styles.icon} />
                        Seguro y aseguradora
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Aseguradora</span>
                        <span style={styles.value}>{mostrarDato(paciente.aseguradora)}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Número seguro</span>
                        <span style={styles.value}>{mostrarDato(paciente.numero_seguro)}</span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        <FaClipboardList style={styles.icon} />
                        Próximas relaciones
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>Expediente clínico</span>
                        <span style={styles.value}>Pendiente de conectar</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Consultas</span>
                        <span style={styles.value}>Pendiente de conectar</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Citas</span>
                        <span style={styles.value}>Pendiente de conectar</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PacienteDetalle;