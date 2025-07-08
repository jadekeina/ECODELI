import { PieChart } from 'lucide-react';
import { Pie } from 'react-chartjs-2';

type ServicesPieChartProps = {
  data: { labels: string[]; values: number[] };
  title: string;
};

export function ServicesPieChart({ data, title }: ServicesPieChartProps) {
  // Couleurs EcoDeli + variantes sobres
  const pieColors = ['#155250', '#A3DAC9', '#F1F68E', '#E9FADF'];

  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: pieColors,
      borderWidth: 1,
    }]
  };

  return (
    <div className=" w-full h-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h5 className="text-xl font-bold text-gray-900 mb-4">{title}</h5>
      <Pie data={chartData} options={{
        plugins: { legend: { position: 'bottom', labels: { color: "#155250", font: { weight: 'bold' } } } }
      }}/>
    </div>
  );
}
export default PieChart;