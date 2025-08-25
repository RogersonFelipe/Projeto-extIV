import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import Home from './home/Home'
import Login from './login/Login'
import Cadastro from './cadastro/Cadastro'
import Ficha_Acompanhamento from './ficha-acompanhamento/Ficha_Acompanhamento'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <nav className="bg-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-xl">Meu Projeto</div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-blue-200 transition">Home</Link>
          <Link to="/login" className="text-white hover:text-blue-200 transition">Login</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/ficha-acompanhamento" element={<Ficha_Acompanhamento />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
