import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import PermisAnimal from "./pages/PermisAnimal";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <h1>Page protégée – tableau de bord</h1>
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
    </Routes>
  );
};

export default App;