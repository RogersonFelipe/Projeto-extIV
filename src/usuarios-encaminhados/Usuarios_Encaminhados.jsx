import { useState } from 'react'

function Usuarios_Encaminhados() {
  const [rows, setRows] = useState(Array(1).fill({}))
  const [quantidade, setQuantidade] = useState(1)

  const addRows = () => {
    if (quantidade > 0) {
      setRows([...rows, ...Array(Number(quantidade)).fill({})])
    }
  }

  const removeRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx))
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-800 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-blue-500">
          <path d="M12 2L2 7v7c0 5 5 8 10 8s10-3 10-8V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        Usuários encaminhados ao Trabalho em 2024
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-blue-200 rounded-lg">
              {["Nº","Nome","Data Admissão","Empresa","Função","Contato RH","Provável data desligamento IEEDF","Ações"].map((title, i) => (
                <th key={i} className={`py-3 px-4 font-bold text-blue-700 ${i === 0 ? "rounded-l-lg" : ""} ${i === 7 ? "rounded-r-lg" : ""}`}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="bg-white hover:bg-blue-50 transition-colors shadow rounded-lg">
                <td className="py-3 px-4 font-semibold text-blue-700 text-center">{String(idx + 1).padStart(2, '0')}</td>
                <td className="py-3 px-4"><input className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="text" /></td>
                <td className="py-3 px-4"><input className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="date" /></td>
                <td className="py-3 px-4"><input className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="text" /></td>
                <td className="py-3 px-4"><input className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="text" /></td>
                <td className="py-3 px-4"><input className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="text" /></td>
                <td className="py-3 px-4"><input className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="date" /></td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg shadow transition-colors"
                    title="Remover linha"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          className="w-24 border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Qtd linhas"
        />
        <button
          className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          onClick={addRows}
        >
          Adicionar linhas
        </button>
      </div>
    </div>
  )
}

export default Usuarios_Encaminhados;