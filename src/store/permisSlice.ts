import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPermisAnimal } from "../api/permis.api";

export const fetchPermisAnimal = createAsyncThunk(
  "permis/fetchPermisAnimal",
  async (id: number) => {
    const res = await getPermisAnimal(id);
    return res.data;
  }
);

interface PermisState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: PermisState = {
  data: null,
  loading: false,
  error: null,
};

const permisSlice = createSlice({
  name: "permis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermisAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPermisAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      });
  },
});

export default permisSlice.reducer;