import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaFolderOpen,
    FaUserInjured,
    FaClipboardList,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const ExpedienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [pacientes, setPacientes] = useState([]);

    const [formData, setFormData] = useState({
        id_paciente: "",
        motivo_apertura: "",
        observaciones: "",
        estado: "ACTIVO"
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerPacientes();

        if (id) {
            obtenerExpediente();
        }
    }, [id]);

    const obtenerPacientes = async () => {
        try {
            const response = await axiosClient.get("/pacientes");
            setPacientes(response.data);
        } catch (error) {
            console.error("Error al obtener pacientes:", error);
            setMensaje("Error al cargar pacientes");
        }
    };

    const obtenerExpediente = async () => {
        try {
            const response = await axiosClient.get(`/expedientes/${id}`);
            const expediente = response.data;

            setFormData({
                id_paciente: expediente.id_paciente || "",
                motivo_apertura: expediente.motivo_apertura || "",
                observaciones: expediente.observaciones || "",
                estado: expediente.estado || "ACTIVO"
            });

        } catch (error) {
            console.error("Error al cargar expediente:", error);
            setMensaje("Error al cargar expediente");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const guardarExpediente = async (e) => {
        e.preventDefault();

        if (!formData.id_paciente || !formData.motivo_apertura) {
            alert("Seleccione un paciente e ingrese el motivo de apertura");
            return;
        }

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/expedientes/${id}`, {
                    motivo_apertura: formData.motivo_apertura,
                    observaciones: formData.observaciones,
                    estado: formData.estado
                });

                setMensaje("Expediente actualizado correctamente");
            } else {
                await axiosClient.post("/expedientes", formData);

                setMensaje("Expediente creado correctamente");
            }

            setTimeout(() => {
                navigate("/expedientes");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar expediente"
            );
        } finally {
            setLoading(false);
        }
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
        card: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5"
        },
        hintBox: {
            width: "570px",
            backgroundColor: "#f7f9fc",
            border: "1px solid #e1e7f0",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "#6b7890",
            fontSize: "13px",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },
        sectionTitle: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#102b5c",
            fontSize: "20px",
            marginTop: "30px",
            marginBottom: "18px",
            borderBottom: "1px solid #edf1f7",
            paddingBottom: "12px"
        },
        sectionIcon: {
            color: "#2f80ed",
            fontSize: "20px"
        },
        grid: {
            display: "flex",
            flexWrap: "wrap",
            columnGap: "35px",
            rowGap: "18px",
            alignItems: "flex-start"
        },
        field: {
            display: "flex",
            flexDirection: "column"
        },
        label: {
            marginBottom: "8px",
            color: "#102b5c",
            fontWeight: "600",
            fontSize: "14px"
        },
        required: {
            color: "#e8505b"
        },
        input: {
            height: "42px",
            borderRadius: "9px",
            border: "1px solid #dbe3ee",
            padding: "0 12px",
            fontSize: "13px",
            outline: "none",
            backgroundColor: "#ffffff"
        },
        textarea: {
            borderRadius: "9px",
            border: "1px solid #dbe3ee",
            padding: "12px",
            fontSize: "13px",
            outline: "none",
            resize: "none",
            backgroundColor: "#ffffff"
        },
        actions: {
            marginTop: "30px",
            display: "flex",
            justifyContent: "flex-end"
        },
        saveButton: {
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            cursor: "pointer"
        },
        popup: {
            position: "fixed",
            top: "25px",
            right: "25px",
            backgroundColor: "#ffffff",
            color: "#102b5c",
            border: "1px solid #dbe3ee",
            borderLeft: "5px solid #27ae60",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            fontWeight: "bold",
            zIndex: 9999
        }
    };

    return (
        <div style={styles.container}>
            {mensaje && (
                <div style={styles.popup}>
                    {mensaje}
                </div>
            )}

            <div style={styles.topBar}>
                <h1 style={styles.title}>
                    {esEdicion ? "Editar Expediente" : "Nuevo Expediente"}
                </h1>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/expedientes")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarExpediente}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    Seleccione el paciente y registre la información inicial del expediente clínico.
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaUserInjured style={styles.sectionIcon} />
                    Paciente relacionado
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Paciente <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="id_paciente"
                            value={formData.id_paciente}
                            onChange={handleChange}
                            disabled={esEdicion}
                            style={{
                                ...styles.input,
                                width: "350px",
                                backgroundColor: esEdicion ? "#f1f4f8" : "#ffffff"
                            }}
                        >
                            <option value="">Seleccione un paciente</option>

                            {pacientes.map((paciente) => (
                                <option
                                    key={paciente.id_paciente}
                                    value={paciente.id_paciente}
                                >
                                    {paciente.nombres} {paciente.apellidos} - DPI: {paciente.dpi}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Estado expediente
                        </label>

                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                width: "160px"
                            }}
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaFolderOpen style={styles.sectionIcon} />
                    Información del expediente
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Motivo apertura <span style={styles.required}>*</span>
                        </label>

                        <textarea
                            rows="3"
                            name="motivo_apertura"
                            value={formData.motivo_apertura}
                            onChange={handleChange}
                            style={{
                                ...styles.textarea,
                                width: "520px"
                            }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Observaciones
                        </label>

                        <textarea
                            rows="3"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            style={{
                                ...styles.textarea,
                                width: "520px"
                            }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaClipboardList style={styles.sectionIcon} />
                    Información clínica relacionada
                </h2>

                <div style={styles.hintBox}>
                    Los antecedentes médicos, alergias, consultas, diagnósticos y tratamientos se gestionarán desde sus módulos correspondientes.
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.saveButton} disabled={loading}>
                        <FaSave />
                        {loading
                            ? esEdicion
                                ? "Actualizando..."
                                : "Guardando..."
                            : esEdicion
                                ? "Actualizar expediente"
                                : "Guardar expediente"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpedienteForm;