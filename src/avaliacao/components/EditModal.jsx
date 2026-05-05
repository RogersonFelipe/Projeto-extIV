import { Modal, ModalHeader } from "../../components/ui/Modal";
import { FieldInput, FieldSelect } from "../../components/ui/FormFields";
import { DateField } from "../../components/ui/DateField";
import { TIPO_LABEL } from "../constants";

export function EditModal({
  editForm,
  editErr,
  alunos,
  handleEditChange,
  handleEditSave,
  onClose,
}) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title={editForm.pessoaNome || "Editar Avaliação"}
        subtitle="Edição de dados"
        icon="edit_note"
        onClose={onClose}
        color="from-blue-600 to-blue-500"
      />

      <form onSubmit={handleEditSave}>
        <div className="p-6 grid grid-cols-2 gap-4">
          <FieldSelect
            label="Aluno"
            icon="school"
            name="alunoId"
            value={String(editForm.alunoId ?? "")}
            onChange={handleEditChange}
            err={editErr.alunoId}
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
            value={editForm.professor ?? ""}
            onChange={handleEditChange}
            err={editErr.professor}
            span={2}
          />
          <FieldSelect
            label="Tipo"
            icon="category"
            name="tipo"
            value={editForm.tipo}
            onChange={handleEditChange}
            err={editErr.tipo}
            options={Object.entries(TIPO_LABEL).map(([v, l]) => ({ value: v, label: l }))}
          />
          <div>
            <DateField
              label="Data da Avaliação"
              name="dataAvaliacao"
              value={editForm.dataAvaliacao}
              err={editErr.dataAvaliacao}
              onChange={handleEditChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
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
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
