import Img2 from "../images/instituto-homepage-02.jpg";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const barData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril"],
  datasets: [
    {
      label: "Alunos",
      data: [12, 19, 8, 50],
      backgroundColor: "rgba(51, 65, 85, 0.75)",
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} alunos` } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: "rgba(0,0,0,0.04)" }, beginAtZero: true, ticks: { font: { size: 11 } } },
  },
};

const pieData = {
  labels: ["Inclusos", "Em andamento", "Finalizados"],
  datasets: [
    {
      data: [10, 5, 7],
      backgroundColor: [
        "rgba(51, 65, 85, 0.8)",
        "rgba(217, 119, 6, 0.75)",
        "rgba(5, 150, 105, 0.75)",
      ],
      borderWidth: 2,
      borderColor: "#fff",
    },
  ],
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
  },
};

const kpis = [
  { label: "Alunos Ativos", value: "89", icon: "school", trend: "+4 este mês" },
  { label: "Encaminhados", value: "34", icon: "assignment_ind", trend: "+2 este mês" },
  { label: "Avaliações", value: "22", icon: "rate_review", trend: "3 em aberto" },
  { label: "Empresas", value: "12", icon: "business", trend: "+1 este mês" },
];

function Home() {
  const usuario = useSelector((state) => state.auth.usuario);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            Painel Principal
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Bem-vindo{usuario?.nome ? `, ${usuario.nome.split(" ")[0]}` : ""}! Visão geral do sistema.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <span className="material-icons-outlined text-base">waving_hand</span>
          Instituto Diomício Freitas
        </div>
      </div>

      {/* Banner */}
      <div className="relative rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex items-center">
        <img
          src={Img2}
          alt="Instituto"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
            <span className="material-icons-outlined text-white text-2xl">account_balance</span>
          </div>
          <div>
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest">
              Instituto Diomício Freitas
            </p>
            <h2 className="text-base font-bold text-white leading-tight">
              Há 40 anos oportunizando jovens e adultos com deficiência intelectual
            </h2>
            <p className="text-slate-300 text-xs mt-0.5">
              Inclusão social e profissional — cidadania e mercado de trabalho
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {kpi.label}
              </p>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="material-icons-outlined text-slate-600 text-base">
                  {kpi.icon}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 leading-none">{kpi.value}</p>
            <p className="text-xs text-gray-400">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Alunos por mês</h2>
              <p className="text-xs text-gray-400 mt-0.5">Matrículas registradas em 2024</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="material-icons-outlined text-slate-600 text-base">bar_chart</span>
            </div>
          </div>
          <div className="relative h-52">
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Status das avaliações</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribuição atual dos registros</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="material-icons-outlined text-slate-600 text-base">pie_chart</span>
            </div>
          </div>
          <div className="relative h-52">
            <Pie data={pieData} options={{ ...pieOptions, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Sobre */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 items-center">
        <img
          src={Img2}
          alt="Atividade"
          className="rounded-lg w-full md:w-44 h-28 object-cover flex-shrink-0 border border-gray-100"
        />
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Sobre o Instituto
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            O Instituto Diomício Freitas atua há mais de 40 anos na inclusão social e profissional
            de jovens e adultos com deficiência intelectual. Nosso trabalho transforma vidas,
            promove cidadania e abre portas para o mercado de trabalho.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { icon: "diversity_3", label: "Inclusão Social" },
              { icon: "account_balance", label: "Cidadania" },
              { icon: "work", label: "Mercado de Trabalho" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200"
              >
                <span className="material-icons-outlined text-xs">{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
