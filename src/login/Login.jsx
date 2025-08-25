function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md md:max-w-xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Senha"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Não tem uma conta? <a href="/cadastro" className="text-blue-600 hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}
export default Login