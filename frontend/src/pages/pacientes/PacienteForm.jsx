import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaUserInjured,
    FaPhoneAlt,
    FaHeartbeat,
    FaShieldAlt,
    FaExclamationCircle
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const PacienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        dpi: "",
        fecha_nacimiento: "",
        sexo: "",
        telefono: "",
        correo: "",
        direccion: "",
        tipo_sangre: "",
        estado_civil: "",
        ocupacion: "",
        contacto_emergencia_nombre: "",
        contacto_emergencia_telefono: "",
        contacto_emergencia_parentesco: "",
        aseguradora: "",
        numero_seguro: "",
        observaciones: "",
        crear_usuario_paciente: false,
        usuario_correo: "",
        usuario_password: "",
        confirmar_password: ""
    });

    const [loading, setLoading] = useState(false);

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {

        const obtenerPaciente = async () => {

            if (!id) return;

            try {

                const response = await axiosClient.get(`/pacientes/${id}`);

                const paciente = response.data;

                setFormData({
                    nombres: paciente.nombres || "",
                    apellidos: paciente.apellidos || "",
                    dpi: paciente.dpi || "",
                    fecha_nacimiento: paciente.fecha_nacimiento
                        ? paciente.fecha_nacimiento.split("T")[0]
                        : "",
                    sexo: paciente.sexo || "",
                    telefono: paciente.telefono || "",
                    correo: paciente.correo || "",
                    direccion: paciente.direccion || "",
                    tipo_sangre: paciente.tipo_sangre || "",
                    estado_civil: paciente.estado_civil || "",
                    ocupacion: paciente.ocupacion || "",
                    contacto_emergencia_nombre:
                        paciente.contacto_emergencia_nombre || "",
                    contacto_emergencia_telefono:
                        paciente.contacto_emergencia_telefono || "",
                    contacto_emergencia_parentesco:
                        paciente.contacto_emergencia_parentesco || "",
                    aseguradora: paciente.aseguradora || "",
                    numero_seguro: paciente.numero_seguro || "",
                    observaciones: paciente.observaciones || ""
                });

            } catch (error) {

                console.error("Error al cargar paciente:", error);

                setMensaje("Error al cargar paciente");

            }

        };

        obtenerPaciente();

    }, [id]);

    const generarCorreoPaciente = (nombres, apellidos) => {
        const limpiarTexto = (texto) => {
            return texto
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s]/g, "")
                .trim()
                .split(/\s+/)[0] || "";
        };

        const primerNombre = limpiarTexto(nombres);
        const primerApellido = limpiarTexto(apellidos);

        if (!primerNombre || !primerApellido) {
            return "";
        }

        return `${primerNombre}.${primerApellido}@pacientesmedicore.com`;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let nuevosDatos = {
            ...formData,
            [name]: type === "checkbox" ? checked : value
        };

        if (
            name === "nombres" ||
            name === "apellidos" ||
            name === "crear_usuario_paciente"
        ) {
            const correoGenerado = generarCorreoPaciente(
                name === "nombres" ? value : nuevosDatos.nombres,
                name === "apellidos" ? value : nuevosDatos.apellidos
            );

            nuevosDatos.usuario_correo =
                nuevosDatos.crear_usuario_paciente
                    ? correoGenerado
                    : "";
        }

        setFormData(nuevosDatos);
    };

    const guardarPaciente = async (e) => {
        e.preventDefault();

        if (
            !formData.nombres ||
            !formData.apellidos ||
            !formData.dpi ||
            !formData.fecha_nacimiento ||
            !formData.sexo ||
            !formData.telefono ||
            !formData.direccion ||
            !formData.tipo_sangre ||
            !formData.contacto_emergencia_nombre ||
            !formData.contacto_emergencia_telefono ||
            !formData.contacto_emergencia_parentesco
        ) {
            alert("Complete todos los campos obligatorios");
            return;
        }

        if (!esEdicion && formData.crear_usuario_paciente) {
            if (
                !formData.usuario_correo ||
                !formData.usuario_password ||
                !formData.confirmar_password
            ) {
                alert("Complete los datos del usuario de acceso");
                return;
            }

            if (formData.usuario_password !== formData.confirmar_password) {
                alert("Las contraseñas del usuario no coinciden");
                return;
            }
        }

        try {
            setLoading(true);

            if (esEdicion) {

                await axiosClient.put(`/pacientes/${id}`, formData);

                setMensaje("Paciente actualizado correctamente");

            } else {

                const response = await axiosClient.post("/pacientes", formData);

                setMensaje(response.data.message || "Paciente registrado correctamente");

            }

            setTimeout(() => {
                navigate("/pacientes");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al registrar paciente"
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
            width: "550px",
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

        accessBox: {
            marginTop: "20px",
            backgroundColor: "#f7f9fc",
            border: "1px solid #dbe3ee",
            borderRadius: "14px",
            padding: "18px",
            width: "fit-content"
        },

        checkboxRow: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#102b5c",
            fontWeight: "bold",
            marginBottom: "16px"
        },

        checkbox: {
            width: "18px",
            height: "18px",
            cursor: "pointer",
            accentColor: "#1f57ac"
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
                    {esEdicion ? "Editar Paciente" : "Nuevo Paciente"}
                </h1>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/pacientes")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarPaciente}>
                <div style={styles.hintBox}>
                    <FaExclamationCircle />
                    Los campos marcados con * son obligatorios para registrar correctamente el paciente.
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaUserInjured style={styles.sectionIcon} />
                    Datos personales
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Nombres <span style={styles.required}>*</span>
                        </label>
                        <input name="nombres" value={formData.nombres} onChange={handleChange} style={{
                            ...styles.input,
                            width: "220px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Apellidos <span style={styles.required}>*</span>
                        </label>
                        <input name="apellidos" value={formData.apellidos} onChange={handleChange} style={{
                            ...styles.input,
                            width: "220px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            DPI <span style={styles.required}>*</span>
                        </label>
                        <input name="dpi" value={formData.dpi} onChange={handleChange} style={{
                            ...styles.input,
                            width: "150px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Fecha nacimiento <span style={styles.required}>*</span>
                        </label>
                        <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} style={{
                            ...styles.input,
                            width: "130px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Sexo <span style={styles.required}>*</span>
                        </label>
                        <select name="sexo" value={formData.sexo} onChange={handleChange} style={{
                            ...styles.input,
                            width: "150px"
                        }}>
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Teléfono <span style={styles.required}>*</span>
                        </label>
                        <input name="telefono" value={formData.telefono} onChange={handleChange} style={{
                            ...styles.input,
                            width: "100px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Correo</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} style={{
                            ...styles.input,
                            width: "200px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Dirección <span style={styles.required}>*</span>
                        </label>
                        <textarea rows="2" name="direccion" value={formData.direccion} onChange={handleChange} style={styles.textarea} />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaHeartbeat style={styles.sectionIcon} />
                    Información médica
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Tipo de sangre <span style={styles.required}>*</span>
                        </label>
                        <select name="tipo_sangre" value={formData.tipo_sangre} onChange={handleChange} style={{
                            ...styles.input,
                            width: "110px"
                        }}>
                            <option value="">Seleccione</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="Desconocido">Desconocido</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Estado civil</label>
                        <select name="estado_civil" value={formData.estado_civil} onChange={handleChange} style={{
                            ...styles.input,
                            width: "110px"
                        }}>
                            <option value="">Seleccione</option>
                            <option value="Soltero/a">Soltero/a</option>
                            <option value="Casado/a">Casado/a</option>
                            <option value="Unido/a">Unido/a</option>
                            <option value="Divorciado/a">Divorciado/a</option>
                            <option value="Viudo/a">Viudo/a</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Ocupación</label>
                        <input name="ocupacion" value={formData.ocupacion} onChange={handleChange} style={{
                            ...styles.input,
                            width: "200px"
                        }} />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaPhoneAlt style={styles.sectionIcon} />
                    Contacto de emergencia
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Nombre contacto <span style={styles.required}>*</span>
                        </label>
                        <input name="contacto_emergencia_nombre" value={formData.contacto_emergencia_nombre} onChange={handleChange} style={{
                            ...styles.input,
                            width: "270px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Teléfono emergencia <span style={styles.required}>*</span>
                        </label>
                        <input name="contacto_emergencia_telefono" value={formData.contacto_emergencia_telefono} onChange={handleChange} style={{
                            ...styles.input,
                            width: "100px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Parentesco <span style={styles.required}>*</span>
                        </label>
                        <select name="contacto_emergencia_parentesco" value={formData.contacto_emergencia_parentesco} onChange={handleChange} style={{
                            ...styles.input,
                            width: "100px"
                        }}>
                            <option value="">Seleccione</option>
                            <option value="Madre">Madre</option>
                            <option value="Padre">Padre</option>
                            <option value="Esposo/a">Esposo/a</option>
                            <option value="Hijo/a">Hijo/a</option>
                            <option value="Hermano/a">Hermano/a</option>
                            <option value="Familiar">Familiar</option>
                            <option value="Amigo/a">Amigo/a</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaShieldAlt style={styles.sectionIcon} />
                    Seguro y aseguradora
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Aseguradora</label>
                        <input name="aseguradora" value={formData.aseguradora} onChange={handleChange} style={{
                            ...styles.input,
                            width: "150px"
                        }} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Número seguro</label>
                        <input name="numero_seguro" value={formData.numero_seguro} onChange={handleChange} style={{
                            ...styles.input,
                            width: "150px"
                        }} />
                    </div>
                </div>
                {!esEdicion && (
                    <>
                        <h2 style={styles.sectionTitle}>
                            <FaShieldAlt style={styles.sectionIcon} />
                            Usuario de acceso del paciente
                        </h2>

                        <div style={styles.accessBox}>
                            <label style={styles.checkboxRow}>
                                <input
                                    type="checkbox"
                                    name="crear_usuario_paciente"
                                    checked={formData.crear_usuario_paciente}
                                    onChange={handleChange}
                                    style={styles.checkbox}
                                />
                                Crear usuario de acceso para este paciente
                            </label>

                            {formData.crear_usuario_paciente && (
                                <div style={styles.grid}>
                                    <div style={styles.field}>
                                        <label style={styles.label}>
                                            Correo de acceso <span style={styles.required}>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            name="usuario_correo"
                                            value={formData.usuario_correo}
                                            readOnly
                                            style={{
                                                ...styles.input,
                                                width: "300px",
                                                backgroundColor: "#eef3fb",
                                                color: "#102b5c",
                                                fontWeight: "600"
                                            }}
                                        />
                                    </div>

                                    <div style={styles.field}>
                                        <label style={styles.label}>
                                            Contraseña temporal <span style={styles.required}>*</span>
                                        </label>

                                        <input
                                            type="password"
                                            name="usuario_password"
                                            value={formData.usuario_password}
                                            onChange={handleChange}
                                            style={{
                                                ...styles.input,
                                                width: "180px"
                                            }}
                                        />
                                    </div>

                                    <div style={styles.field}>
                                        <label style={styles.label}>
                                            Confirmar contraseña <span style={styles.required}>*</span>
                                        </label>

                                        <input
                                            type="password"
                                            name="confirmar_password"
                                            value={formData.confirmar_password}
                                            onChange={handleChange}
                                            style={{
                                                ...styles.input,
                                                width: "180px"
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <h2 style={styles.sectionTitle}>
                    Observaciones generales
                </h2>

                <div style={styles.field}>
                    <label style={styles.label}>Observaciones</label>
                    <textarea rows="2" name="observaciones" value={formData.observaciones} onChange={handleChange} style={{
                        ...styles.input,
                        width: "400px"
                    }} />
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.saveButton} disabled={loading}>
                        <FaSave />
                        {loading
                            ? esEdicion
                                ? "Actualizando..."
                                : "Guardando..."
                            : esEdicion
                                ? "Actualizar paciente"
                                : "Guardar paciente"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PacienteForm;