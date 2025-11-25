import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { updateUserProfile } from "../api/auth.api";
import { updateProfileSuccess } from "../store/authSlice";
import "../styles/Register.css";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await updateUserProfile(user.id, {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password: password || undefined, // facultatif
      });
      dispatch(updateProfileSuccess({ user: res.data.user }));
      setMessage(res.data.message || "Profil mis à jour");
      setPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erreur lors de la mise à jour du profil";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Mon profil</h2>

        {message && <div className="error-message" style={{ backgroundColor: "#e6ffed", color: "#1e7e34", borderLeftColor: "#1e7e34" }}>{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe (facultatif)</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Laisser vide pour ne pas changer" />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;