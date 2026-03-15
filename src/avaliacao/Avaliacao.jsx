import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";

/* ── Perguntas do formulário ── */
const PERGUNTAS = [
  { n: 1,  texto: "Cumpre o horário de entrada?" },
  { n: 2,  texto: "Cumpre o horário de saída?" },
  { n: 3,  texto: "Cumpre o horário de intervalo/almoço?" },
  { n: 4,  texto: "Demonstra pontualidade nas tarefas solicitadas?" },
  { n: 5,  texto: "Apresenta-se adequadamente para o trabalho (higiene pessoal e vestimenta)?" },
  { n: 6,  texto: "Mantém a organização do seu espaço de trabalho?" },
  { n: 7,  texto: "Cuida dos materiais e equipamentos utilizados?" },
  { n: 8,  texto: "Executa as tarefas dentro do prazo solicitado?" },
  { n: 9,  texto: "Demonstra interesse pelas atividades propostas?" },
  { n: 10, texto: "Solicita ajuda quando necessário?" },
  { n: 11, texto: "Aceita orientações e correções com tranquilidade?" },
  { n: 12, texto: "Relaciona-se bem com colegas de trabalho?" },
  { n: 13, texto: "Relaciona-se bem com a chefia/supervisão?" },
  { n: 14, texto: "Respeita as normas e regras da empresa?" },
  { n: 15, texto: "Demonstra iniciativa nas atividades?" },
  { n: 16, texto: "Comunica-se de forma clara e adequada?" },
  { n: 17, texto: "Mantém postura profissional no ambiente de trabalho?" },
  { n: 18, texto: "Demonstra autonomia na realização das tarefas?" },
  { n: 19, texto: "Realiza as tarefas com qualidade?" },
  { n: 20, texto: "Demonstra aprendizado contínuo?" },
  { n: 21, texto: "Adapta-se às mudanças no ambiente de trabalho?" },
  { n: 22, texto: "Demonstra responsabilidade com as tarefas delegadas?" },
  { n: 23, texto: "Participa ativamente das atividades em grupo?" },
  { n: 24, texto: "Utiliza os equipamentos de proteção individual (quando necessário)?" },
  { n: 25, texto: "Demonstra segurança na execução das tarefas?" },
  { n: 26, texto: "Respeita os colegas independentemente de diferenças?" },
  { n: 27, texto: "Demonstra comprometimento com os objetivos da empresa?" },
  { n: 28, texto: "Mantém o sigilo de informações quando necessário?" },
  { n: 29, texto: "Demonstra proatividade para resolver problemas?" },
  { n: 30, texto: "Aceita feedbacks de forma construtiva?" },
  { n: 31, texto: "Mantém relacionamento respeitoso com clientes (quando aplicável)?" },
  { n: 32, texto: "Demonstra criatividade na resolução de tarefas?" },
  { n: 33, texto: "Organiza suas atividades de forma eficiente?" },
  { n: 34, texto: "Demonstra equilíbrio emocional em situações de pressão?" },
  { n: 35, texto: "Busca aperfeiçoamento nas atividades que realiza?" },
  { n: 36, texto: "Colabora com a equipe para atingir metas?" },
  { n: 37, texto: "Demonstra respeito pela hierarquia?" },
  { n: 38, texto: "Utiliza o tempo de trabalho de forma produtiva?" },
  { n: 39, texto: "Demonstra atenção aos detalhes das tarefas?" },
  { n: 40, texto: "Cumpre as metas estabelecidas?" },
  { n: 41, texto: "Demonstra satisfação com as atividades realizadas?" },
  { n: 42, texto: "Mantém postura ética no ambiente de trabalho?" },
  { n: 43, texto: "Demonstra interesse em aprender novas funções?" },
  { n: 44, texto: "Adapta-se bem ao ritmo de trabalho da empresa?" },
  { n: 45, texto: "Integra-se ao ambiente e cultura organizacional?" },
  { n: 46, texto: "Demonstra evolução desde o início da experiência?" },
];

const OPCOES = [
  { v: 1, label: "Sim",               bg: "bg-green-50",  border: "border-green-400",  text: "text-green-700",  dot: "bg-green-500"  },
  { v: 2, label: "Não",               bg: "bg-red-50",    border: "border-red-400",    text: "text-red-700",    dot: "bg-red-500"    },
  { v: 3, label: "Maioria das vezes", bg: "bg-blue-50",   border: "border-blue-400",   text: "text-blue-700",   dot: "bg-blue-500"   },
  { v: 4, label: "Raras vezes",       bg: "bg-amber-50",  border: "border-amber-400",  text: "text-amber-700",  dot: "bg-amber-500"  },
];

