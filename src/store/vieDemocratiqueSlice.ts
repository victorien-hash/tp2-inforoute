import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getVieDemocratique, getVieDemocratiqueDetail } from "../api/VieDemocratique.api";

interface VieDemocratiqueItem {
  id?: number;
  nom_institutionnel?: string;
  nom_specifique?: string;
  type_rencontre?: string;
  date_rencontre?: string;
  endroit?: string;
  nom_lieu?: string;
  salle?: string;
  rue?: string;
  numero_civique?: string;
  [key: string]: any;
}

interface VieDemocratiqueState {
  dataList: VieDemocratiqueItem[];
  data: VieDemocratiqueItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: VieDemocratiqueState = {
  dataList: [],
  data: null,
  loading: false,
  error: null,
};

export const fetchVieDemocratique = createAsyncThunk(
  "vieDemocratique/fetchVieDemocratique",
  async () => {
    const res = await getVieDemocratique();
    if (res.data && res.data.results) return res.data.results;
    if (Array.isArray(res.data)) return res.data;
    return [];
  }
);

export const fetchVieDemocratiqueDetail = createAsyncThunk(
  "vieDemocratique/fetchVieDemocratiqueDetail",
  async (id: number) => {
    const res = await getVieDemocratiqueDetail(id);
    return res.data as VieDemocratiqueItem;
  }
);

const vieDemocratiqueSlice = createSlice({
  name: "vieDemocratique",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVieDemocratique.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVieDemocratique.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchVieDemocratique.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      })
      .addCase(fetchVieDemocratiqueDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVieDemocratiqueDetail.fulfilled, (state, action: PayloadAction<VieDemocratiqueItem>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchVieDemocratiqueDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      });
  },
});

export default vieDemocratiqueSlice.reducer;