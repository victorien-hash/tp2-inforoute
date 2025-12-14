import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchRegistreGes } from "../store/registreGesSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const RegisterGES = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSelector((state: RootState) => state.registreGes);
  const location = useLocation();
  const stateItem = (location.state as any)?.item ?? null;

  useEffect(() => {
    if (stateItem) return;
    if (id) {
      const parsed = parseInt(id);
      if (!isNaN(parsed)) dispatch(fetchRegistreGes(parsed));
    }
  }, [dispatch, id, stateItem]);

  if (!id) return <p className="loading">Aucun ID spécifié</p>;
  if (loading) return <p className="loading">Chargement du Registre GES...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  const displayData = stateItem || data;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Registre GES</h1>
          <UserBar />
        </div>
      </header>

      <div className="table-wrapper" style={{ padding: 20 }}>
        {displayData ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>Numéro SAGO:</strong> {displayData.num_sago || "N/A"}</div>
            <div><strong>Entreprise:</strong> {displayData.entreprise || "N/A"}</div>
            <div><strong>Établissement:</strong> {displayData.etablissement || "N/A"}</div>
            <div><strong>Année:</strong> {displayData.annee || "N/A"}</div>
            <div><strong>Région:</strong> {displayData.region || "N/A"}</div>
            <div><strong>Émissions Totales (t CO2 eq.):</strong> {displayData.em_tot ? Number(displayData.em_tot).toFixed(2) : "N/A"}</div>
            <details>
              <summary>Données brutes</summary>
              <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(displayData, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/registerGES')}>Retour à la liste</button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucune donnée GES trouvée pour l'ID {id}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterGES;