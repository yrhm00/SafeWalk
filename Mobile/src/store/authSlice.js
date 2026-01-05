import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { saveToken, getToken, removeToken } from "../services/secureStore";

// --- ACTIONS ASYNCHRONES (Celles qui parlent à l'API) ---

// Récupère la session au démarrage de l'app
export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const token = await getToken();
    if (!token) return { token: null, user: null };
    const meRes = await api.get("/api/v1/users/me", { headers: { Authorization: `Bearer ${token}` } });
    return { token, user: meRes.data };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// Connexion
export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/v1/users/login", { email, password });
    await saveToken(res.data.token);
    return res.data; // contient { token, user }
  } catch (e) {
    return rejectWithValue(e.response?.data || "Erreur de connexion");
  }
});

// Inscription + Connexion automatique
export const registerThunk = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    await api.post("/api/v1/users/register", userData);
    const loginRes = await api.post("/api/v1/users/login", { email: userData.email, password: userData.password });
    await saveToken(loginRes.data.token);
    return loginRes.data;
  } catch (e) {
    return rejectWithValue(e.response?.data || "Erreur d'inscription");
  }
});

// Déconnexion
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await removeToken();
  return true;
});

// --- LE SLICE (Le cerveau de l'authentification) ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,   // Infos de l'utilisateur (nom, email, etc.)
    token: null,  // Le jeton de sécurité
    loading: true, // Est-ce qu'on est en train de charger ?
    error: null,  // Message d'erreur s'il y en a un
  },
  reducers: {
    // Action simple pour vider les erreurs
    clearError: (state) => { state.error = null; },
    
    // ✅ CETTE ACTION MANQUAIT : Elle met à jour le store après un Edit Profile
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // 1. Gestion de la session au démarrage
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(restoreSession.rejected, (state) => {
      state.loading = false;
    });

    // 2. Gestion commune pour Login et Register (ils font la même chose en cas de succès)
    const handleAuthFullfilled = (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    };

    builder.addCase(loginThunk.fulfilled, handleAuthFullfilled);
    builder.addCase(registerThunk.fulfilled, handleAuthFullfilled);

    // 3. Déconnexion
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.token = null;
      state.user = null;
    });

     // 4. Gestion des erreurs
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => { state.error = action.payload; }
    );
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;