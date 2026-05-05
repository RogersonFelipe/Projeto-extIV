import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/axios';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, senha });
      const { access_token, usuario } = res.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      return usuario;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Credenciais inválidas'
      );
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfileAsync',
  async (dadosAtualizados, { getState, rejectWithValue }) => {
    try {
      const { usuario } = getState().auth;
      const res = await api.patch(`/usuarios/${usuario.id}`, dadosAtualizados);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Erro ao atualizar perfil'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: getStoredUser(),
    token: localStorage.getItem('token') ?? null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.usuario = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    },
    clearError(state) {
      state.error = null;
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
        localStorage.setItem('usuario', JSON.stringify(action.payload));
        state.token = localStorage.getItem('token');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.usuario = { ...state.usuario, ...action.payload };
        localStorage.setItem('usuario', JSON.stringify(state.usuario));
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
