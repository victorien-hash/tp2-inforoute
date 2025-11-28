import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBonTravail } from "../store/bonTravailSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const BonTravail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSelector((state: RootState) => state.bonTravail);

  useEffect(() => {
    if (id) dispatch(fetchBonTravail(parseInt(id)));
  }, [dispatch, id]);

  if (!id) return <p className="loading">Aucun ID spécifié</p>;
  if (loading) return <p className="loading">Chargement du bon travail...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Bon Travaux Aqueduc</h1>
          <UserBar />
        </div>
      </header>

      <div className="table-wrapper" style={{ padding: 20 }}>
        {data ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>Problème :</strong> {data.probleme || 'N/A'}</div>
            <div><strong>Date réalisée :</strong> {data.date_realisee ? new Date(data.date_realisee).toLocaleDateString('fr-FR') : 'N/A'}</div>
            <div><strong>Secteur :</strong> {data.secteur || 'N/A'}</div>
            <div><strong>District :</strong> {data.district || 'N/A'}</div>
            <details>
              <summary>Données brutes</summary>
              <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/bon-travail')}>Retour à la liste</button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucune donnée trouvée pour l'ID {id}</p>
        )}
      </div>
    </div>
  );
};

export default BonTravail;
