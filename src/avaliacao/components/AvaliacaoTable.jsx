import { TIPO_LABEL, RESULTADO_META, countAnswered } from "../constants";
import { fmtData } from "../../utils/date";

export function AvaliacaoTable({ lista, filtro, tabAtiva, openEdit, openView, openResponder }) {
  const listaFiltrada = lista.filter((a) => {
    const matchTab = tabAtiva === "todas" || a.tipo === tabAtiva;
    const nomePessoa = a.pessoa?.nome ?? a.pessoaNome ?? "";
    const matchBusca =
      !filtro ||
      nomePessoa.toLowerCase().includes(filtro.toLowerCase()) ||
      (a.professorResponsavel ?? "").toLowerCase().includes(filtro.toLowerCase());
    return matchTab && matchBusca;
  });

  if (listaFiltrada.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
        <span className="material-icons-outlined text-3xl">inbox</span>
        <p className="text-sm">Nenhuma avaliação encontrada</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Aluno</th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Professor</th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Tipo</th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Data</th>
          <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Progresso</th>
          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
          <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {listaFiltrada.map((a) => {
          const answered   = countAnswered(a);
          const pct        = Math.round((answered / 46) * 100);
          const rm         = RESULTADO_META[a.resultado ?? "em-andamento"] ?? RESULTADO_META["em-andamento"];
          const bloqueadoResponder = a.resultado === "aprovado" || a.resultado === "reprovado";
          return (
            <tr key={a.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 font-semibold text-gray-800">{a.pessoa?.nome || a.pessoaNome || "—"}</td>
              <td className="px-4 py-3.5 text-gray-600">{a.professorResponsavel || "—"}</td>
              <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                {TIPO_LABEL[a.tipo] ?? a.tipo}
              </td>
              <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">
                {fmtData(a.dataAvaliacao)}
              </td>
              <td className="px-4 py-3.5 hidden lg:table-cell">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{answered}/46</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${rm.badge}`}>
                  {rm.label}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openView(a)}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-md transition"
                  >
                    Editar
                  </button>
                  {!bloqueadoResponder && (
                    <button
                      onClick={() => openResponder(a)}
                      className="text-xs font-semibold text-white bg-slate-700 hover:bg-slate-800 px-3 py-1.5 rounded-md transition"
                    >
                      Responder
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
