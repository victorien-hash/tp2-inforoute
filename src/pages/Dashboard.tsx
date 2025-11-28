import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.username || "Utilisateur"} !</span>
          <button onClick={() => navigate('/profile')} className="profile-button">
            Mon profil
          </button>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      
      </header>

      <div className="dashboard-content">
        <h2>Accès rapide</h2>
        <div className="dashboard-cards">
          <Link to="/vie-democratique" className="dashboard-card">
            <div className="card-icon">🏛️</div>
            <h3>Vie Démocratique</h3>
            <p>Consultez les informations sur la vie démocratique</p>
          </Link>

          <Link to="/permis" className="dashboard-card">
            <div className="card-icon">🐾</div>
            <h3>Permis Animaux</h3>
            <p>Consultez tous les permis d'animaux</p>
          </Link>

          <Link to="/registerGES" className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Registre GES</h3>
            <p>Consultez le registre des gaz à effet de serre</p>
          </Link>

          <Link to="/bon-travail" className="dashboard-card">
            <div className="card-icon">🚰</div>
            <h3>Bon Travaux Aqueduc</h3>
            <p>Consultez les interventions aqueduc</p>
          </Link>

          <Link to="/permis-construction" className="dashboard-card">
            <div className="card-icon">🏗️</div>
            <h3>Permis Construction</h3>
            <p>Consultez les permis de construction</p>
          </Link>

          <Link to="/interventions-pompiers" className="dashboard-card">
            <div className="card-icon">🚒</div>
            <h3>Interventions Pompiers</h3>
            <p>Consultez toutes les interventions des pompiers</p>
          </Link>

          <Link to="/statistics" className="dashboard-card">
            <div className="card-icon">📈</div>
            <h3>Visualisation Statistique</h3>
            <p>Voir les graphiques et exporter en PDF</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;