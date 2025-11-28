import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInterventionsPompiers } from "../store/interventionPompierSlice.ts";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/InterventionPompier.css";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const InterventionPompier = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.interventionPompier
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchInterventionsPompiers(parseInt(id)));
    }
  }, [dispatch, id]);

  if (!id) return <p className="loading">Aucun ID spécifié</p>;
  if (loading) return <p className="loading">Chargement de l'intervention...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="intervention-container">
      <header className="intervention-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Intervention des Pompiers</h1>
          <UserBar />
        </div>
      </header>

      <div className="intervention-content">
        {data ? (
          <div className="intervention-detail">
            <div className="detail-item">
              <strong>Date/Heure :</strong>
              <span>{new Date(data.date_heure_alerte).toLocaleString('fr-FR')}</span>
            </div>
            <div className="detail-item">
              <strong>Rue :</strong>
              <span>{data.rue || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Code Postal :</strong>
              <span>{data.code_postal_partiel || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Caserne :</strong>
              <span>{data.caserne || "N/A"}</span>
            </div>
            <div className="detail-item">
              <strong>Type :</strong>
              <span>{data.desc_type || data.code_type}</span>
            </div>
            <div className="detail-item">
              <strong>Sous-type :</strong>
              <span>{data.desc_sous_type || data.code_sous_type}</span>
            </div>
            <details className="raw-data">
              <summary>Données brutes</summary>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/interventions-pompiers')}>Retour à la liste</button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucune intervention trouvée</p>
        )}
      </div>
    </div>
  );
};

export default InterventionPompier;
