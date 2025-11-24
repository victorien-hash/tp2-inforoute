import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVieDemocratique } from "../store/vieDemocratiqueSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/VieDemocratique.css";

const VieDemocratique = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.vieDemocratique);

  useEffect(() => {
    dispatch(fetchVieDemocratique());
  }, [dispatch]);

  // Affichage du chargement avec un spinner
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="page-container">
        <div className="error">
          <p>Oups ! Une erreur est survenue : {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Vie Démocratique</h2>
      
      {data && data.length > 0 ? (
        <div className="cards-grid">
          {data.map((item: any, index: number) => (
            <div key={item.id || index} className="card">
              {/* --- ZONE À PERSONNALISER SELON TON API --- */}
              
              {/* Titre : remplace 'item.titre' par le vrai champ (ex: item.subject) */}
              <h3>{item.titre || `Élément #${index + 1}`}</h3>
              
              <div className="card-content">
                {/* Description : remplace par ton champ (ex: item.content) */}
                {item.description 
                  ? item.description 
                  : <pre style={{fontSize: '0.8rem', overflow: 'hidden'}}>{JSON.stringify(item, null, 2)}</pre>
                }
              </div>

              <div className="card-footer">
                <span>ID: {item.id || "N/A"}</span>
                {/* Date : si tu as un champ date */}
                <span>{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
              </div>
              
              {/* ------------------------------------------ */}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>Aucune donnée disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default VieDemocratique;