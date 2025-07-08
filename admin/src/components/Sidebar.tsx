import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-title.webp";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Euro,
  MessageSquare,
  BarChart,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const sections = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard className="w-5 h-5" />,
    links: [
      { to: "/dashboard/overview", label: "Vue d'ensemble" },
      { to: "/dashboard/alertes", label: "Alertes" }
    ]
  },
  {
    key: "utilisateurs",
    label: "Utilisateurs",
    icon: <Users className="w-5 h-5" />,
    links: [
      { to: "/utilisateurs/overview", label: "Vue d'ensemble" },
      { to: "/utilisateurs/clients", label: "Clients" },
      { to: "/utilisateurs/commercants", label: "Commerçants" },
      { to: "/utilisateurs/prestataires", label: "Prestataires" },
      { to: "/utilisateurs/admins", label: "Admins" }
    ]
  },
  {
    key: "documents",
    label: "Documents",
    icon: <FileText className="w-5 h-5" />,
    links: [
      { to: "/documents/overview", label: "Vue d'ensemble" },
      { to: "/documents/validations", label: "Validations" },
      { to: "/documents/contrats", label: "Contrats" },
      { to: "/documents/export", label: "Exports" }
    ]
  },
  {
    key: "services",
    label: "Services",
    icon: <Package className="w-5 h-5" />,
    links: [
      { to: "/services/overview", label: "Vue d'ensemble" },
      //{ to: "/services/livraisons", label: "Livraisons" },
      { to: "/services/prestations", label: "Prestations" },
      { to: "/services/annonces", label: "Annonces" },
      //{ to: "/services/box", label: "Box" }
    ]
  },
  {
    key: "finance",
    label: "Finance",
    icon: <Euro className="w-5 h-5" />,
    links: [
      { to: "/finance/overview", label: "Vue d'ensemble" },
      { to: "/finance/factures", label: "Factures" },
      { to: "/finance/transactions", label: "Transactions" },
      { to: "/finance/virements", label: "Virements" },
      { to: "/stats/CA", label: "Chiffre d'affaires" },
    ]
  },
  {
    key: "support",
    label: "Support",
    icon: <MessageSquare className="w-5 h-5" />,
    links: [
      { to: "/support/overview", label: "Vue d'ensemble" },
      { to: "/support/tickets", label: "Tickets" },
      { to: "/support/conversations", label: "Conversations" },
      { to: "/support/notifications", label: "Notifications" }
    ]
  },

  //{
    //key: "stats",
   // label: "Statistiques",
   //icon: <BarChart className="w-5 h-5" />,
  //  links: [
    //  { to: "/stats/overview", label: "Vue d'ensemble" },
    //  { to: "/stats/clients", label: "Clients" },
    //  { to: "/stats/prestations", label: "Prestations" },
     // { to: "/stats/livraisons", label: "Livraisons" },
    
   // ]
 // },

  {
    key: "parametres",
    label: "Paramètres",
    icon: <Settings className="w-5 h-5" />,
    links: [
      { to: "/parametres/overview", label: "Vue d'ensemble" },
      { to: "/parametres/systeme", label: "Système" },
      { to: "/parametres/langues", label: "Langues" },
      { to: "/parametres/tarifs", label: "Tarifs" },
      { to: "/parametres/services", label: "Services" }
    ]
  }
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [openMenus, setOpenMenus] = useState(
      sections.reduce((acc, cur) => ({ ...acc, [cur.key]: false }), {})
  );

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
      <>
        {/* Bouton d’ouverture burger TOUJOURS visible */}
        {!open && (
            <button
                className="fixed z-30 top-4 left-4 p-2 rounded-lg bg-white shadow border border-gray-200"
                onClick={() => setOpen(true)}
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="sr-only">Ouvrir menu</span>
            </button>
        )}
        {/* Sidebar */}
        <aside
            className={`
          ${open ? "flex" : "hidden"}
          fixed top-0 left-0 z-20 flex-col w-64 h-full pt-4 bg-white border-r border-gray-200 transition-all duration-300
        `}
            aria-label="Sidebar"
        >
          <div className="flex items-center justify-between px-4">
            <img src={logo} alt="EcoDeli Logo" className="h-10 w-auto" />
            <button
                className="p-1 rounded hover:bg-gray-100 text-gray-700"
                onClick={() => setOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col flex-1 px-3 mt-8 space-y-2 font-normal overflow-y-auto">
            {sections.map((section) => (
                <div key={section.key}>
                  <button
                      onClick={() => toggleMenu(section.key)}
                      className="flex items-center w-full p-2 text-base text-gray-900 rounded-lg transition hover:bg-gray-100 group"
                  >
                    {section.icon}
                    <span className="flex-1 ml-3 text-left whitespace-nowrap">{section.label}</span>
                    {openMenus[section.key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {openMenus[section.key] && (
                      <div className="ml-5 flex flex-col space-y-1 mt-1">
                        {section.links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`
                        px-3 py-2 rounded-lg text-gray-700 transition font-medium
                        ${isActive(link.to) ? "bg-gray-100 text-primary-700 font-bold" : "hover:bg-gray-100"}
                      `}
                            >
                              {link.label}
                            </Link>
                        ))}
                      </div>
                  )}
                </div>
            ))}
          </nav>
        </aside>
      </>
  );
}
