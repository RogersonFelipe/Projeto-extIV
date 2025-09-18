import { useState } from "react";

function CadastroAluno() {
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleImgChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file));
    } else {
      setImgPreview(null);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 p-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-blue-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg mb-3">
            <span className="material-icons-outlined text-white text-4xl">
              school
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-blue-800 text-center tracking-tight drop-shadow">
            Cadastro de Aluno
          </h2>
        </div>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <label className="relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImgChange}
              />
              <div className="w-28 h-28 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center overflow-hidden shadow group-hover:ring-4 group-hover:ring-blue-200 transition">
                {imgPreview ? (
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="material-icons-outlined text-blue-400 text-5xl">
                    person
                  </span>
                )}
              </div>
              <span className="block mt-2 text-sm text-blue-600 font-medium group-hover:underline text-center">
                {imgPreview ? "Trocar foto" : "Adicionar foto"}
              </span>
            </label>
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              person
            </span>
            <input
              type="text"
              placeholder="Nome do Aluno"
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
              placeholder="CPF"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              maxLength={14}
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              supervisor_account
            </span>
            <input
              type="text"
              placeholder="Nome Responsável"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              call
            </span>
            <input
              type="text"
              placeholder="Telefone Responsável"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              required
            />
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              cake
            </span>
            <input
              type="date"
              placeholder="Data de Nascimento"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition"
              required
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

export default CadastroAluno;