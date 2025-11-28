import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPermisConstructionList } from "../store/permisConstructionSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

interface PermisConstructionItem {
  id?: number;
  no_permis?: string;
  type_permis?: string;
  type_permis_descr?: string;
  categorie_batiment?: string;
  date_emission?: string;
  adresse?: string;
  cout_permis?: number;
  exville_descr?: string;
  [key: string]: any;
}

const PermisConstructionList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dataList, loading, error } = useSelector((state: RootState) => state.permisConstruction);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ exville: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPermisConstructionList());
  }, [dispatch]);

  const list = dataList as PermisConstructionItem[];

  const filteredData = list.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (item.no_permis && item.no_permis.toLowerCase().includes(q)) ||
      (item.type_permis_descr && item.type_permis_descr.toLowerCase().includes(q)) ||
      (item.adresse && item.adresse.toLowerCase().includes(q));

    const matchesFilters =
      (!filters.exville || item.exville_descr === filters.exville) &&
      (!filters.type || item.type_permis === filters.type);

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const uniqueExvilles = Array.from(new Set(list.map((it) => it.exville_descr).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(list.map((it) => it.type_permis).filter(Boolean)));

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Permis de construction</h1>
          <UserBar />
        </div>
        <p className="total-items">Total : {filteredData.length} enregistrements</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par N° permis, type ou adresse..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
        </div>

        <div className="filters-grid">
          <select
            value={filters.type}
            onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filters.exville}
            onChange={(e) => { setFilters({ ...filters, exville: e.target.value }); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="">Toutes les villes</option>
            {uniqueExvilles.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Permis</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Date émission</th>
              <th>Adresse</th>
              <th>Coût</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id ?? idx}>
                <td className="permis-numero">{item.no_permis || 'N/A'}</td>
                <td>{item.type_permis_descr || item.type_permis || 'N/A'}</td>
                <td>{item.categorie_batiment || 'N/A'}</td>
                <td>{item.date_emission ? new Date(item.date_emission).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>{item.adresse || 'N/A'}</td>
                <td className="number-cell">{item.cout_permis != null ? Number(item.cout_permis).toFixed(0) : 'N/A'}</td>
                <td>{item.exville_descr || 'N/A'}</td>
                <td>
                  <button className="btn-view" onClick={() => {
                    if (item.id) navigate(`/permis-construction/${item.id}`);
                    else navigate(`/permis-construction`, { state: { item } });
                  }}>Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && <p className="no-data">Aucun résultat trouvé</p>}

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

export default PermisConstructionList;
