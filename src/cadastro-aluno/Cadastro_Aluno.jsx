import { useState } from "react";
import * as yup from "yup";
import api from "../api/axios";

function maskCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function maskTelefone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15);
}

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
    .matches(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF inválido. Use o formato 000.000.000-00",
    )
    .required("CPF é obrigatório"),
  responsavel: yup.string().required("Nome do responsável é obrigatório"),
  telefoneAluno: yup
    .string()
    .matches(
      /^$|^\(\d{2}\)\s\d{5}-\d{4}$/,
      "Telefone do aluno inválido. Ex: (99) 99999-9999",
    ),
  telefoneResponsavel: yup
    .string()
    .matches(
      /^\(\d{2}\)\s\d{5}-\d{4}$/,
      "Telefone do responsável inválido. Ex: (99) 99999-9999",
    )
    .required("Telefone do responsável é obrigatório"),
  nascimento: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data de nascimento inválida. Use o formato dd/mm/aaaa",
    )
    .required("Data de nascimento é obrigatória"),
  dataEntrada: yup
    .string()
    .matches(
      /^$|^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data de entrada inválida. Use o formato dd/mm/aaaa",
    ),
  status: yup.string().oneOf(["ativo", "inativo"]),
  infoMedicamentos: yup.string(),
});

function CadastroAluno() {
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    responsavel: "",
    telefoneAluno: "",
    telefoneResponsavel: "",
    nascimento: "",
    dataEntrada: "",
    status: "ativo",
    usaMedicamento: false,
    infoMedicamentos: "",
  });
  const [errors, setErrors] = useState({});

  function handleImgChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImgPreview(null);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let maskedValue = type === "checkbox" ? checked : value;

    if (name === "cpf") maskedValue = maskCPF(value);
    if (name === "telefoneAluno") maskedValue = maskTelefone(value);
    if (name === "telefoneResponsavel") maskedValue = maskTelefone(value);
    if (name === "nascimento") maskedValue = maskData(value);
    if (name === "dataEntrada") maskedValue = maskData(value);

    setForm({ ...form, [name]: maskedValue });
    setErrors({ ...errors, [name]: "" });
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
      // enviar para json-server
      await api.post("/pessoas", {
        nome: form.nome,
        cpf: form.cpf,
        status: form.status,
        usaMedicamento: !!form.usaMedicamento,
        infoMedicamentos: form.usaMedicamento
          ? form.infoMedicamentos || undefined
          : undefined,
        nomeResponsavel: form.responsavel,
        telefone: form.telefoneAluno || undefined,
        telefoneResponsavel: form.telefoneResponsavel,
        dataNascimento: form.nascimento.split("/").reverse().join("-"),
        dataEntrada: form.dataEntrada
          ? form.dataEntrada.split("/").reverse().join("-")
          : undefined,
        fotoUrl: imgPreview || undefined,
      });
      alert("Aluno cadastrado com sucesso!");
      // opcional: limpar formulário
      setForm({
        nome: "",
        cpf: "",
        responsavel: "",
        telefoneAluno: "",
        telefoneResponsavel: "",
        nascimento: "",
        dataEntrada: "",
        status: "ativo",
        usaMedicamento: false,
        infoMedicamentos: "",
      });
      setImgPreview(null);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else if (err.response?.status === 409) {
        setErrors((prev) => ({ ...prev, cpf: "Este CPF já está cadastrado" }));
      } else {
        alert("Erro ao cadastrar aluno!");
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
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
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
          noValidate
        >
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
              placeholder="Nome completo do aluno"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.nome ? "border-red-400" : "border-gray-200"}`}
              required
              autoComplete="off"
            />
            {errors.nome && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.nome}
              </span>
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
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.cpf}
              </span>
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
              placeholder="Nome completo do responsável"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.responsavel ? "border-red-400" : "border-gray-200"}`}
              required
              autoComplete="off"
            />
            {errors.responsavel && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.responsavel}
              </span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              call
            </span>
            <input
              type="text"
              name="telefoneAluno"
              value={form.telefoneAluno}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Telefone do aluno (opcional)"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.telefoneAluno ? "border-red-400" : "border-gray-200"}`}
              maxLength={15}
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.telefoneAluno && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.telefoneAluno}
              </span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              call
            </span>
            <input
              type="text"
              name="telefoneResponsavel"
              value={form.telefoneResponsavel}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Telefone do responsável"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.telefoneResponsavel ? "border-red-400" : "border-gray-200"}`}
              maxLength={15}
              required
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.telefoneResponsavel && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.telefoneResponsavel}
              </span>
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
              placeholder="Data de nascimento (dd/mm/aaaa)"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.nascimento ? "border-red-400" : "border-gray-200"}`}
              maxLength={10}
              required
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.nascimento && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.nascimento}
              </span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              event_available
            </span>
            <input
              type="text"
              name="dataEntrada"
              value={form.dataEntrada}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Data de entrada (dd/mm/aaaa)"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.dataEntrada ? "border-red-400" : "border-gray-200"}`}
              maxLength={10}
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.dataEntrada && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.dataEntrada}
              </span>
            )}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              flag
            </span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition border-gray-200"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-blue-50 px-4 py-3">
            <input
              id="usaMedicamento"
              name="usaMedicamento"
              type="checkbox"
              checked={!!form.usaMedicamento}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="usaMedicamento" className="text-sm text-slate-700">
              Usa medicação contínua?
            </label>
          </div>
          {form.usaMedicamento && (
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-3 text-blue-400">
                notes
              </span>
              <textarea
                name="infoMedicamentos"
                value={form.infoMedicamentos}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Informações dos medicamentos"
                rows={3}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition resize-none ${errors.infoMedicamentos ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.infoMedicamentos && (
                <span className="text-red-500 text-xs ml-2 block mt-1">
                  {errors.infoMedicamentos}
                </span>
              )}
            </div>
          )}
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
