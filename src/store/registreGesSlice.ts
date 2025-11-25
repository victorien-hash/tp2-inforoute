import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getRegistreGes, getRegistreGesList } from "../api/registerGES.api";

// --- Type de Données (basé sur votre modèle Django) ---
interface RegistreGesData {
  id?: number;
  num_sago: string;
  annee: number;
  entreprise: string;
  etablissement: string;
  em_tot: number; // Émissions totales
  region: string;
}

interface RegistreGesState {
  data: RegistreGesData | null;
  dataList: RegistreGesData[];
  loading: boolean;
  error: string | null;
}

const initialState: RegistreGesState = {
  data: null,
  dataList: [],
  loading: false,
  error: null,
};

// --- Thunks Asynchrones ---
export const fetchRegistreGesList = createAsyncThunk(
  "registreGes/fetchRegistreGesList",
  async () => {
    const res = await getRegistreGesList();
    return res.data;
  }
);

export const fetchRegistreGes = createAsyncThunk(
  "registreGes/fetchRegistreGes",
  async (id: number) => {
    const res = await getRegistreGes(id);
    return res.data as RegistreGesData;
  }
);

// --- Slice ---
const registreGesSlice = createSlice({
  name: "registreGes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistreGesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistreGesList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
      })
      .addCase(fetchRegistreGesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors du chargement du Registre GES";
      })
      .addCase(fetchRegistreGes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistreGes.fulfilled, (state, action: PayloadAction<RegistreGesData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRegistreGes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors du chargement du Registre GES";
      });
  },
});

export default registreGesSlice.reducer;