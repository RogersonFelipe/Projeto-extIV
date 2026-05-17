import React, { useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice";
import Usuarios_Encaminhados from "./usuarios-encaminhados/Usuarios_Encaminhados";
import Recuperar_Senha from "./login/recuperar-senha/Recuperar_Senha";
import Nova_Senha from "./login/nova-senha/Nova_Senha";
import Avaliacao from "./avaliacao/Avaliacao";
import Perfil from "./perfil/Perfil";
import GerenciarRegistros from "./admin/GerenciarRegistros";
import Controle_Interno from "./controle-interno/Controle_Interno";
import "./App.css";

function PrivateRoute({ children }) {
  const usuario = useSelector((state) => state.auth.usuario);
  const location = useLocation();
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const usuario = useSelector((state) => state.auth.usuario);
  const avatarRef = useRef(null);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
    window.location.href = "/login";
  }

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100">
        {/* ── TOPBAR ── */}
        {usuario && (
          <header className="fixed top-0 left-0 right-0 h-16 bg-blue-700 shadow-xl z-50 flex items-center justify-between px-4 gap-4">
            {/* Esquerda: hamburguer + brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="text-white p-2 rounded-lg hover:bg-blue-800 transition focus:outline-none"
                aria-label="Abrir menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <span className="text-white font-bold text-base md:text-lg leading-tight select-none">
                Instituto Diomício Freitas
              </span>
            </div>

            {/* Direita: área do usuário */}
            <div className="relative flex items-center gap-3" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-9 h-9 rounded-full border-2 border-white shadow-md bg-blue-300 flex items-center justify-center overflow-hidden">
                  {usuario.fotoUrl ? (
                    <img
                      src={usuario.fotoUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-blue-700 font-bold text-sm">
                      {usuario?.nome
                        ? usuario.nome.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  )}
                </div>
                <span className="text-white font-semibold text-sm hidden sm:block max-w-[120px] truncate">
                  {usuario.nome}
                </span>
                <svg
                  className="w-4 h-4 text-white opacity-70 hidden sm:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown do usuário */}
              {dropdownOpen && (
                <div className="absolute top-12 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 min-w-[180px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Logado como</p>
                    <p className="text-sm font-bold text-gray-700 truncate">
                      {usuario.nome}
                    </p>
                  </div>
                  <Link
                    to="/perfil"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="material-icons-outlined text-base text-blue-600">
                      person
                    </span>
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <span className="material-icons-outlined text-base">
                      logout
                    </span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </header>
        )}

        {/* ── OVERLAY SIDEBAR ── */}
        {usuario && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            style={{ top: 64 }}
            onClick={closeSidebar}
          />
        )}

        {/* ── SIDEBAR LATERAL ── */}
        {usuario && (
          <aside
            className={`fixed left-0 w-64 bg-blue-700 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out`}
            style={{
              top: 64,
              height: "calc(100vh - 64px)",
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <nav className="flex flex-col flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              <Link
                to="/"
                onClick={closeSidebar}
                className="flex items-center gap-3 text-white font-semibold hover:bg-blue-800 rounded-xl px-4 py-3 transition"
              >
                <span className="material-icons-outlined">home</span>
                Home
              </Link>
              <Link
                to="/usuarios-encaminhados"
                onClick={closeSidebar}
                className="flex items-center gap-3 text-white font-semibold hover:bg-blue-800 rounded-xl px-4 py-3 transition"
              >
                <span className="material-icons-outlined">group</span>
                Encaminhados
              </Link>
              <Link
                to="/avaliacao"
                onClick={closeSidebar}
                className="flex items-center gap-3 text-white font-semibold hover:bg-blue-800 rounded-xl px-4 py-3 transition"
              >
                <span className="material-icons-outlined">star_rate</span>
                Avaliações
              </Link>
              <Link
                to="/controle-interno"
                onClick={closeSidebar}
                className="flex items-center gap-3 text-white font-semibold hover:bg-blue-800 rounded-xl px-4 py-3 transition"
              >
                <span className="material-icons-outlined">
                  assignment_turned_in
                </span>
                Controle Interno
              </Link>

              {usuario?.nivelAcesso === "admin" && (
                <Link
                  to="/admin/gerenciar"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 text-white font-semibold hover:bg-blue-800 rounded-xl px-4 py-3 transition"
                >
                  <span className="material-icons-outlined">
                    admin_panel_settings
                  </span>
                  Gerenciar
                </Link>
              )}
            </nav>

            {/* Rodapé do sidebar */}
            <div className="px-3 py-4 border-t border-blue-600">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-white font-semibold hover:bg-red-600 rounded-xl px-4 py-3 transition"
              >
                <span className="material-icons-outlined">logout</span>
                Sair
              </button>
            </div>
          </aside>
        )}

        {/* ── CONTEÚDO PRINCIPAL ── */}
        <main
          className={`flex-1 transition-all duration-300 ${usuario ? "pt-16" : ""}`}
        >
          <div className="min-h-[calc(100vh-112px)] px-4 md:px-8 py-6">
            <Routes>
              <Route
                path="/login"
                element={usuario ? <Navigate to="/" replace /> : <Login />}
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios-encaminhados"
                element={
                  <PrivateRoute>
                    <Usuarios_Encaminhados />
                  </PrivateRoute>
                }
              />
              <Route path="/recuperar-senha" element={<Recuperar_Senha />} />
              <Route path="/nova-senha" element={<Nova_Senha />} />
              <Route
                path="/avaliacao"
                element={
                  <PrivateRoute>
                    <Avaliacao />
                  </PrivateRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <PrivateRoute>
                    <Perfil />
                  </PrivateRoute>
                }
              />
              <Route
                path="/controle-interno"
                element={
                  <PrivateRoute>
                    <Controle_Interno />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/gerenciar"
                element={
                  <PrivateRoute>
                    {usuario?.nivelAcesso === "admin" ? (
                      <GerenciarRegistros />
                    ) : (
                      <Navigate to="/" replace />
                    )}
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="bg-blue-700 text-white text-center py-4 text-sm">
          &copy; {new Date().getFullYear()} Instituto Diomício Freitas. Todos os
          direitos reservados.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
