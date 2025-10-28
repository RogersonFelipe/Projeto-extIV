import { useState } from "react";
import * as yup from "yup";

// Função para aplicar máscara no CPF
function maskCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

// Função para aplicar máscara no telefone
function maskTelefone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15);
}

// Função para aplicar máscara na data dd/mm/yyyy
function maskData(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  cpf: yup
    .string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00")
    .required("CPF é obrigatório"),
  responsavel: yup.string().required("Nome do responsável é obrigatório"),
  telefone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido. Ex: (99) 99999-9999")
    .required("Telefone é obrigatório"),
  nascimento: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data de nascimento inválida. Use o formato dd/mm/aaaa"
    )
    .required("Data de nascimento é obrigatória"),
});

function CadastroAluno() {
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    responsavel: "",
    telefone: "",
    nascimento: "",
  });
  const [errors, setErrors] = useState({});

  function handleImgChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file));
    } else {
      setImgPreview(null);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "cpf") maskedValue = maskCPF(value);
    if (name === "telefone") maskedValue = maskTelefone(value);
    if (name === "nascimento") maskedValue = maskData(value);

    setForm({ ...form, [name]: maskedValue });
    setErrors({ ...errors, [name]: "" }); // Limpa erro ao digitar
  }

  async function handleBlur(e) {
    const { name, value } = e.target;
    try {
      await yup.reach(schema, name).validate(value);
      setErrors({ ...errors, [name]: "" });
    } catch (err) {
      setErrors({ ...errors, [name]: err.message });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
      alert("Aluno cadastrado com sucesso!");
      // Limpar formulário se quiser
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
    setLoading(false);
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
        <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
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
              name="nome"
              value={form.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome do Aluno"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.nome ? "border-red-400" : "border-gray-200"}`}
              required
              autoComplete="off"
            />
            {errors.nome && (
              <span className="text-red-500 text-xs ml-2 block mt-1">{errors.nome}</span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              badge
            </span>
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="CPF"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.cpf ? "border-red-400" : "border-gray-200"}`}
              maxLength={14}
              required
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.cpf && (
              <span className="text-red-500 text-xs ml-2 block mt-1">{errors.cpf}</span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              supervisor_account
            </span>
            <input
              type="text"
              name="responsavel"
              value={form.responsavel}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome Responsável"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.responsavel ? "border-red-400" : "border-gray-200"}`}
              required
              autoComplete="off"
            />
            {errors.responsavel && (
              <span className="text-red-500 text-xs ml-2 block mt-1">{errors.responsavel}</span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              call
            </span>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Telefone Responsável"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.telefone ? "border-red-400" : "border-gray-200"}`}
              maxLength={15}
              required
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.telefone && (
              <span className="text-red-500 text-xs ml-2 block mt-1">{errors.telefone}</span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              cake
            </span>
            <input
              type="text"
              name="nascimento"
              value={form.nascimento}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Data de Nascimento (dd/mm/aaaa)"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.nascimento ? "border-red-400" : "border-gray-200"}`}
              maxLength={10}
              required
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.nascimento && (
              <span className="text-red-500 text-xs ml-2 block mt-1">{errors.nascimento}</span>
            )}
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