import { useAuth } from "../../context/AuthContext";

const DashboardPaciente = () => {
  const { usuario, logout } = useAuth();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Portal del Paciente</h1>

      <h3>Bienvenido:</h3>

      <p>{usuario?.nombre_completo}</p>

      <p>Rol: {usuario?.rol}</p>

      <button onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default DashboardPaciente;