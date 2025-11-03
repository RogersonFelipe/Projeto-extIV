import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/usuarios`,
        { params: { email, senha } }
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data[0];
      }
      return rejectWithValue("E-mail ou senha inválidos");
    } catch (err) {
      return rejectWithValue("Erro ao conectar ao servidor");
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  "auth/updateProfileAsync",
  async (dadosAtualizados, { getState, rejectWithValue }) => {
    try {
      const { auth: { usuario } } = getState();
      if (!usuario?.id) return rejectWithValue("Usuário não autenticado.");

      const res = await axios.patch(
        `http://localhost:3000/usuarios/${usuario.id}`,
        dadosAtualizados
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Erro ao atualizar o perfil no servidor.");
    }
  }
);

const initialUser = (() => {
  try {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    usuario: initialUser,
    loading: false,
    error: null,
    saving: false,
    saveError: null,
  },
  reducers: {
    logout(state) {
      state.usuario = null;
      state.error = null;
      localStorage.removeItem("usuario");
    },

    updateProfile(state, action) {
      if (!state.usuario) return;
      state.usuario = { ...state.usuario, ...action.payload };
      localStorage.setItem("usuario", JSON.stringify(state.usuario));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
        state.error = null;
        localStorage.setItem("usuario", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.usuario = null;
        state.error = action.payload || "Falha no login";
      })

      .addCase(updateProfileAsync.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.saving = false;
        state.usuario = { ...state.usuario, ...action.payload };
        localStorage.setItem("usuario", JSON.stringify(state.usuario));
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload || "Falha ao salvar perfil";
      });
  },
});

export const { logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
