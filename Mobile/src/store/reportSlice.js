import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 🔄 Récupérer tous les reports
export const fetchReports = createAsyncThunk(
  "reports/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const res = await api.get("/api/v1/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    list: [],
    loading: false,
    error: null,
    filter: "all", // all | low | medium | high
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter } = reportSlice.actions;
export default reportSlice.reducer;
