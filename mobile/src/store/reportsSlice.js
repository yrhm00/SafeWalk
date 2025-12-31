import { createSlice } from '@reduxjs/toolkit';

const reportsSlice = createSlice({
    name: 'reports',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        setReports: (state, action) => {
            state.items = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        setLoading: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        // Action optimiste maintenue si besoin
        addReportOptimistic: (state, action) => {
            state.items.push(action.payload);
        },
    }
});

export const { setReports, setLoading, setError, addReportOptimistic } = reportsSlice.actions;

// Selectors
export const selectAllReports = (state) => state.reports.items;
export const selectReportsStatus = (state) => state.reports.status;

export default reportsSlice.reducer;
