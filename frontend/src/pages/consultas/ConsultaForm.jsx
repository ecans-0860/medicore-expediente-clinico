import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaStethoscope,
    FaFileMedical,
    FaHeartbeat,
    FaNotesMedical,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const ConsultaForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [expedientes, setExpedientes] = useState([]);

    const [formData, setFormData] = useState({
        id_expediente: "",
        motivo: "",
        enfermedad_actual: "",
        examen_fisico: "",
        impresion_clinica: "",
        plan_medico: "",
        observaciones: "",
        signos_vitales: "",
        peso: "",
        talla: "",
        presion_arterial: "",
        temperatura: "",
        frecuencia_cardiaca: "",
        frecuencia_respiratoria: "",
        saturacion_oxigeno: "",
        tipo_consulta: "GENERAL",
        estado: "ACTIVA"
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarExpedientes();

        if (esEdicion) {
            cargarConsulta();
        }
    }, [id]);

    const cargarExpedientes = async () => {
        try {
            const res = await axiosClient.get("/expedientes");
            setExpedientes(res.data);
        } catch (error) {
            console.error("Error al cargar expedientes:", error);
            setMensaje("Error al cargar expedientes");
        }
    };

    const cargarConsulta = async () => {
        try {
            const res = await axiosClient.get(`/consultas/${id}`);
            const consulta = res.data;

            setFormData({
                id_expediente: consulta.id_expediente || "",
                motivo: consulta.motivo || "",
                enfermedad_actual: consulta.enfermedad_actual || "",
                examen_fisico: consulta.examen_fisico || "",
                impresion_clinica: consulta.impresion_clinica || "",
                plan_medico: consulta.plan_medico || "",
                observaciones: consulta.observaciones || "",
                signos_vitales: consulta.signos_vitales || "",
                peso: consulta.peso || "",
                talla: consulta.talla || "",
                presion_arterial: consulta.presion_arterial || "",
                temperatura: consulta.temperatura || "",
                frecuencia_cardiaca: consulta.frecuencia_cardiaca || "",
                frecuencia_respiratoria: consulta.frecuencia_respiratoria || "",
                saturacion_oxigeno: consulta.saturacion_oxigeno || "",
                tipo_consulta: consulta.tipo_consulta || "GENERAL",
                estado: consulta.estado || "ACTIVA"
            });

        } catch (error) {
            console.error("Error al cargar consulta:", error);
            setMensaje("Error al cargar consulta médica");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const guardarConsulta = async (e) => {
        e.preventDefault();

        if (!formData.id_expediente || !formData.motivo) {
            alert("Complete los campos obligatorios");
            return;
        }

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/consultas/${id}`, formData);
                setMensaje("Consulta actualizada correctamente");
            } else {
                await axiosClient.post("/consultas", formData);
                setMensaje("Consulta creada correctamente");
            }

            setTimeout(() => {
                navigate("/consultas");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar la consulta"
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
            width: "650px",
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
                    {esEdicion ? "Editar Consulta Médica" : "Nueva Consulta Médica"}
                </h1>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate("/consultas")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarConsulta}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    Los campos marcados con * son obligatorios para registrar correctamente la consulta médica.
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaFileMedical style={styles.sectionIcon} />
                    Información de la consulta
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Expediente clínico <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="id_expediente"
                            value={formData.id_expediente}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "360px" }}
                        >
                            <option value="">Seleccione un expediente</option>

                            {expedientes.map((exp) => (
                                <option key={exp.id_expediente} value={exp.id_expediente}>
                                    {exp.numero_expediente} - {exp.paciente?.nombres} {exp.paciente?.apellidos}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Tipo de consulta</label>

                        <select
                            name="tipo_consulta"
                            value={formData.tipo_consulta}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "170px" }}
                        >
                            <option value="GENERAL">GENERAL</option>
                            <option value="CONTROL">CONTROL</option>
                            <option value="SEGUIMIENTO">SEGUIMIENTO</option>
                            <option value="EMERGENCIA">EMERGENCIA</option>
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaStethoscope style={styles.sectionIcon} />
                    Evaluación médica
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Motivo de consulta <span style={styles.required}>*</span>
                        </label>

                        <textarea
                            rows="3"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Enfermedad actual</label>

                        <textarea
                            rows="3"
                            name="enfermedad_actual"
                            value={formData.enfermedad_actual}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Examen físico</label>

                        <textarea
                            rows="3"
                            name="examen_fisico"
                            value={formData.examen_fisico}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Impresión clínica</label>

                        <textarea
                            rows="3"
                            name="impresion_clinica"
                            value={formData.impresion_clinica}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaHeartbeat style={styles.sectionIcon} />
                    Signos vitales
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Peso</label>
                        <input name="peso" value={formData.peso} onChange={handleChange} style={{ ...styles.input, width: "100px" }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Talla</label>
                        <input name="talla" value={formData.talla} onChange={handleChange} style={{ ...styles.input, width: "100px" }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Presión arterial</label>
                        <input name="presion_arterial" value={formData.presion_arterial} onChange={handleChange} style={{ ...styles.input, width: "130px" }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Temperatura</label>
                        <input name="temperatura" value={formData.temperatura} onChange={handleChange} style={{ ...styles.input, width: "120px" }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Frecuencia cardíaca</label>
                        <input name="frecuencia_cardiaca" value={formData.frecuencia_cardiaca} onChange={handleChange} style={{ ...styles.input, width: "140px" }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Frecuencia respiratoria</label>
                        <input name="frecuencia_respiratoria" value={formData.frecuencia_respiratoria} onChange={handleChange} style={{ ...styles.input, width: "160px" }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Saturación oxígeno</label>
                        <input name="saturacion_oxigeno" value={formData.saturacion_oxigeno} onChange={handleChange} style={{ ...styles.input, width: "150px" }} />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaNotesMedical style={styles.sectionIcon} />
                    Plan médico y observaciones
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Plan médico</label>

                        <textarea
                            rows="3"
                            name="plan_medico"
                            value={formData.plan_medico}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Observaciones</label>

                        <textarea
                            rows="3"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.saveButton} disabled={loading}>
                        <FaSave />
                        {loading
                            ? esEdicion
                                ? "Actualizando..."
                                : "Guardando..."
                            : esEdicion
                                ? "Actualizar consulta"
                                : "Guardar consulta"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultaForm;