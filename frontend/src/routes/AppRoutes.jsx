import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import DashboardAdmin from "../pages/dashboard/DashboardAdmin";
import DashboardPaciente from "../pages/dashboard/DashboardPaciente";
import Pacientes from "../pages/pacientes/Pacientes";
import PacienteForm from "../pages/pacientes/PacienteForm";
import PacienteDetalle from "../pages/pacientes/PacienteDetalle";
import Expedientes from "../pages/expedientes/Expedientes";
import ExpedienteForm from "../pages/expedientes/ExpedienteForm";
import ExpedienteDetalle from "../pages/expedientes/ExpedienteDetalle";



import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />


      {/* DASHBOARDS */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      {/* PACIENTES */}
      <Route
        path="/pacientes"
        element={
          <ProtectedRoute>
            <Pacientes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard-paciente"
        element={
          <ProtectedRoute>
            <DashboardPaciente />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pacientes/crear"
        element={
          <ProtectedRoute>
            <PacienteForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pacientes/editar/:id"
        element={
          <ProtectedRoute>
            <PacienteForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pacientes/ver/:id"
        element={
          <ProtectedRoute>
            <PacienteDetalle />
          </ProtectedRoute>
        }
      />

      {/* EXPEDIENTES */}
      <Route
        path="/expedientes"
        element={
          <ProtectedRoute>
            <Expedientes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expedientes/crear"
        element={
          <ProtectedRoute>
            <ExpedienteForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expedientes/editar/:id"
        element={
          <ProtectedRoute>
            <ExpedienteForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expedientes/ver/:id"
        element={
          <ProtectedRoute>
            <ExpedienteDetalle />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;