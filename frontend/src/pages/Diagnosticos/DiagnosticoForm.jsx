import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaNotesMedical,
    FaStethoscope,
    FaFileMedical,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const DiagnosticoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [consultas, setConsultas] = useState([]);

    const [formData, setFormData] = useState({
        id_consulta: "",
        descripcion: "",
        tipo: "PRINCIPAL",
        codigo_cie10: "",
        observaciones: ""
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarConsultas();

        if (esEdicion) {
            cargarDiagnostico();
        }
    }, [id]);

    const cargarConsultas = async () => {
        try {
            const res = await axiosClient.get("/consultas");
            setConsultas(res.data);
        } catch (error) {
            console.error("Error al cargar consultas:", error);
            setMensaje("Error al cargar consultas médicas");
        }
    };

    const cargarDiagnostico = async () => {
        try {
            const res = await axiosClient.get(`/diagnosticos/${id}`);
            const diagnostico = res.data;

            setFormData({
                id_consulta: diagnostico.id_consulta || "",
                descripcion: diagnostico.descripcion || "",
                tipo: diagnostico.tipo || "PRINCIPAL",
                codigo_cie10: diagnostico.codigo_cie10 || "",
                observaciones: diagnostico.observaciones || ""
            });

        } catch (error) {
            console.error("Error al cargar diagnóstico:", error);
            setMensaje("Error al cargar diagnóstico médico");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const guardarDiagnostico = async (e) => {
        e.preventDefault();

        if (!formData.id_consulta || !formData.descripcion) {
            alert("Seleccione una consulta médica e ingrese la descripción del diagnóstico");
            return;
        }

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/diagnosticos/${id}`, formData);
                setMensaje("Diagnóstico actualizado correctamente");
            } else {
                await axiosClient.post("/diagnosticos", formData);
                setMensaje("Diagnóstico creado correctamente");
            }

            setTimeout(() => {
                navigate("/diagnosticos");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar el diagnóstico"
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
            width: "720px",
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
                    {esEdicion ? "Editar Diagnóstico Médico" : "Nuevo Diagnóstico Médico"}
                </h1>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate("/diagnosticos")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarDiagnostico}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    El diagnóstico debe registrarse sobre una consulta médica existente.
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaStethoscope style={styles.sectionIcon} />
                    Consulta médica relacionada
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Consulta médica <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="id_consulta"
                            value={formData.id_consulta}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "520px" }}
                        >
                            <option value="">Seleccione una consulta</option>

                            {consultas.map((consulta) => (
                                <option
                                    key={consulta.id_consulta}
                                    value={consulta.id_consulta}
                                >
                                    {consulta.expediente?.numero_expediente} - {consulta.expediente?.paciente?.nombres} {consulta.expediente?.paciente?.apellidos} - {consulta.motivo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaNotesMedical style={styles.sectionIcon} />
                    Información del diagnóstico
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Descripción del diagnóstico <span style={styles.required}>*</span>
                        </label>

                        <textarea
                            rows="4"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "520px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Observaciones</label>

                        <textarea
                            rows="4"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "520px" }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaFileMedical style={styles.sectionIcon} />
                    Clasificación clínica
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Tipo de diagnóstico</label>

                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "180px" }}
                        >
                            <option value="PRINCIPAL">PRINCIPAL</option>
                            <option value="SECUNDARIO">SECUNDARIO</option>
                            <option value="PRESUNTIVO">PRESUNTIVO</option>
                            <option value="CONFIRMADO">CONFIRMADO</option>
                            <option value="DIFERENCIAL">DIFERENCIAL</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Código CIE-10</label>

                        <input
                            name="codigo_cie10"
                            value={formData.codigo_cie10}
                            onChange={handleChange}
                            placeholder="Ej. J00, E11, I10"
                            style={{ ...styles.input, width: "160px" }}
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
                                ? "Actualizar diagnóstico"
                                : "Guardar diagnóstico"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DiagnosticoForm;