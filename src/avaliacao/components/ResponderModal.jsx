import { useState } from "react";
import { Modal, ModalHeader } from "../../components/ui/Modal";
import { PERGUNTAS, OPCOES, countAnswered } from "../constants";

const RESULTADO_OPCOES = [
  { v: "aprovado", label: "Aprovado", active: "bg-green-50 border-green-400 text-green-700" },
  { v: "reprovado", label: "Reprovado", active: "bg-red-50 border-red-400 text-red-700"    },
];

export function ResponderModal({ respForm, handleRespOpcao, handleRespTextChange, handleRespResultado, handleRespSave, handleRespSaveWithResultado, onClose }) {
  const answered = countAnswered(respForm);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (answered === 46 && respForm.resultado === "em-andamento") {
      setShowConfirm(true);
      return;
    }
    handleRespSave(e);
  }

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader
        title={respForm.pessoaNome || "Avaliação"}
        subtitle={`Questionário — ${answered}/46 respondidas`}
        icon="quiz"
        onClose={onClose}
      />

      <form onSubmit={handleSubmit}>
        <div className="p-6 flex flex-col gap-2 max-h-[65vh] overflow-y-auto">
          <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-2">
            <span className="material-icons-outlined text-slate-400 text-base mt-0.5">info</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Para cada item abaixo, selecione a opção que melhor descreve o comportamento
              observado. Clique novamente na opção selecionada para desmarcá-la.
            </p>
          </div>

          {PERGUNTAS.map((p) => {
            const key = `q${String(p.n).padStart(2, "0")}`;
            const val = respForm[key];
            return (
              <div key={p.n} className="border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50 transition">
                <p className="text-sm text-gray-700 mb-2.5">
                  <span className="font-bold text-slate-500 mr-1.5">{p.n}.</span>
                  {p.texto}
                </p>
                <div className="flex flex-wrap gap-2">
                  {OPCOES.map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => handleRespOpcao(p.n, o.v)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border-2 transition
                        ${val === o.v
                          ? `${o.bg} ${o.border} ${o.text}`
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="border border-gray-100 rounded-lg px-4 py-3 mt-1">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-bold text-slate-500 mr-1.5">47.</span>
              Quais as principais dificuldades observadas?
            </p>
            <textarea
              name="q47"
              value={respForm.q47 ?? ""}
              onChange={handleRespTextChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none"
            />
          </div>

          <div className="border border-gray-100 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-bold text-slate-500 mr-1.5">48.</span>
              Quais os pontos positivos observados?
            </p>
            <textarea
              name="q48"
              value={respForm.q48 ?? ""}
              onChange={handleRespTextChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition resize-none"
            />
          </div>

          <div className="border border-gray-100 rounded-lg px-4 py-3 mt-1">
            <p className="text-sm font-semibold text-gray-700 mb-2.5">Resultado</p>
            <div className="flex gap-3">
              {RESULTADO_OPCOES.map((r) => (
                <button
                  key={r.v}
                  type="button"
                  onClick={() => handleRespResultado(r.v)}
                  className={`px-5 py-2 rounded-md text-sm font-semibold border-2 transition
                    ${respForm.resultado === r.v ? r.active : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">{answered} de 46 questões respondidas</span>
          <div className="flex gap-3">
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
              Salvar Respostas
            </button>
          </div>
        </div>
      </form>

      {showConfirm && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-7 mx-6 text-center max-w-sm w-full">
            <span className="material-icons-outlined text-4xl text-slate-600 mb-3 block">task_alt</span>
            <h3 className="text-base font-bold text-gray-800 mb-1">Finalizar avaliação?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Todas as questões foram respondidas. Selecione o resultado para fechar esta avaliação.
            </p>
            <div className="flex gap-3 justify-center mb-4">
              <button
                onClick={() => { setShowConfirm(false); handleRespSaveWithResultado("aprovado"); }}
                className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition"
              >
                Aprovado
              </button>
              <button
                onClick={() => { setShowConfirm(false); handleRespSaveWithResultado("reprovado"); }}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
              >
                Reprovado
              </button>
            </div>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Voltar e revisar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
