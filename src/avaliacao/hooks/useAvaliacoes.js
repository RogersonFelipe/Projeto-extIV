import { useEffect, useState } from "react";
import api from "../../api/axios";
import { blankAval, countAnswered } from "../constants";

const API_AVAL = "/avaliacoes";
const API_ALUNO = "/pessoas";

function normalizeAvaliacao(aval) {
  const base = {
    ...blankAval(),
    ...aval,
  };
  const answered = countAnswered(base);

  return {
    ...base,
    alunoId: String(aval.pessoa?.id ?? aval.pessoaId ?? ""),
    pessoaNome: aval.pessoa?.nome ?? aval.pessoaNome ?? "",
    professor: aval.professorResponsavel ?? aval.professor ?? "",
    observacoes: aval.q47 ?? aval.observacoes ?? "",
    recomendacoes: aval.q48 ?? aval.recomendacoes ?? "",
    statusAvaliacao:
      aval.statusAvaliacao ?? (answered === 46 ? "finalizado" : "em_aberto"),
  };
}

function buildBasePayload(form) {
  return {
    pessoaId: Number(form.alunoId),
    professorResponsavel: form.professor?.trim() || undefined,
    tipo: form.tipo || undefined,
    dataAvaliacao: form.dataAvaliacao || undefined,
    q47: form.observacoes?.trim() || form.q47?.trim() || undefined,
    q48: form.recomendacoes?.trim() || form.q48?.trim() || undefined,
  };
}

function buildQuestionarioPayload(form) {
  const payload = {
    q47: form.q47?.trim() || undefined,
    q48: form.q48?.trim() || undefined,
  };

  for (let i = 1; i <= 46; i++) {
    const key = `q${String(i).padStart(2, "0")}`;
    payload[key] = form[key] ?? null;
  }

  return payload;
}

export function useAvaliacoes() {
  const [lista, setLista] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* modais */
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showResponder, setShowResponder] = useState(false);

  /* forms */
  const [createForm, setCreateForm] = useState(blankAval());
  const [createErr, setCreateErr] = useState({});
  const [editForm, setEditForm] = useState(null);
  const [editErr, setEditErr] = useState({});
  const [editTab, setEditTab] = useState("dados");
  const [viewSelected, setViewSelected] = useState(null);
  const [viewTab, setViewTab] = useState("dados");
  const [respForm, setRespForm] = useState(null);

  /* ── Fetch inicial ── */
  useEffect(() => {
    Promise.all([
      api.get(API_AVAL).catch(() => ({ data: [] })),
      api.get(API_ALUNO).catch(() => ({ data: [] })),
    ])
      .then(([av, al]) => {
        setLista(av.data.map(normalizeAvaliacao));
        setAlunos(al.data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Validação base ── */
  function validateBase(form, setErr) {
    const errs = {};
    if (!form.alunoId) errs.alunoId = "Selecione um aluno";
    if (!form.professor?.trim())
      errs.professor = "Informe o professor responsável";
    if (!form.dataAvaliacao) errs.dataAvaliacao = "Informe a data";
    setErr(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Criar ── */
  function handleCreateChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find((a) => String(a.id) === String(value));
      setCreateForm((f) => ({
        ...f,
        alunoId: value,
        pessoaNome: aluno?.nome ?? "",
      }));
    } else {
      setCreateForm((f) => ({ ...f, [name]: value }));
    }
    setCreateErr((er) => ({ ...er, [name]: "" }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validateBase(createForm, setCreateErr)) return;
    try {
      const { data } = await api.post(API_AVAL, buildBasePayload(createForm));
      setLista((l) => [...l, normalizeAvaliacao(data)]);
      setShowCreate(false);
      setCreateForm(blankAval());
      setCreateErr({});
    } catch {
      alert("Erro ao criar avaliação.");
    }
  }

  /* ── Editar ── */
  function openEdit(aval) {
    setEditForm(normalizeAvaliacao(aval));
    setEditErr({});
    setEditTab("dados");
    setShowEdit(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find((a) => String(a.id) === String(value));
      setEditForm((f) => ({
        ...f,
        alunoId: value,
        pessoaNome: aluno?.nome ?? "",
      }));
    } else {
      setEditForm((f) => ({ ...f, [name]: value }));
    }
    setEditErr((er) => ({ ...er, [name]: "" }));
  }

  async function handleEditSave(e) {
    e.preventDefault();
    if (!validateBase(editForm, setEditErr)) {
      setEditTab("dados");
      return;
    }
    try {
      const { data } = await api.patch(
        `${API_AVAL}/${editForm.id}`,
        buildBasePayload(editForm),
      );
      setLista((l) => l.map((a) => (a.id === data.id ? normalizeAvaliacao(data) : a)));
      setShowEdit(false);
    } catch {
      alert("Erro ao salvar.");
    }
  }

  /* ── Responder ── */
  function openResponder(aval) {
    setRespForm(normalizeAvaliacao(aval));
    setShowResponder(true);
  }

  function handleRespOpcao(nPerg, val) {
    const key = `q${String(nPerg).padStart(2, "0")}`;
    setRespForm((f) => ({ ...f, [key]: f[key] === val ? null : val }));
  }

  function handleRespTextChange(e) {
    const { name, value } = e.target;
    setRespForm((f) => ({ ...f, [name]: value }));
  }

  async function handleRespSave(e) {
    e.preventDefault();
    try {
      const { data } = await api.patch(
        `${API_AVAL}/${respForm.id}`,
        buildQuestionarioPayload(respForm),
      );
      setLista((l) => l.map((a) => (a.id === data.id ? normalizeAvaliacao(data) : a)));
      setShowResponder(false);
    } catch {
      alert("Erro ao salvar respostas.");
    }
  }

  /* ── Visualizar ── */
  function openView(aval) {
    setViewSelected(normalizeAvaliacao(aval));
    setViewTab("dados");
    setShowView(true);
  }

  return {
    lista,
    alunos,
    loading,
    showCreate,
    setShowCreate,
    showEdit,
    setShowEdit,
    showView,
    setShowView,
    showResponder,
    setShowResponder,
    createForm,
    createErr,
    editForm,
    editErr,
    editTab,
    setEditTab,
    viewSelected,
    viewTab,
    setViewTab,
    respForm,
    handleCreateChange,
    handleCreate,
    openEdit,
    handleEditChange,
    handleEditSave,
    openResponder,
    handleRespOpcao,
    handleRespTextChange,
    handleRespSave,
    openView,
  };
}
