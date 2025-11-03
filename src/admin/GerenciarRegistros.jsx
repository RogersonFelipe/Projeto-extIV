import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000"; // ajuste se usar porta diferente

export default function GerenciarRegistros() {
  const [tab, setTab] = useState("usuarios"); // usuarios | alunos | empresas
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(null); // { id, ...record, _type }
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    setPage(1);
    load();
    // eslint-disable-next-line
  }, [tab]);

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${tab}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(item) {
    setEditing({ ...item, _type: tab });
  }

  function closeEdit() {
    setEditing(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setEditing((prev) => ({ ...prev, foto: reader.result }));
    reader.readAsDataURL(file);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id;
      const payload = { ...editing };
      delete payload._type;
      await axios.put(`${API_BASE}/${tab}/${id}`, payload);
      await load();
      closeEdit();
      alert("Registro atualizado com sucesso");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  // filtro + paginação
  const filtered = data.filter((d) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (d.nome || d.nomeFantasia || "").toString().toLowerCase().includes(q) ||
      (d.email || "").toString().toLowerCase().includes(q) ||
      (d.cnpj || "").toString().toLowerCase().includes(q) ||
      (d.id || "").toString().toLowerCase().includes(q)
    );
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return (
    <div className="p-6">
      <div className="max-w-[1100px] mx-auto">
        {/* header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl text-white p-6 mb-6 shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Gerenciar registros</h1>
            <p className="text-sm opacity-90 mt-1">Visualize, edite e exclua empresas, alunos e usuários</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"></path>
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16z"></path>
                </svg>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Pesquisar ${tab}`}
                className="pl-11 pr-4 py-2 rounded-xl w-64 text-sm bg-blue/90 placeholder:text-slate-400 outline-none border border-white/20 focus:ring-4 focus:ring-white/20"
              />
            </div>

            <button onClick={load} className="px-4 py-2 bg-white/20 rounded-xl text-white text-sm border border-white/30 hover:bg-white/25">Atualizar</button>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-3 mb-6">
          <TabButton active={tab === "usuarios"} onClick={() => setTab("usuarios")} icon="person">Usuários</TabButton>
          <TabButton active={tab === "alunos"} onClick={() => setTab("alunos")} icon="school">Alunos</TabButton>
          <TabButton active={tab === "empresas"} onClick={() => setTab("empresas")} icon="apartment">Empresas</TabButton>

          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-slate-500">Por página</label>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="px-3 py-2 rounded-lg border text-sm"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        {/* list as cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-slate-500">Carregando...</div>
          ) : pageItems.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">Nenhum registro</div>
          ) : (
            pageItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-50">
                  {item.foto ? (
                    <img src={item.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-400 font-bold">--</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-lg font-semibold text-slate-800 truncate">{item.nome || item.nomeFantasia || item.titulo || "-"}</div>
                      <div className="text-xs text-slate-500 truncate">{item.email || item.cnpj || "-"}</div>
                    </div>
                    <div className="text-xs text-slate-400">ID {item.id}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="text-sm text-slate-600">
                      {item.telefone ? item.telefone : <span className="text-slate-400">—</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg text-sm shadow">Editar</button>
                      <button onClick={async () => {
                        if (!confirm("Excluir este registro?")) return;
                        try {
                          await axios.delete(`${API_BASE}/${tab}/${item.id}`);
                          await load();
                        } catch (err) { console.error(err); alert("Erro ao excluir"); }
                      }} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm">Excluir</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">Mostrando {start + 1}–{Math.min(start + perPage, total)} de {total}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-white border rounded-lg">Anterior</button>
            <div className="px-3 py-1 text-sm">{page} / {pages}</div>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-1 bg-white border rounded-lg">Próximo</button>
          </div>
        </div>
      </div>

      {/* edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Editar {editing._type}</h3>
                <p className="text-sm text-slate-500">ID: {editing.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={closeEdit} className="text-slate-600 px-3 py-1 rounded hover:bg-slate-100">Fechar</button>
              </div>
            </div>

            <form onSubmit={saveEdit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-50">
                  {editing.foto ? (
                    <img src={editing.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-400">--</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleFile} />
              </div>

              <div className="col-span-1 md:col-span-1 grid grid-cols-1 gap-3">
                {Object.keys(editing).filter(k => k !== "id" && k !== "_type" && k !== "foto").map((key) => (
                  <div key={key}>
                    <label className="text-sm text-slate-600 capitalize block mb-1">{key.replace(/([A-Z])/g, " $1")}</label>
                    <input
                      name={key}
                      value={editing[key] ?? ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                ))}
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={closeEdit} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg">
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* small helper tab button */
function TabButton({ children, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${active ? "bg-white text-blue-700 shadow" : "bg-white/70 text-slate-700 border"}`}
    >
      <span className="material-icons-outlined text-sm">{icon}</span>
      {children}
    </button>
  );
}