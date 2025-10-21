import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:3000/usuarios?email=${email}&senha=${senha}`);
      if (res.data.length > 0) {
        return res.data[0];
      } else {
        return rejectWithValue("E-mail ou senha inválidos");
      }
    } catch (err) {
      return rejectWithValue("Erro ao conectar ao servidor");
    }
  }
);

// Persistência do usuário no localStorage
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
  },
  reducers: {
    logout(state) {
      state.usuario = null;
      state.error = null;
      localStorage.removeItem("usuario");
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
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;