import { useState } from "react";

function Editar_Avaliacao() {
  const [tab, setTab] = useState("dados");
  const [dados, setDados] = useState({
    titulo: "Avaliação 1",
    tipo: "Aluno 1",
    dataInicial: "2025-09-01",
    dataFinal: "2025-09-10"
  });
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState("");
  const [tipoResposta, setTipoResposta] = useState("texto");

  const handleDadosChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const adicionarPergunta = () => {
    if (novaPergunta.trim()) {
      setPerguntas([
        ...perguntas,
        { texto: novaPergunta, tipo: tipoResposta }
      ]);
      setNovaPergunta("");
      setTipoResposta("texto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Editar Avaliação</h2>
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
          <form className="space-y-4">
            <input
              type="text"
              name="titulo"
              value={dados.titulo}
              onChange={handleDadosChange}
              placeholder="Título da Avaliação"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="text"
              name="tipo"
              value={dados.tipo}
              onChange={handleDadosChange}
              placeholder="Tipo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="date"
              name="dataInicial"
              value={dados.dataInicial}
              onChange={handleDadosChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="date"
              name="dataFinal"
              value={dados.dataFinal}
              onChange={handleDadosChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Salvar
            </button>
          </form>
        )}

        {tab === "perguntas" && (
          <div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={novaPergunta}
                onChange={e => setNovaPergunta(e.target.value)}
                placeholder="Digite a pergunta"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <select
                value={tipoResposta}
                onChange={e => setTipoResposta(e.target.value)}
                className="px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="texto">Texto</option>
                <option value="combo">Combo box</option>
              </select>
              <button
                type="button"
                onClick={adicionarPergunta}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              >
                Adicionar
              </button>
            </div>
            <div className="mb-4 flex items-center justify-center">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                <span className="text-blue-700 font-semibold mb-2">Importar perguntas via Excel</span>
                <span className="text-xs text-gray-500">Arraste o arquivo aqui ou clique para selecionar</span>
                <input type="file" accept=".xlsx,.xls" className="hidden" disabled />
              </label>
            </div>
            <div className="h-64 overflow-y-auto">
              <ul className="space-y-2">
                {perguntas.map((p, idx) => (
                  <li key={idx} className="bg-blue-50 px-4 py-2 rounded-lg flex items-center justify-between">
                    <span>{p.texto} <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-200 text-blue-700">{p.tipo === "texto" ? "Texto" : "Combo box"}</span></span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                      onClick={() => setPerguntas(perguntas.filter((_, i) => i !== idx))}
                    >
                      Remover
                    </button>
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

export default Editar_Avaliacao;