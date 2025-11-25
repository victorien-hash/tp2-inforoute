import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getInterventionPompierDetail, getInterventionsPompiers } from "../api/interventionPompier.api.ts";

// --- Type de Données ---
interface InterventionPompier {
  id: number;
  date_heure_alerte: string;
  rue: string;
  code_postal_partiel: string;
  caserne: string;
  code_type: string;
  desc_type: string;
  code_sous_type: string;
  desc_sous_type: string;
}

interface InterventionPompierState {
  data: InterventionPompier | null;
  dataList: InterventionPompier[];
  loading: boolean;
  error: string | null;
}

const initialState: InterventionPompierState = {
  data: null,
  dataList: [],
  loading: false,
  error: null,
};

// --- Thunks Asynchrones ---
export const fetchInterventionsPompiersList = createAsyncThunk(
  "interventionPompier/fetchInterventionsPompiersList",
  async () => {
    const res = await getInterventionsPompiers();
    return res.data;
  }
);

export const fetchInterventionsPompiers = createAsyncThunk(
  "interventionPompier/fetchInterventionsPompiers",
  async (id: number) => {
    const res = await getInterventionPompierDetail(id);
    return res.data as InterventionPompier;
  }
);

// --- Slice ---
const interventionPompierSlice = createSlice({
  name: "interventionPompier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterventionsPompiersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterventionsPompiersList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
      })
      .addCase(fetchInterventionsPompiersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      })
      .addCase(fetchInterventionsPompiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInterventionsPompiers.fulfilled,
        (state, action: PayloadAction<InterventionPompier>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchInterventionsPompiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      });
  },
});

export default interventionPompierSlice.reducer;
