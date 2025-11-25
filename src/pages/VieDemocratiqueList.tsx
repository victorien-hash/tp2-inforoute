import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVieDemocratique } from "../store/vieDemocratiqueSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";

interface VieDemocratiqueItem {
  id?: number;
  nom_institutionnel?: string;
  nom_specifique?: string;
  type_rencontre?: string;
  date_rencontre?: string;
  endroit?: string;
  nom_lieu?: string;
  salle?: string;
  rue?: string;
  numero_civique?: string;
  [key: string]: any;
}

const VieDemocratiqueList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dataList, loading, error } = useSelector((state: RootState) => state.vieDemocratique);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type_rencontre: "", year: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchVieDemocratique());
  }, [dispatch]);

  const list = (dataList as VieDemocratiqueItem[]) || [];

  const filtered = list.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (item.nom_specifique && item.nom_specifique.toLowerCase().includes(q)) ||
      (item.nom_institutionnel && item.nom_institutionnel.toLowerCase().includes(q)) ||
      (item.endroit && item.endroit.toLowerCase().includes(q));

    const matchesType = !filters.type_rencontre || item.type_rencontre === filters.type_rencontre;
    const matchesYear = !filters.year || (item.date_rencontre && new Date(item.date_rencontre).getFullYear() === parseInt(filters.year));

    return matchesSearch && matchesType && matchesYear;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const uniqueTypes = Array.from(new Set(list.map((it) => it.type_rencontre).filter((t): t is string => !!t)));
  const uniqueYears = Array.from(
    new Set(list.map((it) => (it.date_rencontre ? new Date(it.date_rencontre).getFullYear() : null)).filter((y): y is number => y !== null))
  ).sort((a, b) => b - a);

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <h1>Vie Démocratique</h1>
        <p className="total-items">Total : {filtered.length} enregistrements</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom, institution, endroit..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filters-grid">
          <select
            value={filters.type_rencontre}
            onChange={(e) => {
              setFilters({ ...filters, type_rencontre: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => {
              setFilters({ ...filters, year: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Toutes les années</option>
            {uniqueYears.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom Spécifique</th>
              <th>Institution</th>
              <th>Type</th>
              <th>Date</th>
              <th>Endroit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, idx) => (
              <tr key={item.id ?? idx}>
                <td>{item.nom_specifique || "-"}</td>
                <td className="truncate">{item.nom_institutionnel ? String(item.nom_institutionnel).slice(0, 80) : "-"}</td>
                <td>{item.type_rencontre || "-"}</td>
                <td>{item.date_rencontre ? new Date(item.date_rencontre).toLocaleDateString() : "-"}</td>
                <td className="truncate">{item.endroit ? String(item.endroit).slice(0, 60) : "-"}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => {
                      const targetId = item.id ?? (item as any).pk;
                      if (targetId) {
                        navigate(`/vie-democratique/${targetId}`, { state: { item } });
                      } else {
                        navigate(`/vie-democratique/${startIndex + idx}`, { state: { item, fallbackIndex: startIndex + idx } });
                      }
                    }}
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <p className="no-data">Aucun résultat trouvé</p>}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="btn-pagination">Précédent</button>
          <span className="page-info">Page {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="btn-pagination">Suivant</button>
        </div>
      )}
    </div>
  );
};

export default VieDemocratiqueList;
