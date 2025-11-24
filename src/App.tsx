import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import PermisAnimal from "./pages/PermisAnimal";
import VieDemocratique from "./pages/Democratique";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes protégées */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/permis/:id"
        element={
          <PrivateRoute>
            <PermisAnimal />
          </PrivateRoute>
        }
      />

      <Route
        path="/vie-democratique"
        element={
          <PrivateRoute>
            <VieDemocratique />
          </PrivateRoute>
        }
      />

      {/* Redirection par défaut vers login pour les routes non définies */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;