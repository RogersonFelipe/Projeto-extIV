import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";

function fmtData(v) {
  if (!v) return "—";
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
}

/* ── Calendar portal ── */
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEK_PT   = ["D","S","T","Q","Q","S","S"];

function DateField({ label, name, value, onChange, err }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const calRef = useRef(null);

  const parsed = value
    ? (() => { const [y, m, d] = value.split("-").map(Number); return { y, m: m - 1, d }; })()
    : null;
  const today = new Date();
  const [viewY, setViewY] = useState(parsed?.y ?? today.getFullYear());
  const [viewM, setViewM] = useState(parsed?.m ?? today.getMonth());

  function openCal() {
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.left });
    setOpen(true);
  }

  function selectDay(d) {
    const mm = String(viewM + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange({ target: { name, value: `${viewY}-${mm}-${dd}` } });
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function out(e) {
      if (calRef.current && !calRef.current.contains(e.target) && !btnRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, [open]);

  const firstDay    = new Date(viewY, viewM, 1).getDay();
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();

  const cal = open && createPortal(
    <div ref={calRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, minWidth: 264 }}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <button type="button"
          onClick={() => { if (viewM === 0) { setViewM(11); setViewY(y => y - 1); } else setViewM(m => m - 1); }}
          className="p-1 rounded hover:bg-gray-100">
          <span className="material-icons-outlined text-gray-500 text-sm">chevron_left</span>
        </button>
        <span className="text-sm font-semibold text-gray-700">{MONTHS_PT[viewM]} {viewY}</span>
        <button type="button"
          onClick={() => { if (viewM === 11) { setViewM(0); setViewY(y => y + 1); } else setViewM(m => m + 1); }}
          className="p-1 rounded hover:bg-gray-100">
          <span className="material-icons-outlined text-gray-500 text-sm">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-1">
        {WEEK_PT.map((w, i) => <span key={i} className="text-xs font-semibold text-gray-400 py-1">{w}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center gap-y-1">
        {Array(firstDay).fill(null).map((_, i) => <span key={"e" + i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const sel = parsed && parsed.y === viewY && parsed.m === viewM && parsed.d === d;
          return (
            <button key={d} type="button" onClick={() => selectDay(d)}
              className={`w-8 h-8 mx-auto rounded-full text-sm transition
                ${sel ? "bg-slate-700 text-white font-bold" : "hover:bg-gray-100 text-gray-700"}`}>
              {d}
            </button>
          );
        })}
      </div>
      {value && (
        <button type="button"
          onClick={() => { onChange({ target: { name, value: "" } }); setOpen(false); }}
          className="mt-2 w-full text-xs text-gray-400 hover:text-red-500 py-1.5 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-1">
          <span className="material-icons-outlined text-xs">close</span>Limpar
        </button>
      )}
    </div>,
    document.body
  );

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">calendar_today</span>
        <button type="button" ref={btnRef} onClick={openCal}
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-slate-300
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white"}`}>
          {value ? fmtData(value) : <span className="text-gray-400">Selecione a data</span>}
        </button>
      </div>
      {err && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{err}</p>}
      {cal}
    </div>
  );
}

/* ── Field input ── */
function FieldInput({ label, icon, name, value, onChange, err, placeholder = "" }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">{icon}</span>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete="off"
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`} />
      </div>
      {err && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{err}</p>}
    </div>
  );
}

/* ── Field select ── */
function FieldSelect({ label, icon, name, value, onChange, err, options }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">{icon}</span>
        <select name={name} value={value} onChange={onChange}
          className={`w-full pl-11 pr-8 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition appearance-none
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">expand_more</span>
      </div>
      {err && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{err}</p>}
    </div>
  );
}

/* ── Modal wrapper ── */
function Modal({ children, onClose }) {
  useEffect(() => {
    function esc(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ── Modal header ── */
function ModalHeader({ title, subtitle, icon, onClose, color = "from-blue-600 to-blue-500" }) {
  return (
    <div className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${color} rounded-t-xl`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="material-icons-outlined text-white text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{subtitle}</p>
          <h2 className="text-base font-bold text-white leading-tight">{title}</h2>
        </div>
      </div>
      <button onClick={onClose} className="text-white/70 hover:text-white transition">
        <span className="material-icons-outlined text-xl">close</span>
      </button>
    </div>
  );
}

/* ── Blank form ── */
const BLANK = { alunoId: "", nome: "", dataAdmissao: "", empresaId: "", empresa: "", funcao: "", contatoRH: "", dataDesligamento: "" };

/* ═══════════════════════════════════════════════════════════════════ */
export default function Usuarios_Encaminhados() {
  const [list,    setList]    = useState([]);
  const [alunos,  setAlunos]  = useState([]);
  const [empresas,setEmpresas]= useState([]);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [query,   setQuery]   = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [form,       setForm]       = useState(BLANK);
  const [formErr,    setFormErr]    = useState({});
  const [editItem,   setEditItem]   = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [enc, al, emp] = await Promise.all([
        api.get("/encaminhamentos").catch(() => ({ data: [] })),
        api.get("/pessoas").catch(() => ({ data: [] })),
        api.get("/empresas").catch(() => ({ data: [] })),
      ]);
      setList(Array.isArray(enc.data) ? enc.data : []);
      setAlunos(Array.isArray(al.data) ? al.data : []);
      setEmpresas(Array.isArray(emp.data) ? emp.data : []);
    } finally {
      setLoading(false);
    }
  }

  /* ── Handlers form ── */
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find(a => String(a.id) === String(value));
      setForm(f => ({ ...f, alunoId: value, nome: aluno?.nome ?? "" }));
    } else if (name === "empresaId") {
      const emp = empresas.find(e => String(e.id) === String(value));
      setForm(f => ({ ...f, empresaId: value, empresa: emp?.nomeFantasia ?? emp?.nome ?? "" }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setFormErr(er => ({ ...er, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.alunoId)    errs.alunoId    = "Selecione um aluno";
    if (!form.empresaId)  errs.empresaId  = "Selecione uma empresa";
    if (!form.dataAdmissao) errs.dataAdmissao = "Informe a data de admissão";
    setFormErr(errs);
    return Object.keys(errs).length === 0;
  }

  function openCreate() {
    setForm(BLANK);
    setFormErr({});
    setShowCreate(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post("/encaminhamentos", {
        pessoaId:           Number(form.alunoId),
        empresaId:          form.empresaId ? Number(form.empresaId) : undefined,
        dataEncaminhamento: form.dataAdmissao || undefined,
        dataRetorno:        form.dataDesligamento || undefined,
        cargo:              form.funcao.trim() || undefined,
        observacoes:        form.contatoRH.trim() || undefined,
        status:             "em_andamento",
      });
      setShowCreate(false);
      await loadAll();
    } catch { alert("Erro ao salvar."); } finally { setSaving(false); }
  }

  function openEdit(item) {
    setEditItem({ ...item });
    setForm({
      alunoId:          String(item.alunoId ?? ""),
      nome:             item.nome ?? "",
      dataAdmissao:     item.dataAdmissao ?? "",
      empresaId:        String(item.empresaId ?? ""),
      empresa:          item.empresa ?? "",
      funcao:           item.funcao ?? "",
      contatoRH:        item.contatoRH ?? "",
      dataDesligamento: item.dataDesligamento ?? "",
    });
    setFormErr({});
    setShowEdit(true);
  }

  async function handleEdit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.patch(`/encaminhamentos/${editItem.id}`, {
        pessoaId:           Number(form.alunoId),
        empresaId:          form.empresaId ? Number(form.empresaId) : undefined,
        dataEncaminhamento: form.dataAdmissao || undefined,
        dataRetorno:        form.dataDesligamento || undefined,
        cargo:              form.funcao.trim() || undefined,
        observacoes:        form.contatoRH.trim() || undefined,
      });
      setShowEdit(false);
      await loadAll();
    } catch { alert("Erro ao salvar."); } finally { setSaving(false); }
  }

  async function excluir(id) {
    if (!confirm("Excluir este registro permanentemente?")) return;
    try {
      await api.delete(`/encaminhamentos/${id}`);
      await loadAll();
    } catch { alert("Erro ao excluir."); }
  }

  /* ── Filtro ── */
  const filtered = list.filter(item => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (item.nome    || "").toLowerCase().includes(q) ||
      (item.empresa || "").toLowerCase().includes(q) ||
      (item.funcao  || "").toLowerCase().includes(q)
    );
  });

  /* ── Form fields shared ── */
  function FormFields() {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FieldSelect label="Aluno" icon="school" name="alunoId" value={form.alunoId}
            onChange={handleChange} err={formErr.alunoId}
            options={[
              { value: "", label: "Selecione o aluno..." },
              ...alunos.map(a => ({ value: String(a.id), label: a.nome })),
            ]} />
        </div>
        <div className="col-span-2">
          <FieldSelect label="Empresa" icon="business" name="empresaId" value={form.empresaId}
            onChange={handleChange} err={formErr.empresaId}
            options={[
              { value: "", label: "Selecione a empresa..." },
              ...empresas.map(e => ({ value: String(e.id), label: e.nomeFantasia || e.nome })),
            ]} />
        </div>
        <DateField label="Data de Admissão" name="dataAdmissao" value={form.dataAdmissao}
          onChange={handleChange} err={formErr.dataAdmissao} />
        <DateField label="Provável Desligamento" name="dataDesligamento" value={form.dataDesligamento}
          onChange={handleChange} err={null} />
        <FieldInput label="Função" icon="work" name="funcao" value={form.funcao}
          onChange={handleChange} err={null} placeholder="Cargo / função" />
        <FieldInput label="Contato RH" icon="phone" name="contatoRH" value={form.contatoRH}
          onChange={handleChange} err={null} placeholder="Telefone ou e-mail" />
      </div>
    );
  }

  /* ═══════ RENDER ═══════ */
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">Encaminhados ao Trabalho</h1>
          <p className="text-xs text-gray-400 mt-0.5">Registro de alunos encaminhados a empresas parceiras</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAll}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
            <span className="material-icons-outlined text-base">refresh</span>
            Atualizar
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition">
            <span className="material-icons-outlined text-base">add</span>
            Novo Encaminhamento
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center px-4 py-3 gap-3">
        <span className="material-icons-outlined text-gray-400 text-base">search</span>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por aluno, empresa ou função..."
          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400" />
        <span className="text-xs text-gray-400 ml-auto shrink-0">{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</span>
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined animate-spin text-xl">autorenew</span>
            <span className="text-sm">Carregando...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined text-3xl">inbox</span>
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3 w-10">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Aluno</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Empresa</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Função</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Admissão</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">Desligamento</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">Contato RH</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-800">{item.nome || "—"}</td>
                  <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">{item.empresa || "—"}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{item.funcao || "—"}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{fmtData(item.dataAdmissao)}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">{fmtData(item.dataDesligamento)}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">{item.contatoRH || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition">
                        Editar
                      </button>
                      <button onClick={() => excluir(item.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-md transition">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODAL — CRIAR
      ══════════════════════════════════════════ */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <ModalHeader title="Novo Encaminhamento" subtitle="Cadastro" icon="add_task" onClose={() => setShowCreate(false)} />
          <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
            <FormFields />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition disabled:opacity-60">
                {saving ? "Salvando..." : "Salvar Encaminhamento"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL — EDITAR
      ══════════════════════════════════════════ */}
      {showEdit && editItem && (
        <Modal onClose={() => setShowEdit(false)}>
          <ModalHeader title={editItem.nome || "Editar Encaminhamento"} subtitle="Edição de registro" icon="edit_note" onClose={() => setShowEdit(false)} color="from-slate-700 to-slate-600" />
          <form onSubmit={handleEdit} className="p-6 flex flex-col gap-5">
            <FormFields />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition disabled:opacity-60">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
