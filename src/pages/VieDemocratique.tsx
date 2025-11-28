import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchVieDemocratiqueDetail } from "../store/vieDemocratiqueSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/VieDemocratique.css";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const VieDemocratique = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateItem = (location.state as any)?.item ?? null;

  const { data, loading, error } = useSelector((state: RootState) => state.vieDemocratique);
  const [record, setRecord] = useState<any>(stateItem);

  useEffect(() => {
    if (stateItem) {
      setRecord(stateItem);
      return;
    }
    if (id) {
      const parsed = parseInt(id);
      if (!isNaN(parsed)) dispatch(fetchVieDemocratiqueDetail(parsed));
    }
  }, [dispatch, id, stateItem]);

  useEffect(() => {
    if (data && !stateItem) setRecord(data);
  }, [data, stateItem]);

  if (!id && !stateItem) return <p className="loading">Aucun ID spécifié dans l'URL.</p>;
  if (loading && !record) return <p className="loading">Chargement...</p>;
  if (error && !record) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Détail Vie Démocratique</h1>
          <UserBar />
        </div>
      </header>

      <div className="table-wrapper" style={{ padding: 20 }}>
        {record ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div><strong>Nom Spécifique :</strong> {record.nom_specifique || "N/A"}</div>
            <div><strong>Nom Institutionnel :</strong> {record.nom_institutionnel || "N/A"}</div>
            <div><strong>Type de Rencontre :</strong> {record.type_rencontre || "N/A"}</div>
            <div><strong>Date :</strong> {record.date_rencontre ? new Date(record.date_rencontre).toLocaleDateString() : "N/A"}</div>
            <div><strong>Endroit :</strong> {record.endroit || "N/A"}</div>
            <div><strong>Nom du Lieu :</strong> {record.nom_lieu || "N/A"}</div>
            <div><strong>Salle :</strong> {record.salle || "N/A"}</div>
            <div><strong>Rue :</strong> {record.rue || "N/A"}</div>
            <div><strong>Numéro Civique :</strong> {record.numero_civique || "N/A"}</div>

            <details>
              <summary>Données brutes</summary>
              <pre style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(record, null, 2)}</pre>
            </details>

            <div style={{ marginTop: 12 }}>
              <button className="btn-view" onClick={() => navigate("/vie-democratique")}>
                Retour à la liste
              </button>
            </div>
          </div>
        ) : (
          <p className="no-data">Aucune donnée trouvée pour l'ID {id}.</p>
        )}
      </div>
    </div>
  );
};

export default VieDemocratique;