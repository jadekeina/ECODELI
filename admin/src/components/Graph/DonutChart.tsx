import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ labels, data }) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: ["#155250", "#F1F68E", "#E9FADF"], // 3 couleurs pour 3 valeurs
                borderWidth: 2,
                borderColor: "#fff"
            }
        ]
    };

    const options = {
        cutout: "70%",
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    color: "#155250",
                    font: { size: 14, weight: "bold" }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.parsed;
                        return `${label}: ${value}`;
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full py-4">
            <Doughnut data={chartData} options={options} />
        </div>
    );
}
