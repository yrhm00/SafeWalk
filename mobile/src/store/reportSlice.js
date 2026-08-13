import { createSlice } from "@reduxjs/toolkit";

export const REPORTS_LIMIT = 20;

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    list: [],
    loading: false,
    offset: 0,
    hasMore: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setReports: (state, action) => {
      state.list = action.payload.reports;
      state.offset = action.payload.reports.length;
      state.hasMore = action.payload.hasMore;
      state.loading = false;
    },
    appendReports: (state, action) => {
      state.list = [...state.list, ...action.payload.reports];
      state.offset = state.offset + action.payload.reports.length;
      state.hasMore = action.payload.hasMore;
      state.loading = false;
    },
    addReport: (state, action) => {
      state.list = [action.payload, ...state.list];
      state.offset = state.offset + 1;
    },
  },
});

export const { setLoading, setReports, appendReports, addReport } =
  reportSlice.actions;
export default reportSlice.reducer;
