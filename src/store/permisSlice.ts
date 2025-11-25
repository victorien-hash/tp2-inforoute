import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPermisAnimal, getPermisAnimals } from "../api/permis.api";

export const fetchPermisAnimals = createAsyncThunk(
  "permis/fetchPermisAnimals",
  async () => {
    const res = await getPermisAnimals();
    return res.data;
  }
);

export const fetchPermisAnimal = createAsyncThunk(
  "permis/fetchPermisAnimal",
  async (id: number) => {
    const res = await getPermisAnimal(id);
    return res.data;
  }
);

interface PermisState {
  data: any;
  dataList: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PermisState = {
  data: null,
  dataList: [],
  loading: false,
  error: null,
};

const permisSlice = createSlice({
  name: "permis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermisAnimals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
      })
      .addCase(fetchPermisAnimals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      })
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