const STATUS_META = {
  em_aberto:  { label: "Em aberto",  badge: "bg-amber-50 text-amber-700 border border-amber-200"  },
  finalizado: { label: "Finalizado", badge: "bg-slate-700 text-white border border-slate-700"     },
  cancelado:  { label: "Cancelado",  badge: "bg-red-50 text-red-600 border border-red-200"        },
};

const TIPO_LABEL = {
  inicial:        "Experiência",
  acompanhamento: "Acompanhamento",
};

function blankAval() {
  const q = {};
  for (let i = 1; i <= 46; i++) q[`q${String(i).padStart(2, "0")}`] = null;
  return {
    alunoId: "",
    pessoaNome: "",
    professor: "",
    tipo: "inicial",
    status: "em_aberto",
    dataAvaliacao: "",
    observacoes: "",
    recomendacoes: "",
    q47: "",
    q48: "",
    ...q,
  };
}

function fmtData(v) {
  if (!v) return "—";
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
}

function countAnswered(aval) {
  let n = 0;
  for (let i = 1; i <= 46; i++) if (aval[`q${String(i).padStart(2, "0")}`] !== null) n++;
  return n;
}

/* ── Calendar ── */
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEK_PT   = ["D","S","T","Q","Q","S","S"];

function DateField({ name, value, err, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const calRef = useRef(null);

  const parsed = value ? (() => { const [y,m,d] = value.split("-").map(Number); return { y, m: m-1, d }; })() : null;
  const today  = new Date();
  const [viewY, setViewY] = useState(parsed?.y ?? today.getFullYear());
  const [viewM, setViewM] = useState(parsed?.m ?? today.getMonth());

  function openCalendar() {
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
    <div ref={calRef} style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, minWidth: 264 }}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={() => { if (viewM === 0) { setViewM(11); setViewY(y => y-1); } else setViewM(m => m-1); }}
          className="p-1 rounded hover:bg-gray-100">
          <span className="material-icons-outlined text-gray-500 text-sm">chevron_left</span>
        </button>
        <span className="text-sm font-semibold text-gray-700">{MONTHS_PT[viewM]} {viewY}</span>
        <button type="button" onClick={() => { if (viewM === 11) { setViewM(0); setViewY(y => y+1); } else setViewM(m => m+1); }}
          className="p-1 rounded hover:bg-gray-100">
          <span className="material-icons-outlined text-gray-500 text-sm">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-1">
        {WEEK_PT.map((w, i) => <span key={i} className="text-xs font-semibold text-gray-400 py-1">{w}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center gap-y-1">
        {Array(firstDay).fill(null).map((_, i) => <span key={"e"+i} />)}
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
    </div>,
    document.body
  );

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Data da Avaliação</label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">calendar_today</span>
        <button type="button" ref={btnRef} onClick={openCalendar}
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm text-left focus:outline-none focus:ring-2 focus:ring-slate-300 transition
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white focus:bg-white"}`}>
          {value ? fmtData(value) : <span className="text-gray-400">Selecione a data</span>}
        </button>
      </div>
      {err && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="material-icons-outlined text-xs">error</span>{err}</p>}
      {cal}
    </div>
  );
}

