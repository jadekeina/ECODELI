import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';

interface BarChart2Props {
  data: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  chartKey: string;
}

export default function BarChart2({ data, title, subtitle, icon, chartKey }: BarChart2Props) {
  // Couleurs EcoDeli + variantes sobres
  const barColors = ['#155250', '#F1F68E', '#A3DAC9'];

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((d: { label: string; data: number[] }, i: number) => ({
      ...d,
      backgroundColor: barColors[i % barColors.length],
      borderRadius: 4,
      barThickness: 18
    })),
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3">{icon}</div>
          <div>
            <h5 className="leading-none text-2xl font-bold text-gray-900 pb-1">{title}</h5>
            <p className="text-sm font-normal text-gray-500">{subtitle}</p>
          </div>
        </div>
        {/* Optionnel : stat % up/down */}
        <div>
          <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
            <svg className="w-2.5 h-2.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 10 14">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
            </svg>
            +5.2%
          </span>
        </div>
      </div>
      <div className="w-full h-[320px]">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: "#E9FADF" }, ticks: { color: "#142D2D" } },
              y: { grid: { color: "#F1F68E" }, ticks: { color: "#142D2D" } },
            }
          }}
          width={undefined}
          height={undefined}
          key={chartKey}
        />
      </div>
    </div>
  );
}