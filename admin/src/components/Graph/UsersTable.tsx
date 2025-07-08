import { Pencil, Trash2 } from "lucide-react";

type User = {
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
};
type UsersTableProps = {
  users: User[];
  showEmail?: boolean;
  showRole?: boolean;
  showActions?: boolean;
  rowsLimit?: number | null;
};

export default function UserTable({
  users,
  showEmail = true,
  showRole = true,
  showActions = true,
  rowsLimit = null, // null = toutes, sinon n lignes seulement (pour dashboard)
}: UsersTableProps) {
  const rows = rowsLimit ? users.slice(0, rowsLimit) : users;
  return (
    <div className="relative overflow-x-auto shadow-md rounded-xl bg-white p-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold">Nom</th>
            {showEmail && <th className="px-4 py-3 font-semibold">Email</th>}
            {showRole && <th className="px-4 py-3 font-semibold">Rôle</th>}
            <th className="px-4 py-3 font-semibold">Statut</th>
            {showActions && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => (
            <tr key={user.email} className="bg-white border-b border-gray-200 hover:bg-gray-50 last:border-0">
              <td className="flex items-center px-4 py-3 whitespace-nowrap gap-4">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-base font-semibold text-gray-900">{user.name}</div>
                </div>
              </td>
              {showEmail && <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>}
              {showRole && <td className="px-4 py-3 whitespace-nowrap">{user.role}</td>}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full mr-2 ${user.status === "Active" ? "bg-green-400" : "bg-red-500"}`}></span>
                  {user.status}
                </div>
              </td>
              {showActions && (
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-[#155250] hover:bg-[#174D4D] focus:ring-4 focus:ring-[#E9FADF]"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit user
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete user
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Footer, pagination, etc. ici si tu veux */}
    </div>
  );
}
