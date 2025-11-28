import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getPermisConstructionList, getPermisConstructionDetail } from "../api/permisConstruction.api";

interface PermisConstructionItem {
  id?: number;
  no_permis?: string;
  type_permis?: string;
  type_permis_descr?: string;
  categorie_batiment?: string;
  type_batiment?: string;
  date_emission?: string;
  adresse?: string;
  cout_permis?: number;
  exville_descr?: string;
  [key: string]: any;
}

interface PermisConstructionState {
  data: PermisConstructionItem | null;
  dataList: PermisConstructionItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PermisConstructionState = {
  data: null,
  dataList: [],
  loading: false,
  error: null,
};

export const fetchPermisConstructionList = createAsyncThunk(
  "permisConstruction/fetchPermisConstructionList",
  async () => {
    const res = await getPermisConstructionList();
    return res.data;
  }
);

export const fetchPermisConstruction = createAsyncThunk(
  "permisConstruction/fetchPermisConstruction",
  async (id: number) => {
    const res = await getPermisConstructionDetail(id);
    return res.data as PermisConstructionItem;
  }
);

const permisConstructionSlice = createSlice({
  name: "permisConstruction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermisConstructionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisConstructionList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
      })
      .addCase(fetchPermisConstructionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors du chargement des permis de construction";
      })
      .addCase(fetchPermisConstruction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisConstruction.fulfilled, (state, action: PayloadAction<PermisConstructionItem>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPermisConstruction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors du chargement du permis";
      });
  },
});

export default permisConstructionSlice.reducer;
