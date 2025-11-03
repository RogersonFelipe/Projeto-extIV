import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000"; // json-server

export default function Usuarios_Encaminhados() {
  // listagem já salva no servidor
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // modal e lista de empresas cadastradas
  const [modalOpen, setModalOpen] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  // formulário simples (uma entrada por vez)
  const [form, setForm] = useState({
    nome: "",
    dataAdmissao: "",
    empresa: "",
    funcao: "",
    contatoRH: "",
    dataDesligamento: ""
  });

  useEffect(() => {
    loadList();
    loadEmpresas();
  }, []);

  async function loadList() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/encaminhados`);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadEmpresas() {
    try {
      const res = await axios.get(`${API_BASE}/empresas`);
      setEmpresas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar empresas", err);
      setEmpresas([]);
    }
  }

  function openAddModal() {
    setForm({
      nome: "",
      dataAdmissao: "",
      empresa: "",
      funcao: "",
      contatoRH: "",
      dataDesligamento: ""
    });
    setModalOpen(true);
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    // validação mínima
    if (!form.nome && !form.empresa) {
      alert("Preencha pelo menos Nome ou Empresa.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/encaminhados`, {
        nome: (form.nome || "").trim(),
        dataAdmissao: form.dataAdmissao || null,
        empresa: (form.empresa || "").trim(),
        funcao: (form.funcao || "").trim(),
        contatoRH: (form.contatoRH || "").trim(),
        dataDesligamento: form.dataDesligamento || null
      });
      alert("Acompanhamento adicionado com sucesso.");
      setModalOpen(false);
      await loadList();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Veja o console.");
    } finally {
      setSaving(false);
    }
  }

  async function excluirRegistro(id) {
    if (!confirm("Excluir esse registro?")) return;
    try {
      await axios.delete(`${API_BASE}/encaminhados/${id}`);
      await loadList();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-800 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-blue-500">
          <path d="M12 2L2 7v7c0 5 5 8 10 8s10-3 10-8V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        Usuários encaminhados ao Trabalho
      </h2>

      {/* lista salva no servidor */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-600">{loading ? "Carregando..." : `${list.length} registros`}</div>
          <div className="flex items-center gap-2">
            <button onClick={loadList} className="px-3 py-2 bg-white border rounded hover:bg-gray-50">Atualizar</button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-blue-200">
              <tr className="text-blue-700">
                <th className="py-3 px-4">Nº</th>
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">Data Admissão</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Função</th>
                <th className="py-3 px-4">Contato RH</th>
                <th className="py-3 px-4">Provável desligamento</th>
                <th className="py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-500">Nenhum registro</td></tr>
              ) : (
                list.map((item, idx) => (
                  <tr key={item.id} className="border-t hover:bg-blue-50">
                    <td className="py-3 px-4 font-semibold text-blue-700 text-center">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="py-3 px-4">{item.nome || "—"}</td>
                    <td className="py-3 px-4">{item.dataAdmissao || "—"}</td>
                    <td className="py-3 px-4">{item.empresa || "—"}</td>
                    <td className="py-3 px-4">{item.funcao || "—"}</td>
                    <td className="py-3 px-4">{item.contatoRH || "—"}</td>
                    <td className="py-3 px-4">{item.dataDesligamento || "—"}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => excluirRegistro(item.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* área de ação: botão para abrir form de adicionar (não mais linhas) */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        <div className="text-sm text-slate-600">Adicionar novo acompanhamento</div>
        <div className="ml-auto">
          <button onClick={openAddModal} className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Adicionar acompanhamento</button>
        </div>
      </div>

      {/* modal com formulário simples (uma entrada por vez) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-auto max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Adicionar Acompanhamento</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setModalOpen(false)} className="px-3 py-1 rounded hover:bg-slate-100">Fechar</button>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Nome</label>
                <input
                  value={form.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Data de Admissão</label>
                  <input
                    value={form.dataAdmissao}
                    onChange={(e) => handleChange("dataAdmissao", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="date"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600 block mb-1">Empresa</label>
                  <select
                    value={form.empresa}
                    onChange={(e) => handleChange("empresa", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Selecione a empresa...</option>
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.nomeFantasia || emp.nome || emp.id}>
                        {emp.nomeFantasia || emp.nome || `Empresa ${emp.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Função</label>
                  <input
                    value={form.funcao}
                    onChange={(e) => handleChange("funcao", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600 block mb-1">Contato RH</label>
                  <input
                    value={form.contatoRH}
                    onChange={(e) => handleChange("contatoRH", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1">Provável desligamento</label>
                <input
                  value={form.dataDesligamento}
                  onChange={(e) => handleChange("dataDesligamento", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg">
                  {saving ? "Salvando..." : "Salvar Acompanhamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}