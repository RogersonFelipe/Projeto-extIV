function Ficha_Acompanhamento() {
 return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8">Ficha de Acompanhamento</h2>
        <form className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Nome"
            className="px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <div className="flex gap-4">
            <input
              type="date"
              placeholder="Data de admissão"
              className="w-1/2 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <input
              type="date"
              placeholder="Data da visita"
              className="w-1/2 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Empresa"
            className="px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="text"
            placeholder="Responsável RH"
            className="px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="text"
            placeholder="Contato com"
            className="px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <textarea
            placeholder="Parecer Geral"
            className="px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none h-24"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Salvar Ficha
          </button>
        </form>
      </div>
    </div>
  )
}
export default Ficha_Acompanhamento