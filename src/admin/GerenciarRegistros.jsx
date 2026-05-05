import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as yup from "yup";
import api from "../api/axios";

const ENDPOINT_MAP = { alunos: "pessoas", fichas: "fichas-acompanhamento" };
const toEndpoint = (type) => ENDPOINT_MAP[type] ?? type;

const TYPE_META = {
  usuarios: {
    label: "Usuário",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  alunos: {
    label: "Aluno",
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  empresas: {
    label: "Empresa",
    badge: "bg-stone-100 text-stone-600 border border-stone-200",
  },
};

function maskCPF(v) {
  return v
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}
function maskCNPJ(v) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}
function maskTel(v) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15);
}
function maskCEP(v) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}
function maskData(v) {
  return v
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

const schemaAluno = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  cpf: yup
    .string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
    .required("CPF é obrigatório"),
  responsavel: yup.string().required("Responsável é obrigatório"),
  telefoneAluno: yup
    .string()
    .matches(/(^$)|(^\(\d{2}\)\s\d{5}-\d{4}$)/, "Telefone do aluno inválido")
    .nullable(),
  telefoneResponsavel: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone do responsável inválido")
    .required("Telefone do responsável é obrigatório"),
  nascimento: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data inválida dd/mm/aaaa",
    )
    .required("Nascimento é obrigatório"),
  dataEntrada: yup
    .string()
    .matches(
      /^$|^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data de entrada inválida dd/mm/aaaa",
    ),
  status: yup.string().oneOf(["ativo", "inativo"]),
  infoMedicamentos: yup.string(),
});

const schemaEmpresa = yup.object({
  nomeFantasia: yup.string().required("Nome fantasia é obrigatório"),
  razaoSocial: yup.string(),
  cnpj: yup
    .string()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido")
    .required("CNPJ é obrigatório"),
  telefone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido")
    .required("Telefone é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  contatoRhNome: yup.string(),
  cep: yup
    .string()
    .matches(/^\d{5}-\d{3}$/, "CEP inválido")
    .required("CEP é obrigatório"),
  cidade: yup.string().required("Cidade é obrigatória"),
  bairro: yup.string().required("Bairro é obrigatório"),
  rua: yup.string().required("Rua é obrigatória"),
  numero: yup.string().required("Número é obrigatório"),
});

const schemaUsuario = yup.object({
  nome: yup.string().trim().required("Nome é obrigatório"),
  email: yup
    .string()
    .trim()
    .email("E-mail inválido")
    .required("E-mail é obrigatório"),
  senha: yup
    .string()
    .min(6, "Senha deve ter ao menos 6 caracteres")
    .required("Senha é obrigatória"),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref("senha")], "Senhas não coincidem")
    .required("Confirme a senha"),
});

const BLANK_ALUNO = {
  nome: "",
  cpf: "",
  responsavel: "",
  telefoneAluno: "",
  telefoneResponsavel: "",
  nascimento: "",
  dataEntrada: "",
  status: "ativo",
  usaMedicamento: false,
  infoMedicamentos: "",
  foto: "",
};
const BLANK_EMPRESA = {
  nomeFantasia: "",
  razaoSocial: "",
  cnpj: "",
  telefone: "",
  email: "",
  contatoRhNome: "",
  cep: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  complemento: "",
  foto: "",
};
const BLANK_USUARIO = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  isAdmin: false,
  foto: "",
};

const BLANK_FICHA = {
  alunoId: "",
  alunoNome: "",
  empresaId: "",
  empresaNome: "",
  admissao: "",
  visita: "",
  responsavelRH: "",
  contatoCom: "",
  parecer: "",
  status: "em-aberto",
};

const schemaFicha = yup.object({
  alunoNome: yup.string().required("Aluno é obrigatório"),
  empresaNome: yup.string().required("Empresa é obrigatória"),
  admissao: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Data inválida dd/mm/aaaa")
    .required("Admissão é obrigatória"),
  visita: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Data inválida dd/mm/aaaa")
    .required("Visita é obrigatória"),
  responsavelRH: yup.string().required("Responsável RH é obrigatório"),
  contatoCom: yup.string().required("Contato com é obrigatório"),
  parecer: yup.string().required("Parecer é obrigatório"),
});

