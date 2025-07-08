import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

// Register les modules ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
        {
            label: 'Inscriptions',
            data: [12, 19, 8, 15, 22, 9, 17],
            borderColor: '#155250',
            backgroundColor: '#E9FADF',
            tension: 0.4
        }
    ]
};

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

export default function LineChartDemo() {
    return (

            <div className="w-full h-full">
                <Line data={data} options={options} />
            </div>

    );
}
