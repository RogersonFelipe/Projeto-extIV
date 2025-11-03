import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  nome: yup.string().trim().required("Nome é obrigatório"),
  email: yup
    .string()
    .trim()
    .email("E-mail inválido")
    .required("E-mail é obrigatório"),
  senha: yup
    .string()
    .required("Senha é obrigatória"),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref("senha")], "As senhas não coincidem")
    .required("Confirme a senha"),

});

function Cadastro_Usuario() {
  const navigate = useNavigate();

  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});

  function handleImgChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setImgPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleBlur(e) {
    const { name, value } = e.target;
    try {
      await yup.reach(schema, name).validate(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});

      setLoading(true);

      const existente = await axios.get(
        `http://localhost:3000/usuarios?email=${encodeURIComponent(form.email)}`
      );
      if (existente.data.length > 0) {
        setLoading(false);
        setErrors((prev) => ({
          ...prev,
          email: "Este e-mail já está cadastrado",
        }));
        return;
      }

      await axios.post("http://localhost:3000/usuarios", {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        foto: imgPreview || "",
      });

      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          if (error.path && !newErrors[error.path]) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error(err);
        alert("Erro ao cadastrar usuário!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-blue-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg mb-3">
            <span className="material-icons-outlined text-white text-4xl">
              person_add
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-blue-800 text-center tracking-tight drop-shadow">
            Cadastrar Usuário
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
              placeholder="Nome completo"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${
                errors.nome ? "border-red-400" : "border-gray-200"
              }`}
              autoComplete="off"
              required
            />
            {errors.nome && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.nome}
              </span>
            )}
          </div>

          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              mail
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="E-mail"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              autoComplete="off"
              required
            />
            {errors.email && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.email}
              </span>
            )}
          </div>

          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              lock
            </span>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Senha "
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${
                errors.senha ? "border-red-400" : "border-gray-200"
              }`}
              autoComplete="off"
              required
            />
            {errors.senha && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.senha}
              </span>
            )}
          </div>

          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              lock
            </span>
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirmar senha"
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition ${
                errors.confirmarSenha ? "border-red-400" : "border-gray-200"
              }`}
              autoComplete="off"
              required
            />
            {errors.confirmarSenha && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                {errors.confirmarSenha}
              </span>
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

export default Cadastro_Usuario;
