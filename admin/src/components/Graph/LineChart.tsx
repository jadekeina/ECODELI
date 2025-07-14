// LineChart.js
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: { display: false }
    },
    scales: {
        x: { grid: { color: '#F1F68E' }, ticks: { color: '#155250' } },
        y: { grid: { color: '#E9FADF' }, ticks: { color: '#155250' } }
    }
};

// 👇 Ajoute `data` en props, et tu utilises la prop dans le composant !
export default function LineChart({ data }) {
    // labels statiques pour les jours (Lun ... Dim)
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    // Crée le vrai dataSet à partir de la prop
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Inscriptions',
                data: data || [0, 0, 0, 0, 0, 0, 0], // fallback zeros si pas data
                borderColor: '#155250',
                backgroundColor: '#E9FADF',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="w-full h-full">
            <Line data={chartData} options={options} />
        </div>
    );
}
