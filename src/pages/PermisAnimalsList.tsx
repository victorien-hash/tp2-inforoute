import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPermisAnimals } from "../store/permisSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

interface PermisAnimalItem {
  id: number;
  animal_nom: string;
  animal_type_permis: string;
  animal_race_primaire: string;
  animal_sexe: string;
  permis_numero: string;
  permis_date_debut: string;
  permis_date_fin: string;
  [key: string]: any;
}

const PermisAnimalsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dataList, loading, error } = useSelector(
    (state: RootState) => state.permis
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    animal_type_permis: "",
    animal_sexe: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPermisAnimals());
  }, [dispatch]);

  const filteredData = (dataList as PermisAnimalItem[]).filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.animal_nom?.toLowerCase().includes(searchLower) ||
      item.permis_numero?.toLowerCase().includes(searchLower) ||
      item.animal_race_primaire?.toLowerCase().includes(searchLower);

    const matchesFilters =
      (!filters.animal_type_permis ||
        item.animal_type_permis === filters.animal_type_permis) &&
      (!filters.animal_sexe || item.animal_sexe === filters.animal_sexe);

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueTypes = [...new Set((dataList as PermisAnimalItem[]).map((item) => item.animal_type_permis))];
  const uniqueSexes = [...new Set((dataList as PermisAnimalItem[]).map((item) => item.animal_sexe))];

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="data-list-container">
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Permis Animaux</h1>
          <UserBar />
        </div>
        <p className="total-items">Total : {filteredData.length} enregistrements</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom, numéro de permis..."
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
            value={filters.animal_type_permis}
            onChange={(e) => {
              setFilters({ ...filters, animal_type_permis: e.target.value });
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

          <select
            value={filters.animal_sexe}
            onChange={(e) => {
              setFilters({ ...filters, animal_sexe: e.target.value });
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Tous les sexes</option>
            {uniqueSexes.map((sexe) => (
              <option key={sexe} value={sexe}>
                {sexe}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom Animal</th>
              <th>Type</th>
              <th>Race</th>
              <th>Sexe</th>
              <th>N° Permis</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{item.animal_nom || "N/A"}</td>
                <td>{item.animal_type_permis || "N/A"}</td>
                <td>{item.animal_race_primaire || "N/A"}</td>
                <td>{item.animal_sexe || "N/A"}</td>
                <td className="permis-numero">{item.permis_numero}</td>
                <td>{new Date(item.permis_date_debut).toLocaleDateString()}</td>
                <td>{new Date(item.permis_date_fin).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/permis/${item.id}`)}
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

export default PermisAnimalsList;
