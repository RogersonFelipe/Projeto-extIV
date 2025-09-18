function Ficha_Acompanhamento() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Ficha de Acompanhamento
        </h2>
        <form className="flex flex-col gap-5">
          <input type="text" placeholder="Nome" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          
          <div className="flex gap-4">
            <input type="date" placeholder="Data de admissão" className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
            <input type="date" placeholder="Data da visita" className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          </div>

          <input type="text" placeholder="Empresa" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          <input type="text" placeholder="Responsável RH" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          <input type="text" placeholder="Contato com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          <textarea placeholder="Parecer Geral" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none h-24" required />
          
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            Salvar Ficha
          </button>
        </form>
      </div>
    </div>
  );
}

export default Ficha_Acompanhamento;