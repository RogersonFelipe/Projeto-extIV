import { useState } from "react";
import { useAvaliacoes } from "./hooks/useAvaliacoes";
import { AvaliacaoTable } from "./components/AvaliacaoTable";
import { CreateModal }    from "./components/CreateModal";
import { EditModal }      from "./components/EditModal";
import { ResponderModal } from "./components/ResponderModal";
import { ViewModal }      from "./components/ViewModal";

const ABAS = [
  { key: "todas",          label: "Todas"          },
  { key: "inicial",        label: "Experiência"    },
  { key: "acompanhamento", label: "Acompanhamento" },
];

export default function Avaliacao() {
  const [filtro,   setFiltro]   = useState("");
  const [tabAtiva, setTabAtiva] = useState("todas");

  const aval = useAvaliacoes();

  const counts = {
    todas:          aval.lista.length,
    inicial:        aval.lista.filter((a) => a.tipo === "inicial").length,
    acompanhamento: aval.lista.filter((a) => a.tipo === "acompanhamento").length,
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">Avaliações</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Registro e acompanhamento de avaliações de experiência
          </p>
        </div>
        <button
          onClick={() => { aval.setShowCreate(true); }}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          <span className="material-icons-outlined text-base">add</span>
          Nova Avaliação
        </button>
      </div>

      {/* Abas + busca */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center overflow-x-auto">
        {ABAS.map((aba, i) => (
          <button
            key={aba.key}
            type="button"
            onClick={() => setTabAtiva(aba.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2
              ${tabAtiva === aba.key
                ? "border-slate-700 text-slate-800 bg-slate-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
              ${i > 0 ? "border-l border-l-gray-100" : ""}`}
          >
            {ABAS.find((a) => a.key === aba.key)?.label ?? aba.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${tabAtiva === aba.key ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-500"}`}>
              {counts[aba.key]}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 px-4 border-l border-gray-100">
          <span className="material-icons-outlined text-gray-400 text-base">search</span>
          <input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar aluno ou professor..."
            className="text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 w-48"
          />
          {filtro && (
            <button onClick={() => setFiltro("")} className="text-gray-400 hover:text-gray-600">
              <span className="material-icons-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {aval.loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined animate-spin text-xl">autorenew</span>
            <span className="text-sm">Carregando...</span>
          </div>
        ) : (
          <AvaliacaoTable
            lista={aval.lista}
            filtro={filtro}
            tabAtiva={tabAtiva}
            openEdit={aval.openEdit}
            openView={aval.openView}
            openResponder={aval.openResponder}
          />
        )}
      </div>

      {/* Modais */}
      {aval.showCreate && (
        <CreateModal
          createForm={aval.createForm}
          createErr={aval.createErr}
          alunos={aval.alunos}
          handleCreateChange={aval.handleCreateChange}
          handleCreate={aval.handleCreate}
          onClose={() => aval.setShowCreate(false)}
        />
      )}

      {aval.showEdit && aval.editForm && (
        <EditModal
          editForm={aval.editForm}
          editErr={aval.editErr}
          editTab={aval.editTab}
          setEditTab={aval.setEditTab}
          alunos={aval.alunos}
          handleEditChange={aval.handleEditChange}
          handleEditSave={aval.handleEditSave}
          onClose={() => aval.setShowEdit(false)}
        />
      )}

      {aval.showResponder && aval.respForm && (
        <ResponderModal
          respForm={aval.respForm}
          handleRespOpcao={aval.handleRespOpcao}
          handleRespTextChange={aval.handleRespTextChange}
          handleRespSave={aval.handleRespSave}
          onClose={() => aval.setShowResponder(false)}
        />
      )}

      {aval.showView && aval.viewSelected && (
        <ViewModal
          viewSelected={aval.viewSelected}
          viewTab={aval.viewTab}
          setViewTab={aval.setViewTab}
          onClose={() => aval.setShowView(false)}
        />
      )}
    </div>
  );
}
