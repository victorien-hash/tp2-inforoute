import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVieDemocratique } from "../store/vieDemocratiqueSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/VieDemocratique.css";
import "../styles/DataList.css";

const VieDemocratique = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.vieDemocratique);

  useEffect(() => {
    dispatch(fetchVieDemocratique());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ year: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // prepare filtered + paginated data
  const list = Array.isArray(data) ? data : [];

  const filtered = list.filter((item: any) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (item.titre && item.titre.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.id && String(item.id).includes(q));

    const matchesYear = !filters.year || (item.date && new Date(item.date).getFullYear() === parseInt(filters.year));
    const matchesType = !filters.type || (item.type === filters.type || item.categorie === filters.type);

    return matchesSearch && matchesYear && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const uniqueYears = Array.from(new Set(list
    .map((it: any) => (it.date ? new Date(it.date).getFullYear() : null))
    .filter((y): y is number => y !== null)
  )).sort((a: number, b: number) => b - a);
  const uniqueTypes = Array.from(new Set(list.map((it: any) => it.type || it.categorie).filter((t): t is string => !!t)));

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
            placeholder="Rechercher par titre, description ou id..."
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
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
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
            {uniqueYears.map((y: number) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Date</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item: any, idx: number) => (
              <tr key={item.id || idx}>
                <td>{item.titre || `Élément #${startIndex + idx + 1}`}</td>
                <td className="truncate">{item.description ? (String(item.description).slice(0, 140)) : JSON.stringify(item)}</td>
                <td>{item.date ? new Date(item.date).toLocaleDateString() : ""}</td>
                <td className="centered">{item.id ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="no-data">Aucun résultat trouvé</p>
      )}

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

export default VieDemocratique;