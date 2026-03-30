import { useEffect, useState } from "react";
import api from "../../api/axios";
import { blankAval } from "../constants";

const API_AVAL  = "/avaliacoes";
const API_ALUNO = "/pessoas";

export function useAvaliacoes() {
  const [lista,   setLista]   = useState([]);
  const [alunos,  setAlunos]  = useState([]);
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
  const [viewTab,      setViewTab]      = useState("dados");
  const [respForm,     setRespForm]     = useState(null);

  /* ── Fetch inicial ── */
  useEffect(() => {
    Promise.all([
      api.get(API_AVAL).catch(() => ({ data: [] })),
      api.get(API_ALUNO).catch(() => ({ data: [] })),
    ])
      .then(([av, al]) => {
        setLista(av.data);
        setAlunos(al.data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Validação base ── */
  function validateBase(form, setErr) {
    const errs = {};
    if (!form.alunoId) errs.alunoId = "Selecione um aluno";
    if (!form.professor?.trim()) errs.professor = "Informe o professor responsável";
    if (!form.dataAvaliacao) errs.dataAvaliacao = "Informe a data";
    setErr(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Criar ── */
  function handleCreateChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find((a) => String(a.id) === String(value));
      setCreateForm((f) => ({ ...f, alunoId: value, pessoaNome: aluno?.nome ?? "" }));
    } else {
      setCreateForm((f) => ({ ...f, [name]: value }));
    }
    setCreateErr((er) => ({ ...er, [name]: "" }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validateBase(createForm, setCreateErr)) return;
    try {
      const { alunoId, professor, pessoaNome: _n, ...rest } = createForm;
      const { data } = await api.post(API_AVAL, {
        ...rest,
        pessoaId: Number(alunoId),
        professorResponsavel: professor,
      });
      setLista((l) => [...l, data]);
      setShowCreate(false);
      setCreateForm(blankAval());
      setCreateErr({});
    } catch {
      alert("Erro ao criar avaliação.");
    }
  }

  /* ── Editar ── */
  function openEdit(aval) {
    setEditForm({
      ...aval,
      alunoId:    aval.pessoa?.id  ?? aval.pessoaId ?? "",
      pessoaNome: aval.pessoa?.nome ?? "",
      professor:  aval.professorResponsavel ?? "",
    });
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
      const { alunoId, professor, pessoaNome: _n, pessoa: _p, professorResponsavel: _pr, ...rest } = editForm;
      const { data } = await api.put(`${API_AVAL}/${editForm.id}`, {
        ...rest,
        pessoaId: Number(alunoId),
        professorResponsavel: professor,
      });
      setLista((l) => l.map((a) => (a.id === data.id ? data : a)));
      setShowEdit(false);
    } catch {
      alert("Erro ao salvar.");
    }
  }

  /* ── Responder ── */
  function openResponder(aval) {
    setRespForm({
      ...aval,
      pessoaNome: aval.pessoa?.nome ?? "",
      professor:  aval.professorResponsavel ?? "",
    });
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
      const { data } = await api.put(`${API_AVAL}/${respForm.id}`, respForm);
      setLista((l) => l.map((a) => (a.id === data.id ? data : a)));
      setShowResponder(false);
    } catch {
      alert("Erro ao salvar respostas.");
    }
  }

  /* ── Visualizar ── */
  function openView(aval) {
    setViewSelected({
      ...aval,
      pessoaNome: aval.pessoa?.nome ?? "",
      professor:  aval.professorResponsavel ?? "",
    });
    setViewTab("dados");
    setShowView(true);
  }

  return {
    lista, alunos, loading,
    showCreate, setShowCreate,
    showEdit,   setShowEdit,
    showView,   setShowView,
    showResponder, setShowResponder,
    createForm, createErr,
    editForm, editErr, editTab, setEditTab,
    viewSelected, viewTab, setViewTab,
    respForm,
    handleCreateChange, handleCreate,
    openEdit, handleEditChange, handleEditSave,
    openResponder, handleRespOpcao, handleRespTextChange, handleRespSave,
    openView,
  };
}
