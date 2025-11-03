import { useState } from "react";
import * as yup from "yup";

function maskData(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  admissao: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Data de admissão inválida. Use o formato dd/mm/aaaa")
    .required("Data de admissão é obrigatória"),
  visita: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Data da visita inválida. Use o formato dd/mm/aaaa")
    .required("Data da visita é obrigatória"),
  empresa: yup.string().required("Empresa é obrigatória"),
  responsavelRH: yup.string().required("Responsável RH é obrigatório"),
  contatoCom: yup.string().required("Contato com é obrigatório"),
  parecer: yup.string().required("Parecer Geral é obrigatório"),
});

function Ficha_Acompanhamento() {
  const [form, setForm] = useState({
    nome: "",
    admissao: "",
    visita: "",
    empresa: "",
    responsavelRH: "",
    contatoCom: "",
    parecer: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "admissao" || name === "visita") maskedValue = maskData(value);
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
      alert("Ficha salva com sucesso!");
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
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Ficha de Acompanhamento
        </h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.nome ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.nome && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.nome}</span>}
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                type="text"
                name="admissao"
                value={form.admissao}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Data de admissão"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.admissao ? "border-red-400" : "border-gray-300"}`}
                required
                maxLength={10}
                inputMode="numeric"
              />
              {errors.admissao && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.admissao}</span>}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="visita"
                value={form.visita}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Data da visita"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.visita ? "border-red-400" : "border-gray-300"}`}
                required
                maxLength={10}
                inputMode="numeric"
              />
              {errors.visita && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.visita}</span>}
            </div>
          </div>
          <div>
            <input
              type="text"
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Empresa"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.empresa ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.empresa && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.empresa}</span>}
          </div>
          <div>
            <input
              type="text"
              name="responsavelRH"
              value={form.responsavelRH}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Responsável RH"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.responsavelRH ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.responsavelRH && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.responsavelRH}</span>}
          </div>
          <div>
            <input
              type="text"
              name="contatoCom"
              value={form.contatoCom}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Contato com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.contatoCom ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.contatoCom && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.contatoCom}</span>}
          </div>
          <div>
            <textarea
              name="parecer"
              value={form.parecer}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Parecer Geral"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none h-24 ${errors.parecer ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.parecer && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.parecer}</span>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            disabled={loading}
          >
            Salvar Ficha
          </button>
        </form>
      </div>
    </div>
  );
}

export default Ficha_Acompanhamento;