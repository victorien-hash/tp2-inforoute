import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import PermisAnimal from "./pages/PermisAnimal";
import PermisAnimalsList from "./pages/PermisAnimalsList";
import VieDemocratique from "./pages/VieDemocratique";
import VieDemocratiqueList from "./pages/VieDemocratiqueList";
import Dashboard from "./pages/Dashboard";
import InterventionPompier from "./pages/InterventionPompier";
import InterventionPompiersList from "./pages/InterventionPompiersList";
import RegisterGES from "./pages/registerGES";
import RegisterGESList from "./pages/RegisterGESList";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";
import BonTravailList from "./pages/BonTravailList";
import BonTravail from "./pages/BonTravail";
import PermisConstructionList from "./pages/PermisConstructionList";
import PermisConstruction from "./pages/PermisConstruction";

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
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/permis"
        element={
          <PrivateRoute>
            <PermisAnimalsList />
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
        path="/interventions-pompiers"
        element={
          <PrivateRoute>
            <InterventionPompiersList />
          </PrivateRoute>
        }
      />

      <Route
        path="/interventions-pompiers/:id"
        element={
          <PrivateRoute>
            <InterventionPompier />
          </PrivateRoute>
        }
      />

      <Route
        path="/registerGES"
        element={
          <PrivateRoute>
            <RegisterGESList />
          </PrivateRoute>
        }
      />

      <Route
        path="/bon-travail"
        element={
          <PrivateRoute>
            <BonTravailList />
          </PrivateRoute>
        }
      />

      <Route
        path="/bon-travail/:id"
        element={
          <PrivateRoute>
            <BonTravail />
          </PrivateRoute>
        }
      />

      <Route
        path="/permis-construction"
        element={
          <PrivateRoute>
            <PermisConstructionList />
          </PrivateRoute>
        }
      />

      <Route
        path="/permis-construction/:id"
        element={
          <PrivateRoute>
            <PermisConstruction />
          </PrivateRoute>
        }
      />

      <Route
        path="/registerGES/:id"
        element={
          <PrivateRoute>
            <RegisterGES />
          </PrivateRoute>
        }
      />

      <Route
        path="/vie-democratique"
        element={
          <PrivateRoute>
            <VieDemocratiqueList />
          </PrivateRoute>
        }
      />

      <Route
        path="/vie-democratique/:id"
        element={
          <PrivateRoute>
            <VieDemocratique />
          </PrivateRoute>
        }
      />

      <Route
        path="/statistics"
        element={
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        }
      />

      {/* Redirection par défaut vers login pour les routes non définies */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;