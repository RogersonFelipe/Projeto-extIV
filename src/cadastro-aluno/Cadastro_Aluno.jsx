function CadastroAluno() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Cadastro de Aluno
        </h2>
        <form className="flex flex-col gap-5">
           <input
            type="text"
            placeholder="Nome do Aluno"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            placeholder="CPF"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            maxLength={14}
            required
          />
          <input
            type="text"
            placeholder="Nome Responsável"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            placeholder="Telefone Responsável"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="date"
            placeholder="Data de Nascimento"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroAluno;