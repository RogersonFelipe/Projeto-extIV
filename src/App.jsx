import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './home/Home'
import Login from './login/Login'
import Ficha_Acompanhamento from './ficha-acompanhamento/Ficha_Acompanhamento'
import Usuarios_Encaminhados from './usuarios-encaminhados/Usuarios_Encaminhados'
import Cadastro_Aluno from './cadastro-aluno/Cadastro_Aluno'
import Cadastro_Empresa from './cadastro-empresa/Cadastro_Empresa'
import Recuperar_Senha from './login/recuperar-senha/Recuperar_Senha'
import Cadastro_Avaliacao from './avaliacao/cadastro-avaliacao/Cadastro_Avaliacao'
import Avaliacao from './avaliacao/Avaliacao'
import Editar_Avaliacao  from './avaliacao/editar-avaliacao/Editar_Avaliacao'
import Avaliacoes_Finalizadas from './avaliacao/avaliacoes-finalizadas/Avaliacoes_Finalizadas'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-50 bg-blue-600 flex flex-col py-6 px-2 shadow-lg z-50">
        <div className="text-white font-bold text-xl mb-4 text-left">Instituto Diomício Freitas</div>
        <div className="flex flex-col space-y-4 overflow-y-auto">
          <Link to="/" className="text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition">Home</Link>
          <Link to="/ficha-acompanhamento" className="text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition">Acompanhamento</Link>
          <Link to="/usuarios-encaminhados" className="text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition">Encaminhados</Link>
          <Link to="/avaliacao" className="text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition">Avaliações</Link>
          <div className="group cadastro">
            <span className="text-white font-semibold rounded px-3 py-2 block">Cadastro</span>
            <div className="ml-4 mt-1 flex flex-col space-y-2">
              <Link to="/cadastro-aluno" className="text-blue-100 font-normal hover:bg-blue-700 rounded px-2 py-1 transition">Aluno</Link>
              <Link to="/cadastro-empresa" className="text-blue-100 font-normal hover:bg-blue-700 rounded px-2 py-1 transition">Empresa</Link>
            </div>
          </div>


          <Link to="/login" className="text-white font-semibold hover:bg-blue-700 rounded px-3 py-2 transition">Login</Link>
        </div>
      </div>
  <div className="ml-48 px-4 md:px-8 py-6 bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ficha-acompanhamento" element={<Ficha_Acompanhamento />} />
          <Route path="/usuarios-encaminhados" element={<Usuarios_Encaminhados />} />
          <Route path="/cadastro-aluno" element={<Cadastro_Aluno />} />
          <Route path="/cadastro-empresa" element={<Cadastro_Empresa />} />
          <Route path="/recuperar-senha" element={<Recuperar_Senha />} />
          <Route path="/cadastro-avaliacao" element={<Cadastro_Avaliacao />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/editar-avaliacao" element={<Editar_Avaliacao />} />
          <Route path="/avaliacoes-finalizadas" element={<Avaliacoes_Finalizadas />} />
        </Routes>
      </div>


      <footer className="bg-blue-600 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Instituto Diomício Freitas. Todos os direitos reservados.
      </footer>
    </BrowserRouter>
  )
}

export default App;