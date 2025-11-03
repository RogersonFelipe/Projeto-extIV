import Img2 from "../images/instituto-homepage-02.jpg";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const barData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril"],
  datasets: [
    {
      label: "Alunos",
      data: [12, 19, 8, 50],
      backgroundColor: "rgba(37, 99, 235, 0.6)",
    },
  ],
};

const pieData = {
  labels: ["Inclusos", "Em andamento", "Finalizados"],
  datasets: [
    {
      data: [10, 5, 7],
      backgroundColor: [
        "rgba(37, 99, 235, 0.6)",
        "rgba(251, 191, 36, 0.6)",
        "rgba(34, 197, 94, 0.6)",
      ],
    },
  ],
};

function Home() {
  return (
    <div className="w-full  bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-center min-h-screen p-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">
          <div className="flex flex-col gap-6">
            <img 
              src={Img2}
              alt="Atividade 2" 
              className="rounded-2xl shadow-lg w-full object-cover"
            /> 
            <div className="bg-blue-50 rounded-xl p-4 shadow">
              <h2 className="text-lg font-bold text-blue-700 mb-2">Alunos por mês</h2>
              <Bar data={barData} />
            </div>
          </div>

          <div className="flex flex-col justify-start text-gray-600">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
              Bem-vindo ao Instituto
            </h1>
            <p className="text-lg leading-relaxed mb-6">
              Há 40 anos oportunizando a jovens e adultos com deficiência intelectual o pleno
              exercício da cidadania e sua inclusão no mercado de trabalho.
            </p>

            <div className="bg-blue-50 rounded-xl p-4 shadow mt-4">
              <h2 className="text-lg font-bold text-blue-700 mb-2">Status das avaliações</h2>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;