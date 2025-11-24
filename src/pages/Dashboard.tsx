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

          <Link to="/permis/1" className="dashboard-card">
            <div className="card-icon">🐾</div>
            <h3>Permis Animaux</h3>
            <p>Gérez les permis d'animaux</p>
          </Link>
        </div>

        <div className="user-details">
          <h3>Informations du compte</h3>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Nom d'utilisateur:</strong>
              <span>{user?.username}</span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{user?.email}</span>
            </div>
            {user?.first_name && (
              <div className="detail-item">
                <strong>Prénom:</strong>
                <span>{user.first_name}</span>
              </div>
            )}
            {user?.last_name && (
              <div className="detail-item">
                <strong>Nom:</strong>
                <span>{user.last_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;