import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVieDemocratique } from "../api/VieDemocratique.api";

export const fetchVieDemocratique = createAsyncThunk(
  "vieDemocratique/fetchVieDemocratique",
  async () => {
    const res = await getVieDemocratique();
    return res.data;
  }
);

interface VieDemocratiqueState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: VieDemocratiqueState = {
  data: [],
  loading: false,
  error: null,
};

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
        state.data = action.payload;
      })
      .addCase(fetchVieDemocratique.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      });
  },
});

export default vieDemocratiqueSlice.reducer;