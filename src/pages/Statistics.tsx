import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { fetchPermisAnimals } from "../store/permisSlice";
import { fetchInterventionsPompiersList } from "../store/interventionPompierSlice";
import { fetchRegistreGesList } from "../store/registreGesSlice";
import { fetchVieDemocratique } from "../store/vieDemocratiqueSlice";
import type { RootState, AppDispatch } from "../store/store";
import "../styles/DataList.css";
import UserBar from "../components/UserBar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"];

const Statistics = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { dataList: permis } = useSelector((state: RootState) => state.permis);
  const { dataList: interventions } = useSelector(
    (state: RootState) => state.interventionPompier
  );
  const { dataList: registreGes } = useSelector((state: RootState) => state.registreGes);
  const { dataList: vieDemocratique } = useSelector((state: RootState) => state.vieDemocratique);

  const [searchFilters, setSearchFilters] = useState({
    permisType: "",
    interventionType: "",
    gesRegion: "",
    vieDemoType: "",
  });

  useEffect(() => {
    dispatch(fetchPermisAnimals());
    dispatch(fetchInterventionsPompiersList());
    dispatch(fetchRegistreGesList());
    dispatch(fetchVieDemocratique());
  }, [dispatch]);

  // --- Chart 1: Animal Types Distribution (Pie Chart) ---
  const animalTypeData = permis
    ? Object.entries(
        (permis as any[]).reduce((acc: any, item: any) => {
          const type = item.animal_type_permis || "N/A";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  const filteredAnimalData = searchFilters.permisType
    ? animalTypeData.filter((d) => d.name === searchFilters.permisType)
    : animalTypeData;

  // --- Chart 2: Interventions by Caserne (Bar Chart) ---
  const caserneData = interventions
    ? Object.entries(
        (interventions as any[]).reduce((acc: any, item: any) => {
          const caserne = item.caserne || "N/A";
          acc[caserne] = (acc[caserne] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => (b.count as number) - (a.count as number))
        .slice(0, 8) // Top 8
    : [];

  // --- Chart 3: GES Emissions by Region (Bar Chart) ---
  const gesRegionData = registreGes
    ? Object.entries(
        (registreGes as any[]).reduce((acc: any, item: any) => {
          const region = item.region || "N/A";
          acc[region] = (acc[region] || 0) + Number(item.em_tot || 0);
          return acc;
        }, {})
      )
        .map(([region, emissions]) => ({ region, emissions: Number(emissions).toFixed(2) }))
        .sort((a, b) => Number(b.emissions) - Number(a.emissions))
        .slice(0, 10)
    : [];

  const filteredGesData = searchFilters.gesRegion
    ? gesRegionData.filter((d) => d.region === searchFilters.gesRegion)
    : gesRegionData;

  // --- Chart 4: Vie Democratique by Type (Donut Chart) ---
  const vieDemoTypeData = vieDemocratique
    ? Object.entries(
        (vieDemocratique as any[]).reduce((acc: any, item: any) => {
          const type = item.type_rencontre || "N/A";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // --- Chart 5: Interventions Over Time (Line Chart) ---
  const interventionsTimelineData = interventions
    ? Object.entries(
        (interventions as any[]).reduce((acc: any, item: any) => {
          const date = item.date_heure_alerte ? new Date(item.date_heure_alerte).toLocaleDateString() : "N/A";
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([date, count]) => ({ date, interventions: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30) // Last 30 days
    : [];

  // --- Chart 6: Data Distribution Summary (Scatter) ---
  const dataSummary = [
    { entity: "Permis Animaux", count: permis?.length || 0, x: 1 },
    { entity: "Interventions", count: interventions?.length || 0, x: 2 },
    { entity: "Registre GES", count: registreGes?.length || 0, x: 3 },
    { entity: "Vie Démocratique", count: vieDemocratique?.length || 0, x: 4 },
  ];

  return (
    <div className="data-list-container" style={{ padding: "20px" }}>
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>📊 Visualisation Statistique des Données</h1>
          <UserBar />
        </div>
        <p className="total-items">
          Total : {(permis?.length || 0) + (interventions?.length || 0) + (registreGes?.length || 0) + (vieDemocratique?.length || 0)} enregistrements
        </p>
      </header>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
        <button
          className="btn-export"
          onClick={async () => {
            const container = document.getElementById('statistics-charts');
            if (!container) {
              alert('Zone de capture introuvable.');
              return;
            }

            try {
              // dynamic import to avoid SSR issues and keep bundler happy
              const { default: jspdf } = await import('jspdf');
              const html2canvas = (await import('html2canvas')).default;
              const doc = new jspdf('p', 'mm', 'a4');
              const now = new Date();
              const headerText = 'Visualisation Statistique - Export';
                const footerText = `Généré le ${now.toLocaleDateString()} à ${now.toLocaleTimeString()}`;

              const canvas = await html2canvas(container, { scale: 2, useCORS: true });
              const imgData = canvas.toDataURL('image/png');

              const imgProps = (doc as any).getImageProperties(imgData);
              const pdfWidth = doc.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              const margin = 10;
              const pageHeight = doc.internal.pageSize.getHeight();

              // Add header
              doc.setFontSize(12);
              doc.text(headerText, margin, 12);

              // Place first image
              let position = 20;
              doc.addImage(imgData, 'PNG', margin, position, pdfWidth - margin * 2, pdfHeight);

              // If content overflows, add pages
              let heightLeft = pdfHeight - (pageHeight - position - margin);
              let page = 1;
              while (heightLeft > 0) {
                doc.addPage();
                page += 1;
                const y = position - (page - 1) * (pageHeight - margin * 2);
                doc.addImage(imgData, 'PNG', margin, y, pdfWidth - margin * 2, pdfHeight);
                heightLeft -= (pageHeight - margin * 2);
              }

              // Footer on last page
              doc.setPage(page);
              doc.setFontSize(9);
              doc.text(footerText, margin, pageHeight - 10);

              const fileName = `statistics_export_${now.toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`;
              doc.save(fileName);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
              alert('Erreur lors de la génération du PDF.');
            }
          }}
        >
          Exporter en PDF
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <select
            value={searchFilters.permisType}
            onChange={(e) => setSearchFilters({ ...searchFilters, permisType: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous les types d'animaux</option>
            {animalTypeData.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={searchFilters.gesRegion}
            onChange={(e) => setSearchFilters({ ...searchFilters, gesRegion: e.target.value })}
            className="filter-select"
          >
            <option value="">Toutes les régions (GES)</option>
            {gesRegionData.map((d) => (
              <option key={d.region} value={d.region}>
                {d.region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Container */}
      <div id="statistics-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        {/* Chart 1: Animal Types Distribution */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#f9f9f9" }}>
          <h3 style={{ marginTop: 0 }}>🐾 Distribution par Type d'Animal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredAnimalData.length > 0 ? filteredAnimalData : animalTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(filteredAnimalData.length > 0 ? filteredAnimalData : animalTypeData).map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Interventions by Caserne */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#f9f9f9" }}>
          <h3 style={{ marginTop: 0 }}>🚒 Interventions par Caserne (Top 8)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caserneData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: GES Emissions by Region */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#f9f9f9" }}>
          <h3 style={{ marginTop: 0 }}>🌍 Émissions GES par Région (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredGesData.length > 0 ? filteredGesData : gesRegionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" width={190} />
              <Tooltip />
              <Bar dataKey="emissions" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Vie Democratique by Type */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#f9f9f9" }}>
          <h3 style={{ marginTop: 0 }}>🏛️ Vie Démocratique par Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vieDemoTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {vieDemoTypeData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 5: Interventions Timeline */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#f9f9f9", gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>📈 Évolution Temporelle des Interventions (30 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={interventionsTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="interventions" stroke="#FF8042" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 6: Data Summary */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#f9f9f9", gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>📊 Résumé des Entités</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Entity" />
              <YAxis type="number" dataKey="count" name="Count" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Entités" data={dataSummary} fill="#8884d8">
                {dataSummary.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}-${entry.entity}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {dataSummary.map((item) => (
              <div key={item.entity} style={{ padding: "10px", background: "#fff", border: "1px solid #eee", borderRadius: "4px", textAlign: "center" }}>
                <strong>{item.count}</strong>
                <div style={{ fontSize: "0.85em", color: "#666" }}>{item.entity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
