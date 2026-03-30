import { useEncaminhamentos } from "./hooks/useEncaminhamentos";
import { EncaminhamentoForm } from "./components/EncaminhamentoForm";
import { Modal, ModalHeader } from "../components/ui/Modal";
import { fmtData } from "../utils/date";

export default function Usuarios_Encaminhados() {
  const enc = useEncaminhamentos();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            Encaminhados ao Trabalho
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Registro de alunos encaminhados a empresas parceiras
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={enc.loadAll}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            <span className="material-icons-outlined text-base">refresh</span>
            Atualizar
          </button>
          <button
            onClick={enc.openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition"
          >
            <span className="material-icons-outlined text-base">add</span>
            Novo Encaminhamento
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center px-4 py-3 gap-3">
        <span className="material-icons-outlined text-gray-400 text-base">search</span>
        <input
          value={enc.query}
          onChange={(e) => enc.setQuery(e.target.value)}
          placeholder="Buscar por aluno, empresa ou função..."
          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
        />
        <span className="text-xs text-gray-400 ml-auto shrink-0">
          {enc.filtered.length} registro{enc.filtered.length !== 1 ? "s" : ""}
        </span>
        {enc.query && (
          <button onClick={() => enc.setQuery("")} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {enc.loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined animate-spin text-xl">autorenew</span>
            <span className="text-sm">Carregando...</span>
          </div>
        ) : enc.filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-icons-outlined text-3xl">inbox</span>
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3 w-10">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Aluno</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Empresa</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Função</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Admissão</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">Desligamento</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">Contato RH</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enc.filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-800">
                    {item.pessoa?.nome || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">
                    {item.empresa?.nomeFantasia || item.empresa?.razaoSocial || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{item.funcao || "—"}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{fmtData(item.dataAdmissao)}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">{fmtData(item.dataProvavelDesligamento)}</td>
                  <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">{item.contatoRh || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => enc.openEdit(item)}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => enc.excluir(item.id)}
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
      </div>

      {/* Modal — Criar */}
      {enc.showCreate && (
        <Modal onClose={() => enc.setShowCreate(false)}>
          <ModalHeader
            title="Novo Encaminhamento"
            subtitle="Cadastro"
            icon="add_task"
            onClose={() => enc.setShowCreate(false)}
            color="from-blue-600 to-blue-500"
          />
          <form onSubmit={enc.handleCreate} className="p-6 flex flex-col gap-5">
            <EncaminhamentoForm
              form={enc.form}
              formErr={enc.formErr}
              alunos={enc.alunos}
              empresas={enc.empresas}
              handleChange={enc.handleChange}
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => enc.setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" disabled={enc.saving}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition disabled:opacity-60">
                {enc.saving ? "Salvando..." : "Salvar Encaminhamento"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal — Editar */}
      {enc.showEdit && (
        <Modal onClose={() => enc.setShowEdit(false)}>
          <ModalHeader
            title={enc.form.pessoaNome || "Editar Encaminhamento"}
            subtitle="Edição de registro"
            icon="edit_note"
            onClose={() => enc.setShowEdit(false)}
            color="from-slate-700 to-slate-600"
          />
          <form onSubmit={enc.handleEdit} className="p-6 flex flex-col gap-5">
            <EncaminhamentoForm
              form={enc.form}
              formErr={enc.formErr}
              alunos={enc.alunos}
              empresas={enc.empresas}
              handleChange={enc.handleChange}
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => enc.setShowEdit(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" disabled={enc.saving}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition disabled:opacity-60">
                {enc.saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
