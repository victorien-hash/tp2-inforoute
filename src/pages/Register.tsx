import { useState } from "react";
import { registerRequest } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import "../styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerRequest({ 
        username, 
        password, 
        email,
        first_name: firstName,
        last_name: lastName
      });
      
      // Connexion automatique après inscription
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erreur lors de l'inscription";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Créer un compte</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="votre prénom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="votre nom"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="votre nom d'utilisateur"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre email ex:john.doe@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <p className="login-link">
          Vous avez déjà un compte ?{" "}
          <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;