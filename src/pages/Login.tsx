import { useState } from "react";
import { loginRequest } from "../api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend expects {"email": "votreusername", "password": "..."}
      const res = await loginRequest({ username: username, password });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      navigate("/");
    } catch {
      alert("Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
        />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
