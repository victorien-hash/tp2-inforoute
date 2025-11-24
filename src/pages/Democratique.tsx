import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVieDemocratique } from "../store/vieDemocratiqueSlice";
import type { RootState, AppDispatch } from "../store/store";

const VieDemocratique = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.vieDemocratique);

  useEffect(() => {
    dispatch(fetchVieDemocratique());
  }, [dispatch]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Vie Démocratique</h2>
      {data && data.length > 0 ? (
        <div>
          {data.map((item: any, index: number) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
};

export default VieDemocratique;