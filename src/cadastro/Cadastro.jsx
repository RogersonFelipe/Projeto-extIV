function Cadastro() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md md:max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8 tracking-tight">Cadastro</h2>
        <form className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Nome"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-user"></i>
            </span>
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-envelope"></i>
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-lock"></i>
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirmar Senha"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-lock"></i>
            </span>
          </div>
          <div className="relative">
            <input
              type="date"
              placeholder="Data de Nascimento"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-calendar"></i>
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="CPF"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              maxLength={14}
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-id-card"></i>
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  )
}
export default Cadastro