import { useEffect, useState } from "react";
import api from "../../api/axios";

const BLANK = {
  alunoId: "",
  pessoaNome: "",
  dataAdmissao: "",
  empresaId: "",
  empresaNome: "",
  funcao: "",
  contatoRh: "",
  dataDesligamento: "",
};

export function useEncaminhamentos() {
  const [list,    setList]    = useState([]);
  const [alunos,  setAlunos]  = useState([]);
  const [empresas,setEmpresas]= useState([]);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [query,   setQuery]   = useState("");

  const [showCreate,    setShowCreate]    = useState(false);
  const [showEdit,      setShowEdit]      = useState(false);
  const [form,          setForm]          = useState(BLANK);
  const [formErr,       setFormErr]       = useState({});
  const [editId,        setEditId]        = useState(null);

  const [desativarId,   setDesativarId]   = useState(null);
  const [motivo,        setMotivo]        = useState("");
  const [motivoErr,     setMotivoErr]     = useState("");

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [enc, al, emp] = await Promise.all([
        api.get("/encaminhamentos").catch(() => ({ data: [] })),
        api.get("/pessoas").catch(()         => ({ data: [] })),
        api.get("/empresas").catch(()         => ({ data: [] })),
      ]);
      setList(    Array.isArray(enc.data) ? enc.data : []);
      setAlunos(  Array.isArray(al.data)  ? al.data  : []);
      setEmpresas(Array.isArray(emp.data) ? emp.data : []);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "alunoId") {
      const aluno = alunos.find((a) => String(a.id) === String(value));
      setForm((f) => ({ ...f, alunoId: value, pessoaNome: aluno?.nome ?? "" }));
    } else if (name === "empresaId") {
      const emp = empresas.find((e) => String(e.id) === String(value));
      setForm((f) => ({ ...f, empresaId: value, empresaNome: emp?.nomeFantasia ?? "" }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    setFormErr((er) => ({ ...er, [name]: "" }));
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
    setEditId(null);
    setShowCreate(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post("/encaminhamentos", {
        pessoaId:                Number(form.alunoId),
        empresaId:               Number(form.empresaId),
        dataAdmissao:            form.dataAdmissao   || undefined,
        dataProvavelDesligamento: form.dataDesligamento || undefined,
        funcao:                  form.funcao.trim()  || undefined,
        contatoRh:               form.contatoRh.trim() || undefined,
        status: "ativo",
      });
      setShowCreate(false);
      await loadAll();
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao salvar.";
      setFormErr((p) => ({ ...p, alunoId: msg }));
    } finally {
      setSaving(false);
    }
  }

  function openEdit(item) {
    setEditId(item.id);
    setForm({
      alunoId:          String(item.pessoa?.id  ?? ""),
      pessoaNome:       item.pessoa?.nome         ?? "",
      dataAdmissao:     item.dataAdmissao          ?? "",
      empresaId:        String(item.empresa?.id   ?? ""),
      empresaNome:      item.empresa?.nomeFantasia ?? "",
      funcao:           item.funcao                ?? "",
      contatoRh:        item.contatoRh             ?? "",
      dataDesligamento: item.dataProvavelDesligamento ?? "",
    });
    setFormErr({});
    setShowEdit(true);
  }

  async function handleEdit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.patch(`/encaminhamentos/${editId}`, {
        pessoaId:                Number(form.alunoId),
        empresaId:               Number(form.empresaId),
        dataAdmissao:            form.dataAdmissao    || undefined,
        dataProvavelDesligamento: form.dataDesligamento || undefined,
        funcao:                  form.funcao.trim()   || undefined,
        contatoRh:               form.contatoRh.trim()|| undefined,
      });
      setShowEdit(false);
      await loadAll();
    } catch {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  function abrirDesativar(id) {
    setDesativarId(id);
    setMotivo("");
    setMotivoErr("");
  }

  async function confirmarDesativar() {
    if (!motivo.trim()) { setMotivoErr("Informe o motivo"); return; }
    setSaving(true);
    try {
      await api.patch(`/encaminhamentos/${desativarId}`, {
        status: "desligado",
        motivoDesligamento: motivo.trim(),
      });
      setDesativarId(null);
      setMotivo("");
      await loadAll();
    } catch {
      alert("Erro ao desativar.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = list.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (item.pessoa?.nome    ?? "").toLowerCase().includes(q) ||
      (item.empresa?.nomeFantasia ?? "").toLowerCase().includes(q) ||
      (item.funcao ?? "").toLowerCase().includes(q)
    );
  });

  return {
    list, filtered, alunos, empresas, loading, saving,
    query, setQuery,
    showCreate, setShowCreate,
    showEdit,   setShowEdit,
    form, formErr,
    handleChange,
    openCreate, handleCreate,
    openEdit,   handleEdit,
    desativarId, abrirDesativar, confirmarDesativar, setDesativarId,
    motivo, setMotivo, motivoErr,
    loadAll,
  };
}
