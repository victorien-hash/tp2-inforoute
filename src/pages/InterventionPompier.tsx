import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInterventionsPompiers } from "../store/interventionPompierSlice.ts";
import type { RootState, AppDispatch } from "../store/store";
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
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Intervention Pompier</h1>
          <UserBar />
        </div>
      </header>

      <div className="table-wrapper" style={{ padding: 20 }}>
        {data ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>Date/Heure:</strong> {new Date(data.date_heure_alerte).toLocaleString('fr-FR')}</div>
            <div><strong>Rue:</strong> {data.rue || "N/A"}</div>
            <div><strong>Code Postal:</strong> {data.code_postal_partiel || "N/A"}</div>
            <div><strong>Caserne:</strong> {data.caserne || "N/A"}</div>
            <div><strong>Type:</strong> {data.desc_type || data.code_type}</div>
            <div><strong>Sous-type:</strong> {data.desc_sous_type || data.code_sous_type}</div>
            <details>
              <summary>Données brutes</summary>
              <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/interventions-pompiers')}>Retour à la liste</button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucune intervention trouvée pour l'ID {id}</p>
        )}
      </div>
    </div>
  );
};

export default InterventionPompier;
