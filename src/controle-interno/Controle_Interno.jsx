/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as yup from "yup";
import api from "../api/axios";

const RESULTADO_META = {
  "em-andamento": {
    label: "Em Andamento",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  aprovado: {
    label: "Aprovado",
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  reprovado: {
    label: "Reprovado",
    badge: "bg-red-50 text-red-500 border border-red-200",
  },
};

const BLANK = {
  alunoId: "",
  alunoNome: "",
  ingresso: "",
  aval1: "",
  aval2: "",
  entrevistaPais1: "",
  entrevistaPais2: "",
  resultado: "em-andamento",
  observacao: "",
};

const schema = yup.object({
  alunoNome: yup.string().required("Aluno é obrigatório"),
  ingresso: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data inválida dd/mm/aaaa",
    )
    .required("Data de ingresso é obrigatória"),
});

/* ── Modal wrapper ── */
function Modal({ children, onClose }) {
  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ── Cabeçalho do modal ── */
function ModalHeader({
  title,
  subtitle,
  icon,
  onClose,
  color = "from-slate-700 to-slate-600",
}) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${color} rounded-t-xl`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="material-icons-outlined text-white text-xl">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium uppercase tracking-wide">
            {subtitle}
          </p>
          <h2 className="text-base font-bold text-white leading-tight truncate max-w-xs">
            {title}
          </h2>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition"
      >
        <span className="material-icons-outlined text-xl">close</span>
      </button>
    </div>
  );
}

/* ── Field input ── */
function Field({
  name,
  value,
  err,
  onChange,
  label,
  icon,
  span = 1,
  placeholder,
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          {icon}
        </span>
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
        />
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}

/* ── FieldSelect ── */
function FieldSelect({
  label,
  icon,
  value,
  onChange,
  name,
  err,
  children,
  span = 1,
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          {icon}
        </span>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-11 pr-8 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition appearance-none bg-gray-50 focus:bg-white
            ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        >
          {children}
        </select>
        <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          expand_more
        </span>
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}

/* ── FieldTextarea ── */
function FieldTextarea({
  label,
  icon,
  value,
  onChange,
  name,
  err,
  placeholder,
}) {
  return (
    <div className="col-span-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-3 text-gray-400 text-base pointer-events-none">
          {icon}
        </span>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none bg-gray-50 focus:bg-white
            ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}

/* ── DateField com calendário portal ── */
const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const WEEK_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function DateField({ name, value, err, onChange, label = "Data" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const calRef = useRef(null);

  function parseValue(v) {
    if (!v || v.length !== 10) return null;
    const [d, m, y] = v.split("/");
    const date = new Date(+y, +m - 1, +d);
    return isNaN(date) ? null : date;
  }

  const selected = parseValue(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => {
    const s = parseValue(value);
    return s
      ? new Date(s.getFullYear(), s.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);
  });

  function openCalendar() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 288),
      });
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    function handler(e) {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        calRef.current &&
        !calRef.current.contains(e.target)
      )
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function selectDay(day) {
    const d = String(day).padStart(2, "0");
    const m = String(view.getMonth() + 1).padStart(2, "0");
    const y = view.getFullYear();
    onChange({ target: { name, value: `${d}/${m}/${y}` } });
    setOpen(false);
  }

  const year = view.getFullYear(),
    month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysCount = new Date(year, month + 1, 0).getDate();

  const calendar = open ? (
    <div
      ref={calRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      }}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <span className="material-icons-outlined text-gray-500 text-base">
            chevron_left
          </span>
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {MONTHS_PT[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <span className="material-icons-outlined text-gray-500 text-base">
            chevron_right
          </span>
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {WEEK_PT.map((w) => (
          <div
            key={w}
            className="text-center text-xs font-semibold text-gray-400"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => {
          const d = new Date(year, month, day);
          const isSel = selected && d.getTime() === selected.getTime();
          const isToday = d.getTime() === today.getTime();
          return (
            <button
              key={day}
              type="button"
              onClick={() => selectDay(day)}
              className={`w-8 h-8 mx-auto rounded-full text-xs flex items-center justify-center transition font-medium
                ${isSel ? "bg-slate-700 text-white" : isToday ? "ring-2 ring-slate-400 text-slate-700 font-bold" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange({ target: { name, value: "" } });
            setOpen(false);
          }}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-red-500 transition py-1.5 rounded-lg hover:bg-red-50"
        >
          <span className="material-icons-outlined text-xs">close</span>Limpar
          data
        </button>
      )}
    </div>
  ) : null;

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <button
        ref={btnRef}
        type="button"
        onClick={openCalendar}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-slate-300
          ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white"}`}
      >
        <span className="material-icons-outlined text-gray-400 text-base">
          calendar_today
        </span>
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || "Selecionar data"}
        </span>
      </button>
      {open && createPortal(calendar, document.body)}
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}

