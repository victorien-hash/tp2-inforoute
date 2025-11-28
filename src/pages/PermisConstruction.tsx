import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPermisConstruction } from "../store/permisConstructionSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const PermisConstruction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSelector((state: RootState) => state.permisConstruction);

  useEffect(() => {
    if (id) dispatch(fetchPermisConstruction(parseInt(id)));
  }, [dispatch, id]);

  if (!id) return <p className="loading">Aucun ID spécifié</p>;
  if (loading) return <p className="loading">Chargement du permis...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Permis Construction</h1>
          <UserBar />
        </div>
      </header>

      <div className="table-wrapper" style={{ padding: 20 }}>
        {data ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>N° Permis:</strong> {data.no_permis || 'N/A'}</div>
            <div><strong>Type:</strong> {data.type_permis_descr || data.type_permis || 'N/A'}</div>
            <div><strong>Catégorie:</strong> {data.categorie_batiment || 'N/A'}</div>
            <div><strong>Date emission:</strong> {data.date_emission ? new Date(data.date_emission).toLocaleDateString('fr-FR') : 'N/A'}</div>
            <div><strong>Adresse:</strong> {data.adresse || 'N/A'}</div>
            <div><strong>Coût:</strong> {data.cout_permis != null ? Number(data.cout_permis).toFixed(0) : 'N/A'}</div>
            <details>
              <summary>Données brutes</summary>
              <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/permis-construction')}>Retour à la liste</button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucun permis trouvé pour l'ID {id}</p>
        )}
      </div>
    </div>
  );
};

export default PermisConstruction;
