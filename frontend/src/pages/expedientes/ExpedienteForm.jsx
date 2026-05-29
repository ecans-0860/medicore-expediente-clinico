import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaFolderOpen,
    FaUserInjured,
    FaClipboardList,
    FaExclamationCircle,
    FaPlus,
    FaTrash
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

    const [antecedentes, setAntecedentes] = useState([]);
    const [alergias, setAlergias] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [habitos, setHabitos] = useState([]);
    const [vacunas, setVacunas] = useState([]);
    const [documentos, setDocumentos] = useState([]);

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

            setAntecedentes(expediente.antecedentes || []);
            setAlergias(expediente.alergias || []);
            setMedicamentos(expediente.medicamentos_actuales || []);
            setHabitos(expediente.habitos || []);
            setVacunas(expediente.vacunas || []);
            setDocumentos(expediente.documentos_clinicos || []);

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

    const actualizarLista = (lista, setLista, index, campo, valor) => {
        const nuevaLista = [...lista];

        nuevaLista[index] = {
            ...nuevaLista[index],
            [campo]: valor
        };

        setLista(nuevaLista);
    };

    const eliminarItem = (lista, setLista, index) => {
        setLista(lista.filter((_, i) => i !== index));
    };

    const guardarExpediente = async (e) => {
        e.preventDefault();

        if (!formData.id_paciente || !formData.motivo_apertura) {
            alert("Seleccione un paciente e ingrese el motivo de apertura");
            return;
        }

        const form = new FormData();

        form.append("id_paciente", formData.id_paciente);
        form.append("motivo_apertura", formData.motivo_apertura);
        form.append("observaciones", formData.observaciones || "");
        form.append("estado", formData.estado);

        form.append("antecedentes", JSON.stringify(antecedentes));
        form.append("alergias", JSON.stringify(alergias));
        form.append("medicamentos_actuales", JSON.stringify(medicamentos));
        form.append("habitos", JSON.stringify(habitos));
        form.append("vacunas", JSON.stringify(vacunas));

        const documentosSinArchivo = documentos.map((doc) => ({
            nombre: doc.nombre,
            tipo: doc.tipo,
            archivo_url: doc.archivo_url || null,
            descripcion: doc.descripcion,
            estado: doc.estado || "ACTIVO"
        }));

        form.append("documentos_clinicos", JSON.stringify(documentosSinArchivo));

        documentos.forEach((doc) => {
            if (doc.archivo) {
                form.append("documentos_clinicos", doc.archivo);
            }
        });

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/expedientes/${id}`, form);
                setMensaje("Expediente actualizado correctamente");
            } else {
                await axiosClient.post("/expedientes", form);
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
            maxWidth: "760px",
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
        clinicalCard: {
            backgroundColor: "#f9fbfe",
            border: "1px solid #e1e7f0",
            borderRadius: "14px",
            padding: "18px",
            width: "1100px",
            marginBottom: "18px"
        },
        clinicalHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px"
        },
        clinicalTitle: {
            color: "#102b5c",
            fontSize: "17px",
            margin: 0
        },
        addSmallButton: {
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            border: "none",
            borderRadius: "9px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px"
        },
        removeButton: {
            backgroundColor: "#eb5757",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            width: "38px",
            height: "38px",
            cursor: "pointer"
        },
        itemBox: {
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            alignItems: "flex-end",
            marginBottom: "14px",
            padding: "14px",
            backgroundColor: "#ffffff",
            border: "1px solid #edf1f7",
            borderRadius: "12px"
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
            {mensaje && <div style={styles.popup}>{mensaje}</div>}

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
                        <label style={styles.label}>Estado expediente</label>

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
                        <label style={styles.label}>Observaciones</label>

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
                    Información clínica inicial
                </h2>

                <div style={styles.hintBox}>
                    Registre antecedentes, alergias, medicamentos, hábitos, vacunas y documentos clínicos iniciales del paciente.
                </div>

                <div style={styles.clinicalCard}>
                    <div style={styles.clinicalHeader}>
                        <h3 style={styles.clinicalTitle}>Antecedentes médicos</h3>

                        <button
                            type="button"
                            style={styles.addSmallButton}
                            onClick={() =>
                                setAntecedentes([
                                    ...antecedentes,
                                    {
                                        tipo: "",
                                        descripcion: "",
                                        observaciones: "",
                                        estado: "ACTIVO"
                                    }
                                ])
                            }
                        >
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                    {antecedentes.map((item, index) => (
                        <div key={index} style={styles.itemBox}>
                            <div style={styles.field}>
                                <label style={styles.label}>Tipo</label>
                                <select
                                    value={item.tipo || ""}
                                    onChange={(e) =>
                                        actualizarLista(antecedentes, setAntecedentes, index, "tipo", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "120px" }}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="PATOLOGICO">Patológico</option>
                                    <option value="FAMILIAR">Familiar</option>
                                    <option value="QUIRURGICO">Quirúrgico</option>
                                    <option value="TRAUMATICO">Traumático</option>
                                    <option value="CRONICO">Crónico</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Descripción</label>
                                <input
                                    value={item.descripcion || ""}
                                    onChange={(e) =>
                                        actualizarLista(antecedentes, setAntecedentes, index, "descripcion", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "290px" }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Observaciones</label>
                                <input
                                    value={item.observaciones || ""}
                                    onChange={(e) =>
                                        actualizarLista(antecedentes, setAntecedentes, index, "observaciones", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "290px" }}
                                />
                            </div>

                            <button
                                type="button"
                                style={styles.removeButton}
                                onClick={() => eliminarItem(antecedentes, setAntecedentes, index)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={styles.clinicalCard}>
                    <div style={styles.clinicalHeader}>
                        <h3 style={styles.clinicalTitle}>Alergias</h3>

                        <button
                            type="button"
                            style={styles.addSmallButton}
                            onClick={() =>
                                setAlergias([
                                    ...alergias,
                                    {
                                        sustancia: "",
                                        reaccion: "",
                                        severidad: "",
                                        observaciones: "",
                                        estado: "ACTIVO"
                                    }
                                ])
                            }
                        >
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                    {alergias.map((item, index) => (
                        <div key={index} style={styles.itemBox}>
                            <div style={styles.field}>
                                <label style={styles.label}>Sustancia</label>
                                <input
                                    value={item.sustancia || ""}
                                    onChange={(e) =>
                                        actualizarLista(alergias, setAlergias, index, "sustancia", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "120px" }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Reacción</label>
                                <input
                                    value={item.reaccion || ""}
                                    onChange={(e) =>
                                        actualizarLista(alergias, setAlergias, index, "reaccion", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "180px" }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Severidad</label>
                                <select
                                    value={item.severidad || ""}
                                    onChange={(e) =>
                                        actualizarLista(alergias, setAlergias, index, "severidad", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "120px" }}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="LEVE">Leve</option>
                                    <option value="MODERADA">Moderada</option>
                                    <option value="GRAVE">Grave</option>
                                    <option value="CRITICA">Crítica</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Observaciones</label>
                                <input
                                    value={item.observaciones || ""}
                                    onChange={(e) =>
                                        actualizarLista(alergias, setAlergias, index, "observaciones", e.target.value)
                                    }
                                    style={{ ...styles.input, width: "260px" }}
                                />
                            </div>

                            <button
                                type="button"
                                style={styles.removeButton}
                                onClick={() => eliminarItem(alergias, setAlergias, index)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={styles.clinicalCard}>
                    <div style={styles.clinicalHeader}>
                        <h3 style={styles.clinicalTitle}>Medicamentos actuales</h3>

                        <button
                            type="button"
                            style={styles.addSmallButton}
                            onClick={() =>
                                setMedicamentos([
                                    ...medicamentos,
                                    {
                                        nombre: "",
                                        dosis: "",
                                        frecuencia: "",
                                        via: "",
                                        observaciones: "",
                                        estado: "ACTIVO"
                                    }
                                ])
                            }
                        >
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                    {medicamentos.map((item, index) => (
                        <div key={index} style={styles.itemBox}>

                            <div style={styles.field}>
                                <label style={styles.label}>Nombre</label>

                                <input
                                    placeholder="Nombre"
                                    value={item.nombre || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            medicamentos,
                                            setMedicamentos,
                                            index,
                                            "nombre",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "120px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Dosis</label>

                                <input
                                    placeholder="Dosis"
                                    value={item.dosis || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            medicamentos,
                                            setMedicamentos,
                                            index,
                                            "dosis",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "90px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Frecuencia</label>

                                <input
                                    placeholder="Frecuencia"
                                    value={item.frecuencia || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            medicamentos,
                                            setMedicamentos,
                                            index,
                                            "frecuencia",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "150px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Vía</label>

                                <select
                                    value={item.via || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            medicamentos,
                                            setMedicamentos,
                                            index,
                                            "via",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "125px"
                                    }}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="ORAL">Oral</option>
                                    <option value="INTRAVENOSA">Intravenosa</option>
                                    <option value="INTRAMUSCULAR">Intramuscular</option>
                                    <option value="SUBCUTANEA">Subcutánea</option>
                                    <option value="TOPICA">Tópica</option>
                                    <option value="INHALATORIA">Inhalatoria</option>
                                    <option value="OTRA">Otra</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Observaciones</label>

                                <input
                                    placeholder="Observaciones"
                                    value={item.observaciones || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            medicamentos,
                                            setMedicamentos,
                                            index,
                                            "observaciones",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "260px"
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                style={styles.removeButton}
                                onClick={() =>
                                    eliminarItem(
                                        medicamentos,
                                        setMedicamentos,
                                        index
                                    )
                                }
                            >
                                <FaTrash />
                            </button>

                        </div>
                    ))}
                </div>

                <div style={styles.clinicalCard}>
                    <div style={styles.clinicalHeader}>
                        <h3 style={styles.clinicalTitle}>Hábitos del paciente</h3>

                        <button
                            type="button"
                            style={styles.addSmallButton}
                            onClick={() =>
                                setHabitos([
                                    ...habitos,
                                    {
                                        tipo: "",
                                        descripcion: "",
                                        frecuencia: "",
                                        estado: "ACTIVO"
                                    }
                                ])
                            }
                        >
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                    {habitos.map((item, index) => (
                        <div key={index} style={styles.itemBox}>

                            <div style={styles.field}>
                                <label style={styles.label}>Tipo</label>

                                <select
                                    value={item.tipo || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            habitos,
                                            setHabitos,
                                            index,
                                            "tipo",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "130px"
                                    }}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="TABACO">Tabaco</option>
                                    <option value="ALCOHOL">Alcohol</option>
                                    <option value="ACTIVIDAD_FISICA">Actividad física</option>
                                    <option value="ALIMENTACION">Alimentación</option>
                                    <option value="SUEÑO">Sueño</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Descripción</label>

                                <input
                                    placeholder="Descripción"
                                    value={item.descripcion || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            habitos,
                                            setHabitos,
                                            index,
                                            "descripcion",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "260px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Frecuencia</label>

                                <input
                                    placeholder="Frecuencia"
                                    value={item.frecuencia || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            habitos,
                                            setHabitos,
                                            index,
                                            "frecuencia",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "150px"
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                style={styles.removeButton}
                                onClick={() =>
                                    eliminarItem(
                                        habitos,
                                        setHabitos,
                                        index
                                    )
                                }
                            >
                                <FaTrash />
                            </button>

                        </div>
                    ))}
                </div>

                <div style={styles.clinicalCard}>
                    <div style={styles.clinicalHeader}>
                        <h3 style={styles.clinicalTitle}>Vacunas</h3>

                        <button
                            type="button"
                            style={styles.addSmallButton}
                            onClick={() =>
                                setVacunas([
                                    ...vacunas,
                                    {
                                        nombre: "",
                                        dosis: "",
                                        fecha_aplicacion: "",
                                        observaciones: "",
                                        estado: "ACTIVO"
                                    }
                                ])
                            }
                        >
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                    {vacunas.map((item, index) => (
                        <div key={index} style={styles.itemBox}>

                            <div style={styles.field}>
                                <label style={styles.label}>Nombre</label>

                                <input
                                    placeholder="Nombre"
                                    value={item.nombre || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            vacunas,
                                            setVacunas,
                                            index,
                                            "nombre",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "150px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}></label>

                                <input
                                    placeholder="Dosis"
                                    value={item.dosis || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            vacunas,
                                            setVacunas,
                                            index,
                                            "dosis",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "90px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Fecha aplicación</label>

                                <input
                                    type="date"
                                    value={
                                        item.fecha_aplicacion
                                            ? item.fecha_aplicacion.toString().slice(0, 10)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        actualizarLista(
                                            vacunas,
                                            setVacunas,
                                            index,
                                            "fecha_aplicacion",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "130px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Observaciones</label>

                                <input
                                    placeholder="Observaciones"
                                    value={item.observaciones || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            vacunas,
                                            setVacunas,
                                            index,
                                            "observaciones",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "260px"
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                style={styles.removeButton}
                                onClick={() =>
                                    eliminarItem(
                                        vacunas,
                                        setVacunas,
                                        index
                                    )
                                }
                            >
                                <FaTrash />
                            </button>

                        </div>
                    ))}
                </div>

                <div style={styles.clinicalCard}>
                    <div style={styles.clinicalHeader}>
                        <h3 style={styles.clinicalTitle}>Documentos clínicos</h3>

                        <button
                            type="button"
                            style={styles.addSmallButton}
                            onClick={() =>
                                setDocumentos([
                                    ...documentos,
                                    {
                                        nombre: "",
                                        tipo: "",
                                        archivo_url: "",
                                        descripcion: "",
                                        estado: "ACTIVO"
                                    }
                                ])
                            }
                        >
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                    {documentos.map((item, index) => (
                        <div key={index} style={styles.itemBox}>

                            <div style={styles.field}>
                                <label style={styles.label}>Nombre</label>

                                <input
                                    placeholder="Nombre"
                                    value={item.nombre || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            documentos,
                                            setDocumentos,
                                            index,
                                            "nombre",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "180px"
                                    }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Tipo</label>

                                <select
                                    value={item.tipo || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            documentos,
                                            setDocumentos,
                                            index,
                                            "tipo",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "150px"
                                    }}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="PDF">PDF</option>
                                    <option value="IMAGEN">Imagen</option>
                                    <option value="LABORATORIO">Laboratorio</option>
                                    <option value="RADIOGRAFIA">Radiografía</option>
                                    <option value="RECETA">Receta</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Archivo</label>

                                <div
                                    onClick={() => document.getElementById(`archivo-${index}`).click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();

                                        const file = e.dataTransfer.files[0];

                                        if (file) {
                                            actualizarLista(
                                                documentos,
                                                setDocumentos,
                                                index,
                                                "archivo",
                                                file
                                            );
                                        }
                                    }}
                                    style={{
                                        width: "260px",
                                        height: "42px",
                                        border: item.archivo
                                            ? "2px dashed #16a34a"
                                            : "2px dashed #3b82f6",

                                        backgroundColor: item.archivo
                                            ? "#f0fdf4"
                                            : "#f8fbff",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        color: "#0b2c5f",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        padding: "8px"
                                    }}
                                >
                                    <div
                                        style={{
                                            color: item.archivo ? "#16a34a" : "#0b2c5f",
                                            fontWeight: "700",
                                            fontSize: "13px"
                                        }}
                                    >
                                        {item.archivo
                                            ? "Archivo subido correctamente"
                                            : "Arrastre o seleccione archivo"}
                                    </div>

                                    <input
                                        id={`archivo-${index}`}
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) =>
                                            actualizarLista(
                                                documentos,
                                                setDocumentos,
                                                index,
                                                "archivo",
                                                e.target.files[0]
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Descripción</label>

                                <input
                                    placeholder="Descripción"
                                    value={item.descripcion || ""}
                                    onChange={(e) =>
                                        actualizarLista(
                                            documentos,
                                            setDocumentos,
                                            index,
                                            "descripcion",
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        ...styles.input,
                                        width: "260px"
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                style={styles.removeButton}
                                onClick={() =>
                                    eliminarItem(
                                        documentos,
                                        setDocumentos,
                                        index
                                    )
                                }
                            >
                                <FaTrash />
                            </button>

                        </div>
                    ))}
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