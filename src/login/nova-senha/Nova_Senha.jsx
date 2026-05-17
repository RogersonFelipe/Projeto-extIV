import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";

function Nova_Senha() {
  const [params]       = useSearchParams();
  const token          = params.get("token") || "";

  const [novaSenha,     setNovaSenha]     = useState("");
  const [confirmar,     setConfirmar]     = useState("");
  const [showNova,      setShowNova]      = useState(false);
  const [showConf,      setShowConf]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [concluido,     setConcluido]     = useState(false);
  const [erros,         setErros]         = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const newErros = {};
    if (novaSenha.length < 6) newErros.novaSenha = "Mínimo 6 caracteres";
    if (novaSenha !== confirmar) newErros.confirmar = "As senhas não coincidem";
    if (Object.keys(newErros).length) { setErros(newErros); return; }

    setLoading(true);
    setErros({});
    try {
      await api.post("/auth/nova-senha", { token, novaSenha });
      setConcluido(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Token inválido ou expirado.";
      setErros({ geral: msg });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <span className="material-icons-outlined text-red-400 text-5xl">link_off</span>
          <p className="mt-4 text-gray-600">Link inválido ou expirado.</p>
          <a href="/login" className="mt-4 inline-block text-blue-600 hover:underline text-sm">Voltar ao login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2 tracking-tight">
          Nova Senha
        </h2>

        {concluido ? (
          <div className="flex flex-col items-center gap-4 mt-6">
            <span className="material-icons-outlined text-green-500 text-5xl">check_circle</span>
            <p className="text-center text-gray-600 text-sm">Senha redefinida com sucesso!</p>
            <a href="/login" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition text-center block">
              Ir para o login
            </a>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">Escolha uma nova senha para sua conta.</p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div>
                <div className="flex gap-2">
                  <input
                    type={showNova ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => { setNovaSenha(e.target.value); setErros((p) => ({ ...p, novaSenha: "" })); }}
                    placeholder="Nova senha"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${erros.novaSenha ? "border-red-400" : "border-gray-300"}`}
                  />
                  <button type="button" onClick={() => setShowNova((s) => !s)}
                    className="px-3 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition" tabIndex={-1}>
                    <span className="material-icons-outlined text-base">{showNova ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {erros.novaSenha && <span className="text-red-500 text-xs ml-1 block mt-1">{erros.novaSenha}</span>}
              </div>
              <div>
                <div className="flex gap-2">
                  <input
                    type={showConf ? "text" : "password"}
                    value={confirmar}
                    onChange={(e) => { setConfirmar(e.target.value); setErros((p) => ({ ...p, confirmar: "" })); }}
                    placeholder="Confirme a senha"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${erros.confirmar ? "border-red-400" : "border-gray-300"}`}
                  />
                  <button type="button" onClick={() => setShowConf((s) => !s)}
                    className="px-3 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition" tabIndex={-1}>
                    <span className="material-icons-outlined text-base">{showConf ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {erros.confirmar && <span className="text-red-500 text-xs ml-1 block mt-1">{erros.confirmar}</span>}
              </div>
              {erros.geral && <span className="text-red-500 text-xs ml-1 block">{erros.geral}</span>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Redefinir senha"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Nova_Senha;
