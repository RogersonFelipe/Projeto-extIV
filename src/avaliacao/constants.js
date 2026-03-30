export const PERGUNTAS = [
  { n: 1,  texto: "Atende as regras" },
  { n: 2,  texto: "Socializa com o grupo" },
  { n: 3,  texto: "Isola-se do grupo" },
  { n: 4,  texto: "Tolerância à frustração" },
  { n: 5,  texto: "Respeita colegas e professores" },
  { n: 6,  texto: "Faz relatos fantasiosos" },
  { n: 7,  texto: "Concentra-se nas atividades" },
  { n: 8,  texto: "Tem iniciativa" },
  { n: 9,  texto: "Sonolência em sala" },
  { n: 10, texto: "Alterações intensas de humor" },
  { n: 11, texto: "Oscilação repentina de humor" },
  { n: 12, texto: "Irrita-se com facilidade *" },
  { n: 13, texto: "Ansiedade" },
  { n: 14, texto: "Escuta colegas" },
  { n: 15, texto: "Segue orientação dos professores" },
  { n: 16, texto: "Mantém-se em sala" },
  { n: 17, texto: "Desloca-se muito na sala" },
  { n: 18, texto: "Fala demasiadamente" },
  { n: 19, texto: "É pontual" },
  { n: 20, texto: "É assíduo" },
  { n: 21, texto: "Demonstra desejo de trabalhar" },
  { n: 22, texto: "Apropria-se do que não é seu" },
  { n: 23, texto: "Hábito de banho diário" },
  { n: 24, texto: "Hábito de escovação" },
  { n: 25, texto: "Cuidado com aparência / uniforme" },
  { n: 26, texto: "Autonomia nos hábitos (23, 24, 25)" },
  { n: 27, texto: "Falta medicação com oscilações **" },
  { n: 28, texto: "Consegue receitas / medicações **" },
  { n: 29, texto: "Materiais organizados" },
  { n: 30, texto: "Usa transporte coletivo" },
  { n: 31, texto: "Iniciativa nas atividades" },
  { n: 32, texto: "Localiza-se na Instituição" },
  { n: 33, texto: "Situa-se nas trocas de sala" },
  { n: 34, texto: "Interage par a par" },
  { n: 35, texto: "Interage em grupo" },
  { n: 36, texto: "Cria conflitos" },
  { n: 37, texto: "Promove harmonia" },
  { n: 38, texto: "Intrigas entre colegas e professores" },
  { n: 39, texto: "Interesse em extraclasses" },
  { n: 40, texto: "Família apoia na Instituição" },
  { n: 41, texto: "Família superprotege" },
  { n: 42, texto: "Relatos negativos da família" },
  { n: 43, texto: "Relatos positivos da família" },
  { n: 44, texto: "Família incentiva autonomia" },
  { n: 45, texto: "Família incentiva mercado de trabalho" },
  { n: 46, texto: "Traz documentos enviados pela Instituição assinados" },
];

export const OPCOES = [
  { v: 1, label: "Sim",              bg: "bg-green-50",  border: "border-green-400",  text: "text-green-700",  dot: "bg-green-500"  },
  { v: 2, label: "Não",              bg: "bg-red-50",    border: "border-red-400",    text: "text-red-700",    dot: "bg-red-500"    },
  { v: 3, label: "Maioria das vezes",bg: "bg-blue-50",   border: "border-blue-400",   text: "text-blue-700",   dot: "bg-blue-500"   },
  { v: 4, label: "Raras vezes",      bg: "bg-amber-50",  border: "border-amber-400",  text: "text-amber-700",  dot: "bg-amber-500"  },
];

export const TIPO_LABEL = {
  inicial: "Experiência",
  acompanhamento: "Acompanhamento",
};

export const STATUS_META = {
  em_aberto:  { label: "Em aberto",  badge: "bg-amber-50 text-amber-700 border border-amber-200"  },
  finalizado: { label: "Finalizado", badge: "bg-slate-700 text-white border border-slate-700"      },
  cancelado:  { label: "Cancelado",  badge: "bg-red-50 text-red-600 border border-red-200"         },
};

export function blankAval() {
  const q = {};
  for (let i = 1; i <= 46; i++) q[`q${String(i).padStart(2, "0")}`] = null;
  return {
    alunoId: "",
    pessoaNome: "",
    professor: "",
    tipo: "inicial",
    dataAvaliacao: "",
    q47: "",
    q48: "",
    ...q,
  };
}

export function countAnswered(aval) {
  let n = 0;
  for (let i = 1; i <= 46; i++)
    if (aval[`q${String(i).padStart(2, "0")}`] !== null) n++;
  return n;
}
