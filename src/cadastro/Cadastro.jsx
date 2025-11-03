import { useState } from "react";
import * as yup from "yup";

function maskCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: yup.string().min(6, "Senha deve ter ao menos 6 caracteres").required("Senha é obrigatória"),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref("senha")], "As senhas não conferem")
    .required("Confirme a senha"),
  nascimento: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Data de nascimento inválida"
    )
    .required("Data de nascimento é obrigatória"),
  cpf: yup
    .string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00")
    .required("CPF é obrigatório"),
});

function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    nascimento: "",
    cpf: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "cpf") maskedValue = maskCPF(value);
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
      alert("Cadastro realizado com sucesso!");
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md md:max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8 tracking-tight">Cadastro</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="relative">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.nome ? "border-red-400" : "border-blue-300"}`}
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-user"></i>
            </span>
            {errors.nome && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.nome}</span>}
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="E-mail"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? "border-red-400" : "border-blue-300"}`}
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-envelope"></i>
            </span>
            {errors.email && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.email}</span>}
          </div>
          <div className="relative">
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Senha"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.senha ? "border-red-400" : "border-blue-300"}`}
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-lock"></i>
            </span>
            {errors.senha && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.senha}</span>}
          </div>
          <div className="relative">
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirmar Senha"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.confirmarSenha ? "border-red-400" : "border-blue-300"}`}
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-lock"></i>
            </span>
            {errors.confirmarSenha && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.confirmarSenha}</span>}
          </div>
          <div className="relative">
            <input
              type="date"
              name="nascimento"
              value={form.nascimento}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Data de Nascimento"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.nascimento ? "border-red-400" : "border-blue-300"}`}
              required
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-calendar"></i>
            </span>
            {errors.nascimento && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.nascimento}</span>}
          </div>
          <div className="relative">
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="CPF"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.cpf ? "border-red-400" : "border-blue-300"}`}
              required
              maxLength={14}
              inputMode="numeric"
            />
            <span className="absolute left-3 top-3 text-blue-400">
              <i className="fa fa-id-card"></i>
            </span>
            {errors.cpf && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.cpf}</span>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
            disabled={loading}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
export default Cadastro;