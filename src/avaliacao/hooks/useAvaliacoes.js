import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { blankAval } from "../constants";

const API_AVAL = "/avaliacoes";
const API_ALUNO = "/pessoas";
const API_ENC = "/encaminhamentos";

function normalizeAvaliacao(aval) {
  const base = { ...blankAval(), ...aval };
  return {
    ...base,
    alunoId: String(aval.pessoa?.id ?? aval.pessoaId ?? ""),
    pessoaNome: aval.pessoa?.nome ?? aval.pessoaNome ?? "",
    professor: aval.professorResponsavel ?? aval.professor ?? "",
    resultado: aval.resultado ?? "em-andamento",
    observacoes: aval.q47 ?? aval.observacoes ?? "",
    recomendacoes: aval.q48 ?? aval.recomendacoes ?? "",
    statusAvaliacao: aval.statusAvaliacao ?? "em_aberto",
  };
}

function buildBasePayload(form) {
  return {
    pessoaId: Number(form.alunoId),
    encaminhamentoId: form.encaminhamentoId ? Number(form.encaminhamentoId) : undefined,
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
    resultado: form.resultado || undefined,
  };
  for (let i = 1; i <= 46; i++) {
    const key = `q${String(i).padStart(2, "0")}`;
    payload[key] = form[key] ?? null;
  }
  return payload;
}

export function useAvaliacoes() {
  const usuario = useSelector((s) => s.auth.usuario);

  const [lista,           setLista]           = useState([]);
  const [alunos,          setAlunos]          = useState([]);
  const [encaminhamentos, setEncaminhamentos] = useState([]);
  const [loading,         setLoading]         = useState(true);

  const [showCreate,    setShowCreate]    = useState(false);
  const [showEdit,      setShowEdit]      = useState(false);
  const [showView,      setShowView]      = useState(false);
  const [showResponder, setShowResponder] = useState(false);

  const [createForm, setCreateForm] = useState(blankAval());
  const [createErr,  setCreateErr]  = useState({});
  const [editForm,   setEditForm]   = useState(null);
  const [editErr,    setEditErr]    = useState({});
  const [editTab,    setEditTab]    = useState("dados");
  const [viewSelected, setViewSelected] = useState(null);
  const [viewTab,    setViewTab]    = useState("dados");
  const [respForm,   setRespForm]   = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(API_AVAL).catch(() => ({ data: [] })),
      api.get(API_ALUNO).catch(() => ({ data: [] })),
      api.get(API_ENC).catch(() => ({ data: [] })),
    ])
      .then(([av, al, enc]) => {
        setLista(av.data.map(normalizeAvaliacao));
        setAlunos(al.data);
        setEncaminhamentos(Array.isArray(enc.data) ? enc.data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  function encAtivoDe(alunoId) {
    return encaminhamentos.find(
      (e) => String(e.pessoa?.id) === String(alunoId) && e.status === "ativo"
    ) ?? null;
  }

  function validateBase(form, setErr) {
    const errs = {};
    if (!form.alunoId) errs.alunoId = "Selecione um aluno";
    if (!form.dataAvaliacao) errs.dataAvaliacao = "Informe a data";
    setErr(errs);
    return Object.keys(errs).length === 0;
  }

  function openCreate() {
    const enc = null;
    setCreateForm({
      ...blankAval(),
      professor: usuario?.nome ?? "",
      encaminhamentoId: enc?.id ?? "",
    });
    setCreateErr({});
    setShowCreate(true);
  }

  function handleCreateChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find((a) => String(a.id) === String(value));
      const enc = encaminhamentos.find(
        (e) => String(e.pessoa?.id) === String(value) && e.status === "ativo"
      );
      setCreateForm((f) => ({
        ...f,
        alunoId: value,
        pessoaNome: aluno?.nome ?? "",
        encaminhamentoId: enc?.id ?? "",
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
      if (createForm.encaminhamentoId && createForm.tipo === "inicial") {
        setEncaminhamentos((prev) =>
          prev.map((enc) =>
            enc.id === Number(createForm.encaminhamentoId)
              ? { ...enc, status: "desligado" }
              : enc
          )
        );
      }
      setShowCreate(false);
      setCreateForm({ ...blankAval(), professor: usuario?.nome ?? "" });
      setCreateErr({});
    } catch {
      alert("Erro ao criar avaliação.");
    }
  }

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
      setEditForm((f) => ({ ...f, alunoId: value, pessoaNome: aluno?.nome ?? "" }));
    } else {
      setEditForm((f) => ({ ...f, [name]: value }));
    }
    setEditErr((er) => ({ ...er, [name]: "" }));
  }

  async function handleEditSave(e) {
    e.preventDefault();
    if (!validateBase(editForm, setEditErr)) { setEditTab("dados"); return; }
    try {
      const { data } = await api.patch(`${API_AVAL}/${editForm.id}`, buildBasePayload(editForm));
      setLista((l) => l.map((a) => (a.id === data.id ? normalizeAvaliacao(data) : a)));
      setShowEdit(false);
    } catch {
      alert("Erro ao salvar.");
    }
  }

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

  function handleRespResultado(val) {
    setRespForm((f) => ({ ...f, resultado: f.resultado === val ? "em-andamento" : val }));
  }

  async function handleRespSave(e) {
    e.preventDefault();
    try {
      const { data } = await api.patch(`${API_AVAL}/${respForm.id}`, buildQuestionarioPayload(respForm));
      setLista((l) => l.map((a) => (a.id === data.id ? normalizeAvaliacao(data) : a)));
      setShowResponder(false);
    } catch {
      alert("Erro ao salvar respostas.");
    }
  }

  async function handleRespSaveWithResultado(resultado) {
    try {
      const { data } = await api.patch(
        `${API_AVAL}/${respForm.id}`,
        buildQuestionarioPayload({ ...respForm, resultado }),
      );
      setLista((l) => l.map((a) => (a.id === data.id ? normalizeAvaliacao(data) : a)));
      setShowResponder(false);
    } catch {
      alert("Erro ao salvar respostas.");
    }
  }

  function openView(aval) {
    setViewSelected(normalizeAvaliacao(aval));
    setViewTab("dados");
    setShowView(true);
  }

  return {
    lista, alunos, encaminhamentos, loading,
    showCreate, setShowCreate,
    showEdit, setShowEdit,
    showView, setShowView,
    showResponder, setShowResponder,
    createForm, createErr,
    editForm, editErr, editTab, setEditTab,
    viewSelected, viewTab, setViewTab,
    respForm,
    encAtivoDe,
    openCreate,
    handleCreateChange, handleCreate,
    openEdit, handleEditChange, handleEditSave,
    openResponder, handleRespOpcao, handleRespTextChange, handleRespResultado, handleRespSave, handleRespSaveWithResultado,
    openView,
  };
}
