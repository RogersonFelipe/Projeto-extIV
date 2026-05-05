import { useEffect, useState } from "react";
import * as yup from "yup";
import api from "../../api/axios";

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
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Data inválida dd/mm/aaaa")
    .required("Data de ingresso é obrigatória"),
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

function normalizeAvaliacao(item) {
  return {
    ...item,
    alunoId: item.pessoa?.id ? String(item.pessoa.id) : "",
    alunoNome: item.pessoa?.nome || "",
    ingresso: toBrDate(item.ingresso || item.dataAvaliacao),
    aval1: toBrDate(item.aval1),
    aval2: toBrDate(item.aval2),
    entrevistaPais1: toBrDate(item.entrevistaPais1),
    entrevistaPais2: toBrDate(item.entrevistaPais2),
    resultado:
      item.resultado ||
      (item.tipo === "acompanhamento" ? "aprovado" : "em-andamento"),
    observacao: item.observacao || item.q47 || "",
  };
}

function mapAvaliacaoPayload(form) {
  return {
    pessoaId: Number(form.alunoId),
    dataAvaliacao: toIsoDate(form.ingresso),
    ingresso: toIsoDate(form.ingresso),
    aval1: toIsoDate(form.aval1),
    aval2: toIsoDate(form.aval2),
    entrevistaPais1: toIsoDate(form.entrevistaPais1),
    entrevistaPais2: toIsoDate(form.entrevistaPais2),
    tipo: form.resultado === "em-andamento" ? "inicial" : "acompanhamento",
    resultado: form.resultado,
    observacao: form.observacao?.trim() || undefined,
    q47: form.observacao?.trim() || undefined,
  };
}

export function useControleInterno() {
  const [registros, setRegistros] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [tab,       setTab]       = useState("todos");
  const [query,     setQuery]     = useState("");
  const [page,      setPage]      = useState(1);
  const [perPage,   setPerPage]   = useState(10);
  const [alunosOpts, setAlunosOpts] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [form,       setForm]       = useState({ ...BLANK });
  const [formErr,    setFormErr]    = useState({});
  const [creating,   setCreating]   = useState(false);

  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { load(); loadAlunos(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/avaliacoes");
      setRegistros(res.data.map(normalizeAvaliacao));
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
    } catch { /* ignora */ }
  }

  function openCreate() {
    setForm({ ...BLANK });
    setFormErr({});
    setShowCreate(true);
  }

  async function submitCreate(ev) {
    ev.preventDefault();
    setCreating(true);
    try {
      await schema.validate(form, { abortEarly: false });
      await api.post("/avaliacoes", mapAvaliacaoPayload(form));
      setShowCreate(false);
      setForm({ ...BLANK });
      setFormErr({});
      await load();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errs = {};
        err.inner.forEach((e) => { if (!errs[e.path]) errs[e.path] = e.message; });
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
      await api.patch(`/avaliacoes/${editing.id}`, mapAvaliacaoPayload(editing));
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

  const filtered = registros.filter((r) => {
    if (tab === "em-andamento" && r.resultado !== "em-andamento") return false;
    if (tab === "aprovado"     && r.resultado !== "aprovado")     return false;
    if (tab === "reprovado"    && r.resultado !== "reprovado")    return false;
    if (!query) return true;
    return (r.alunoNome || "").toLowerCase().includes(query.toLowerCase());
  });

  const counts = {
    todos:          registros.length,
    "em-andamento": registros.filter((r) => r.resultado === "em-andamento").length,
    aprovado:       registros.filter((r) => r.resultado === "aprovado").length,
    reprovado:      registros.filter((r) => r.resultado === "reprovado").length,
  };

  const total     = filtered.length;
  const pages     = Math.max(1, Math.ceil(total / perPage));
  const start     = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return {
    registros, loading, tab, setTab, query, setQuery,
    page, setPage, perPage, setPerPage, alunosOpts,
    showCreate, setShowCreate, form, setForm, formErr, creating,
    editing, setEditing, saving,
    openCreate, submitCreate, submitEdit, deleteItem,
    filtered, counts, total, pages, start, pageItems,
    load,
  };
}
