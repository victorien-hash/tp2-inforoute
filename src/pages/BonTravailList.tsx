import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBonTravailList } from "../store/bonTravailSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

interface BonTravailItem {
  id?: number;
  probleme?: string;
  date_realisee?: string;
  secteur?: string;
  district?: string;
  [key: string]: any;
}

const BonTravailList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dataList, loading, error } = useSelector((state: RootState) => state.bonTravail);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ secteur: "", district: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchBonTravailList());
  }, [dispatch]);

  const list = dataList as BonTravailItem[];

  const filteredData = list.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (item.probleme && item.probleme.toLowerCase().includes(q)) ||
      (item.secteur && item.secteur.toLowerCase().includes(q)) ||
      (item.district && item.district.toLowerCase().includes(q));

    const matchesFilters =
      (!filters.secteur || item.secteur === filters.secteur) &&
      (!filters.district || item.district === filters.district);

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const uniqueSecteurs = Array.from(new Set(list.map((it) => it.secteur).filter(Boolean)));
  const uniqueDistricts = Array.from(new Set(list.map((it) => it.district).filter(Boolean)));

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Bon Travaux Aqueduc</h1>
          <UserBar />
        </div>
        <p className="total-items">Total : {filteredData.length} enregistrements</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par problème, secteur ou district..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
        </div>

        <div className="filters-grid">
          <select
            value={filters.secteur}
            onChange={(e) => { setFilters({ ...filters, secteur: e.target.value }); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="">Tous les secteurs</option>
            {uniqueSecteurs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.district}
            onChange={(e) => { setFilters({ ...filters, district: e.target.value }); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="">Tous les districts</option>
            {uniqueDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Problème</th>
              <th>Date réalisée</th>
              <th>Secteur</th>
              <th>District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id ?? idx}>
                <td>{item.probleme || "N/A"}</td>
                <td>{item.date_realisee ? new Date(item.date_realisee).toLocaleDateString('fr-FR') : "N/A"}</td>
                <td>{item.secteur || "N/A"}</td>
                <td>{item.district || "N/A"}</td>
                <td>
                  <button className="btn-view" onClick={() => {
                    if (item.id) navigate(`/bon-travail/${item.id}`);
                    else navigate(`/bon-travail`, { state: { item } });
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

export default BonTravailList;
