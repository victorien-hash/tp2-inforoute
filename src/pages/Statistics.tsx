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
  ResponsiveContainer,
  
} from "recharts";
import { fetchPermisAnimals } from "../store/permisSlice";
import { fetchInterventionsPompiersList } from "../store/interventionPompierSlice";
import { fetchRegistreGesList } from "../store/registreGesSlice";
import { fetchVieDemocratique } from "../store/vieDemocratiqueSlice";
import { fetchBonTravailList } from "../store/bonTravailSlice";
import { fetchPermisConstructionList } from "../store/permisConstructionSlice";
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

  // filters that depend on the selected dataset
  const [currentFilters, setCurrentFilters] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    dispatch(fetchPermisAnimals());
    dispatch(fetchInterventionsPompiersList());
    dispatch(fetchRegistreGesList());
    dispatch(fetchVieDemocratique());
    dispatch(fetchBonTravailList());
    dispatch(fetchPermisConstructionList());
  }, [dispatch]);

  // --- Chart 1: Animal Types Distribution (Pie Chart) ---
  const uniqueAnimalTypes = Array.from(new Set((permis as any[] || []).map((it: any) => it.animal_type_permis).filter(Boolean)));

  const animalTypeData = Object.entries(
    (permis as any[] || [])
      .filter((it: any) => !currentFilters.permisType || it.animal_type_permis === currentFilters.permisType)
      .reduce((acc: any, item: any) => {
        const type = item.animal_type_permis || "N/A";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // --- Chart 2: Interventions by Caserne (Bar Chart) ---
  const uniqueCaserne = Array.from(new Set((interventions as any[] || []).map((it: any) => it.caserne).filter(Boolean)));
  const caserneData = Object.entries(
    (interventions as any[] || [])
      .filter((it: any) => !currentFilters.caserne || it.caserne === currentFilters.caserne)
      .reduce((acc: any, item: any) => {
        const caserne = item.caserne || "N/A";
        acc[caserne] = (acc[caserne] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 8);

  // --- Chart 3: GES Emissions by Region (Bar Chart) ---
  const uniqueGesRegions = Array.from(new Set((registreGes as any[] || []).map((it: any) => it.region).filter(Boolean)));
  const gesRegionData = Object.entries(
    (registreGes as any[] || [])
      .filter((it: any) => !currentFilters.gesRegion || it.region === currentFilters.gesRegion)
      .reduce((acc: any, item: any) => {
        const region = item.region || "N/A";
        acc[region] = (acc[region] || 0) + Number(item.em_tot || 0);
        return acc;
      }, {} as Record<string, number>)
  )
    .map(([region, emissions]) => ({ region, emissions: Number(emissions).toFixed(2) }))
    .sort((a, b) => Number(b.emissions) - Number(a.emissions))
    .slice(0, 10);

  // --- Chart 4: Vie Democratique by Type (Donut Chart) ---
  const uniqueVieTypes = Array.from(new Set((vieDemocratique as any[] || []).map((it: any) => it.type_rencontre).filter(Boolean)));
  const uniqueVieYears = Array.from(new Set((vieDemocratique as any[] || []).map((it: any) => (it.date ? new Date(it.date).getFullYear() : null)).filter(Boolean)));
  const vieFiltered = (vieDemocratique as any[] || []).filter((it: any) => {
    if (currentFilters.vieType && it.type_rencontre !== currentFilters.vieType) return false;
    if (currentFilters.vieYear && it.date) {
      const y = new Date(it.date).getFullYear();
      if (String(y) !== String(currentFilters.vieYear)) return false;
    }
    return true;
  });
  const vieDemoTypeData = Object.entries(vieFiltered.reduce((acc: any, item: any) => { const type = item.type_rencontre || 'N/A'; acc[type] = (acc[type]||0)+1; return acc; }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

  // --- Chart 5: Interventions Over Time (Line Chart) ---
  const interventionsTimelineData = Object.entries(
    (interventions as any[] || [])
      .filter((it: any) => !currentFilters.caserne || it.caserne === currentFilters.caserne)
      .reduce((acc: any, item: any) => {
        const date = item.date_heure_alerte ? new Date(item.date_heure_alerte).toLocaleDateString() : "N/A";
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  ).map(([date, count]) => ({ date, interventions: count })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-30);

  

  // --- Additional datasets (BonTravail, PermisConstruction) ---
  const { dataList: bonTravail = [] } = useSelector((state: RootState) => state.bonTravail);
  const { dataList: permisConstruction = [] } = useSelector((state: RootState) => state.permisConstruction);

  const uniqueBonSecteurs = Array.from(new Set((bonTravail as any[] || []).map((it: any) => it.secteur).filter(Boolean)));
  const uniqueBonDistricts = Array.from(new Set((bonTravail as any[] || []).map((it: any) => it.district).filter(Boolean)));

  const uniquePermisTypes = Array.from(new Set((permisConstruction as any[] || []).map((it: any) => it.type_permis_descr || it.type_permis).filter(Boolean)));
  const uniquePermisCities = Array.from(new Set((permisConstruction as any[] || []).map((it: any) => it.exville_descr).filter(Boolean)));

  

  // Selected dataset state
  const [selectedDataset, setSelectedDataset] = useState<string>("Permis Animaux");

  // reset filters when switching dataset
  useEffect(() => {
    setCurrentFilters({});
  }, [selectedDataset]);

  const datasets = [
    "Permis Animaux",
    "Interventions",
    "Registre GES",
    "Vie Démocratique",
    "BonTravail Aqueduc",
    "Permis Construction",
  ];

  // Helper: render 3 cards for selected dataset
  const renderDatasetCharts = () => {
    switch (selectedDataset) {
      case "Permis Animaux": {
        // reuse animalTypeData
        const typeCounts = animalTypeData;
        const topTypes = typeCounts.sort((a: any, b: any) => (b.value as number) - (a.value as number)).slice(0, 8);
        return (
          <>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>🐾 Distribution par Type d'Animal</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={typeCounts} dataKey="value" nameKey="name" outerRadius={80} labelLine={false} label={({ name, value }) => `${name}: ${value}`}>
                    {typeCounts.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Top Types (Bar)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Permis Animaux</h3>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{permis?.length || 0}</div>
              </div>
              <div style={{ color: "#667eea" }}>🐾</div>
            </div>
          </>
        );
      }

      case "Interventions": {
        return (
          <>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>🚒 Interventions par Caserne (Top 8)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={caserneData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>📈 Évolution Temporelle (30 derniers jours)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={interventionsTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interventions" stroke="#FF8042" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Interventions</h3>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{interventions?.length || 0}</div>
              </div>
              <div style={{ color: "#00C49F" }}>🚒</div>
            </div>
          </>
        );
      }

      case "Registre GES": {
        return (
          <>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>🌍 Émissions GES par Région (Top 10)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={gesRegionData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="emissions" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Répartition par Région (Pie)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={gesRegionData.map((d: any) => ({ name: d.region, value: Number(d.emissions) }))} dataKey="value" nameKey="name" outerRadius={80} labelLine={false} label={({ name, value }) => `${name}: ${value}`}>
                    {gesRegionData.map((_entry: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Enregistrements GES</h3>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{registreGes?.length || 0}</div>
              </div>
              <div style={{ color: "#FFBB28" }}>🌍</div>
            </div>
          </>
        );
      }

      case "Vie Démocratique": {
        const yearCounts = Array.from(new Set((vieDemocratique as any[]).map((it: any) => (it.date ? new Date(it.date).getFullYear() : 'N/A'))))
          .map((y: any) => ({ year: y, count: (vieDemocratique as any[]).filter((it: any) => (it.date ? new Date(it.date).getFullYear() === y : false)).length }));
        return (
          <>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>🏛️ Vie Démocratique par Type</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={vieDemoTypeData} dataKey="value" nameKey="name" outerRadius={80} labelLine={false} label={({ name, value }) => `${name}: ${value}`}>
                    {vieDemoTypeData.map((_entry: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Par Année (Bar)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yearCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884D8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Vie Démocratique</h3>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{vieDemocratique?.length || 0}</div>
              </div>
              <div style={{ color: "#667eea" }}>🏛️</div>
            </div>
          </>
        );
      }

      case "BonTravail Aqueduc": {
        const secteurData = bonTravail ? Object.entries((bonTravail as any[]).reduce((acc: any, it: any) => { const s = it.secteur || 'N/A'; acc[s] = (acc[s]||0)+1; return acc; }, {})).map(([name, value]) => ({ name, value })) : [];
        const districtData = bonTravail ? Object.entries((bonTravail as any[]).reduce((acc: any, it: any) => { const d = it.district || 'N/A'; acc[d] = (acc[d]||0)+1; return acc; }, {})).map(([name, value]) => ({ name, value })) : [];
        return (
          <>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Secteur (Top)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={secteurData.slice(0,8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82CA9D" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Répartition par District</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={districtData} dataKey="value" nameKey="name" outerRadius={80} labelLine={false} label={({ name, value }) => `${name}: ${value}`}>
                    {districtData.map((_entry: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total BonTravail</h3>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{bonTravail?.length || 0}</div>
              </div>
              <div style={{ color: "#82CA9D" }}>🚰</div>
            </div>
          </>
        );
      }

      case "Permis Construction": {
        const typeCounts = Array.from(new Set((permisConstruction as any[]).map((it: any) => it.type_permis_descr || it.type_permis))).map((t: any) => ({ name: t, value: (permisConstruction as any[]).filter((it: any) => (it.type_permis_descr||it.type_permis) === t).length }));
        const cityCounts = Array.from(new Set((permisConstruction as any[]).map((it: any) => it.exville_descr))).map((c: any) => ({ name: c, value: (permisConstruction as any[]).filter((it: any) => it.exville_descr === c).length }));
        return (
          <>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Types de Permis</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={typeCounts} dataKey="value" nameKey="name" outerRadius={80} labelLine={false} label={({ name, value }) => `${name}: ${value}`}>
                    {typeCounts.map((_entry: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#f9f9f9" }}>
              <h3 style={{ marginTop: 0 }}>Top Villes</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cityCounts.slice(0,8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Permis Construction</h3>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{permisConstruction?.length || 0}</div>
              </div>
              <div style={{ color: "#667eea" }}>🏗️</div>
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="data-list-container" style={{ padding: "20px" }}>
      <header className="list-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>📊 Visualisation Statistique des Données</h1>
          <UserBar />
        </div>
        <p className="total-items">
          Total : {(permis?.length || 0) + (interventions?.length || 0) + (registreGes?.length || 0) + (vieDemocratique?.length || 0) + (bonTravail?.length || 0) + (permisConstruction?.length || 0)} enregistrements
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

      {/* Dataset-specific Filters */}
      <div className="filters-section">
        {/* Render filters depending on selected dataset */}
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {selectedDataset === 'Permis Animaux' && (
            <select value={currentFilters.permisType || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, permisType: e.target.value || undefined })} className="filter-select">
              <option value="">Tous les types d'animaux</option>
              {uniqueAnimalTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          )}

          {selectedDataset === 'Interventions' && (
            <select value={currentFilters.caserne || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, caserne: e.target.value || undefined })} className="filter-select">
              <option value="">Toutes les casernes</option>
              {uniqueCaserne.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          )}

          {selectedDataset === 'Registre GES' && (
            <select value={currentFilters.gesRegion || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, gesRegion: e.target.value || undefined })} className="filter-select">
              <option value="">Toutes les régions (GES)</option>
              {uniqueGesRegions.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          )}

          {selectedDataset === 'Vie Démocratique' && (
            <>
              <select value={currentFilters.vieType || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, vieType: e.target.value || undefined })} className="filter-select">
                <option value="">Tous les types</option>
                {uniqueVieTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
              <select value={currentFilters.vieYear || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, vieYear: e.target.value || undefined })} className="filter-select">
                <option value="">Toutes les années</option>
                {uniqueVieYears.filter(y => y !== null).map((y) => (<option key={y} value={y!}>{y}</option>))}
              </select>
            </>
          )}

          {selectedDataset === 'BonTravail Aqueduc' && (
            <>
              <select value={currentFilters.secteur || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, secteur: e.target.value || undefined })} className="filter-select">
                <option value="">Tous les secteurs</option>
                {uniqueBonSecteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <select value={currentFilters.district || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, district: e.target.value || undefined })} className="filter-select">
                <option value="">Tous les districts</option>
                {uniqueBonDistricts.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </>
          )}

          {selectedDataset === 'Permis Construction' && (
            <>
              <select value={currentFilters.permisType || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, permisType: e.target.value || undefined })} className="filter-select">
                <option value="">Tous les types de permis</option>
                {uniquePermisTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
              <select value={currentFilters.city || ''} onChange={(e) => setCurrentFilters({ ...currentFilters, city: e.target.value || undefined })} className="filter-select">
                <option value="">Toutes les villes</option>
                {uniquePermisCities.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Dataset selector and Charts Container */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {datasets.map((ds) => (
            <button
              key={ds}
              onClick={() => setSelectedDataset(ds)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: selectedDataset === ds ? '2px solid #667eea' : '1px solid #ddd',
                background: selectedDataset === ds ? '#eef2ff' : '#fff',
                cursor: 'pointer'
              }}
            >
              {ds}
            </button>
          ))}
        </div>

        <div id="statistics-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "0px" }}>
          {renderDatasetCharts()}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
