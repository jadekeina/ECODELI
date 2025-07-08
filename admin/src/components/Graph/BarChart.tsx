import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const barData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    datasets: [
        {
            label: 'CA',
            data: [2000, 2300, 1800, 2200],
            backgroundColor: '#155250'
        }
    ]
};

const barOptions = {
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: "#142D2D" } },
        y: { grid: { color: "#F1F68E" }, ticks: { color: "#155250" } }
    }
};

export function CaBarChart() {
    return <Bar data={barData} options={barOptions} height={160} />;
}