function toIsoDate(value) {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return undefined;
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function toBrDate(value) {
  if (!value) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function montarEnderecoEmpresa(form) {
  if (form.endereco?.trim()) return form.endereco.trim();
  const ruaNumero = [form.rua, form.numero].filter(Boolean).join(", ");
  const complemento = form.complemento ? ` - ${form.complemento}` : "";
  const bairroCidade = [form.bairro, form.cidade].filter(Boolean).join(", ");
  const cep = form.cep ? ` - CEP ${form.cep}` : "";
  return `${ruaNumero}${complemento}${bairroCidade ? ` - ${bairroCidade}` : ""}${cep}`.trim();
}

function parseEnderecoEmpresa(endereco) {
  if (!endereco) {
    return {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      cep: "",
    };
  }

  const cepMatch = endereco.match(/CEP\s*(\d{5}-\d{3})/i);
  const cep = cepMatch?.[1] || "";
  const semCep = endereco.replace(/\s*-?\s*CEP\s*\d{5}-\d{3}/i, "").trim();

  const partes = semCep.split(" - ").map((p) => p.trim());
  const ruaNumero = partes[0] || "";
  const segundaParte = partes[1] || "";
  const terceiraParte = partes[2] || "";

  let rua = "";
  let numero = "";
  if (ruaNumero.includes(",")) {
    const [r, n] = ruaNumero.split(",");
    rua = (r || "").trim();
    numero = (n || "").trim();
  } else {
    rua = ruaNumero;
  }

  let complemento = "";
  let bairroCidade = "";
  if (terceiraParte) {
    complemento = segundaParte;
    bairroCidade = terceiraParte;
  } else {
    bairroCidade = segundaParte;
  }

  let bairro = "";
  let cidade = "";
  if (bairroCidade.includes(",")) {
    const [b, c] = bairroCidade.split(",");
    bairro = (b || "").trim();
    cidade = (c || "").trim();
  }

  return { rua, numero, complemento, bairro, cidade, cep };
}

function mapRegistroPayload(type, form, img) {
  if (type === "alunos") {
    return {
      nome: form.nome?.trim(),
      cpf: form.cpf || undefined,
      status: form.status || undefined,
      usaMedicamento: !!form.usaMedicamento,
      infoMedicamentos: form.usaMedicamento
        ? form.infoMedicamentos?.trim() || undefined
        : undefined,
      nomeResponsavel: form.responsavel?.trim() || undefined,
      telefone: form.telefoneAluno || undefined,
      telefoneResponsavel: form.telefoneResponsavel || undefined,
      dataNascimento: toIsoDate(form.nascimento),
      dataEntrada: toIsoDate(form.dataEntrada),
      fotoUrl: img || form.foto || form.fotoUrl || undefined,
    };
  }

  if (type === "empresas") {
    return {
      nomeFantasia: form.nomeFantasia?.trim(),
      razaoSocial: form.razaoSocial?.trim() || undefined,
      cnpj: form.cnpj || undefined,
      telefone: form.telefone || undefined,
      contatoRhNome: form.contatoRhNome?.trim() || undefined,
      contatoRhEmail: form.email?.trim() || form.contatoRhEmail || undefined,
      endereco: montarEnderecoEmpresa(form) || undefined,
    };
  }

  return {
    nome: form.nome?.trim(),
    email: form.email?.trim(),
    senha: form.senha || undefined,
    nivelAcesso: form.isAdmin ? "admin" : "usuario",
    fotoUrl: img || form.foto || form.fotoUrl || undefined,
  };
}

function normalizeRegistro(type, item) {
  if (type === "usuarios") {
    return {
      id: item.id,
      nome: item.nome || "",
      email: item.email || "",
      senha: "",
      _type: "usuarios",
      isAdmin: item.nivelAcesso === "admin",
      foto: item.fotoUrl || "",
    };
  }

  if (type === "alunos") {
    return {
      id: item.id,
      nome: item.nome || "",
      cpf: item.cpf || "",
      status: item.status || "ativo",
      usaMedicamento: !!item.usaMedicamento,
      infoMedicamentos: item.infoMedicamentos || "",
      _type: "alunos",
      responsavel: item.nomeResponsavel || "",
      telefoneAluno: item.telefone || "",
      telefoneResponsavel: item.telefoneResponsavel || "",
      nascimento: toBrDate(item.dataNascimento),
      dataEntrada: toBrDate(item.dataEntrada),
      foto: item.fotoUrl || "",
    };
  }

  const enderecoPartes = parseEnderecoEmpresa(item.endereco);

  return {
    id: item.id,
    nomeFantasia: item.nomeFantasia || "",
    razaoSocial: item.razaoSocial || "",
    cnpj: item.cnpj || "",
    telefone: item.telefone || "",
    contatoRhNome: item.contatoRhNome || "",
    endereco: item.endereco || "",
    ...enderecoPartes,
    _type: "empresas",
    email: item.contatoRhEmail || item.email || "",
    foto: item.fotoUrl || "",
  };
}

function mapFichaPayload(form) {
  return {
    pessoaId: Number(form.alunoId),
    empresaId: form.empresaId ? Number(form.empresaId) : undefined,
    dataAdmissao: toIsoDate(form.admissao),
    dataVisita: toIsoDate(form.visita),
    contatoRh: form.responsavelRH?.trim() || undefined,
    contatoCom: form.contatoCom?.trim() || undefined,
    status: form.status || undefined,
    parecerGeral: form.parecer?.trim() || undefined,
  };
}

function normalizeFicha(item) {
  return {
    ...item,
    alunoId: item.pessoa?.id ? String(item.pessoa.id) : "",
    alunoNome: item.pessoa?.nome || "",
    empresaId: item.empresa?.id ? String(item.empresa.id) : "",
    empresaNome: item.empresa?.nomeFantasia || "",
    admissao: toBrDate(item.dataAdmissao),
    visita: toBrDate(item.dataVisita),
    responsavelRH: item.contatoRh || "",
    contatoCom: item.contatoCom || "",
    parecer: item.parecerGeral || "",
    status: item.status || "em-aberto",
  };
}

const FIELD_META = {
  nome: { label: "Nome completo", icon: "person", span: 2 },
  nomeFantasia: { label: "Nome fantasia", icon: "storefront", span: 2 },
  razaoSocial: { label: "Razão social", icon: "domain", span: 2 },
  email: { label: "E-mail", icon: "email", span: 2 },
  senha: { label: "Senha", icon: "lock", span: 1 },
  cpf: { label: "CPF", icon: "badge", span: 1 },
  cnpj: { label: "CNPJ", icon: "badge", span: 1 },
  responsavel: { label: "Nome do responsável", icon: "supervisor_account", span: 2 },
  telefoneAluno: { label: "Telefone do aluno", icon: "phone", span: 1 },
  telefoneResponsavel: { label: "Telefone do responsável", icon: "phone", span: 1 },
  contatoRhNome: { label: "Contato RH (nome)", icon: "badge", span: 2 },
  dataEntrada: { label: "Data de entrada", icon: "event_available", span: 1 },
  status: { label: "Status", icon: "flag", span: 1 },
  usaMedicamento: { label: "Usa medicação", icon: "medication", span: 2 },
  infoMedicamentos: { label: "Informações de medicação", icon: "notes", span: 2 },
  telefone: { label: "Telefone", icon: "phone", span: 1 },
  nascimento: { label: "Nascimento", icon: "calendar_today", span: 1 },
  cep: { label: "CEP", icon: "local_post_office", span: 1 },
  cidade: { label: "Cidade", icon: "location_city", span: 1 },
  bairro: { label: "Bairro", icon: "holiday_village", span: 1 },
  rua: { label: "Rua / Logradouro", icon: "signpost", span: 2 },
  numero: { label: "Número", icon: "tag", span: 1 },
  complemento: { label: "Complemento", icon: "add_location_alt", span: 1 },
  isAdmin: { label: "Administrador", icon: "admin_panel_settings", span: 2 },
};

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

/* ── Avatar upload ── */
function AvatarUpload({ img, nome, onChange }) {
  return (
    <div className="flex justify-center py-4 border-b border-gray-100">
      <label className="cursor-pointer relative group">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
          {img ? (
            <img src={img} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-2xl font-bold">
              {nome ? nome.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center border-2 border-white shadow">
          <span
            className="material-icons-outlined text-white"
            style={{ fontSize: "13px" }}
          >
            photo_camera
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

/* ── Field input ── */
function Field({
  name,
  value,
  err,
  onChange,
  type = "text",
  maxLength,
  inputMode,
  placeholder,
  label,
  icon,
  span,
}) {
  const fm = FIELD_META[name] || {};
  const resolvedLabel = label ?? fm.label ?? name;
  const resolvedIcon = icon ?? fm.icon ?? "edit_note";
  const resolvedSpan = span ?? fm.span ?? 1;
  return (
    <div className={resolvedSpan === 2 ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {resolvedLabel}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          {resolvedIcon}
        </span>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          maxLength={maxLength}
          inputMode={inputMode}
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
function FieldSelect({ label, icon, value, onChange, name, err, children }) {
  return (
    <div>
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
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition appearance-none bg-gray-50 focus:bg-white
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
function FieldTextarea({ label, icon, value, onChange, name, err, placeholder }) {
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

/* ── DateField ── */
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

  const year = view.getFullYear();
  const month = view.getMonth();
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
                ${
                  isSel
                    ? "bg-slate-700 text-white"
                    : isToday
                      ? "ring-2 ring-slate-400 text-slate-700 font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
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

/* ═══════════════════════════════════════════════════════════════════ */
export default function GerenciarRegistros() {
  const [tab, setTab] = useState("todos");
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({
    todos: 0,
    usuarios: 0,
    alunos: 0,
    empresas: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showPass, setShowPass] = useState(false);
  const [newMenu, setNewMenu] = useState(false);
  const [createType, setCreateType] = useState(null);
  const [createForm, setCreateForm] = useState({});
  const [createErr, setCreateErr] = useState({});
  const [createImg, setCreateImg] = useState(null);
  const [creating, setCreating] = useState(false);

  /* ── Seção principal ── */
  const [mainSection, setMainSection] = useState("registros");

  /* ── Ficha de Acompanhamento ── */
  const [fichas, setFichas] = useState([]);
  const [fichaLoading, setFichaLoading] = useState(false);
  const [fichaTab, setFichaTab] = useState("todas");
  const [fichaQuery, setFichaQuery] = useState("");
  const [fichaPage, setFichaPage] = useState(1);
  const [fichaPerPage, setFichaPerPage] = useState(10);
  const [editingFicha, setEditingFicha] = useState(null);
  const [savingFicha, setSavingFicha] = useState(false);
  const [showCreateFicha, setShowCreateFicha] = useState(false);
  const [fichaForm, setFichaForm] = useState({ ...BLANK_FICHA });
  const [fichaErr, setFichaErr] = useState({});
  const [creatingFicha, setCreatingFicha] = useState(false);
  const [alunosOpts, setAlunosOpts] = useState([]);
  const [empresasOpts, setEmpresasOpts] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
    load();
  }, [tab]);

  async function load() {
    setLoading(true);
    try {
      const [u, a, e] = await Promise.all([
        api.get("/usuarios"),
        api.get("/pessoas"),
        api.get("/empresas"),
      ]);

      const usuarios = u.data.map((x) => normalizeRegistro("usuarios", x));
      const alunos = a.data.map((x) => normalizeRegistro("alunos", x));
      const empresas = e.data.map((x) => normalizeRegistro("empresas", x));

      setCounts({
        usuarios: usuarios.length,
        alunos: alunos.length,
        empresas: empresas.length,
        todos: usuarios.length + alunos.length + empresas.length,
      });

      if (tab === "todos") {
        setData([...usuarios, ...alunos, ...empresas]);
      } else if (tab === "usuarios") {
        setData(usuarios);
      } else if (tab === "alunos") {
        setData(alunos);
      } else if (tab === "empresas") {
        setData(empresas);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
      setCounts({ todos: 0, usuarios: 0, alunos: 0, empresas: 0 });
    } finally {
      setLoading(false);
    }
  }

  function openCreate(type) {
    const blanks = {
      alunos: BLANK_ALUNO,
      empresas: BLANK_EMPRESA,
      usuarios: BLANK_USUARIO,
    };
    setCreateType(type);
    setCreateForm({ ...blanks[type] });
    setCreateErr({});
    setCreateImg(null);
    setNewMenu(false);
  }

  function handleCreateChange(e) {
    const { name, value, type, checked } = e.target;
    let v = type === "checkbox" ? checked : value;
    if (name === "cpf") v = maskCPF(v);
    if (name === "cnpj") v = maskCNPJ(v);
    if (name === "telefone") v = maskTel(v);
    if (name === "telefoneAluno") v = maskTel(v);
    if (name === "telefoneResponsavel") v = maskTel(v);
    if (name === "cep") v = maskCEP(v);
    if (name === "nascimento") v = maskData(v);
    if (name === "dataEntrada") v = maskData(v);
    setCreateForm((p) => ({ ...p, [name]: v }));
    setCreateErr((p) => ({ ...p, [name]: "" }));
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    let v = type === "checkbox" ? checked : value;
    if (name === "cpf") v = maskCPF(v);
    if (name === "cnpj") v = maskCNPJ(v);
    if (name === "telefone") v = maskTel(v);
    if (name === "telefoneAluno") v = maskTel(v);
    if (name === "telefoneResponsavel") v = maskTel(v);
    if (name === "cep") v = maskCEP(v);
    if (name === "nascimento") v = maskData(v);
    if (name === "dataEntrada") v = maskData(v);
    setEditing((p) => ({
      ...p,
      [name]: v,
      ...(name === "usaMedicamento" && !v ? { infoMedicamentos: "" } : {}),
    }));
  }

  function handleCreateImg(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setCreateImg(r.result);
    r.readAsDataURL(file);
  }

  async function submitCreate(e) {
    e.preventDefault();
    setCreating(true);
    const schemas = {
      alunos: schemaAluno,
      empresas: schemaEmpresa,
      usuarios: schemaUsuario,
    };
    try {
      await schemas[createType].validate(createForm, { abortEarly: false });
      const payload = mapRegistroPayload(createType, createForm, createImg);
      await api.post(`/${toEndpoint(createType)}`, payload);
      setCreateType(null);
      if (tab === "todos" || tab === createType) await load();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errs = {};
        err.inner.forEach((e) => {
          if (!errs[e.path]) errs[e.path] = e.message;
        });
        setCreateErr(errs);
      } else {
        alert("Erro ao cadastrar");
      }
    }
    setCreating(false);
  }

  async function deleteItem(item) {
    if (!confirm("Excluir este registro permanentemente?")) return;
    try {
      await api.delete(`/${toEndpoint(item._type)}/${item.id}`);
      await load();
    } catch {
      alert("Erro ao excluir");
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = mapRegistroPayload(editing._type, editing, null);
      await api.patch(`/${toEndpoint(editing._type)}/${editing.id}`, payload);
      await load();
      setEditing(null);
    } catch {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  /* ── Ficha de Acompanhamento: funções ── */
  async function loadFichas() {
    setFichaLoading(true);
    try {
      const res = await api.get("/fichas-acompanhamento");
      setFichas(res.data.map(normalizeFicha));
    } catch {
      setFichas([]);
    } finally {
      setFichaLoading(false);
    }
  }

  async function loadOptions() {
    try {
      const [a, e] = await Promise.all([
        api.get("/pessoas"),
        api.get("/empresas"),
      ]);
      setAlunosOpts(a.data);
      setEmpresasOpts(e.data);
    } catch {
      /* ignora */
    }
  }

  useEffect(() => {
    if (mainSection === "fichas") {
      loadFichas();
      loadOptions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainSection]);

  function handleFichaChange(e) {
    const { name, value } = e.target;
    setFichaForm((p) => ({ ...p, [name]: value }));
    setFichaErr((p) => ({ ...p, [name]: "" }));
  }

  function handleFichaAlunoChange(e) {
    const opt = alunosOpts.find((a) => String(a.id) === e.target.value);
    setFichaForm((p) => ({
      ...p,
      alunoId: opt ? String(opt.id) : "",
      alunoNome: opt ? opt.nome : "",
    }));
    setFichaErr((p) => ({ ...p, alunoNome: "" }));
  }

  function handleFichaEmpresaChange(e) {
    const opt = empresasOpts.find((em) => String(em.id) === e.target.value);
    setFichaForm((p) => ({
      ...p,
      empresaId: opt ? String(opt.id) : "",
      empresaNome: opt ? opt.nomeFantasia : "",
    }));
    setFichaErr((p) => ({ ...p, empresaNome: "" }));
  }

  async function submitCreateFicha(ev) {
    ev.preventDefault();
    setCreatingFicha(true);
    try {
      await schemaFicha.validate(fichaForm, { abortEarly: false });
      await api.post("/fichas-acompanhamento", mapFichaPayload(fichaForm));
      setShowCreateFicha(false);
      setFichaForm({ ...BLANK_FICHA });
      setFichaErr({});
      await loadFichas();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errs = {};
        err.inner.forEach((e) => { if (!errs[e.path]) errs[e.path] = e.message; });
        setFichaErr(errs);
      } else {
        alert("Erro ao cadastrar ficha");
      }
    }
    setCreatingFicha(false);
  }

  async function saveEditFicha(ev) {
    ev.preventDefault();
    setSavingFicha(true);
    try {
      await schemaFicha.validate(editingFicha, { abortEarly: false });
      await api.patch(
        `/fichas-acompanhamento/${editingFicha.id}`,
        mapFichaPayload(editingFicha),
      );
      setEditingFicha(null);
      await loadFichas();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        alert(err.inner.map((e) => e.message).join("\n"));
      } else {
        alert("Erro ao salvar ficha");
      }
    }
    setSavingFicha(false);
  }

  async function deleteFicha(ficha) {
    if (!confirm("Excluir esta ficha permanentemente?")) return;
    try {
      await api.delete(`/fichas-acompanhamento/${ficha.id}`);
      await loadFichas();
    } catch {
      alert("Erro ao excluir ficha");
    }
  }

  /* ── Ficha: filtros e paginação ── */
  const fichaFiltered = fichas.filter((f) => {
    if (fichaTab === "em-aberto" && f.status !== "em-aberto") return false;
    if (fichaTab === "finalizada" && f.status !== "finalizada") return false;
    if (!fichaQuery) return true;
    const q = fichaQuery.toLowerCase();
    return (
      (f.alunoNome || "").toLowerCase().includes(q) ||
      (f.empresaNome || "").toLowerCase().includes(q) ||
      (f.responsavelRH || "").toLowerCase().includes(q)
    );
  });
  const fichaTotal = fichaFiltered.length;
  const fichaPages = Math.max(1, Math.ceil(fichaTotal / fichaPerPage));
  const fichaStart = (fichaPage - 1) * fichaPerPage;
  const fichaPageItems = fichaFiltered.slice(fichaStart, fichaStart + fichaPerPage);

  const fichaTabCounts = {
    todas: fichas.length,
    "em-aberto": fichas.filter((f) => f.status === "em-aberto").length,
    finalizada: fichas.filter((f) => f.status === "finalizada").length,
  };

  const filtered = data.filter((d) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (d.nome || d.nomeFantasia || "").toLowerCase().includes(q) ||
      (d.email || "").toLowerCase().includes(q) ||
      (d.cnpj || "").toLowerCase().includes(q) ||
      (d.cpf || "").toLowerCase().includes(q)
    );
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const TABS = [
    { key: "todos", label: "Todos" },
    { key: "usuarios", label: "Usuários" },
    { key: "alunos", label: "Alunos" },
    { key: "empresas", label: "Empresas" },
  ];

  const COUNTS = counts;

  const TYPE_ICON = {
    usuarios: "person_outline",
    alunos: "school",
    empresas: "business",
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            Gerenciar Registros
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {mainSection === "registros"
              ? "Usuários, alunos e empresas cadastrados no sistema"
              : "Fichas de acompanhamento dos alunos"}
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          {[
            { key: "registros", icon: "manage_accounts", label: "Registros" },
            { key: "fichas", icon: "assignment", label: "Fichas" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setMainSection(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition
                ${mainSection === s.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className="material-icons-outlined text-base">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={mainSection === "registros" ? load : loadFichas}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            <span className="material-icons-outlined text-base">refresh</span>
            Atualizar
          </button>

          {mainSection === "registros" && (
            <div className="relative">
              <button
                onClick={() => setNewMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition"
              >
                <span className="material-icons-outlined text-base">add</span>
                Novo registro
                <span className="material-icons-outlined text-base">
                  expand_more
                </span>
              </button>
              {newMenu && (
                <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-[180px]">
                  {[
                    {
                      type: "usuarios",
                      icon: "person_outline",
                      label: "Usuário",
                    },
                    { type: "alunos", icon: "school", label: "Aluno" },
                    { type: "empresas", icon: "business", label: "Empresa" },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => openCreate(item.type)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <span className="material-icons-outlined text-gray-400 text-base">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ SEÇÃO: REGISTROS ══ */}
      {mainSection === "registros" && (<>

      {/* Abas de filtro + busca */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2
              ${
                tab === t.key
                  ? "border-slate-700 text-slate-800 bg-slate-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }
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

        {/* Busca integrada */}
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
            placeholder="Buscar por nome, e-mail, CPF ou CNPJ..."
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

        {/* Linhas por página */}
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
            <span className="material-icons-outlined text-3xl">inbox</span>
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                  Nome
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                  Contato
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                  Telefone
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                  Tipo
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageItems.map((item) => {
                const nome = item.nome || item.nomeFantasia || "—";
                const contato =
                  item._type === "alunos"
                    ? item.nome || "—"
                    : item.email || item.cnpj || item.cpf || "—";
                const tmeta = TYPE_META[item._type] || {};
                return (
                  <tr
                    key={`${item._type}-${item.id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-100 flex items-center justify-center">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs font-bold">
                              {nome.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {nome}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                      {contato}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                      {item._type === "alunos"
                        ? item.telefoneResponsavel || item.telefoneAluno || "—"
                        : item.telefone || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${tmeta.badge}`}
                      >
                        {tmeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditing({ ...item });
                            setShowPass(false);
                          }}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
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

      {/* ══════════════════════════════════════════
          MODAL — CRIAR
      ══════════════════════════════════════════ */}
      {createType &&
        (() => {
          const meta = TYPE_META[createType] || {};
          return (
            <Modal onClose={() => setCreateType(null)}>
              <ModalHeader
                title={`Cadastrar ${meta.label}`}
                subtitle="Novo registro"
                icon={TYPE_ICON[createType] || "add"}
                onClose={() => setCreateType(null)}
                color={
                  {
                    usuarios: "from-blue-600 to-blue-500",
                    alunos: "from-emerald-600 to-emerald-500",
                    empresas: "from-violet-600 to-violet-500",
                  }[createType]
                }
              />

              <AvatarUpload
                img={createImg}
                nome={createForm.nome || createForm.nomeFantasia}
                onChange={handleCreateImg}
              />

              <form
                onSubmit={submitCreate}
                className="px-6 pb-6 flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-h-[45vh] overflow-y-auto py-2">
                  {createType === "alunos" && (
                    <>
                      <Field
                        name="nome"
                        value={createForm.nome}
                        err={createErr.nome}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="cpf"
                        value={createForm.cpf}
                        err={createErr.cpf}
                        onChange={handleCreateChange}
                        maxLength={14}
                        inputMode="numeric"
                      />
                      <Field
                        name="responsavel"
                        value={createForm.responsavel}
                        err={createErr.responsavel}
                        onChange={handleCreateChange}
                        label="Nome do responsável"
                      />
                      <Field
                        name="telefoneAluno"
                        value={createForm.telefoneAluno}
                        err={createErr.telefoneAluno}
                        onChange={handleCreateChange}
                        maxLength={15}
                        inputMode="numeric"
                        label="Telefone do aluno (opcional)"
                      />
                      <Field
                        name="telefoneResponsavel"
                        value={createForm.telefoneResponsavel}
                        err={createErr.telefoneResponsavel}
                        onChange={handleCreateChange}
                        maxLength={15}
                        inputMode="numeric"
                        label="Telefone do responsável"
                      />
                      <DateField
                        name="nascimento"
                        value={createForm.nascimento}
                        err={createErr.nascimento}
                        onChange={handleCreateChange}
                      />
                      <DateField
                        name="dataEntrada"
                        value={createForm.dataEntrada}
                        err={createErr.dataEntrada}
                        onChange={handleCreateChange}
                        label="Data de entrada"
                      />
                      <FieldSelect
                        label="Status"
                        icon="flag"
                        name="status"
                        value={createForm.status}
                        onChange={handleCreateChange}
                        err={createErr.status}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </FieldSelect>
                      <div className="col-span-2 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <span className="material-icons-outlined text-gray-400 text-lg">
                          medication
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-700">
                            Usa medicação
                          </p>
                          <p className="text-xs text-gray-400">
                            Marque se o aluno usa medicamento continuamente
                          </p>
                        </div>
                        <input
                          id="usaMedicamentoNew"
                          name="usaMedicamento"
                          type="checkbox"
                          checked={!!createForm.usaMedicamento}
                          onChange={handleCreateChange}
                          className="w-5 h-5 accent-slate-700 cursor-pointer"
                        />
                      </div>
                      {createForm.usaMedicamento && (
                        <Field
                          name="infoMedicamentos"
                          value={createForm.infoMedicamentos}
                          err={createErr.infoMedicamentos}
                          onChange={handleCreateChange}
                          label="Informações de medicação"
                          icon="notes"
                          span={2}
                        />
                      )}
                    </>
                  )}
                  {createType === "empresas" && (
                    <>
                      <Field
                        name="nomeFantasia"
                        value={createForm.nomeFantasia}
                        err={createErr.nomeFantasia}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="razaoSocial"
                        value={createForm.razaoSocial}
                        err={createErr.razaoSocial}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="cnpj"
                        value={createForm.cnpj}
                        err={createErr.cnpj}
                        onChange={handleCreateChange}
                        maxLength={18}
                        inputMode="numeric"
                      />
                      <Field
                        name="telefone"
                        value={createForm.telefone}
                        err={createErr.telefone}
                        onChange={handleCreateChange}
                        maxLength={15}
                        inputMode="numeric"
                      />
                      <Field
                        name="contatoRhNome"
                        value={createForm.contatoRhNome}
                        err={createErr.contatoRhNome}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="email"
                        value={createForm.email}
                        err={createErr.email}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="cep"
                        value={createForm.cep}
                        err={createErr.cep}
                        onChange={handleCreateChange}
                        maxLength={9}
                        inputMode="numeric"
                      />
                      <Field
                        name="cidade"
                        value={createForm.cidade}
                        err={createErr.cidade}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="bairro"
                        value={createForm.bairro}
                        err={createErr.bairro}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="rua"
                        value={createForm.rua}
                        err={createErr.rua}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="numero"
                        value={createForm.numero}
                        err={createErr.numero}
                        onChange={handleCreateChange}
                        maxLength={5}
                      />
                      <Field
                        name="complemento"
                        value={createForm.complemento}
                        err={null}
                        onChange={handleCreateChange}
                      />
                    </>
                  )}
                  {createType === "usuarios" && (
                    <>
                      <Field
                        name="nome"
                        value={createForm.nome}
                        err={createErr.nome}
                        onChange={handleCreateChange}
                      />
                      <Field
                        name="email"
                        value={createForm.email}
                        err={createErr.email}
                        onChange={handleCreateChange}
                        type="email"
                      />
                      <Field
                        name="senha"
                        value={createForm.senha}
                        err={createErr.senha}
                        onChange={handleCreateChange}
                        type="password"
                      />
                      <Field
                        name="confirmarSenha"
                        value={createForm.confirmarSenha}
                        err={createErr.confirmarSenha}
                        onChange={handleCreateChange}
                        type="password"
                        label="Confirmar senha"
                        icon="lock_reset"
                        span={1}
                      />
                      <div className="col-span-2 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <span className="material-icons-outlined text-gray-400 text-lg">
                          admin_panel_settings
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-700">
                            Administrador
                          </p>
                          <p className="text-xs text-gray-400">
                            Acesso total ao painel de gerenciamento
                          </p>
                        </div>
                        <input
                          id="isAdminNew"
                          name="isAdmin"
                          type="checkbox"
                          checked={!!createForm.isAdmin}
                          onChange={handleCreateChange}
                          className="w-5 h-5 accent-slate-700 cursor-pointer"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCreateType(null)}
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
                    {creating ? "Cadastrando..." : `Cadastrar ${meta.label}`}
                  </button>
                </div>
              </form>
            </Modal>
          );
        })()}

      {/* ══════════════════════════════════════════
          MODAL — EDITAR
      ══════════════════════════════════════════ */}
      {editing &&
        (() => {
          const emeta = TYPE_META[editing._type] || {};
          const editNome = editing.nome || editing.nomeFantasia || "?";
          return (
            <Modal onClose={() => setEditing(null)}>
              <ModalHeader
                title={editNome}
                subtitle={`${emeta.label} · ID ${editing.id}`}
                icon={TYPE_ICON[editing._type] || "edit"}
                onClose={() => setEditing(null)}
                color={
                  {
                    usuarios: "from-blue-600 to-blue-500",
                    alunos: "from-emerald-600 to-emerald-500",
                    empresas: "from-violet-600 to-violet-500",
                  }[editing._type]
                }
              />

              <AvatarUpload
                img={editing.foto}
                nome={editNome}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const r = new FileReader();
                  r.onloadend = () =>
                    setEditing((p) => ({ ...p, foto: r.result }));
                  r.readAsDataURL(file);
                }}
              />

              <form
                onSubmit={saveEdit}
                className="px-6 pb-6 flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-h-[42vh] overflow-y-auto py-2 p-1">
                  {Object.keys(editing)
                    .filter((k) => !["id", "_type", "foto"].includes(k))
                    .map((key) => {
                      const fm = FIELD_META[key] || {
                        label: key.replace(/([A-Z])/g, " $1"),
                        icon: "edit_note",
                        span: 1,
                      };

                      if (key === "nascimento")
                        return (
                          <DateField
                            key={key}
                            name={key}
                            value={editing[key] ?? ""}
                            err={null}
                            onChange={handleEditChange}
                          />
                        );

                      if (key === "dataEntrada")
                        return (
                          <DateField
                            key={key}
                            name={key}
                            value={editing[key] ?? ""}
                            err={null}
                            label="Data de entrada"
                            onChange={handleEditChange}
                          />
                        );

                      if (key === "status" && editing._type === "alunos")
                        return (
                          <FieldSelect
                            key={key}
                            label="Status"
                            icon="flag"
                            name={key}
                            value={editing[key] ?? "ativo"}
                            onChange={handleEditChange}
                            err={null}
                          >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                          </FieldSelect>
                        );

                      if (key === "usaMedicamento")
                        return (
                          <div
                            key={key}
                            className="col-span-2 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                          >
                            <span className="material-icons-outlined text-gray-400 text-lg">
                              medication
                            </span>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-700">
                                Usa medicação
                              </p>
                            </div>
                            <input
                              name={key}
                              type="checkbox"
                              checked={!!editing[key]}
                              onChange={handleEditChange}
                              className="w-5 h-5 accent-slate-700 cursor-pointer"
                            />
                          </div>
                        );

                      if (key === "isAdmin")
                        return (
                          <div
                            key={key}
                            className="col-span-2 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                          >
                            <span className="material-icons-outlined text-gray-400 text-lg">
                              admin_panel_settings
                            </span>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-700">
                                Administrador
                              </p>
                              <p className="text-xs text-gray-400">
                                Acesso total ao painel de gerenciamento
                              </p>
                            </div>
                            <input
                              name={key}
                              type="checkbox"
                              checked={!!editing[key]}
                              onChange={handleEditChange}
                              className="w-5 h-5 accent-slate-700 cursor-pointer"
                            />
                          </div>
                        );

                      if (key === "senha")
                        return (
                          <div
                            key={key}
                            className={fm.span === 2 ? "col-span-2" : ""}
                          >
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                              {fm.label}
                            </label>
                            <div className="relative flex gap-2">
                              <div className="relative flex-1">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
                                  lock
                                </span>
                                <input
                                  name={key}
                                  type={showPass ? "text" : "password"}
                                  value={editing[key] ?? ""}
                                  onChange={handleEditChange}
                                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowPass((s) => !s)}
                                className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 whitespace-nowrap"
                              >
                                <span className="material-icons-outlined text-base">
                                  {showPass ? "visibility_off" : "visibility"}
                                </span>
                                {showPass ? "Ocultar" : "Ver"}
                              </button>
                            </div>
                          </div>
                        );

                      if (key === "infoMedicamentos" && !editing.usaMedicamento) {
                        return null;
                      }

                      return (
                        <div
                          key={key}
                          className={fm.span === 2 ? "col-span-2" : ""}
                        >
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            {fm.label}
                          </label>
                          <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
                              {fm.icon}
                            </span>
                            <input
                              name={key}
                              value={editing[key] ?? ""}
                              onChange={handleEditChange}
                              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

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
          );
        })()}

      </>)}
      {/* ══ FIM SEÇÃO: REGISTROS ══ */}

      {/* ══ SEÇÃO: FICHAS DE ACOMPANHAMENTO ══ */}
      {mainSection === "fichas" && (<>

        {/* Cabeçalho fichas */}
        <div className="flex items-center justify-between">
          <div />
          <button
            onClick={() => {
              setFichaForm({ ...BLANK_FICHA });
              setFichaErr({});
              setShowCreateFicha(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition"
          >
            <span className="material-icons-outlined text-base">add</span>
            Nova Ficha
          </button>
        </div>

        {/* Abas de status + busca */}
        <div className="bg-white border border-gray-200 rounded-lg flex items-center overflow-x-auto">
          {[
            { key: "todas", label: "Todas" },
            { key: "em-aberto", label: "Em Aberto" },
            { key: "finalizada", label: "Finalizadas" },
          ].map((t, i) => (
            <button
              key={t.key}
              onClick={() => { setFichaTab(t.key); setFichaPage(1); }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2
                ${fichaTab === t.key
                  ? "border-slate-700 text-slate-800 bg-slate-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
                ${i > 0 ? "border-l border-l-gray-100" : ""}`}
            >
              {t.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full
                ${fichaTab === t.key ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-500"}`}>
                {fichaTabCounts[t.key]}
              </span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 px-4 border-l border-gray-100">
            <span className="material-icons-outlined text-gray-400 text-base">search</span>
            <input
              value={fichaQuery}
              onChange={(e) => { setFichaQuery(e.target.value); setFichaPage(1); }}
              placeholder="Buscar aluno, empresa ou responsável..."
              className="text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 w-60"
            />
            {fichaQuery && (
              <button onClick={() => setFichaQuery("")} className="text-gray-400 hover:text-gray-600">
                <span className="material-icons-outlined text-sm">close</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 border-l border-gray-100 text-sm text-gray-500 shrink-0">
            <span>Exibir</span>
            <select
              value={fichaPerPage}
              onChange={(e) => { setFichaPerPage(Number(e.target.value)); setFichaPage(1); }}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-gray-50 focus:outline-none"
            >
              {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Tabela fichas */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {fichaLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <span className="material-icons-outlined text-3xl animate-spin">autorenew</span>
              <p className="text-sm">Carregando fichas...</p>
            </div>
          ) : fichaPageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <span className="material-icons-outlined text-3xl">assignment</span>
              <p className="text-sm">Nenhuma ficha encontrada</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Aluno</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Empresa</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Responsável RH</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Admissão</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Visita</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fichaPageItems.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 text-xs font-bold">
                            {(f.alunoNome || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800">{f.alunoNome || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{f.empresaNome || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{f.responsavelRH || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{f.admissao || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{f.visita || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md
                        ${f.status === "finalizada"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                        {f.status === "finalizada" ? "Finalizada" : "Em Aberto"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingFicha({ ...f })}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteFicha(f)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-md transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Paginação fichas */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400">
              {fichaTotal === 0
                ? "0 fichas"
                : `${fichaStart + 1}–${Math.min(fichaStart + fichaPerPage, fichaTotal)} de ${fichaTotal} fichas`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFichaPage((p) => Math.max(1, p - 1))}
                disabled={fichaPage === 1}
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <span className="material-icons-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: fichaPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setFichaPage(p)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition
                    ${p === fichaPage ? "bg-slate-700 text-white" : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-100"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setFichaPage((p) => Math.min(fichaPages, p + 1))}
                disabled={fichaPage === fichaPages}
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <span className="material-icons-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* ══ MODAL — CRIAR FICHA ══ */}
        {showCreateFicha && (
          <Modal onClose={() => setShowCreateFicha(false)}>
            <ModalHeader
              title="Nova Ficha de Acompanhamento"
              subtitle="Ficha de acompanhamento"
              icon="add_task"
              onClose={() => setShowCreateFicha(false)}
              color="from-slate-700 to-slate-600"
            />
            <form onSubmit={submitCreateFicha} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-h-[52vh] overflow-y-auto pr-1">
                <FieldSelect
                  label="Aluno"
                  icon="school"
                  name="alunoId"
                  value={fichaForm.alunoId}
                  onChange={handleFichaAlunoChange}
                  err={fichaErr.alunoNome}
                >
                  <option value="">Selecionar aluno...</option>
                  {alunosOpts.map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </FieldSelect>
                <FieldSelect
                  label="Empresa"
                  icon="business"
                  name="empresaId"
                  value={fichaForm.empresaId}
                  onChange={handleFichaEmpresaChange}
                  err={fichaErr.empresaNome}
                >
                  <option value="">Selecionar empresa...</option>
                  {empresasOpts.map((e) => (
                    <option key={e.id} value={e.id}>{e.nomeFantasia}</option>
                  ))}
                </FieldSelect>
                <DateField
                  name="admissao"
                  value={fichaForm.admissao}
                  err={fichaErr.admissao}
                  label="Admissão"
                  onChange={(e) => { setFichaForm((p) => ({ ...p, admissao: e.target.value })); setFichaErr((p) => ({ ...p, admissao: "" })); }}
                />
                <DateField
                  name="visita"
                  value={fichaForm.visita}
                  err={fichaErr.visita}
                  label="Data da Visita"
                  onChange={(e) => { setFichaForm((p) => ({ ...p, visita: e.target.value })); setFichaErr((p) => ({ ...p, visita: "" })); }}
                />
                <Field
                  name="responsavelRH"
                  value={fichaForm.responsavelRH}
                  err={fichaErr.responsavelRH}
                  onChange={handleFichaChange}
                  label="Responsável RH"
                  icon="badge"
                  span={1}
                />
                <Field
                  name="contatoCom"
                  value={fichaForm.contatoCom}
                  err={fichaErr.contatoCom}
                  onChange={handleFichaChange}
                  label="Contato com"
                  icon="contact_phone"
                  span={1}
                />
                <FieldTextarea
                  name="parecer"
                  value={fichaForm.parecer}
                  err={fichaErr.parecer}
                  onChange={handleFichaChange}
                  label="Parecer Geral"
                  icon="rate_review"
                  placeholder="Descreva o parecer geral da visita..."
                />
                <FieldSelect
                  label="Status"
                  icon="flag"
                  name="status"
                  value={fichaForm.status}
                  onChange={handleFichaChange}
                  err={null}
                >
                  <option value="em-aberto">Em Aberto</option>
                  <option value="finalizada">Finalizada</option>
                </FieldSelect>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateFicha(false)}
                  className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingFicha}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition font-semibold disabled:opacity-60"
                >
                  <span className="material-icons-outlined text-base">
                    {creatingFicha ? "hourglass_top" : "check_circle"}
                  </span>
                  {creatingFicha ? "Salvando..." : "Cadastrar Ficha"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ══ MODAL — EDITAR FICHA ══ */}
        {editingFicha && (
          <Modal onClose={() => setEditingFicha(null)}>
            <ModalHeader
              title={editingFicha.alunoNome || "Ficha"}
              subtitle="Editar ficha de acompanhamento"
              icon="assignment"
              onClose={() => setEditingFicha(null)}
              color="from-emerald-600 to-emerald-500"
            />
            <form onSubmit={saveEditFicha} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-h-[52vh] overflow-y-auto pr-1">
                <FieldSelect
                  label="Aluno"
                  icon="school"
                  name="alunoId"
                  value={editingFicha.alunoId}
                  onChange={(e) => {
                    const opt = alunosOpts.find((a) => String(a.id) === e.target.value);
                    setEditingFicha((p) => ({ ...p, alunoId: opt ? String(opt.id) : "", alunoNome: opt ? opt.nome : "" }));
                  }}
                  err={null}
                >
                  <option value="">Selecionar aluno...</option>
                  {alunosOpts.map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </FieldSelect>
                <FieldSelect
                  label="Empresa"
                  icon="business"
                  name="empresaId"
                  value={editingFicha.empresaId}
                  onChange={(e) => {
                    const opt = empresasOpts.find((em) => String(em.id) === e.target.value);
                    setEditingFicha((p) => ({ ...p, empresaId: opt ? String(opt.id) : "", empresaNome: opt ? opt.nomeFantasia : "" }));
                  }}
                  err={null}
                >
                  <option value="">Selecionar empresa...</option>
                  {empresasOpts.map((e) => (
                    <option key={e.id} value={e.id}>{e.nomeFantasia}</option>
                  ))}
                </FieldSelect>
                <DateField
                  name="admissao"
                  value={editingFicha.admissao}
                  err={null}
                  label="Admissão"
                  onChange={(e) => setEditingFicha((p) => ({ ...p, admissao: e.target.value }))}
                />
                <DateField
                  name="visita"
                  value={editingFicha.visita}
                  err={null}
                  label="Data da Visita"
                  onChange={(e) => setEditingFicha((p) => ({ ...p, visita: e.target.value }))}
                />
                <Field
                  name="responsavelRH"
                  value={editingFicha.responsavelRH}
                  err={null}
                  onChange={(e) => setEditingFicha((p) => ({ ...p, responsavelRH: e.target.value }))}
                  label="Responsável RH"
                  icon="badge"
                  span={1}
                />
                <Field
                  name="contatoCom"
                  value={editingFicha.contatoCom}
                  err={null}
                  onChange={(e) => setEditingFicha((p) => ({ ...p, contatoCom: e.target.value }))}
                  label="Contato com"
                  icon="contact_phone"
                  span={1}
                />
                <FieldTextarea
                  name="parecer"
                  value={editingFicha.parecer}
                  err={null}
                  onChange={(e) => setEditingFicha((p) => ({ ...p, parecer: e.target.value }))}
                  label="Parecer Geral"
                  icon="rate_review"
                  placeholder="Descreva o parecer geral da visita..."
                />
                <FieldSelect
                  label="Status"
                  icon="flag"
                  name="status"
                  value={editingFicha.status}
                  onChange={(e) => setEditingFicha((p) => ({ ...p, status: e.target.value }))}
                  err={null}
                >
                  <option value="em-aberto">Em Aberto</option>
                  <option value="finalizada">Finalizada</option>
                </FieldSelect>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingFicha(null)}
                  className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingFicha}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition font-semibold disabled:opacity-60"
                >
                  <span className="material-icons-outlined text-base">
                    {savingFicha ? "hourglass_top" : "save"}
                  </span>
                  {savingFicha ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </Modal>
        )}

      </>)}
      {/* ══ FIM SEÇÃO: FICHAS ══ */}

    </div>
  );
}
