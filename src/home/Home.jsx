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
import { useState, useEffect } from "react";
import api from "../api/axios";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

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

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
  },
};

function Home() {
  const usuario = useSelector((state) => state.auth.usuario);
  const [barData, setBarData] = useState({
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    datasets: [
      {
        label: "Alunos",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(51, 65, 85, 0.75)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  });

  const [pieData, setPieData] = useState({
    labels: ["Em andamento", "Finalizados"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          "rgba(217, 119, 6, 0.75)",
          "rgba(5, 150, 105, 0.75)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  });

  const [kpis, setKpis] = useState([
    { label: "Alunos Ativos", value: "0", icon: "school", trend: "carregando..." },
    { label: "Encaminhados", value: "0", icon: "assignment_ind", trend: "carregando..." },
    { label: "Avaliações", value: "0", icon: "rate_review", trend: "carregando..." },
    { label: "Empresas", value: "0", icon: "business", trend: "carregando..." },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados em paralelo
        const [pessoasRes, encaminhamentosRes, avaliacoesRes, empresasRes] = await Promise.all([
          api.get("/pessoas?skip=0&take=1000"),
          api.get("/encaminhamentos?skip=0&take=1000"),
          api.get("/avaliacoes?skip=0&take=1000"),
          api.get("/empresas?skip=0&take=1000"),
        ]);

        // Extrair dados (pode ser um array ou um objeto com propriedade data)
        const pessoas = Array.isArray(pessoasRes.data) ? pessoasRes.data : pessoasRes.data?.data || [];
        const encaminhamentos = Array.isArray(encaminhamentosRes.data) ? encaminhamentosRes.data : encaminhamentosRes.data?.data || [];
        const avaliacoes = Array.isArray(avaliacoesRes.data) ? avaliacoesRes.data : avaliacoesRes.data?.data || [];
        const empresas = Array.isArray(empresasRes.data) ? empresasRes.data : empresasRes.data?.data || [];

        // Processar dados para gráfico de barras (alunos por mês - usando dataEntrada ou createdAt)
        const monthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const currentYear = new Date().getFullYear();
        
        pessoas.forEach((pessoa) => {
          const dateStr = pessoa.dataEntrada || pessoa.createdAt;
          if (dateStr) {
            const date = new Date(dateStr);
            // Verificar se é do ano atual ou considerando para gráfico
            const month = date.getMonth();
            if (!isNaN(month)) {
              monthCounts[month]++;
            }
          }
        });

        setBarData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: monthCounts,
            },
          ],
        }));

        // Processar dados para gráfico de pizza (status avaliações)
        // Status esperados: em_aberto, finalizado, cancelado
        const statusCounts = { "Em andamento": 0, "Finalizados": 0 };
        
        avaliacoes.forEach((avaliacao) => {
          const status = avaliacao.statusAvaliacao || "em_aberto";
          
          // Mapeamento dos status para as label do gráfico
          if (status === "finalizado") {
            statusCounts["Finalizados"]++;
          } else {
            statusCounts["Em andamento"]++;
          }
        });

        setPieData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: [statusCounts["Em andamento"], statusCounts["Finalizados"]],
            },
          ],
        }));

        // Contar avaliações ativas (não finalizadas)
        const aval_abertas = avaliacoes.filter(
          (a) => a.statusAvaliacao !== "finalizado"
        ).length;

        // Atualizar KPIs
        setKpis([
          { 
            label: "Alunos Ativos", 
            value: pessoas.length.toString(), 
            icon: "school", 
            trend: `${pessoas.length} no total` 
          },
          { 
            label: "Encaminhados", 
            value: encaminhamentos.length.toString(), 
            icon: "assignment_ind", 
            trend: `${encaminhamentos.length} registrados` 
          },
          { 
            label: "Avaliações", 
            value: avaliacoes.length.toString(), 
            icon: "rate_review", 
            trend: `${aval_abertas} em aberto` 
          },
          { 
            label: "Empresas", 
            value: empresas.length.toString(), 
            icon: "business", 
            trend: `${empresas.length} parceiras` 
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        // Manter dados padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            className={`bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 transition-opacity ${
              loading ? "opacity-60" : ""
            }`}
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
            <p className={`text-2xl font-bold text-gray-800 leading-none ${loading ? "animate-pulse" : ""}`}>
              {kpi.value}
            </p>
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
              <p className="text-xs text-gray-400 mt-0.5">Matrículas registradas</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="material-icons-outlined text-slate-600 text-base">bar_chart</span>
            </div>
          </div>
          <div className={`relative h-52 ${loading ? "opacity-50" : ""}`}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm">Carregando...</span>
              </div>
            ) : (
              <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
            )}
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
          <div className={`relative h-52 ${loading ? "opacity-50" : ""}`}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm">Carregando...</span>
              </div>
            ) : (
              <Pie data={pieData} options={{ ...pieOptions, maintainAspectRatio: false }} />
            )}
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
