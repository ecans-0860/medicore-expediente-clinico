import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
    FaArrowLeft,
    FaEdit,
    FaUserInjured,
    FaUserMd,
    FaClipboardList,
    FaStethoscope,
    FaNotesMedical,
    FaPrescriptionBottleAlt,
    FaCalendarAlt,
    FaFileMedical
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logos/medicore-Copy.png";

const RecetaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();

    const esPaciente = usuario?.rol === "PACIENTE";

    const rutaVolver =
        esPaciente
            ? "/paciente/recetas"
            : "/recetas";

    const [receta, setReceta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarReceta();
    }, []);

    const cargarReceta = async () => {
        try {
            const res = await axiosClient.get(`/recetas/${id}`);
            setReceta(res.data);
        } catch (error) {
            console.error("Error al cargar receta:", error);
        } finally {
            setLoading(false);
        }
    };

    const mostrarDato = (valor) => {
        return valor && valor !== "" ? valor : "Sin información";
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Sin fecha";

        return new Date(fecha).toLocaleDateString("es-GT", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const descargarPDFReceta = async () => {
        const input = document.getElementById("receta-pdf");

        if (!input) return;

        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        heightLeft -= pdfHeight;

        while (heightLeft > 5) {
            position = heightLeft - imgHeight;

            pdf.addPage();

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

            heightLeft -= pdfHeight;
        }

        pdf.save(`Receta-${receta.codigo_receta}.pdf`);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <p>Cargando receta médica...</p>
            </div>
        );
    }

    if (!receta) {
        return (
            <div style={styles.loadingContainer}>
                <p>No se encontró la receta médica.</p>
            </div>
        );
    }

    const diagnostico = receta.diagnostico;
    const consulta = diagnostico?.consulta;
    const expediente = consulta?.expediente;
    const paciente = expediente?.paciente;
    const medico = consulta?.usuarioMedico;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button
                    style={styles.btnVolver}
                    onClick={() => navigate(rutaVolver)}
                >
                    <FaArrowLeft />
                    Volver
                </button>

                <div>
                    <h1 style={styles.title}>Receta Médica</h1>

                    <p style={styles.subtitle}>
                        Visualización clínica detallada de la prescripción médica.
                    </p>
                </div>

                <button
                    style={styles.btnPDF}
                    onClick={descargarPDFReceta}
                >
                    <FaFileMedical />
                    Descargar PDF
                </button>

                {!esPaciente && (
                    <button
                        style={styles.btnEditar}
                        onClick={() => navigate(`/recetas/editar/${receta.id_receta}`)}
                    >
                        <FaEdit />
                        Editar
                    </button>
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaFileMedical />
                    <h2>Información General</h2>
                </div>

                <div style={styles.grid}>
                    <div style={styles.infoBox}>
                        <FaUserInjured style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>Paciente</span>
                            <p style={styles.value}>
                                {paciente
                                    ? `${paciente.nombres} ${paciente.apellidos}`
                                    : "Paciente no registrado"}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaUserMd style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>Médico</span>
                            <p style={styles.value}>
                                {mostrarDato(medico?.nombre_completo)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaClipboardList style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>Expediente</span>
                            <p style={styles.value}>
                                {mostrarDato(expediente?.numero_expediente)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <FaStethoscope style={styles.iconBlue} />

                        <div>
                            <span style={styles.label}>Consulta</span>
                            <p style={styles.value}>
                                {formatearFecha(consulta?.fecha_consulta)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaPrescriptionBottleAlt />
                    <h2>Receta</h2>
                </div>

                <div style={styles.badgeRow}>
                    <span
                        style={
                            receta.estado === "ACTIVA"
                                ? styles.estadoActivo
                                : styles.estadoInactivo
                        }
                    >
                        {receta.estado}
                    </span>

                    <span style={styles.badge}>
                        Código: {mostrarDato(receta.codigo_receta)}
                    </span>

                    <span style={styles.badge}>
                        Emisión: {formatearFecha(receta.fecha_emision)}
                    </span>

                    <span style={styles.badge}>
                        Vigencia: {formatearFecha(receta.fecha_vigencia)}
                    </span>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Medicamentos prescritos</h3>
                    <p style={styles.text}>
                        {mostrarDato(receta.medicamentos)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Indicaciones</h3>
                    <p style={styles.text}>
                        {mostrarDato(receta.indicaciones)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Instrucciones generales</h3>
                    <p style={styles.text}>
                        {mostrarDato(receta.instrucciones_generales)}
                    </p>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaCalendarAlt />
                    <h2>Seguimiento de la receta</h2>
                </div>

                <div style={styles.grid}>
                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Fecha de emisión</span>
                            <p style={styles.value}>
                                {formatearFecha(receta.fecha_emision)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Fecha de vigencia</span>
                            <p style={styles.value}>
                                {formatearFecha(receta.fecha_vigencia)}
                            </p>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div>
                            <span style={styles.label}>Próxima revisión</span>
                            <p style={styles.value}>
                                {formatearFecha(receta.proxima_revision)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaNotesMedical />
                    <h2>Diagnóstico relacionado</h2>
                </div>

                <div style={styles.badgeRow}>
                    <span
                        style={
                            diagnostico?.estado === "ACTIVO"
                                ? styles.estadoActivo
                                : styles.estadoInactivo
                        }
                    >
                        {mostrarDato(diagnostico?.estado)}
                    </span>

                    <span style={styles.badge}>
                        Tipo: {mostrarDato(diagnostico?.tipo)}
                    </span>

                    <span style={styles.badge}>
                        CIE-10: {mostrarDato(diagnostico?.codigo_cie10)}
                    </span>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Descripción del diagnóstico</h3>
                    <p style={styles.text}>
                        {mostrarDato(diagnostico?.descripcion)}
                    </p>
                </div>

                <div style={styles.item}>
                    <h3 style={styles.itemTitle}>Observaciones del diagnóstico</h3>
                    <p style={styles.text}>
                        {mostrarDato(diagnostico?.observaciones)}
                    </p>
                </div>
            </div>

            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Consulta relacionada</h2>

                <div style={styles.section}>
                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>Motivo de consulta</h3>
                        <p style={styles.text}>
                            {mostrarDato(consulta?.motivo)}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>Impresión clínica</h3>
                        <p style={styles.text}>
                            {mostrarDato(consulta?.impresion_clinica)}
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h3 style={styles.itemTitle}>Plan médico</h3>
                        <p style={styles.text}>
                            {mostrarDato(consulta?.plan_medico)}
                        </p>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <FaClipboardList />
                    <h2>Observaciones generales</h2>
                </div>

                <div style={styles.item}>
                    <p style={styles.text}>
                        {mostrarDato(receta.observaciones)}
                    </p>
                </div>
            </div>
            <div id="receta-pdf" style={styles.pdfContainer}>
                <div style={styles.pdfHeader}>
                    <div style={styles.pdfBrand}>
                        <img src={logo} alt="MediCore" style={styles.pdfLogoImage} />

                        <div>
                            <h1 style={styles.pdfLogo}>MediCore</h1>
                            <p style={styles.pdfSubtitle}>Sistema de Expediente Clínico Electrónico</p>
                        </div>
                    </div>

                    <div style={styles.pdfBadge}>RECETA MÉDICA</div>
                </div>

                <div style={styles.pdfTopGrid}>
                    <div style={styles.pdfSection}>
                        <h2 style={styles.pdfTitle}>INFORMACIÓN GENERAL</h2>

                        <div style={styles.pdfGrid}>
                            <div>
                                <strong>Paciente:</strong>
                                <p>{paciente ? `${paciente.nombres} ${paciente.apellidos}` : "Sin información"}</p>
                            </div>

                            <div>
                                <strong>Médico:</strong>
                                <p>{mostrarDato(medico?.nombre_completo)}</p>
                            </div>

                            <div>
                                <strong>Expediente:</strong>
                                <p>{mostrarDato(expediente?.numero_expediente)}</p>
                            </div>

                            <div>
                                <strong>Consulta:</strong>
                                <p>{formatearFecha(consulta?.fecha_consulta)}</p>
                            </div>
                        </div>
                    </div>

                    <div style={styles.pdfSection}>
                        <h2 style={styles.pdfTitle}>DATOS DE LA RECETA</h2>

                        <div style={styles.pdfGrid}>
                            <div>
                                <strong>Estado:</strong>
                                <p>{mostrarDato(receta.estado)}</p>
                            </div>

                            <div>
                                <strong>Código:</strong>
                                <p>{mostrarDato(receta.codigo_receta)}</p>
                            </div>

                            <div>
                                <strong>Fecha de emisión:</strong>
                                <p>{formatearFecha(receta.fecha_emision)}</p>
                            </div>

                            <div>
                                <strong>Fecha de vigencia:</strong>
                                <p>{formatearFecha(receta.fecha_vigencia)}</p>
                            </div>

                            <div>
                                <strong>Próxima revisión:</strong>
                                <p>{formatearFecha(receta.proxima_revision)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.pdfSection}>
                    <h2 style={styles.pdfTitle}>MEDICAMENTOS PRESCRITOS</h2>
                    <p style={styles.pdfText}>{mostrarDato(receta.medicamentos)}</p>
                </div>

                <div style={styles.pdfSection}>
                    <h2 style={styles.pdfTitle}>INDICACIONES</h2>
                    <p style={styles.pdfText}>{mostrarDato(receta.indicaciones)}</p>
                </div>

                <div style={styles.pdfSection}>
                    <h2 style={styles.pdfTitle}>INSTRUCCIONES GENERALES</h2>
                    <p style={styles.pdfText}>{mostrarDato(receta.instrucciones_generales)}</p>
                </div>

                <div style={styles.pdfSection}>
                    <h2 style={styles.pdfTitle}>DIAGNÓSTICO RELACIONADO</h2>

                    <div style={styles.pdfDiagGrid}>
                        <div>
                            <strong>Estado:</strong>
                            <p>{mostrarDato(diagnostico?.estado)}</p>
                        </div>

                        <div>
                            <strong>Tipo:</strong>
                            <p>{mostrarDato(diagnostico?.tipo)}</p>
                        </div>

                        <div>
                            <strong>CIE-10:</strong>
                            <p>{mostrarDato(diagnostico?.codigo_cie10)}</p>
                        </div>
                    </div>

                    <p style={styles.pdfText}>
                        <strong>Descripción:</strong> {mostrarDato(diagnostico?.descripcion)}
                    </p>

                    <p style={styles.pdfText}>
                        <strong>Observaciones:</strong> {mostrarDato(diagnostico?.observaciones)}
                    </p>
                </div>

                <div style={styles.pdfSection}>
                    <h2 style={styles.pdfTitle}>CONSULTA RELACIONADA</h2>

                    <p style={styles.pdfText}>
                        <strong>Motivo de consulta:</strong> {mostrarDato(consulta?.motivo)}
                    </p>

                    <p style={styles.pdfText}>
                        <strong>Impresión clínica:</strong> {mostrarDato(consulta?.impresion_clinica)}
                    </p>

                    <p style={styles.pdfText}>
                        <strong>Plan médico:</strong> {mostrarDato(consulta?.plan_medico)}
                    </p>
                </div>

                <div style={styles.pdfSection}>
                    <h2 style={styles.pdfTitle}>OBSERVACIONES GENERALES</h2>
                    <p style={styles.pdfText}>{mostrarDato(receta.observaciones)}</p>
                </div>

                <div style={styles.pdfFooter}>
                    <div style={styles.pdfFooterInfo}>
                        <div style={styles.pdfQR}>QR</div>

                        <div>
                            <p>Receta generada electrónicamente</p>
                            <p>Sistema MediCore</p>
                            <p>{formatearFecha(new Date())}</p>
                        </div>
                    </div>

                    <img src={logo} alt="Sello MediCore" style={styles.pdfWatermark} />

                    <div style={styles.pdfFirma}>
                        <div style={styles.pdfLinea}></div>
                        <p>{mostrarDato(medico?.nombre_completo)}</p>
                        <span>Firma y sello médico</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        overflowY: "auto",
        backgroundColor: "#f5f7fb",
        padding: "24px",
        fontFamily: "'Segoe UI', sans-serif"
    },
    loadingContainer: {
        padding: "40px",
        textAlign: "center"
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px"
    },
    btnVolver: {
        backgroundColor: "#0b2c5f",
        color: "#fff",
        border: "none",
        padding: "12px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "600"
    },
    btnEditar: {
        backgroundColor: "#2f80ed",
        color: "#fff",
        border: "none",
        padding: "12px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "600"
    },
    btnPDF: {
        marginLeft: "auto",
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        padding: "12px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "600",
        boxShadow: "0 6px 16px rgba(22, 163, 74, 0.25)"
    },

    pdfContainer: {
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "794px",
        backgroundColor: "#ffffff",
        padding: "28px",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#1f2937"
    },
    pdfHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "4px solid #0b2c5f",
        paddingBottom: "14px",
        marginBottom: "22px"
    },
    pdfBrand: {
        display: "flex",
        alignItems: "center",
        gap: "18px"
    },
    pdfLogoImage: {
        width: "140px",
        height: "110px",
        objectFit: "contain"
    },
    pdfLogo: {
        margin: 0,
        color: "#0b2c5f",
        fontSize: "34px",
        fontWeight: "800"
    },
    pdfSubtitle: {
        margin: "5px 0 0 0",
        color: "#64748b",
        fontSize: "13px"
    },
    pdfBadge: {
        backgroundColor: "#0b2c5f",
        color: "#ffffff",
        padding: "12px 18px",
        borderRadius: "10px",
        fontWeight: "700",
        fontSize: "13px"
    },
    pdfTopGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "14px",
        marginBottom: "12px"
    },
    pdfSection: {
        border: "1px solid #dbe8f5",
        borderRadius: "12px",
        padding: "13px",
        marginBottom: "12px",
        backgroundColor: "#f8fbff",
        pageBreakInside: "avoid"
    },
    pdfTitle: {
        margin: "0 0 10px 0",
        color: "#0b2c5f",
        fontSize: "14px",
        fontWeight: "800"
    },
    pdfGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        fontSize: "11px"
    },
    pdfDiagGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
        fontSize: "11px"
    },
    pdfText: {
        margin: "4px 0",
        lineHeight: "1.35",
        whiteSpace: "pre-line",
        fontSize: "11px"
    },
    pdfFooter: {
        borderTop: "2px solid #0b2c5f",
        marginTop: "28px",
        paddingTop: "18px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
        gap: "20px"
    },
    pdfFooterInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "11px"
    },
    pdfQR: {
        width: "58px",
        height: "58px",
        border: "1px solid #dbe8f5",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#0b2c5f"
    },
    pdfWatermark: {
        width: "95px",
        opacity: 0.18,
        margin: "0 auto"
    },
    pdfFirma: {
        textAlign: "center",
        width: "230px",
        marginLeft: "auto",
        fontSize: "12px"
    },
    pdfLinea: {
        borderTop: "2px solid #0b2c5f",
        marginBottom: "8px"
    },

    title: {
        color: "#0b2c5f",
        margin: 0
    },
    subtitle: {
        color: "#6c757d",
        marginTop: "5px"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "18px",
        padding: "25px",
        marginBottom: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#0b2c5f",
        marginBottom: "20px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
    },
    infoBox: {
        backgroundColor: "#f8fbff",
        border: "1px solid #dbe8f5",
        borderRadius: "14px",
        padding: "18px",
        display: "flex",
        alignItems: "center",
        gap: "15px"
    },
    iconBlue: {
        color: "#0b5ed7",
        fontSize: "24px"
    },
    label: {
        color: "#6c757d",
        fontSize: "13px"
    },
    value: {
        margin: 0,
        marginTop: "5px",
        fontWeight: "600",
        color: "#0b2c5f"
    },
    sectionTitle: {
        color: "#0b2c5f",
        marginBottom: "20px"
    },
    section: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    item: {
        backgroundColor: "#f8fbff",
        borderRadius: "12px",
        padding: "18px",
        border: "1px solid #e3edf7",
        marginBottom: "15px"
    },
    itemTitle: {
        marginTop: 0,
        color: "#0b2c5f",
        marginBottom: "10px"
    },
    text: {
        margin: 0,
        color: "#374151",
        lineHeight: "1.7",
        whiteSpace: "pre-line"
    },
    badgeRow: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px"
    },
    badge: {
        backgroundColor: "#eef4ff",
        color: "#0b2c5f",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600"
    },
    estadoActivo: {
        backgroundColor: "#dff6e4",
        color: "#1f7a3f",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    estadoInactivo: {
        backgroundColor: "#fde2e2",
        color: "#b42318",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    }
};

export default RecetaDetalle;