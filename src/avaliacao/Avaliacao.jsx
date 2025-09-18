import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Avaliacao() {
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      titulo: "Avaliação 1",
      tipo: "Avaliação Aluno",
      aluno: "Aluno 1",
      img: "https://i.pravatar.cc/100?img=1",
      dataInicial: "01/09/2025",
      dataFinal: "10/09/2025",
      status: "Em aberto"
    },
    {
      id: 2,
      titulo: "Avaliação 2",
      tipo: "Avaliaação Experiencia",
      aluno: "Aluno 2",
      img: "https://i.pravatar.cc/100?img=2",
      dataInicial: "05/09/2025",
      dataFinal: "15/09/2025",
      status: "Finalizado"
    },
    {
      id: 3,
      titulo: "Avaliação 3",
      tipo: "Avaliaação Experiencia",
      aluno: "Aluno 3",
      img: "https://i.pravatar.cc/100?img=3",
      dataInicial: "05/09/2025",
      dataFinal: "15/09/2025",
      status: "Cancelado"
    }
  ]);
  const statusUnicos = [...new Set(avaliacoes.map(a => a.status))];
  const tiposUnicos = [...new Set(avaliacoes.map(a => a.tipo))];

  return (
    <div className="mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-800 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-blue-500">
          <path d="M12 2L2 7v7c0 5 5 8 10 8s10-3 10-8V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        Lista de Avaliações
      </h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por título"
          className="px-3 py-2 rounded border border-blue-300"
        />
        <select className="px-3 py-2 rounded border border-blue-300">
          <option value="">Todos os status</option>
          {statusUnicos.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select className="px-3 py-2 rounded border border-blue-300">
          <option value="">Todos os tipos</option>
          {tiposUnicos.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrar por aluno"
          className="px-3 py-2 rounded border border-blue-300"
        />
        <Link
          to="/cadastro-avaliacao"
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Nova Avaliação
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-blue-200 rounded-lg">
              <th className="py-3 px-4 rounded-l-lg">Id</th>
              <th className="py-3 px-4">Título</th>
              <th className="py-3 px-4">Aluno</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Data Inicial</th>
              <th className="py-3 px-4">Data Final</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-r-lg">Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((a) => (
              <tr
                key={a.id}
                className="bg-white hover:bg-blue-50 transition-colors shadow rounded-lg"
              >
                <td className="py-3 px-4 font-semibold text-blue-700">{a.id}</td>
                <td className="py-3 px-4 font-semibold text-blue-700">{a.titulo}</td>
                {/* Imagem do aluno com tooltip */}
                <td className="py-3 px-4">
                  <div className="relative group flex items-center justify-center">
                    <img
                      src={a.img}
                      alt={a.aluno}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                    <span className="absolute left-12 z-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition whitespace-nowrap pointer-events-none">
                      {a.aluno}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">{a.tipo}</td>
                <td className="py-3 px-4">{a.dataInicial}</td>
                <td className="py-3 px-4">{a.dataFinal}</td>
                <td className="py-3 px-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap
                    ${a.status === "Finalizado" ? "bg-green-200 text-green-700" :
                        a.status === "Cancelado" ? "bg-red-200 text-red-700" :
                          "bg-yellow-200 text-yellow-700"}`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {a.status === "Finalizado" ? (
                    <a className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow transition-colors" href="/avaliacoes-finalizadas">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                      Visualizar
                    </a>
                  ) : (
                    <a className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg shadow transition-colors" href="/editar-avaliacao">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M4 21v-3.5a2 2 0 0 1 .59-1.41l10.83-10.83a2 2 0 0 1 2.83 0l3.5 3.5a2 2 0 0 1 0 2.83L10.92 20.41A2 2 0 0 1 9.5 21H6a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                      Editar
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Avaliacao;
