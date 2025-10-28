import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import { useSelector } from "react-redux";
import Ficha_Acompanhamento from "./ficha-acompanhamento/Ficha_Acompanhamento";
import Usuarios_Encaminhados from "./usuarios-encaminhados/Usuarios_Encaminhados";
import Cadastro_Aluno from "./cadastro-aluno/Cadastro_Aluno";
import Cadastro_Empresa from "./cadastro-empresa/Cadastro_Empresa";
import Recuperar_Senha from "./login/recuperar-senha/Recuperar_Senha";
import Cadastro_Avaliacao from "./avaliacao/cadastro-avaliacao/Cadastro_Avaliacao";
import Avaliacao from "./avaliacao/Avaliacao";
import Editar_Avaliacao from "./avaliacao/editar-avaliacao/Editar_Avaliacao";
import Avaliacoes_Finalizadas from "./avaliacao/avaliacoes-finalizadas/Avaliacoes_Finalizadas";
import "./App.css";


import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const usuario = useSelector((state) => state.auth.usuario);
  const location = useLocation();
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const usuario = useSelector((state) => state.auth.usuario);
  const avatarRef = useRef(null);

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <BrowserRouter>
      <div>
        {/* Sidebar e menu só aparecem se estiver logado */}
        {usuario && (
          <>
            {/* Botão hambúrguer: só aparece em telas pequenas e quando sidebar está fechada */}
            {!sidebarOpen && (
              <button
                className="md:hidden fixed top-4 left-3 z-50 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2"
                onClick={() => setSidebarOpen(true)}
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
            )}
            {/* Sidebar responsiva */}
            <div
              className={`
                fixed top-0 left-0 h-full bg-blue-600 flex flex-col py-6 px-2 shadow-lg z-40 transition-all duration-300
                ${sidebarOpen ? "w-56" : "w-16"}
                block md:block
              `}
            >
              {/* Botão de retração/expansão sempre visível na sidebar */}
              <button
                className="absolute top-4 right-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2 focus:outline-none transition"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Retrair menu" : "Expandir menu"}
              >
                {sidebarOpen ? (
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
                      d="M18 12H6"
                    />
                  </svg>
                ) : (
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
                )}
              </button>
              <div
                className={`text-white font-bold text-xl mt-5 text-left transition-all duration-300 ${sidebarOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none h-0 overflow-hidden"
                  }`}
              >
                Instituto Diomício Freitas
              </div>

              {/* Área do usuário com avatar, nome e dropdown */}
              {usuario && (
                <div className="flex flex-col items-center mt-6 mb-2 relative" ref={avatarRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="w-14 h-14 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={usuario.foto || "https://i.pravatar.cc/100"}
                      alt="Usuário"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </button>
                  <span className={`text-white font-bold text-xl mt-5 text-center transition-all duration-300 ${sidebarOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none h-0 overflow-hidden"
                    }`}>
                    {usuario.nome}
                  </span>
                  {dropdownOpen && sidebarOpen && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white border rounded-xl shadow-lg py-2 px-4 z-50 min-w-[140px]">
                      <ul className="flex flex-col gap-2">
                        <li>
                          <button className="w-full text-left text-blue-700 hover:underline">
                            Perfil
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left text-blue-700 hover:underline">
                            Configurações
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left text-red-500 hover:underline">
                            Sair
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-4 overflow-y-auto mt-8">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition"
                >
                  <span className="material-icons-outlined">home</span>
                  {sidebarOpen && "Home"}
                </Link>
                <Link
                  to="/ficha-acompanhamento"
                  className="flex items-center gap-2 text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition"
                >
                  <span className="material-icons-outlined">assignment</span>
                  {sidebarOpen && "Acompanhamento"}
                </Link>
                <Link
                  to="/usuarios-encaminhados"
                  className="flex items-center gap-2 text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition"
                >
                  <span className="material-icons-outlined">group</span>
                  {sidebarOpen && "Encaminhados"}
                </Link>
                <Link
                  to="/avaliacao"
                  className="flex items-center gap-2 text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition"
                >
                  <span className="material-icons-outlined">star_rate</span>
                  {sidebarOpen && "Avaliações"}
                </Link>
                <div className="group cadastro">
                  <span className="flex items-center gap-2 text-white font-semibold rounded px-3 py-2">
                    <span className="material-icons-outlined">person_add</span>
                    {sidebarOpen && "Cadastro"}
                  </span>
                  <div
                    className={`ml-4 mt-1 flex flex-col space-y-2 ${sidebarOpen ? "" : "hidden"
                      }`}
                  >
                    <Link
                      to="/cadastro-aluno"
                      className="text-blue-100 font-normal hover:bg-blue-700 rounded px-2 py-1 transition"
                    >
                      Aluno
                    </Link>
                    <Link
                      to="/cadastro-empresa"
                      className="text-blue-100 font-normal hover:bg-blue-700 rounded px-2 py-1 transition"
                    >
                      Empresa
                    </Link>
                  </div>
                </div>
                {/* Link de Login removido quando autenticado */}
              </div>
            </div>
          </>
        )}
        {/* Conteúdo principal */}
        <div
          className={`
            transition-all duration-300
            ${usuario ? (sidebarOpen ? "md:ml-56" : "md:ml-16") : "ml-0"}
            ml-0 px-2 md:px-8 py-6 bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen
          `}
        >
          <Routes>
            <Route
              path="/login"
              element={
                usuario ? <Navigate to="/" replace /> : <Login />
              }
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
              path="/ficha-acompanhamento"
              element={
                <PrivateRoute>
                  <Ficha_Acompanhamento />
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
            <Route
              path="/cadastro-aluno"
              element={
                <PrivateRoute>
                  <Cadastro_Aluno />
                </PrivateRoute>
              }
            />
            <Route
              path="/cadastro-empresa"
              element={
                <PrivateRoute>
                  <Cadastro_Empresa />
                </PrivateRoute>
              }
            />
            <Route path="/recuperar-senha" element={<Recuperar_Senha />} />
            <Route
              path="/cadastro-avaliacao"
              element={
                <PrivateRoute>
                  <Cadastro_Avaliacao />
                </PrivateRoute>
              }
            />
            <Route
              path="/avaliacao"
              element={
                <PrivateRoute>
                  <Avaliacao />
                </PrivateRoute>
              }
            />
            <Route
              path="/editar-avaliacao"
              element={
                <PrivateRoute>
                  <Editar_Avaliacao />
                </PrivateRoute>
              }
            />
            <Route
              path="/avaliacoes-finalizadas"
              element={
                <PrivateRoute>
                  <Avaliacoes_Finalizadas />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
      <footer className="bg-blue-600 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Instituto Diomício Freitas. Todos os direitos reservados.
      </footer>
    </BrowserRouter>
  );
}

export default App;
