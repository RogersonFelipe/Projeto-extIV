import { Modal, ModalHeader } from "../../components/ui/Modal";
import { FieldInput, FieldSelect } from "../../components/ui/FormFields";
import { DateField } from "../../components/ui/DateField";
import { TIPO_LABEL } from "../constants";

const TABS = [
  { k: "dados",       icon: "info",  label: "Dados gerais" },
  { k: "observacoes", icon: "notes", label: "Observações"  },
];

export function EditModal({
  editForm,
  editErr,
  editTab,
  setEditTab,
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

      <div className="flex border-b border-gray-100 px-6">
        {TABS.map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setEditTab(t.k)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition
              ${editTab === t.k ? "border-slate-700 text-slate-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            <span className="material-icons-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleEditSave}>
        {editTab === "dados" && (
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
        )}

        {editTab === "observacoes" && (
          <div className="p-6 grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Observações
              </label>
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-3 text-gray-400 text-base pointer-events-none">notes</span>
                <textarea
                  name="observacoes"
                  value={editForm.observacoes ?? ""}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Recomendações
              </label>
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-3 text-gray-400 text-base pointer-events-none">recommend</span>
                <textarea
                  name="recomendacoes"
                  value={editForm.recomendacoes ?? ""}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none"
                />
              </div>
            </div>
          </div>
        )}

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
