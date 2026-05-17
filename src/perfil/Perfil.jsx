import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { updateProfileAsync } from "../store/authSlice";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Perfil() {
  const { usuario } = useSelector((s) => s.auth);
  const dispatch    = useDispatch();
  const fileRef     = useRef(null);

  const [editMode,     setEditMode]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [preview,      setPreview]      = useState(null);
  const [hasNewPhoto,  setHasNewPhoto]  = useState(false);
  const [showPass,     setShowPass]     = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [errs,         setErrs]         = useState({});

  const [form, setForm] = useState({
    nome: "", email: "", novaSenha: "", confirmarSenha: "",
  });

  useEffect(() => {
    if (usuario) {
      setForm({ nome: usuario.nome || "", email: usuario.email || "", novaSenha: "", confirmarSenha: "" });
      setPreview(usuario.fotoUrl || null);
      setHasNewPhoto(false);
    }
  }, [usuario]);

  if (!usuario) return null;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrs((p) => ({ ...p, [name]: "" }));
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 200;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.5);
        setPreview(compressed);
        setHasNewPhoto(true);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function cancelar() {
    setForm({ nome: usuario.nome || "", email: usuario.email || "", novaSenha: "", confirmarSenha: "" });
    setPreview(usuario.fotoUrl || null);
    setHasNewPhoto(false);
    setErrs({});
    setEditMode(false);
  }

  async function onSave(e) {
    e.preventDefault();
    const newErrs = {};
    if (!form.nome.trim()) newErrs.nome = "Nome é obrigatório";
    if (!form.email.trim()) newErrs.email = "E-mail é obrigatório";
    if (form.novaSenha && form.novaSenha.length < 6) newErrs.novaSenha = "Mínimo 6 caracteres";
    if (form.novaSenha && form.novaSenha !== form.confirmarSenha) newErrs.confirmarSenha = "As senhas não coincidem";
    if (Object.keys(newErrs).length) { setErrs(newErrs); return; }

    setSaving(true);
    try {
      const payload = {
        nome:    form.nome.trim(),
        email:   form.email.trim(),
        fotoUrl: hasNewPhoto ? (preview || "") : (usuario.fotoUrl || ""),
        ...(form.novaSenha ? { senha: form.novaSenha } : {}),
      };
      await dispatch(updateProfileAsync(payload)).unwrap();
      setEditMode(false);
      setForm((f) => ({ ...f, novaSenha: "", confirmarSenha: "" }));
    } catch (err) {
      alert(typeof err === "string" ? err : "Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">Meu Perfil</h1>
          <p className="text-xs text-gray-400 mt-0.5">Gerencie suas informações pessoais</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition"
          >
            <span className="material-icons-outlined text-base">edit</span>
            Editar perfil
          </button>
        )}
      </div>

      <form onSubmit={onSave} className="flex flex-col gap-4">
        {/* Card: Foto + dados básicos */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Header do card */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Informações pessoais</p>
          </div>

          <div className="px-6 py-6 flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-blue-100 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-700 font-bold text-2xl">{getInitials(form.nome)}</span>
                  )}
                </div>
                {editMode && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-slate-700 hover:bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow transition"
                  >
                    <span className="material-icons-outlined text-white" style={{ fontSize: 14 }}>photo_camera</span>
                  </button>
                )}
              </div>
              {editMode && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-slate-600 hover:text-slate-800 underline transition"
                >
                  Alterar foto
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>

            {/* Campos nome e email */}
            <div className="flex-1 grid grid-cols-1 gap-4 w-full">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Nome completo
                </label>
                <div className="relative">
                  <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">person</span>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={onChange}
                    disabled={!editMode}
                    placeholder="Seu nome completo"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300
                      ${!editMode ? "bg-gray-50 border-gray-200 text-gray-700 cursor-default" : errs.nome ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
                  />
                </div>
                {errs.nome && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{errs.nome}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    disabled={!editMode}
                    placeholder="seu@email.com"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300
                      ${!editMode ? "bg-gray-50 border-gray-200 text-gray-700 cursor-default" : errs.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
                  />
                </div>
                {errs.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{errs.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Card: Alterar senha — só em modo edição */}
        {editMode && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Alterar senha</p>
              <p className="text-xs text-gray-400 mt-0.5">Deixe em branco para manter a senha atual</p>
            </div>
            <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nova senha */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nova senha</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">lock</span>
                    <input
                      name="novaSenha"
                      type={showPass ? "text" : "password"}
                      value={form.novaSenha}
                      onChange={onChange}
                      placeholder="Nova senha"
                      className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition
                        ${errs.novaSenha ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
                    />
                  </div>
                  <button type="button" onClick={() => setShowPass((s) => !s)}
                    className="px-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition">
                    <span className="material-icons-outlined text-base">{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {errs.novaSenha && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{errs.novaSenha}</p>}
              </div>

              {/* Confirmar senha */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Confirmar senha</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">lock_reset</span>
                    <input
                      name="confirmarSenha"
                      type={showConfPass ? "text" : "password"}
                      value={form.confirmarSenha}
                      onChange={onChange}
                      placeholder="Confirme a senha"
                      className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition
                        ${errs.confirmarSenha ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
                    />
                  </div>
                  <button type="button" onClick={() => setShowConfPass((s) => !s)}
                    className="px-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition">
                    <span className="material-icons-outlined text-base">{showConfPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {errs.confirmarSenha && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{errs.confirmarSenha}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        {editMode && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelar}
              disabled={saving}
              className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition font-semibold disabled:opacity-60"
            >
              <span className="material-icons-outlined text-base">{saving ? "hourglass_top" : "save"}</span>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
