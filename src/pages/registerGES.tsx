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
    // If we received the item via navigation state, skip fetching
    if (stateItem) return;
    if (id) {
      // try parse id — if it's a numeric fallback index this will still call the API and may 404,
      // but when passed stateItem the UI will already show the data.
      const parsed = parseInt(id);
      if (!isNaN(parsed)) dispatch(fetchRegistreGes(parsed));
    }
  }, [dispatch, id, stateItem]);

  if (!id) return <p className="loading">Aucun ID spécifié dans l'URL.</p>;
  if (loading) return <p className="loading">Chargement du Registre GES...</p>;
  if (error) return <p className="error">Erreur lors du chargement : {error}</p>;

  return (
    <div className="registre-ges-container">
      <header className="registre-ges-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Registre GES #{id}</h1>
          <UserBar />
        </div> 
      </header>

      <div className="registre-ges-content">
        {stateItem ? (
          // show data from navigation state immediately
          <div className="registre-ges-detail">
            <div className="detail-item">
              <strong>Numéro SAGO :</strong>
              <span>{stateItem.num_sago || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Entreprise :</strong>
              <span>{stateItem.entreprise || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Établissement :</strong>
              <span>{stateItem.etablissement || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Année :</strong>
              <span>{stateItem.annee || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Région :</strong>
              <span>{stateItem.region || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Émissions Totales (t CO2 eq.) :</strong>
              <span>{stateItem.em_tot ? Number(stateItem.em_tot).toFixed(2) : "N/A"}</span>
            </div>
            <details className="raw-data">
              <summary>Données brutes complètes</summary>
              <pre>{JSON.stringify(stateItem, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/registerGES')}>Retour à la liste</button>
            </div>
          </div>
        ) : data ? (
          <div className="registre-ges-detail">
            <div className="detail-item">
              <strong>Numéro SAGO :</strong>
              <span>{data.num_sago || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Entreprise :</strong>
              <span>{data.entreprise || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Établissement :</strong>
              <span>{data.etablissement || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Année :</strong>
              <span>{data.annee || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Région :</strong>
              <span>{data.region || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Émissions Totales (t CO2 eq.) :</strong>
              <span>{data.em_tot ? data.em_tot.toFixed(2) : "N/A"}</span>
            </div>
            <details className="raw-data">
              <summary>Données brutes complètes</summary>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/registerGES')}>Retour à la liste</button>
            </div>
          </div>
          ) : (
          <p className="no-data">Aucune donnée GES trouvée pour l'ID {id}.</p>
        )}
      </div>
    </div>
  );
};

export default RegisterGES;