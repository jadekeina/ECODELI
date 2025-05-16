import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import logo from "../assets/logo-title.webp"
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
} from "lucide-react"

export default function Sidebar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true,
    utilisateurs: true,
    documents: false,
    services: false,
    finance: false,
    support: false,
    stats: false,
    parametres: false
  })

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside className="w-64 h-screen bg-green-900 text-white p-3 fixed top-0 left-0 shadow-lg overflow-y-auto">
      <img src={logo} alt="EcoDeli Logo" className="h-12 w-auto mb-5 mt-2" />
      <nav className="flex flex-col space-y-2 text-sm font-medium">

        {/* Dashboard */}
        <button onClick={() => toggleMenu("dashboard")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><LayoutDashboard size={16} /> Tableau de bord</span>
          {openMenus.dashboard ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.dashboard && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/dashboard/overview" className={`${isActive("/dashboard/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/dashboard/alertes" className={`${isActive("/dashboard/alertes") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Alertes</Link>
          </div>
        )}

        {/* Utilisateurs */}
        <button onClick={() => toggleMenu("utilisateurs")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><Users size={16} /> Utilisateurs</span>
          {openMenus.utilisateurs ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.utilisateurs && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/utilisateurs/overview" className={`${isActive("/utilisateurs/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/utilisateurs/clients" className={`${isActive("/utilisateurs/clients") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Clients</Link>
            <Link to="/utilisateurs/livreurs" className={`${isActive("/utilisateurs/livreurs") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Livreurs</Link>
            <Link to="/utilisateurs/commercants" className={`${isActive("/utilisateurs/commercants") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Commerçants</Link>
            <Link to="/utilisateurs/prestataires" className={`${isActive("/utilisateurs/prestataires") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Prestataires</Link>
            <Link to="/utilisateurs/admins" className={`${isActive("/utilisateurs/admins") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Admins</Link>
          </div>
        )}

        {/* Documents */}
        <button onClick={() => toggleMenu("documents")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><FileText size={16} /> Documents</span>
          {openMenus.documents ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.documents && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/documents/overview" className={`${isActive("/documents/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/documents/validations" className={`${isActive("/documents/validations") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Validations</Link>
            <Link to="/documents/contrats" className={`${isActive("/documents/contrats") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Contrats</Link>
            <Link to="/documents/export" className={`${isActive("/documents/export") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Exports</Link>
          </div>
        )}

        {/* Services */}
        <button onClick={() => toggleMenu("services")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><Package size={16} /> Services</span>
          {openMenus.services ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.services && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/services/overview" className={`${isActive("/services/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/services/livraisons" className={`${isActive("/services/livraisons") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Livraisons</Link>
            <Link to="/services/prestations" className={`${isActive("/services/prestations") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Prestations</Link>
            <Link to="/services/annonces" className={`${isActive("/services/annonces") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Annonces</Link>
            <Link to="/services/box" className={`${isActive("/services/box") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Box</Link>
          </div>
        )}

        {/* Finance */}
        <button onClick={() => toggleMenu("finance")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><Euro size={16} /> Finance</span>
          {openMenus.finance ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.finance && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/finance/overview" className={`${isActive("/finance/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/finance/factures" className={`${isActive("/finance/factures") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Factures</Link>
            <Link to="/finance/transactions" className={`${isActive("/finance/transactions") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Transactions</Link>
            <Link to="/finance/abonnements" className={`${isActive("/finance/abonnements") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Abonnements</Link>
            <Link to="/finance/virements" className={`${isActive("/finance/virements") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Virements</Link>
          </div>
        )}

        {/* Support */}
        <button onClick={() => toggleMenu("support")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><MessageSquare size={16} /> Support</span>
          {openMenus.support ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.support && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/support/overview" className={`${isActive("/support/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/support/tickets" className={`${isActive("/support/tickets") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Tickets</Link>
            <Link to="/support/conversations" className={`${isActive("/support/conversations") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Conversations</Link>
            <Link to="/support/notifications" className={`${isActive("/support/notifications") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Notifications</Link>
          </div>
        )}

        {/* Statistiques */}
        <button onClick={() => toggleMenu("stats")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><BarChart size={16} /> Statistiques</span>
          {openMenus.stats ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.stats && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/stats/overview" className={`${isActive("/stats/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/stats/clients" className={`${isActive("/stats/clients") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Clients</Link>
            <Link to="/stats/prestations" className={`${isActive("/stats/prestations") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Prestations</Link>
            <Link to="/stats/livraisons" className={`${isActive("/stats/livraisons") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Livraisons</Link>
            <Link to="/stats/CA" className={`${isActive("/stats/CA") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Chiffre d'affaires</Link>
          </div>
        )}

        {/* Paramètres */}
        <button onClick={() => toggleMenu("parametres")} className="flex items-center justify-between px-3 py-2 rounded hover:bg-green-800 w-full">
          <span className="flex items-center gap-2"><Settings size={16} /> Paramètres</span>
          {openMenus.parametres ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {openMenus.parametres && (
          <div className="ml-5 flex flex-col space-y-1">
            <Link to="/parametres/overview" className={`${isActive("/parametres/overview") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Vue d'ensemble</Link>
            <Link to="/parametres/systeme" className={`${isActive("/parametres/systeme") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Système</Link>
            <Link to="/parametres/langues" className={`${isActive("/parametres/langues") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Langues</Link>
            <Link to="/parametres/tarifs" className={`${isActive("/parametres/tarifs") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Tarifs</Link>
            <Link to="/parametres/services" className={`${isActive("/parametres/services") ? "bg-green-800" : ""} px-3 py-2 rounded hover:bg-green-800`}>Services</Link>
          </div>
        )}

      </nav>
    </aside>
  )
}