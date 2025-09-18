import { useState } from "react";

function CadastroEmpresa() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 p-6">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-blue-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg mb-3">
            <span className="material-icons-outlined text-white text-4xl">
              business
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-blue-800 text-center tracking-tight drop-shadow">
            Cadastro de Empresa
          </h2>
        </div>
        <form className="flex flex-col gap-5">
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              apartment
            </span>
            <input
              type="text"
              placeholder="Nome fantasia"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              badge
            </span>
            <input
              type="text"
              placeholder="CNPJ"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              maxLength={14}
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              call
            </span>
            <input
              type="text"
              placeholder="Telefone para contato"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              email
            </span>
            <input
              type="text"
              placeholder="E-mail para contato"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              location_on
            </span>
            <input
              type="text"
              placeholder="CEP"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              maxLength={9}
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                location_city
              </span>
              <input
                type="text"
                placeholder="Cidade"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
                required
              />
            </div>
            <div className="relative w-1/2">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                map
              </span>
              <input
                type="text"
                placeholder="Bairro"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative w-2/3">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                streetview
              </span>
              <input
                type="text"
                placeholder="Rua"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
                required
              />
            </div>
            <div className="relative w-1/3">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                pin
              </span>
              <input
                type="text"
                placeholder="Número"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
                maxLength={5}
                required
              />
            </div>
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              add_location_alt
            </span>
            <input
              type="text"
              placeholder="Complemento"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-icons-outlined animate-spin">
                autorenew
              </span>
            ) : (
              <span className="material-icons-outlined">check_circle</span>
            )}
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroEmpresa;