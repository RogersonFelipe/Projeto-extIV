import { useState } from "react";
import api from "../../api/axios";

function Recuperar_Senha() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro,    setErro]    = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { setErro("Informe seu e-mail"); return; }
    setErro("");
    setLoading(true);
    try {
      await api.post("/auth/recuperar-senha", { email });
      setEnviado(true);
    } catch {
      setErro("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2 tracking-tight">
          Recuperar Senha
        </h2>

        {enviado ? (
          <div className="flex flex-col items-center gap-4 mt-6">
            <span className="material-icons-outlined text-green-500 text-5xl">mark_email_read</span>
            <p className="text-center text-gray-600 text-sm">
              Se o e-mail estiver cadastrado, você receberá as instruções em breve.
            </p>
            <a href="/login" className="text-blue-600 text-sm hover:underline">
              Voltar para o login
            </a>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErro(""); }}
                  placeholder="Seu e-mail"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${erro ? "border-red-400" : "border-gray-300"}`}
                />
                {erro && <span className="text-red-500 text-xs ml-1 block mt-1">{erro}</span>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-500">
              <a href="/login" className="text-blue-600 hover:underline">Voltar para o login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Recuperar_Senha;
