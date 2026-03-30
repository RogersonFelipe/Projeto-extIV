import { Modal, ModalHeader } from "../../components/ui/Modal";
import { FieldInput, FieldSelect } from "../../components/ui/FormFields";
import { DateField } from "../../components/ui/DateField";
import { TIPO_LABEL } from "../constants";

export function CreateModal({ createForm, createErr, alunos, handleCreateChange, handleCreate, onClose }) {
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
          <FieldInput
            label="Professor responsável"
            icon="person"
            name="professor"
            value={createForm.professor}
            onChange={handleCreateChange}
            err={createErr.professor}
            placeholder="Nome do professor"
            span={2}
          />
          <FieldSelect
            label="Tipo"
            icon="category"
            name="tipo"
            value={createForm.tipo}
            onChange={handleCreateChange}
            err={createErr.tipo}
            options={Object.entries(TIPO_LABEL).map(([v, l]) => ({ value: v, label: l }))}
          />
          <div>
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
