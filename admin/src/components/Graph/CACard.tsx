import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function CACard({
  value = "12 423 €",
  title = "Chiffre d'affaires cette semaine",
  percent = 23,
  percentColor = "text-green-500",
  percentIconUp = true,
  chartData = [15, 22, 13, 27, 32, 20, 25], // FAKES !
  chartLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  actions,
  dropdown = true,
  ...props
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ChartJS data
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "",
        data: chartData,
        borderColor: "#6366F1",
        backgroundColor: ctx => {
          const ctxGradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
          ctxGradient.addColorStop(0, "#6366F144");
          ctxGradient.addColorStop(1, "#fff0");
          return ctxGradient;
        },
        pointBackgroundColor: "#6366F1",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { color: "#6366F1" }, ticks: { color: "#374151" } },
      y: { grid: { color: "#E9FADF" }, ticks: { color: "#374151" } }
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6" {...props}>
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{value}</h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">{title}</p>
        </div>
        <div className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${percentColor} text-center`}>
          {percent}{typeof percent === "number" ? "%" : ""}
          <svg className={`w-3 h-3 ml-1 ${percentIconUp ? "" : "rotate-180"}`} aria-hidden="true" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
          </svg>
        </div>
      </div>
      {/* --- Area Chart --- */}
      <div className="min-h-90 w-full mt-2">
        <Line data={data} options={options} />
      </div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
        <div className="flex justify-between items-center pt-5">
          {/* Dropdown */}
          {dropdown && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                type="button"
              >
                Last 7 days
                <svg className="w-2.5 ml-1.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              {/* Dropdown menu (fake!) */}
              {dropdownOpen && (
                <div className="absolute left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold">Last 7 days</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a></li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {/* Actions */}
          {actions || (
            <a
              href="#"
              className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 px-3 py-2"
            >
              Sales Report
              <svg className="w-2.5 h-2.5 ml-1.5" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
