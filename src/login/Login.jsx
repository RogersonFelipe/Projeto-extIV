function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Login
        </h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-500">
          Esqueceu a senha?{" "}
          <a href="/recuperar-senha" className="text-blue-600 hover:underline">
            Recuperar Senha
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;