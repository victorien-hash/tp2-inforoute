import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPermisAnimal } from "../store/permisSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const PermisAnimal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSelector((state: RootState) => state.permis);

  useEffect(() => {
    if (id) dispatch(fetchPermisAnimal(parseInt(id)));
  }, [dispatch, id]);

  if (!id) return <p className="loading">Aucun ID spécifié</p>;
  if (loading) return <p className="loading">Chargement du permis...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Permis Animal</h1>
          <UserBar />
        </div>
      </header>

      <div className="table-wrapper" style={{ padding: 20 }}>
        {data ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>N° Permis:</strong> {data.permis_numero}</div>
            <div><strong>Nom animal:</strong> {data.animal_nom || 'N/A'}</div>
            <div><strong>Type:</strong> {data.animal_type_permis || 'N/A'}</div>
            <div><strong>Race:</strong> {data.animal_race_primaire || 'N/A'}</div>
            <div><strong>Sexe:</strong> {data.animal_sexe || 'N/A'}</div>
            <div><strong>Date début:</strong> {data.permis_date_debut ? new Date(data.permis_date_debut).toLocaleDateString() : 'N/A'}</div>
            <div><strong>Date fin:</strong> {data.permis_date_fin ? new Date(data.permis_date_fin).toLocaleDateString() : 'N/A'}</div>
            <details>
              <summary>Données brutes</summary>
              <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate('/permis')}>Retour à la liste</button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucun permis trouvé pour l'ID {id}</p>
        )}
      </div>
    </div>
  );
};

export default PermisAnimal;