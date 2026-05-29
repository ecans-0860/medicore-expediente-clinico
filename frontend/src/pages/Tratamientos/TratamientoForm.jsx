import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaPills,
    FaNotesMedical,
    FaCalendarAlt,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const TratamientoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [diagnosticos, setDiagnosticos] = useState([]);

    const [formData, setFormData] = useState({
        id_diagnostico: "",
        nombre: "",
        descripcion: "",
        indicaciones: "",
        tipo: "FARMACOLÓGICO",
        dosis: "",
        frecuencia: "",
        duracion: "",
        via: "",
        fecha_inicio: "",
        fecha_fin: "",
        observaciones: ""
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarDiagnosticos();

        if (esEdicion) {
            cargarTratamiento();
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

    const cargarTratamiento = async () => {
        try {
            const res = await axiosClient.get(`/tratamientos/${id}`);
            const tratamiento = res.data;

            setFormData({
                id_diagnostico: tratamiento.id_diagnostico || "",
                nombre: tratamiento.nombre || "",
                descripcion: tratamiento.descripcion || "",
                indicaciones: tratamiento.indicaciones || "",
                tipo: tratamiento.tipo || "FARMACOLÓGICO",
                dosis: tratamiento.dosis || "",
                frecuencia: tratamiento.frecuencia || "",
                duracion: tratamiento.duracion || "",
                via: tratamiento.via || "",
                fecha_inicio: tratamiento.fecha_inicio
                    ? tratamiento.fecha_inicio.split("T")[0]
                    : "",
                fecha_fin: tratamiento.fecha_fin
                    ? tratamiento.fecha_fin.split("T")[0]
                    : "",
                observaciones: tratamiento.observaciones || ""
            });

        } catch (error) {
            console.error("Error al cargar tratamiento:", error);
            setMensaje("Error al cargar tratamiento médico");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const guardarTratamiento = async (e) => {
        e.preventDefault();

        if (!formData.id_diagnostico || !formData.descripcion) {
            alert("Seleccione un diagnóstico e ingrese la descripción del tratamiento");
            return;
        }

        const dataEnviar = {
            ...formData,
            id_diagnostico: Number(formData.id_diagnostico),
            fecha_inicio: formData.fecha_inicio || null,
            fecha_fin: formData.fecha_fin || null
        };

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/tratamientos/${id}`, formData);
                setMensaje("Tratamiento actualizado correctamente");
            } else {
                await axiosClient.post("/tratamientos", formData);
                setMensaje("Tratamiento creado correctamente");
            }

            setTimeout(() => {
                navigate("/tratamientos");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar el tratamiento"
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
                    {esEdicion ? "Editar Tratamiento Médico" : "Nuevo Tratamiento Médico"}
                </h1>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate("/tratamientos")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarTratamiento}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    El tratamiento debe registrarse sobre un diagnóstico médico existente.
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
                            style={{ ...styles.input, width: "650px" }}
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
                    <FaPills style={styles.sectionIcon} />
                    Información del tratamiento
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Nombre del tratamiento</label>

                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej. Tratamiento antibiótico"
                            style={{ ...styles.input, width: "300px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Tipo de tratamiento</label>

                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "190px" }}
                        >
                            <option value="FARMACOLÓGICO">FARMACOLÓGICO</option>
                            <option value="TERAPÉUTICO">TERAPÉUTICO</option>
                            <option value="QUIRÚRGICO">QUIRÚRGICO</option>
                            <option value="PREVENTIVO">PREVENTIVO</option>
                            <option value="REHABILITACIÓN">REHABILITACIÓN</option>
                            <option value="CONTROL">CONTROL</option>
                            <option value="OTRO">OTRO</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Descripción <span style={styles.required}>*</span>
                        </label>

                        <textarea
                            rows="3"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "550px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Indicaciones</label>

                        <textarea
                            rows="3"
                            name="indicaciones"
                            value={formData.indicaciones}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "550px" }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaNotesMedical style={styles.sectionIcon} />
                    Detalle clínico
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Dosis</label>

                        <input
                            name="dosis"
                            value={formData.dosis}
                            onChange={handleChange}
                            placeholder="Ej. 500 mg"
                            style={{ ...styles.input, width: "140px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Frecuencia</label>

                        <input
                            name="frecuencia"
                            value={formData.frecuencia}
                            onChange={handleChange}
                            placeholder="Ej. Cada 8 horas"
                            style={{ ...styles.input, width: "180px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Duración</label>

                        <input
                            name="duracion"
                            value={formData.duracion}
                            onChange={handleChange}
                            placeholder="Ej. 7 días"
                            style={{ ...styles.input, width: "140px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Vía</label>

                        <select
                            name="via"
                            value={formData.via}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "160px" }}
                        >
                            <option value="">Seleccione</option>
                            <option value="Oral">Oral</option>
                            <option value="Intravenosa">Intravenosa</option>
                            <option value="Intramuscular">Intramuscular</option>
                            <option value="Subcutánea">Subcutánea</option>
                            <option value="Tópica">Tópica</option>
                            <option value="Inhalada">Inhalada</option>
                            <option value="Oftálmica">Oftálmica</option>
                            <option value="Ótica">Ótica</option>
                            <option value="Otra">Otra</option>
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaCalendarAlt style={styles.sectionIcon} />
                    Fechas del tratamiento
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Fecha inicio</label>

                        <input
                            type="date"
                            name="fecha_inicio"
                            value={formData.fecha_inicio}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "150px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Fecha fin</label>

                        <input
                            type="date"
                            name="fecha_fin"
                            value={formData.fecha_fin}
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
                        rows="3"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        style={{ ...styles.textarea, width: "520px" }}
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
                                ? "Actualizar tratamiento"
                                : "Guardar tratamiento"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TratamientoForm;