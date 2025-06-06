import { useLocation } from "react-router-dom"

export default function Header() {
  const location = useLocation()

  const breadcrumb = location.pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ")

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white">
      <div className="text-sm text-gray-500 font-medium">
        {breadcrumb || "Dashboard"}
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher..."
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        />
        <button className="border rounded-md px-3 py-1 text-sm">FR</button>
        <button className="border rounded-md px-3 py-1 text-sm">Déconnexion</button>
      </div>
    </header>
  )
}
