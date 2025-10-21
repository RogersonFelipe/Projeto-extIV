import { useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

const schema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: yup.string().required("Senha é obrigatória"),
});

function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
      dispatch(login(form));
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Login
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="E-mail"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.email && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.email}</span>}
          </div>
          <div>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Senha"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.senha ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.senha && <span className="text-red-500 text-xs ml-2 block mt-1">{errors.senha}</span>}
          </div>
          {error && <span className="text-red-500 text-xs ml-2 block mt-1">{error}</span>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-500">
          Esqueceu a senha?{" "}
          <a href="/recuperar-senha" className="text-blue-600 hover:underline">
            Recuperar Senha
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;