import { Modal, ModalHeader } from "../../components/ui/Modal";
import { PERGUNTAS, OPCOES, TIPO_LABEL, countAnswered } from "../constants";
import { fmtData } from "../../utils/date";

const TABS = [
  { k: "dados",        icon: "info", label: "Dados gerais"  },
  { k: "questionario", icon: "quiz", label: "Questionário"  },
];

export function ViewModal({ viewSelected, viewTab, setViewTab, onClose }) {
  const answered = countAnswered(viewSelected);

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader
        title={viewSelected.pessoaNome || "Avaliação"}
        subtitle="Avaliação finalizada — somente leitura"
        icon="task_alt"
        onClose={onClose}
        color="from-emerald-600 to-emerald-500"
      />

      <div className="flex border-b border-gray-100 px-6">
        {TABS.map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setViewTab(t.k)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition
              ${viewTab === t.k ? "border-slate-700 text-slate-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            <span className="material-icons-outlined text-sm">{t.icon}</span>
            {t.k === "questionario" ? `Questionário (${answered}/46)` : t.label}
          </button>
        ))}
      </div>

      {viewTab === "dados" && (
        <div className="p-6 grid grid-cols-2 gap-3">
          {[
            { icon: "school",        label: "Aluno",     value: viewSelected.pessoaNome,                           full: true  },
            { icon: "person",        label: "Professor", value: viewSelected.professor,                            full: true  },
            { icon: "category",      label: "Tipo",      value: TIPO_LABEL[viewSelected.tipo] ?? viewSelected.tipo            },
            { icon: "calendar_today",label: "Data",      value: fmtData(viewSelected.dataAvaliacao)                           },
          ].map((f) => (
            <div
              key={f.label}
              className={`bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 ${f.full ? "col-span-2" : ""}`}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <span className="material-icons-outlined text-xs">{f.icon}</span>
                {f.label}
              </p>
              <p className="text-sm font-semibold text-gray-800">{f.value || "—"}</p>
            </div>
          ))}
        </div>
      )}

      {viewTab === "questionario" && (
        <div className="p-6 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {PERGUNTAS.map((p) => {
            const key   = `q${String(p.n).padStart(2, "0")}`;
            const val   = viewSelected[key];
            const opcao = OPCOES.find((o) => o.v === val);
            return (
              <div key={p.n} className="border border-gray-100 rounded-lg px-4 py-3 flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  <span className="font-bold text-slate-500 mr-1.5">{p.n}.</span>
                  {p.texto}
                </p>
                {opcao ? (
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border-2 whitespace-nowrap flex-shrink-0 ${opcao.bg} ${opcao.border} ${opcao.text}`}>
                    {opcao.label}
                  </span>
                ) : (
                  <span className="text-xs text-gray-300 italic flex-shrink-0">—</span>
                )}
              </div>
            );
          })}

          {[
            { n: 47, key: "q47", label: "Quais as principais dificuldades observadas?" },
            { n: 48, key: "q48", label: "Quais os pontos positivos observados?"        },
          ]
            .filter((q) => viewSelected[q.key])
            .map((q) => (
              <div key={q.n} className="border border-gray-100 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="font-bold text-slate-500 mr-1.5">{q.n}.</span>
                  {q.label}
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{viewSelected[q.key]}</p>
              </div>
            ))}
        </div>
      )}

      <div className="flex justify-end px-6 py-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold transition"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
