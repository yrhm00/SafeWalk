import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { saveToken, getToken, removeToken } from "../services/secureStore";

// ✅ 1) RESTORE SESSION (au démarrage)
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();
      if (!token) return { token: null, user: null };

      // On met le token dans l’état d’abord
      // puis on appelle /me (axios interceptor utilisera le token, on le fera étape 5)
      const meRes = await api.get("/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` }, // simple pour l’instant
      });

      return { token, user: meRes.data };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

// ✅ 2) LOGIN
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/users/login", { email, password });
      const { token, user } = res.data;

      await saveToken(token);

      return { token, user };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

// ✅ 2) Register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, username, email, password }, { rejectWithValue }) => {
    try {
      // 1️⃣ Création du compte
      await api.post("/api/v1/users/register", {
        name,
        username,
        email,
        password,
      });

      // 2️⃣ Login automatique
      const loginRes = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      const { token, user } = loginRes.data;

      await saveToken(token);

      return { token, user };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);


// ✅ 3) LOGOUT
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await removeToken();
  return true;
});

const initialState = {
  user: null,
  token: null,
  loading: true, // au lancement on est en "loading" le temps du restore
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // (optionnel) si tu veux des actions sync
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // restoreSession
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || "Restore failed";
      });

    // loginThunk
    builder
      .addCase(loginThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload || "Login failed";
      });

    // register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.payload || "Register failed";
      });

    // logoutThunk
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.token = null;
      state.user = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
