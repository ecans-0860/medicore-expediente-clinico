import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaCalendarAlt,
    FaUserInjured,
    FaUserMd,
    FaNotesMedical,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const CitaForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const { usuario } = useAuth();
    const esPaciente = usuario?.rol === "PACIENTE";

    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);

    const [formData, setFormData] = useState({
        id_paciente: "",
        id_usuario: "",
        fecha_hora: "",
        motivo: "",
        tipo_cita: "GENERAL",
        modalidad: "PRESENCIAL",
        prioridad: "MEDIA",
        sintomas: "",
        observaciones: "",
        estado: "PENDIENTE"
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        if (!esPaciente) {
            cargarPacientes();
        }

        cargarMedicos();

        if (esEdicion) {
            cargarCita();
        }
    }, [id]);

    const cargarPacientes = async () => {
        try {
            const res = await axiosClient.get("/pacientes");
            setPacientes(res.data);
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            setMensaje("Error al cargar pacientes");
        }
    };

    const cargarMedicos = async () => {
        try {
            const res = await axiosClient.get("/usuarios/medicos");

            console.log("MEDICOS:", res.data);

            setMedicos(res.data);
        } catch (error) {
            console.error("Error al cargar médicos:", error);
            setMensaje("Error al cargar médicos");
        }
    };

    const cargarCita = async () => {
        try {
            const res = await axiosClient.get(`/citas/${id}`);
            const cita = res.data;

            setFormData({
                id_paciente: cita.id_paciente || "",
                id_usuario: cita.id_usuario || "",
                fecha_hora: cita.fecha_hora
                    ? cita.fecha_hora.slice(0, 16)
                    : "",
                motivo: cita.motivo || "",
                tipo_cita: cita.tipo_cita || "GENERAL",
                modalidad: cita.modalidad || "PRESENCIAL",
                prioridad: cita.prioridad || "MEDIA",
                sintomas: cita.sintomas || "",
                observaciones: cita.observaciones || "",
                estado: cita.estado || "PENDIENTE"
            });
        } catch (error) {
            console.error("Error al cargar cita:", error);
            setMensaje("Error al cargar cita médica");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const guardarCita = async (e) => {
        e.preventDefault();

        if (
            (!esPaciente && !formData.id_paciente) ||
            !formData.id_usuario ||
            !formData.fecha_hora ||
            !formData.motivo
        ) {
            alert(
                esPaciente
                    ? "Complete médico, fecha/hora y motivo de la cita"
                    : "Complete paciente, médico, fecha/hora y motivo de la cita"
            );
            return;
        }

        const dataEnviar = {
            ...formData,
            id_usuario: Number(formData.id_usuario),
            estado: esPaciente ? "PENDIENTE" : formData.estado
        };

        if (!esPaciente) {
            dataEnviar.id_paciente = Number(formData.id_paciente);
        }

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/citas/${id}`, dataEnviar);
                setMensaje("Cita médica actualizada correctamente");
            } else {
                await axiosClient.post("/citas", dataEnviar);
                setMensaje("Cita médica creada correctamente");
            }

            setTimeout(() => {
                navigate(esPaciente ? "/paciente/citas" : "/citas");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar la cita médica"
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
                    {esEdicion ? "Editar Cita Médica" : "Nueva Cita Médica"}
                </h1>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() =>
                        navigate(
                            esPaciente
                                ? "/paciente/citas"
                                : "/citas"
                        )
                    }
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarCita}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    {esPaciente
                        ? "Seleccione un médico y un horario disponible para programar su cita."
                        : "La cita debe asignarse a un paciente, un médico y un horario disponible."
                    }
                </div>

                {!esPaciente && (
                    <>
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
                                    style={{ ...styles.input, width: "380px" }}
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
                        </div>
                    </>
                )}
                {esPaciente && (
                    <>
                        <h2 style={styles.sectionTitle}>
                            <FaUserInjured style={styles.sectionIcon} />
                            Paciente relacionado
                        </h2>

                        <div style={styles.grid}>
                            <div
                                style={{
                                    backgroundColor: "#f7f9fc",
                                    border: "1px solid #e1e7f0",
                                    borderRadius: "12px",
                                    padding: "14px 18px",
                                    color: "#102b5c",
                                    fontWeight: "bold",
                                    width: "380px"
                                }}
                            >
                                {usuario?.nombre_completo || "Paciente autenticado"}
                            </div>
                        </div>
                    </>
                )}

                <h2 style={styles.sectionTitle}>
                    <FaUserMd style={styles.sectionIcon} />
                    Médico y horario
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Médico <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="id_usuario"
                            value={formData.id_usuario}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "340px" }}
                        >
                            <option value="">Seleccione un médico</option>

                            {medicos.map((medico) => (
                                <option
                                    key={medico.id_usuario}
                                    value={medico.id_usuario}
                                >
                                    {medico.nombre_completo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Fecha y hora <span style={styles.required}>*</span>
                        </label>

                        <input
                            type="datetime-local"
                            name="fecha_hora"
                            value={formData.fecha_hora}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "210px" }}
                        />
                    </div>

                    {!esPaciente && (
                        <div style={styles.field}>
                            <label style={styles.label}>Estado</label>

                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                style={{ ...styles.input, width: "160px" }}
                            >
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="CONFIRMADA">CONFIRMADA</option>
                                <option value="ATENDIDA">ATENDIDA</option>
                                <option value="CANCELADA">CANCELADA</option>
                            </select>
                        </div>
                    )}
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaCalendarAlt style={styles.sectionIcon} />
                    Información de la cita
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Tipo de cita</label>

                        <select
                            name="tipo_cita"
                            value={formData.tipo_cita}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "170px" }}
                        >
                            <option value="GENERAL">GENERAL</option>
                            <option value="CONTROL">CONTROL</option>
                            <option value="SEGUIMIENTO">SEGUIMIENTO</option>
                            <option value="EMERGENCIA">EMERGENCIA</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Modalidad</label>

                        <select
                            name="modalidad"
                            value={formData.modalidad}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "170px" }}
                        >
                            <option value="PRESENCIAL">PRESENCIAL</option>
                            <option value="VIRTUAL">VIRTUAL</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Prioridad</label>

                        <select
                            name="prioridad"
                            value={formData.prioridad}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "150px" }}
                        >
                            <option value="BAJA">BAJA</option>
                            <option value="MEDIA">MEDIA</option>
                            <option value="ALTA">ALTA</option>
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaNotesMedical style={styles.sectionIcon} />
                    Motivo y detalle clínico
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Motivo de la cita <span style={styles.required}>*</span>
                        </label>

                        <textarea
                            rows="3"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "500px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Síntomas reportados</label>

                        <textarea
                            rows="3"
                            name="sintomas"
                            value={formData.sintomas}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "500px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Observaciones</label>

                        <textarea
                            rows="3"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            style={{ ...styles.textarea, width: "500px" }}
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
                                ? "Actualizar cita"
                                : "Guardar cita"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CitaForm;