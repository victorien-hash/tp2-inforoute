import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermisAnimal } from "../store/permisSlice";
import type { RootState, AppDispatch } from "../store/store";

const PermisAnimal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.permis);

  useEffect(() => {
    dispatch(fetchPermisAnimal(1));
  }, [dispatch]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Permis Animal</h2>
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};

export default PermisAnimal;