/* ── Campos do modal ── */
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
function Modal({ children, onClose, wide = false }) {
  useEffect(() => {
    function esc(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ── Cabeçalho do modal ── */
function ModalHeader({ title, subtitle, icon, onClose, color = "from-slate-700 to-slate-600" }) {
  return (
    <div className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${color} rounded-t-xl`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <span className="material-icons-outlined text-white text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{subtitle}</p>
          <h2 className="text-base font-bold text-white leading-tight truncate max-w-xs">{title}</h2>
        </div>
      </div>
      <button onClick={onClose} className="text-white/70 hover:text-white transition">
        <span className="material-icons-outlined text-xl">close</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Avaliacao() {
  const [lista,   setLista]   = useState([]);
  const [alunos,  setAlunos]  = useState([]);
  const [filtro,  setFiltro]  = useState("");
  const [tabAtiva, setTabAtiva] = useState("todas");
  const [loading, setLoading] = useState(true);

  /* modais */
  const [showCreate,    setShowCreate]    = useState(false);
  const [showEdit,      setShowEdit]      = useState(false);
  const [showView,      setShowView]      = useState(false);
  const [showResponder, setShowResponder] = useState(false);

  /* forms */
  const [createForm, setCreateForm] = useState(blankAval());
  const [createErr,  setCreateErr]  = useState({});
  const [editForm,   setEditForm]   = useState(null);
  const [editErr,    setEditErr]    = useState({});
  const [editTab,    setEditTab]    = useState("dados");
  const [viewSelected, setViewSelected] = useState(null);
  const [viewTab,    setViewTab]    = useState("dados");
  const [respForm,   setRespForm]   = useState(null);

  const API_AVAL  = "/avaliacoes";
  const API_ALUNO = "/pessoas";

  /* ── Fetch ── */
  useEffect(() => {
    Promise.all([
      api.get(API_AVAL).catch(() => ({ data: [] })),
      api.get(API_ALUNO).catch(() => ({ data: [] })),
    ]).then(([av, al]) => {
      setLista(av.data);
      setAlunos(al.data);
    }).finally(() => setLoading(false));
  }, []);

  /* ── Contadores ── */
  const total       = lista.length;
  const emAberto    = lista.filter(a => a.status === "em_aberto").length;
  const finalizados = lista.filter(a => a.status === "finalizado").length;
  const cancelados  = lista.filter(a => a.status === "cancelado").length;

  const ABAS = [
    { key: "todas",      label: "Todas",       count: total       },
    { key: "em_aberto",  label: "Em aberto",   count: emAberto    },
    { key: "finalizado", label: "Finalizadas", count: finalizados },
    { key: "cancelado",  label: "Canceladas",  count: cancelados  },
  ];

  /* ── Filtro ── */
  const listaFiltrada = lista.filter(a => {
    const matchTab   = tabAtiva === "todas" || a.status === tabAtiva;
    const matchBusca = !filtro ||
      a.pessoaNome?.toLowerCase().includes(filtro.toLowerCase()) ||
      a.professor?.toLowerCase().includes(filtro.toLowerCase());
    return matchTab && matchBusca;
  });

  /* ── Validação ── */
  function validateBase(form, setErr) {
    const errs = {};
    if (!form.alunoId)           errs.alunoId     = "Selecione um aluno";
    if (!form.professor?.trim()) errs.professor    = "Informe o professor responsável";
    if (!form.dataAvaliacao)     errs.dataAvaliacao = "Informe a data";
    setErr(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Criar ── */
  function handleCreateChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find(a => String(a.id) === String(value));
      setCreateForm(f => ({ ...f, alunoId: value, pessoaNome: aluno?.nome ?? "" }));
    } else {
      setCreateForm(f => ({ ...f, [name]: value }));
    }
    setCreateErr(er => ({ ...er, [name]: "" }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validateBase(createForm, setCreateErr)) return;
    try {
      const { data } = await api.post(API_AVAL, createForm);
      setLista(l => [...l, data]);
      setShowCreate(false);
      setCreateForm(blankAval());
      setCreateErr({});
    } catch { alert("Erro ao criar avaliação."); }
  }

  /* ── Editar ── */
  function openEdit(aval) {
    setEditForm({ ...aval });
    setEditErr({});
    setEditTab("dados");
    setShowEdit(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find(a => String(a.id) === String(value));
      setEditForm(f => ({ ...f, alunoId: value, pessoaNome: aluno?.nome ?? "" }));
    } else {
      setEditForm(f => ({ ...f, [name]: value }));
    }
    setEditErr(er => ({ ...er, [name]: "" }));
  }

  async function handleEditSave(e) {
    e.preventDefault();
    if (!validateBase(editForm, setEditErr)) { setEditTab("dados"); return; }
    try {
      const { data } = await api.put(`${API_AVAL}/${editForm.id}`, editForm);
      setLista(l => l.map(a => a.id === data.id ? data : a));
      setShowEdit(false);
    } catch { alert("Erro ao salvar."); }
  }

  /* ── Responder ── */
  function openResponder(aval) {
    setRespForm({ ...aval });
    setShowResponder(true);
  }

  function handleRespOpcao(nPerg, val) {
    const key = `q${String(nPerg).padStart(2, "0")}`;
    setRespForm(f => ({ ...f, [key]: f[key] === val ? null : val }));
  }

  function handleRespTextChange(e) {
    const { name, value } = e.target;
    setRespForm(f => ({ ...f, [name]: value }));
  }

  async function handleRespSave(e) {
    e.preventDefault();
    try {
      const { data } = await api.put(`${API_AVAL}/${respForm.id}`, respForm);
      setLista(l => l.map(a => a.id === data.id ? data : a));
      setShowResponder(false);
    } catch { alert("Erro ao salvar respostas."); }
  }

  /* ── Visualizar ── */
  function openView(aval) {
    setViewSelected(aval);
    setViewTab("dados");
    setShowView(true);
  }

  /* ═══════ RENDER ═══════ */
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">

      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">Avaliações</h1>
          <p className="text-xs text-gray-400 mt-0.5">Registro e acompanhamento de avaliações de experiência</p>
        </div>
        <button onClick={() => { setCreateForm(blankAval()); setCreateErr({}); setShowCreate(true); }}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <span className="material-icons-outlined text-base">add</span>
          Nova Avaliação
        </button>
      </div>

      {/* Abas de filtro */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center overflow-x-auto">
        {ABAS.map((aba, i) => (
          <button key={aba.key} type="button" onClick={() => setTabAtiva(aba.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2
              ${tabAtiva === aba.key
                ? "border-slate-700 text-slate-800 bg-slate-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
              ${i > 0 ? "border-l border-l-gray-100" : ""}`}>
            {aba.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full
              ${tabAtiva === aba.key ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-500"}`}>
              {aba.count}
            </span>
          </button>
        ))}

        {/* Busca integrada à barra */}
        <div className="ml-auto flex items-center gap-2 px-4 border-l border-gray-100">
          <span className="material-icons-outlined text-gray-400 text-base">search</span>
          <input value={filtro} onChange={e => setFiltro(e.target.value)}
            placeholder="Buscar aluno ou professor..."
            className="text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 w-48" />
          {filtro && (
            <button onClick={() => setFiltro("")} className="text-gray-400 hover:text-gray-600">
              <span className="material-icons-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined animate-spin text-xl">autorenew</span>
            <span className="text-sm">Carregando...</span>
          </div>
        ) : listaFiltrada.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined text-3xl">inbox</span>
            <p className="text-sm">Nenhuma avaliação encontrada</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Aluno</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Professor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Tipo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Data</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Progresso</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listaFiltrada.map(a => {
                const sm       = STATUS_META[a.status] ?? STATUS_META.em_aberto;
                const answered = countAnswered(a);
                const pct      = Math.round((answered / 46) * 100);
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-800">{a.pessoaNome || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-600">{a.professor || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{TIPO_LABEL[a.tipo] ?? a.tipo}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{fmtData(a.dataAvaliacao)}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{answered}/46</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${sm.badge}`}>
                        {sm.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {a.status === "finalizado" ? (
                          <button onClick={() => openView(a)}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition">
                            Visualizar
                          </button>
                        ) : (
                          <>
                            <button onClick={() => openEdit(a)}
                              className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition">
                              Editar
                            </button>
                            {a.status === "em_aberto" && (
                              <button onClick={() => openResponder(a)}
                                className="text-xs font-semibold text-white bg-slate-700 hover:bg-slate-800 px-3 py-1.5 rounded-md transition">
                                Responder
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODAL — NOVA AVALIAÇÃO
      ══════════════════════════════════════════ */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <ModalHeader title="Nova Avaliação" subtitle="Cadastro" icon="add_task" onClose={() => setShowCreate(false)} color="from-blue-600 to-blue-500" />
          <form onSubmit={handleCreate} className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FieldSelect label="Aluno" icon="school" name="alunoId" value={createForm.alunoId}
                  onChange={handleCreateChange} err={createErr.alunoId}
                  options={[
                    { value: "", label: "Selecione o aluno..." },
                    ...alunos.map(a => ({ value: String(a.id), label: a.nome })),
                  ]} />
              </div>
              <div className="col-span-2">
                <FieldInput label="Professor responsável" icon="person" name="professor"
                  value={createForm.professor} onChange={handleCreateChange}
                  err={createErr.professor} placeholder="Nome do professor" />
              </div>
              <FieldSelect label="Tipo" icon="category" name="tipo" value={createForm.tipo}
                onChange={handleCreateChange} err={createErr.tipo}
                options={Object.entries(TIPO_LABEL).map(([v, l]) => ({ value: v, label: l }))} />
              <FieldSelect label="Status" icon="flag" name="status" value={createForm.status}
                onChange={handleCreateChange} err={createErr.status}
                options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />
              <div className="col-span-2">
                <DateField name="dataAvaliacao" value={createForm.dataAvaliacao}
                  err={createErr.dataAvaliacao} onChange={handleCreateChange} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition">
                Criar Avaliação
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL — EDITAR
      ══════════════════════════════════════════ */}
      {showEdit && editForm && (
        <Modal onClose={() => setShowEdit(false)}>
          <ModalHeader title={editForm.pessoaNome || "Editar Avaliação"} subtitle="Edição de dados"
            icon="edit_note" onClose={() => setShowEdit(false)} color="from-blue-600 to-blue-500" />

          <div className="flex border-b border-gray-100 px-6">
            {[
              { k: "dados",       icon: "info",  label: "Dados gerais" },
              { k: "observacoes", icon: "notes", label: "Observações"  },
            ].map(t => (
              <button key={t.k} type="button" onClick={() => setEditTab(t.k)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition
                  ${editTab === t.k ? "border-slate-700 text-slate-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                <span className="material-icons-outlined text-sm">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleEditSave}>
            {editTab === "dados" && (
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FieldSelect label="Aluno" icon="school" name="alunoId" value={String(editForm.alunoId ?? "")}
                    onChange={handleEditChange} err={editErr.alunoId}
                    options={[
                      { value: "", label: "Selecione o aluno..." },
                      ...alunos.map(a => ({ value: String(a.id), label: a.nome })),
                    ]} />
                </div>
                <div className="col-span-2">
                  <FieldInput label="Professor responsável" icon="person" name="professor"
                    value={editForm.professor} onChange={handleEditChange} err={editErr.professor} />
                </div>
                <FieldSelect label="Tipo" icon="category" name="tipo" value={editForm.tipo}
                  onChange={handleEditChange} err={editErr.tipo}
                  options={Object.entries(TIPO_LABEL).map(([v, l]) => ({ value: v, label: l }))} />
                <FieldSelect label="Status" icon="flag" name="status" value={editForm.status}
                  onChange={handleEditChange} err={editErr.status}
                  options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />
                <div className="col-span-2">
                  <DateField name="dataAvaliacao" value={editForm.dataAvaliacao}
                    err={editErr.dataAvaliacao} onChange={handleEditChange} />
                </div>
              </div>
            )}

            {editTab === "observacoes" && (
              <div className="p-6 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Observações</label>
                  <div className="relative">
                    <span className="material-icons-outlined absolute left-3 top-3 text-gray-400 text-base pointer-events-none">notes</span>
                    <textarea name="observacoes" value={editForm.observacoes} onChange={handleEditChange} rows={4}
                      className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Recomendações</label>
                  <div className="relative">
                    <span className="material-icons-outlined absolute left-3 top-3 text-gray-400 text-base pointer-events-none">recommend</span>
                    <textarea name="recomendacoes" value={editForm.recomendacoes} onChange={handleEditChange} rows={4}
                      className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL — RESPONDER QUESTIONÁRIO
      ══════════════════════════════════════════ */}
      {showResponder && respForm && (
        <Modal onClose={() => setShowResponder(false)} wide>
          <ModalHeader
            title={respForm.pessoaNome || "Avaliação"}
            subtitle={`Questionário — ${countAnswered(respForm)}/46 respondidas`}
            icon="quiz"
            onClose={() => setShowResponder(false)}
            color="from-slate-700 to-slate-600"
          />

          <form onSubmit={handleRespSave}>
            <div className="p-6 flex flex-col gap-2 max-h-[65vh] overflow-y-auto">

              {/* Instruções */}
              <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-2">
                <span className="material-icons-outlined text-slate-400 text-base mt-0.5">info</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para cada item abaixo, selecione a opção que melhor descreve o comportamento observado.
                  Clique novamente na opção selecionada para desmarcá-la.
                </p>
              </div>

              {PERGUNTAS.map(p => {
                const key = `q${String(p.n).padStart(2, "0")}`;
                const val = respForm[key];
                return (
                  <div key={p.n} className="border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50 transition">
                    <p className="text-sm text-gray-700 mb-2.5">
                      <span className="font-bold text-slate-500 mr-1.5">{p.n}.</span>
                      {p.texto}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {OPCOES.map(o => (
                        <button key={o.v} type="button" onClick={() => handleRespOpcao(p.n, o.v)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border-2 transition
                            ${val === o.v
                              ? `${o.bg} ${o.border} ${o.text}`
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"}`}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Q47 */}
              <div className="border border-gray-100 rounded-lg px-4 py-3 mt-1">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold text-slate-500 mr-1.5">47.</span>
                  Quais as principais dificuldades observadas?
                </p>
                <textarea name="q47" value={respForm.q47 ?? ""} onChange={handleRespTextChange} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none" />
              </div>

              {/* Q48 */}
              <div className="border border-gray-100 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold text-slate-500 mr-1.5">48.</span>
                  Quais os pontos positivos observados?
                </p>
                <textarea name="q48" value={respForm.q48 ?? ""} onChange={handleRespTextChange} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none" />
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {countAnswered(respForm)} de 46 questões respondidas
              </span>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowResponder(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition">
                  Salvar Respostas
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL — VISUALIZAR (finalizado)
      ══════════════════════════════════════════ */}
      {showView && viewSelected && (
        <Modal onClose={() => setShowView(false)} wide>
          <ModalHeader
            title={viewSelected.pessoaNome || "Avaliação"}
            subtitle="Avaliação finalizada — somente leitura"
            icon="task_alt"
            onClose={() => setShowView(false)}
            color="from-emerald-600 to-emerald-500"
          />

          <div className="flex border-b border-gray-100 px-6">
            {[
              { k: "dados",        icon: "info",  label: "Dados gerais" },
              { k: "questionario", icon: "quiz",  label: `Questionário (${countAnswered(viewSelected)}/46)` },
            ].map(t => (
              <button key={t.k} type="button" onClick={() => setViewTab(t.k)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition
                  ${viewTab === t.k ? "border-slate-700 text-slate-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                <span className="material-icons-outlined text-sm">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {viewTab === "dados" && (
            <div className="p-6 grid grid-cols-2 gap-3">
              {[
                { icon: "school",         label: "Aluno",      value: viewSelected.pessoaNome,                        full: true  },
                { icon: "person",         label: "Professor",  value: viewSelected.professor,                         full: true  },
                { icon: "category",       label: "Tipo",       value: TIPO_LABEL[viewSelected.tipo] ?? viewSelected.tipo },
                { icon: "flag",           label: "Status",     value: STATUS_META[viewSelected.status]?.label ?? viewSelected.status },
                { icon: "calendar_today", label: "Data",       value: fmtData(viewSelected.dataAvaliacao)             },
              ].map(f => (
                <div key={f.label} className={`bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 ${f.full ? "col-span-2" : ""}`}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span className="material-icons-outlined text-xs">{f.icon}</span>{f.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{f.value || "—"}</p>
                </div>
              ))}
              {viewSelected.observacoes && (
                <div className="col-span-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span className="material-icons-outlined text-xs">notes</span>Observações
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{viewSelected.observacoes}</p>
                </div>
              )}
              {viewSelected.recomendacoes && (
                <div className="col-span-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span className="material-icons-outlined text-xs">recommend</span>Recomendações
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{viewSelected.recomendacoes}</p>
                </div>
              )}
            </div>
          )}

          {viewTab === "questionario" && (
            <div className="p-6 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {PERGUNTAS.map(p => {
                const key   = `q${String(p.n).padStart(2, "0")}`;
                const val   = viewSelected[key];
                const opcao = OPCOES.find(o => o.v === val);
                return (
                  <div key={p.n} className="border border-gray-100 rounded-lg px-4 py-3 flex items-start justify-between gap-4">
                    <p className="text-sm text-gray-700 flex-1">
                      <span className="font-bold text-slate-500 mr-1.5">{p.n}.</span>
                      {p.texto}
                    </p>
                    {opcao ? (
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border-2 whitespace-nowrap flex-shrink-0 ${opcao.bg} ${opcao.border} ${opcao.text}`}>
                        {opcao.label}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300 italic flex-shrink-0">—</span>
                    )}
                  </div>
                );
              })}

              {[
                { n: 47, key: "q47", label: "Quais as principais dificuldades observadas?" },
                { n: 48, key: "q48", label: "Quais os pontos positivos observados?"        },
              ].filter(q => viewSelected[q.key]).map(q => (
                <div key={q.n} className="border border-gray-100 rounded-lg px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    <span className="font-bold text-slate-500 mr-1.5">{q.n}.</span>{q.label}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{viewSelected[q.key]}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end px-6 py-4 border-t border-gray-100">
            <button onClick={() => setShowView(false)}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition">
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
