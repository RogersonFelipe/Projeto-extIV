import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div>
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
            className={`text-white font-bold text-xl mt-5 text-left transition-all duration-300 ${
              sidebarOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none h-0 overflow-hidden"
            }`}
          >
            Instituto Diomício Freitas
          </div>
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
                className={`ml-4 mt-1 flex flex-col space-y-2 ${
                  sidebarOpen ? "" : "hidden"
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
            <Link
              to="/login"
              className="flex items-center gap-2 text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition"
            >
              <span className="material-icons-outlined">login</span>
              {sidebarOpen && "Login"}
            </Link>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div
          className={`
            transition-all duration-300
            ${sidebarOpen ? "md:ml-56" : "md:ml-16"}
            ml-0 px-2 md:px-8 py-6 bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen
          `}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/ficha-acompanhamento"
              element={<Ficha_Acompanhamento />}
            />
            <Route
              path="/usuarios-encaminhados"
              element={<Usuarios_Encaminhados />}
            />
            <Route path="/cadastro-aluno" element={<Cadastro_Aluno />} />
            <Route path="/cadastro-empresa" element={<Cadastro_Empresa />} />
            <Route path="/recuperar-senha" element={<Recuperar_Senha />} />
            <Route
              path="/cadastro-avaliacao"
              element={<Cadastro_Avaliacao />}
            />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="/editar-avaliacao" element={<Editar_Avaliacao />} />
            <Route
              path="/avaliacoes-finalizadas"
              element={<Avaliacoes_Finalizadas />}
            />
          </Routes>
        </div>
      </div>
      <footer className="bg-blue-600 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Instituto Diomício Freitas. Todos os
        direitos reservados.
      </footer>
    </BrowserRouter>
  );
}

export default App;
