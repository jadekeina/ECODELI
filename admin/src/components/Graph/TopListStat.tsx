import { useState } from "react";

const TABS = [
    { key: "livreurs", label: "Top livreurs" },
    { key: "clients", label: "Top clients" },
    // Ajoute d'autres onglets si besoin !
];

const data = {
    livreurs: [
        {
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            name: "Keina P.",
            value: "42 courses",
            diff: "+12%",
            diffType: "up"
        },
        // ...
    ],
    clients: [
        {
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            name: "Jade D.",
            value: "28 commandes",
            diff: "-3%",
            diffType: "down"
        },
        // ...
    ]
};

export default function TopStatsCard() {
    const [activeTab, setActiveTab] = useState("livreurs");
    const currentData = data[activeTab];

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Statistiques ce mois
                <span className="ml-2 text-gray-400">
          <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#F1F68E"/></svg>
        </span>
            </h2>
            <div className="flex mb-4 border-b border-gray-200">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-2 px-4 font-medium text-sm transition rounded-t-lg
              ${activeTab === tab.key ? "bg-gray-50 text-[#155250] border-b-2 border-[#155250]" : "text-gray-400 hover:bg-gray-50"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <ul>
                {currentData.map((user, idx) => (
                    <li key={idx} className="flex items-center justify-between py-4 border-b last:border-none">
                        <div className="flex items-center gap-3 min-w-0">
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                            <div>
                                <div className="font-medium text-gray-900 truncate">{user.name}</div>
                                <div className={`flex items-center text-sm ${user.diffType === "up" ? "text-green-600" : "text-red-500"}`}>
                                    {user.diffType === "up" ? (
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 13l4-4 4 4" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M15 7l-4 4-4-4" />
                                        </svg>
                                    )}
                                    {user.diff}
                                    <span className="ml-2 text-gray-500">vs dernier mois</span>
                                </div>
                            </div>
                        </div>
                        <div className="font-semibold text-base text-gray-900">{user.value}</div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center pt-4">
                <button className="text-sm text-gray-500">7 derniers jours</button>
                <a href="#" className="text-sm text-[#155250] font-medium hover:underline">VOIR PLUS</a>
            </div>
        </div>
    );
}