/* ── FormFields (componente externo para evitar remount) ── */
function FormFields({ data, setData, errs = {}, alunosOpts }) {
  function changeAluno(e) {
    const opt = alunosOpts.find((a) => String(a.id) === e.target.value);
    setData((p) => ({
      ...p,
      alunoId: opt ? String(opt.id) : "",
      alunoNome: opt ? opt.nome : "",
    }));
  }
  function change(e) {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-h-[52vh] overflow-y-auto pr-1 py-1">
      <FieldSelect
        label="Aluno"
        icon="school"
        name="alunoId"
        value={data.alunoId}
        onChange={changeAluno}
        err={errs.alunoNome}
        span={2}
      >
        <option value="">Selecionar aluno...</option>
        {alunosOpts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nome}
          </option>
        ))}
      </FieldSelect>

      <DateField
        name="ingresso"
        value={data.ingresso}
        err={errs.ingresso}
        label="Ingresso"
        onChange={(e) => setData((p) => ({ ...p, ingresso: e.target.value }))}
      />

      <DateField
        name="aval1"
        value={data.aval1}
        err={null}
        label="1ª Avaliação"
        onChange={(e) => setData((p) => ({ ...p, aval1: e.target.value }))}
      />

      <DateField
        name="aval2"
        value={data.aval2}
        err={null}
        label="2ª Avaliação"
        onChange={(e) => setData((p) => ({ ...p, aval2: e.target.value }))}
      />

      <DateField
        name="entrevistaPais1"
        value={data.entrevistaPais1}
        err={null}
        label="1ª Entrevista Pais"
        onChange={(e) =>
          setData((p) => ({ ...p, entrevistaPais1: e.target.value }))
        }
      />

      <DateField
        name="entrevistaPais2"
        value={data.entrevistaPais2}
        err={null}
        label="2ª Entrevista Pais"
        onChange={(e) =>
          setData((p) => ({ ...p, entrevistaPais2: e.target.value }))
        }
      />

      <FieldSelect
        label="Resultado"
        icon="flag"
        name="resultado"
        value={data.resultado}
        onChange={change}
        err={null}
        span={1}
      >
        <option value="em-andamento">Em Andamento</option>
        <option value="aprovado">Aprovado</option>
        <option value="reprovado">Reprovado</option>
      </FieldSelect>

      <FieldTextarea
        name="observacao"
        value={data.observacao}
        err={null}
        onChange={change}
        label="Observações"
        icon="notes"
        placeholder="Observações adicionais..."
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Controle_Interno() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [alunosOpts, setAlunosOpts] = useState([]);

  /* create */
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [formErr, setFormErr] = useState({});
  const [creating, setCreating] = useState(false);

  /* edit */
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    loadAlunos();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/avaliacoes");
      setRegistros(res.data);
    } catch {
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadAlunos() {
    try {
      const res = await api.get("/pessoas");
      setAlunosOpts(res.data);
    } catch {
      /* ignora */
    }
  }

  async function submitCreate(ev) {
    ev.preventDefault();
    setCreating(true);
    try {
      await schema.validate(form, { abortEarly: false });
      await api.post("/avaliacoes", form);
      setShowCreate(false);
      setForm({ ...BLANK });
      setFormErr({});
      await load();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errs = {};
        err.inner.forEach((e) => {
          if (!errs[e.path]) errs[e.path] = e.message;
        });
        setFormErr(errs);
      } else {
        alert("Erro ao cadastrar");
      }
    }
    setCreating(false);
  }

  async function submitEdit(ev) {
    ev.preventDefault();
    setSaving(true);
    try {
      await schema.validate(editing, { abortEarly: false });
      await api.patch(`/avaliacoes/${editing.id}`, editing);
      setEditing(null);
      await load();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        alert(err.inner.map((e) => e.message).join("\n"));
      } else {
        alert("Erro ao salvar");
      }
    }
    setSaving(false);
  }

  async function deleteItem(item) {
    if (!confirm("Excluir este registro permanentemente?")) return;
    try {
      await api.delete(`/avaliacoes/${item.id}`);
      await load();
    } catch {
      alert("Erro ao excluir");
    }
  }

  /* filtros */
  const filtered = registros.filter((r) => {
    if (tab === "em-andamento" && r.resultado !== "em-andamento") return false;
    if (tab === "aprovado" && r.resultado !== "aprovado") return false;
    if (tab === "reprovado" && r.resultado !== "reprovado") return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (r.alunoNome || "").toLowerCase().includes(q);
  });

  const COUNTS = {
    todos: registros.length,
    "em-andamento": registros.filter((r) => r.resultado === "em-andamento")
      .length,
    aprovado: registros.filter((r) => r.resultado === "aprovado").length,
    reprovado: registros.filter((r) => r.resultado === "reprovado").length,
  };

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const TABS = [
    { key: "todos", label: "Todos" },
    { key: "em-andamento", label: "Em Andamento" },
    { key: "aprovado", label: "Aprovados" },
    { key: "reprovado", label: "Reprovados" },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            Controle Interno
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Avaliação de usuários — Período de Experiência{" "}
            {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            <span className="material-icons-outlined text-base">refresh</span>
            Atualizar
          </button>
          <button
            onClick={() => {
              setForm({ ...BLANK });
              setFormErr({});
              setShowCreate(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition"
          >
            <span className="material-icons-outlined text-base">add</span>
            Novo Registro
          </button>
        </div>
      </div>

      {/* Abas + busca */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2
              ${tab === t.key ? "border-slate-700 text-slate-800 bg-slate-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
              ${i > 0 ? "border-l border-l-gray-100" : ""}`}
          >
            {t.label}
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-full
              ${tab === t.key ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {COUNTS[t.key]}
            </span>
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 px-4 border-l border-gray-100">
          <span className="material-icons-outlined text-gray-400 text-base">
            search
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome do usuário..."
            className="text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 w-56"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="material-icons-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 px-4 border-l border-gray-100 text-sm text-gray-500 shrink-0">
          <span>Exibir</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-gray-50 focus:outline-none"
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="material-icons-outlined text-3xl animate-spin">
              autorenew
            </span>
            <p className="text-sm">Carregando registros...</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="material-icons-outlined text-3xl">assignment</span>
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                  Nome do Usuário
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                  Ingresso
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                  1ª Aval
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                  2ª Aval
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">
                  1ª Entrev. Pais
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">
                  2ª Entrev. Pais
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Resultado
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageItems.map((r) => {
                const rm =
                  RESULTADO_META[r.resultado] || RESULTADO_META["em-andamento"];
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 text-xs font-bold">
                            {(r.alunoNome || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {r.alunoNome || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                      {r.ingresso || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">
                      {r.aval1 || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">
                      {r.aval2 || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">
                      {r.entrevistaPais1 || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">
                      {r.entrevistaPais2 || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${rm.badge}`}
                      >
                        {rm.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing({ ...r })}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteItem(r)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-md transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Paginação */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
          <p className="text-xs text-gray-400">
            {total === 0
              ? "0 registros"
              : `${start + 1}–${Math.min(start + perPage, total)} de ${total} registros`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
            >
              <span className="material-icons-outlined text-sm">
                chevron_left
              </span>
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition
                  ${p === page ? "bg-slate-700 text-white" : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
            >
              <span className="material-icons-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ══ MODAL — CRIAR ══ */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <ModalHeader
            title="Novo Registro de Controle"
            subtitle="Período de experiência"
            icon="add_task"
            onClose={() => setShowCreate(false)}
            color="from-slate-700 to-slate-600"
          />
          <form
            onSubmit={submitCreate}
            className="px-6 py-5 flex flex-col gap-4"
          >
            <FormFields
              data={form}
              setData={setForm}
              errs={formErr}
              alunosOpts={alunosOpts}
            />
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition font-semibold disabled:opacity-60"
              >
                <span className="material-icons-outlined text-base">
                  {creating ? "hourglass_top" : "check_circle"}
                </span>
                {creating ? "Salvando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══ MODAL — EDITAR ══ */}
      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <ModalHeader
            title={editing.alunoNome || "Registro"}
            subtitle="Editar controle interno"
            icon="edit_note"
            onClose={() => setEditing(null)}
            color="from-blue-600 to-blue-500"
          />
          <form onSubmit={submitEdit} className="px-6 py-5 flex flex-col gap-4">
            <FormFields
              data={editing}
              setData={setEditing}
              errs={{}}
              alunosOpts={alunosOpts}
            />
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition font-semibold disabled:opacity-60"
              >
                <span className="material-icons-outlined text-base">
                  {saving ? "hourglass_top" : "save"}
                </span>
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
