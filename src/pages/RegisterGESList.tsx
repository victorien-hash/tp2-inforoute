import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRegistreGesList } from "../store/registreGesSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

interface RegistreGesItem {
  id?: number;
  num_sago: string;
  annee: number;
  entreprise: string;
  etablissement: string;
  em_tot: number;
  region: string;
  [key: string]: any;
}

const RegisterGESList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dataList, loading, error } = useSelector(
    (state: RootState) => state.registreGes
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    region: "",
    annee: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchRegistreGesList());
  }, [dispatch]);

  const filteredData = (dataList as RegistreGesItem[]).filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.entreprise?.toLowerCase().includes(searchLower) ||
      item.num_sago?.toLowerCase().includes(searchLower) ||
      item.etablissement?.toLowerCase().includes(searchLower);

    const matchesFilters =
      (!filters.region || item.region === filters.region) &&
      (!filters.annee || item.annee.toString() === filters.annee);

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueRegions = [...new Set((dataList as RegistreGesItem[]).map((item) => item.region))];
  const uniqueYears = [...new Set((dataList as RegistreGesItem[]).map((item) => item.annee))].sort((a, b) => b - a);

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Registre GES - Gaz à effet de serre</h1>
          <UserBar />
        </div>
        <p className="total-items">Total : {filteredData.length} enregistrements</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par entreprise, SAGO, établissement..."
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
            value={filters.region}
            onChange={(e) => {
              setFilters({ ...filters, region: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Toutes les régions</option>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={filters.annee}
            onChange={(e) => {
              setFilters({ ...filters, annee: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Toutes les années</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° SAGO</th>
              <th>Entreprise</th>
              <th>Établissement</th>
              <th>Année</th>
              <th>Région</th>
              <th>Émissions (t CO2 eq.)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="sago-numero">{item.num_sago}</td>
                <td>{item.entreprise || "N/A"}</td>
                <td>{item.etablissement || "N/A"}</td>
                <td className="centered">{item.annee}</td>
                <td>{item.region || "N/A"}</td>
                <td className="number-cell">{item.em_tot?.toFixed(0) || "N/A"}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => {
                      const targetId = item.id ?? (item as any).pk;
                      const globalIndex = startIndex + idx; // ligne réelle dans le tableau complet
                      // Si on a un id/pk, on passe via l'URL; sinon on passe l'objet en state
                      if (targetId) {
                        navigate(`/registerGES/${targetId}`, { state: { item } });
                      } else {
                        navigate(`/registerGES/${globalIndex}`, { state: { item, fallbackIndex: globalIndex } });
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

      {filteredData.length === 0 && (
        <p className="no-data">Aucun résultat trouvé</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn-pagination"
          >
            Précédent
          </button>
          <span className="page-info">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="btn-pagination"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterGESList;
