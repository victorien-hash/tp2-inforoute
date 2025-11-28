import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const UserBar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="user-info">
      <span>Bienvenue, {user?.username || "Utilisateur"} !</span>
      <button onClick={() => navigate('/')} className="dashboard-button">
        Tableau de Bord
      </button>
      <button onClick={() => navigate("/profile")} className="profile-button">
        Mon profil
      </button>
      <button onClick={handleLogout} className="logout-button">
        Déconnexion
      </button>
    </div>
  );
};

export default UserBar;