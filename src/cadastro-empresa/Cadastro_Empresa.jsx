import { useState } from "react";
import * as yup from "yup";
import axios from "axios";

function maskCNPJ(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

function maskTelefone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15);
}

function maskCEP(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

const schema = yup.object().shape({
  nomeFantasia: yup.string().required("Nome fantasia é obrigatório"),
  cnpj: yup
    .string()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido. Ex: 00.000.000/0000-00")
    .required("CNPJ é obrigatório"),
  telefone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido. Ex: (99) 99999-9999")
    .required("Telefone é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cep: yup
    .string()
    .matches(/^\d{5}-\d{3}$/, "CEP inválido. Ex: 00000-000")
    .required("CEP é obrigatório"),
  cidade: yup.string().required("Cidade é obrigatória"),
  bairro: yup.string().required("Bairro é obrigatório"),
  rua: yup.string().required("Rua é obrigatória"),
  numero: yup.string().required("Número é obrigatório"),
  complemento: yup.string(),
});

function CadastroEmpresa() {
  const [form, setForm] = useState({
    nomeFantasia: "",
    cnpj: "",
    telefone: "",
    email: "",
    cep: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "cnpj") maskedValue = maskCNPJ(value);
    if (name === "telefone") maskedValue = maskTelefone(value);
    if (name === "cep") maskedValue = maskCEP(value);
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
      await axios.post("http://localhost:3000/empresas", {
        ...form,
        foto: form.foto || "",
      });
      alert("Empresa cadastrada com sucesso!");
      // limpar
      setForm({
        nomeFantasia: "",
        cnpj: "",
        telefone: "",
        email: "",
        cep: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: "",
        complemento: "",
      });
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
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
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              apartment
            </span>
            <input
              type="text"
              name="nomeFantasia"
              value={form.nomeFantasia}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome fantasia"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.nomeFantasia ? "border-red-400" : "border-gray-200"}`}
              required
            />
            {errors.nomeFantasia && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.nomeFantasia}</span>}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              badge
            </span>
            <input
              type="text"
              name="cnpj"
              value={form.cnpj}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="CNPJ"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.cnpj ? "border-red-400" : "border-gray-200"}`}
              maxLength={18}
              required
              inputMode="numeric"
            />
            {errors.cnpj && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.cnpj}</span>}
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
              placeholder="Telefone para contato"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.telefone ? "border-red-400" : "border-gray-200"}`}
              maxLength={15}
              required
              inputMode="numeric"
            />
            {errors.telefone && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.telefone}</span>}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              email
            </span>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="E-mail para contato"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.email ? "border-red-400" : "border-gray-200"}`}
              required
            />
            {errors.email && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.email}</span>}
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              location_on
            </span>
            <input
              type="text"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="CEP"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.cep ? "border-red-400" : "border-gray-200"}`}
              maxLength={9}
              required
              inputMode="numeric"
            />
            {errors.cep && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.cep}</span>}
          </div>
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                location_city
              </span>
              <input
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Cidade"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.cidade ? "border-red-400" : "border-gray-200"}`}
                required
              />
              {errors.cidade && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.cidade}</span>}
            </div>
            <div className="relative w-1/2">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                map
              </span>
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Bairro"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.bairro ? "border-red-400" : "border-gray-200"}`}
                required
              />
              {errors.bairro && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.bairro}</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative w-2/3">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                streetview
              </span>
              <input
                type="text"
                name="rua"
                value={form.rua}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Rua"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.rua ? "border-red-400" : "border-gray-200"}`}
                required
              />
              {errors.rua && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.rua}</span>}
            </div>
            <div className="relative w-1/3">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                pin
              </span>
              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Número"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${errors.numero ? "border-red-400" : "border-gray-200"}`}
                maxLength={5}
                required
              />
              {errors.numero && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.numero}</span>}
            </div>
          </div>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              add_location_alt
            </span>
            <input
              type="text"
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Complemento"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition`}
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