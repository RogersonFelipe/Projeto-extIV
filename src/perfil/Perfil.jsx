import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateProfileAsync } from "../store/authSlice";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Perfil() {
  const { usuario, saving } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    foto: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({
        nome: usuario.nome || "",
        email: usuario.email || "",
        foto: usuario.foto || "",
        novaSenha: "",
        confirmarSenha: "",
      });
      setPreview(usuario.foto || null);
      setHasNewPhoto(false);
    }
  }, [usuario]);

  if (!usuario) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-3">Meu Perfil</h2>
        <p>Nenhum usuário autenticado.</p>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setHasNewPhoto(true);
    };
    reader.readAsDataURL(file);
  };

  const onSave = async (e) => {
    e.preventDefault();

    if (form.novaSenha || form.confirmarSenha) {
      if (form.novaSenha !== form.confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
      }
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      foto: hasNewPhoto ? (preview || "") : (usuario.foto || ""),
      ...(form.novaSenha ? { senha: form.novaSenha } : {}),
    };

    try {
      await dispatch(updateProfileAsync(payload)).unwrap();
      setEditMode(false);
      setForm((f) => ({ ...f, novaSenha: "", confirmarSenha: "" }));
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      alert(typeof err === "string" ? err : "Erro ao salvar perfil.");
    }
  };

  const cancelarEdicao = () => {
    setForm({
      nome: usuario.nome || "",
      email: usuario.email || "",
      foto: usuario.foto || "",
      novaSenha: "",
      confirmarSenha: "",
    });
    setPreview(usuario.foto || null);
    setHasNewPhoto(false);
    setEditMode(false);
  };

  const initials = getInitials(form.nome);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Meu Perfil</h1>

      <div className="flex items-center gap-4 mb-6">
        {preview ? (
          <img
            src={preview}
            alt="Foto do usuário"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border bg-gray-200 flex items-center justify-center text-blue-700 font-bold text-xl">
            {initials || "?"}
          </div>
        )}

        {!editMode && (
          <button
            className="px-3 py-2 rounded-lg bg-blue-600 text-white"
            onClick={() => setEditMode(true)}
          >
            Editar
          </button>
        )}
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={onChange}
            disabled={!editMode}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            disabled={!editMode}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {editMode && (
          <>
            <div>
              <label className="block text-sm font-medium">Foto do perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se nada for selecionado, manteremos a foto atual (ou vazio).
              </p>
            </div>

            <hr className="my-4" />
            <h2 className="text-lg font-semibold text-gray-700">Alterar senha</h2>

            <div>
              <label className="block text-sm font-medium">Nova senha</label>
              <input
                type="password"
                name="novaSenha"
                value={form.novaSenha}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Digite a nova senha"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirmar nova senha</label>
              <input
                type="password"
                name="confirmarSenha"
                value={form.confirmarSenha}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Confirme a nova senha"
              />
            </div>
          </>
        )}

        {editMode && (
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-70"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={cancelarEdicao}
              className="px-4 py-2 rounded-lg border"
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
