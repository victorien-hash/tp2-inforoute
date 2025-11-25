import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInterventionsPompiersList } from "../store/interventionPompierSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";

interface InterventionItem {
  id: number;
  date_heure_alerte: string;
  rue: string;
  code_postal_partiel: string;
  caserne: string;
  desc_type: string;
  desc_sous_type: string;
  [key: string]: any;
}

const InterventionPompiersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dataList, loading, error } = useSelector(
    (state: RootState) => state.interventionPompier
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    caserne: "",
    desc_type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchInterventionsPompiersList());
  }, [dispatch]);

  const filteredData = (dataList as InterventionItem[]).filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.rue?.toLowerCase().includes(searchLower) ||
      item.caserne?.toLowerCase().includes(searchLower) ||
      item.desc_type?.toLowerCase().includes(searchLower);

    const matchesFilters =
      (!filters.caserne || item.caserne === filters.caserne) &&
      (!filters.desc_type || item.desc_type === filters.desc_type);

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueCasernes = [...new Set((dataList as InterventionItem[]).map((item) => item.caserne))];
  const uniqueTypes = [...new Set((dataList as InterventionItem[]).map((item) => item.desc_type))];

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <h1>Interventions des Pompiers</h1>
        <p className="total-items">Total : {filteredData.length} enregistrements</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par rue, caserne, type..."
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
            value={filters.caserne}
            onChange={(e) => {
              setFilters({ ...filters, caserne: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Toutes les casernes</option>
            {uniqueCasernes.map((caserne) => (
              <option key={caserne} value={caserne}>
                Caserne {caserne}
              </option>
            ))}
          </select>

          <select
            value={filters.desc_type}
            onChange={(e) => {
              setFilters({ ...filters, desc_type: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date/Heure</th>
              <th>Rue</th>
              <th>Code Postal</th>
              <th>Caserne</th>
              <th>Type</th>
              <th>Sous-type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.date_heure_alerte).toLocaleString('fr-FR')}</td>
                <td>{item.rue || "N/A"}</td>
                <td>{item.code_postal_partiel || "N/A"}</td>
                <td className="caserne-cell">{item.caserne}</td>
                <td className="type-cell">{item.desc_type}</td>
                <td>{item.desc_sous_type || "N/A"}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/interventions-pompiers/${item.id}`)}
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

export default InterventionPompiersList;
