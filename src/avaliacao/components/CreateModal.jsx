import { Modal, ModalHeader } from "../../components/ui/Modal";
import { FieldSelect } from "../../components/ui/FormFields";
import { DateField } from "../../components/ui/DateField";

export function CreateModal({ createForm, createErr, alunos, encaminhamentos, handleCreateChange, handleCreate, onClose }) {
  const encAtivo = encaminhamentos?.find(
    (e) => String(e.pessoa?.id) === String(createForm.alunoId) && e.status === "ativo"
  ) ?? null;

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Nova Avaliação"
        subtitle="Cadastro"
        icon="add_task"
        onClose={onClose}
        color="from-blue-600 to-blue-500"
      />
      <form onSubmit={handleCreate} className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <FieldSelect
            label="Aluno"
            icon="school"
            name="alunoId"
            value={createForm.alunoId}
            onChange={handleCreateChange}
            err={createErr.alunoId}
            span={2}
            options={[
              { value: "", label: "Selecione o aluno..." },
              ...alunos.map((a) => ({ value: String(a.id), label: a.nome })),
            ]}
          />

          {/* Encaminhamento ativo do aluno */}
          {createForm.alunoId && (
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Encaminhamento
              </label>
              {encAtivo ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
                  <span className="material-icons-outlined text-base text-green-600">work</span>
                  <span className="font-medium">
                    {encAtivo.empresa?.nomeFantasia || encAtivo.empresa?.razaoSocial || "Empresa"}
                  </span>
                  {encAtivo.funcao && (
                    <span className="text-green-600 text-xs">— {encAtivo.funcao}</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400">
                  <span className="material-icons-outlined text-base">work_off</span>
                  Nenhum encaminhamento ativo
                </div>
              )}
            </div>
          )}

          {/* Professor — preenchido automaticamente */}
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Professor responsável
            </label>
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">person</span>
              <input
                value={createForm.professor}
                readOnly
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 cursor-default focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-2">
            <DateField
              label="Data da Avaliação"
              name="dataAvaliacao"
              value={createForm.dataAvaliacao}
              err={createErr.dataAvaliacao}
              onChange={handleCreateChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition"
          >
            Criar Avaliação
          </button>
        </div>
      </form>
    </Modal>
  );
}
