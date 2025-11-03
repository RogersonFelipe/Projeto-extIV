import { useState } from "react";

function Avaliacoes_Finalizadas() {

  const dados = {
    titulo: "Avaliação 1",
    tipo: "Aluno 1",
    dataInicial: "2025-09-01",
    dataFinal: "2025-09-10"
  };
  const [tab, setTab] = useState("dados");
  const [perguntas] = useState([
    { texto: "Como foi o desempenho?", tipo: "texto" },
    { texto: "Selecione o nível", tipo: "combo" }
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Avaliação Finalizada</h2>
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`flex-1 py-3 font-semibold ${tab === "dados" ? "text-blue-700 border-b-4 border-blue-500 bg-blue-50" : "text-gray-500"} transition`}
            onClick={() => setTab("dados")}
          >
            Dados
          </button>
          <button
            className={`flex-1 py-3 font-semibold ${tab === "perguntas" ? "text-blue-700 border-b-4 border-blue-500 bg-blue-50" : "text-gray-500"} transition`}
            onClick={() => setTab("perguntas")}
          >
            Perguntas
          </button>
        </div>

        {tab === "dados" && (
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-gray-700 font-semibold">Título:</label>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">{dados.titulo}</div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Tipo:</label>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">{dados.tipo}</div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Data Inicial:</label>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">{dados.dataInicial}</div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Data Final:</label>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">{dados.dataFinal}</div>
            </div>
          </div>
        )}

        {tab === "perguntas" && (
          <div>
            <button
              type="button"
              className="mb-4 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold shadow cursor-not-allowed opacity-70"
              disabled
            >
              Exportar para Excel
            </button>
            <div className="h-64 overflow-y-auto">
              <ul className="space-y-2">
                {perguntas.map((p, idx) => (
                  <li key={idx} className="bg-blue-50 px-4 py-2 rounded-lg flex items-center justify-between">
                    <span>{p.texto} <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-200 text-blue-700">{p.tipo === "texto" ? "Texto" : "Combo box"}</span></span>
                  </li>
                ))}
                {perguntas.length === 0 && (
                  <li className="text-gray-400 text-center py-4">Nenhuma pergunta adicionada.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Avaliacoes_Finalizadas;