import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaPrescriptionBottleAlt,
    FaNotesMedical,
    FaCalendarAlt,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const RecetaForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [diagnosticos, setDiagnosticos] = useState([]);

    const [formData, setFormData] = useState({
        id_diagnostico: "",
        codigo_receta: "",
        medicamentos: "",
        indicaciones: "",
        instrucciones_generales: "",
        fecha_emision: "",
        fecha_vigencia: "",
        proxima_revision: "",
        observaciones: ""
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarDiagnosticos();

        if (esEdicion) {
            cargarReceta();
        }
    }, [id]);

    const cargarDiagnosticos = async () => {
        try {
            const res = await axiosClient.get("/diagnosticos");
            setDiagnosticos(res.data);
        } catch (error) {
            console.error("Error al cargar diagnósticos:", error);
            setMensaje("Error al cargar diagnósticos médicos");
        }
    };

    const cargarReceta = async () => {
        try {
            const res = await axiosClient.get(`/recetas/${id}`);
            const receta = res.data;

            setFormData({
                id_diagnostico: receta.id_diagnostico || "",
                codigo_receta: receta.codigo_receta || "",
                medicamentos: receta.medicamentos || "",
                indicaciones: receta.indicaciones || "",
                instrucciones_generales: receta.instrucciones_generales || "",
                fecha_emision: receta.fecha_emision
                    ? receta.fecha_emision.split("T")[0]
                    : "",
                fecha_vigencia: receta.fecha_vigencia
                    ? receta.fecha_vigencia.split("T")[0]
                    : "",
                proxima_revision: receta.proxima_revision
                    ? receta.proxima_revision.split("T")[0]
                    : "",
                observaciones: receta.observaciones || ""
            });

        } catch (error) {
            console.error("Error al cargar receta:", error);
            setMensaje("Error al cargar receta médica");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const guardarReceta = async (e) => {
        e.preventDefault();

        if (!formData.id_diagnostico || !formData.medicamentos) {
            alert("Seleccione un diagnóstico e ingrese los medicamentos de la receta");
            return;
        }

        const dataEnviar = {
            ...formData,
            id_diagnostico: Number(formData.id_diagnostico),
            fecha_emision: formData.fecha_emision || null,
            fecha_vigencia: formData.fecha_vigencia || null,
            proxima_revision: formData.proxima_revision || null
        };

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/recetas/${id}`, dataEnviar);
                setMensaje("Receta actualizada correctamente");
            } else {
                await axiosClient.post("/recetas", dataEnviar);
                setMensaje("Receta creada correctamente");
            }

            setTimeout(() => {
                navigate("/recetas");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar la receta médica"
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
            width: "760px",
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
                    {esEdicion ? "Editar Receta Médica" : "Nueva Receta Médica"}
                </h1>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate("/recetas")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarReceta}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    La receta médica debe registrarse sobre un diagnóstico existente dentro del expediente clínico.
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaNotesMedical style={styles.sectionIcon} />
                    Diagnóstico relacionado
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Diagnóstico médico <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="id_diagnostico"
                            value={formData.id_diagnostico}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "700px" }}
                        >
                            <option value="">Seleccione un diagnóstico</option>

                            {diagnosticos.map((diagnostico) => (
                                <option
                                    key={diagnostico.id_diagnostico}
                                    value={diagnostico.id_diagnostico}
                                >
                                    {diagnostico.consulta?.expediente?.numero_expediente} - {diagnostico.consulta?.expediente?.paciente?.nombres} {diagnostico.consulta?.expediente?.paciente?.apellidos} - {diagnostico.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaPrescriptionBottleAlt style={styles.sectionIcon} />
                    Información de la receta
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Código de receta</label>

                        <input
                            name="codigo_receta"
                            value={formData.codigo_receta}
                            onChange={handleChange}
                            placeholder="Ej. REC-2026-0001"
                            style={{ ...styles.input, width: "200px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Medicamentos <span style={styles.required}>*</span>
                        </label>

                        <textarea
                            rows="6"
                            name="medicamentos"
                            value={formData.medicamentos}
                            onChange={handleChange}
                            placeholder="Ej. Amoxicilina 500mg, 1 cápsula cada 8 horas por 7 días"
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Indicaciones</label>

                        <textarea
                            rows="6"
                            name="indicaciones"
                            value={formData.indicaciones}
                            onChange={handleChange}
                            placeholder="Indicaciones específicas para el paciente"
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Instrucciones generales</label>

                        <textarea
                            rows="6"
                            name="instrucciones_generales"
                            value={formData.instrucciones_generales}
                            onChange={handleChange}
                            placeholder="Ej. Tomar con alimentos, evitar alcohol, completar tratamiento"
                            style={{ ...styles.textarea, width: "450px" }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaCalendarAlt style={styles.sectionIcon} />
                    Fechas de la receta
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Fecha emisión</label>

                        <input
                            type="date"
                            name="fecha_emision"
                            value={formData.fecha_emision}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "150px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Fecha vigencia</label>

                        <input
                            type="date"
                            name="fecha_vigencia"
                            value={formData.fecha_vigencia}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "150px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Próxima revisión</label>

                        <input
                            type="date"
                            name="proxima_revision"
                            value={formData.proxima_revision}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "150px" }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    Observaciones generales
                </h2>

                <div style={styles.field}>
                    <label style={styles.label}>Observaciones</label>

                    <textarea
                        rows="4"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        style={{ ...styles.textarea, width: "550px" }}
                    />
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.saveButton} disabled={loading}>
                        <FaSave />
                        {loading
                            ? esEdicion
                                ? "Actualizando..."
                                : "Guardando..."
                            : esEdicion
                                ? "Actualizar receta"
                                : "Guardar receta"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecetaForm;