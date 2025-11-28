import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getBonTravailList, getBonTravailDetail } from "../api/bonTravail.api";

interface BonTravailItem {
  id?: number;
  probleme?: string;
  date_realisee?: string;
  secteur?: string;
  district?: string;
  [key: string]: any;
}

interface BonTravailState {
  data: BonTravailItem | null;
  dataList: BonTravailItem[];
  loading: boolean;
  error: string | null;
}

const initialState: BonTravailState = {
  data: null,
  dataList: [],
  loading: false,
  error: null,
};

export const fetchBonTravailList = createAsyncThunk(
  "bonTravail/fetchBonTravailList",
  async () => {
    const res = await getBonTravailList();
    return res.data;
  }
);

export const fetchBonTravail = createAsyncThunk(
  "bonTravail/fetchBonTravail",
  async (id: number) => {
    const res = await getBonTravailDetail(id);
    return res.data as BonTravailItem;
  }
);

const bonTravailSlice = createSlice({
  name: "bonTravail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonTravailList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBonTravailList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
      })
      .addCase(fetchBonTravailList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors du chargement des Bon Travaux";
      })
      .addCase(fetchBonTravail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBonTravail.fulfilled, (state, action: PayloadAction<BonTravailItem>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBonTravail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors du chargement du Bon Travail";
      });
  },
});

export default bonTravailSlice.reducer;
