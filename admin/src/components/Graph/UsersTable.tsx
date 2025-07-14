import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export type UserApi = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  profilpicture?: string | null;
  role: string;
  dateInscription?: string;
  last_login?: string | null;
  email_verified?: boolean | number;
};

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
};

type UsersTableProps = {
  usersApi: UserApi[]; // Data brute reçue de l'API
  showEmail?: boolean;
  showRole?: boolean;
  showActions?: boolean;
  rowsLimit?: number | null;
  showSeeMore?: boolean;
  seeMoreHref?: string;
  onDeleteUser?: (userId: number) => void;
  onEditUser?: (userId: number, newData?: any) => void;
};

export default function UsersTable({
  usersApi,
  showEmail = true,
  showRole = true,
  showActions = true,
  rowsLimit = null,
  showSeeMore = false,
  seeMoreHref = "/admin/utilisateurs",
  onDeleteUser,
  onEditUser,
}: UsersTableProps) {
  // Mappe les users de l’API à la structure du tableau
  const users: User[] = usersApi.map((u) => ({
    id: u.id,
    name: `${u.firstname} ${u.lastname}`,
    email: u.mail,
    avatar: u.profilpicture || "https://randomuser.me/api/portraits/lego/1.jpg",
    role: u.role,
    // Statut custom selon last_login ou email_verified (ajuste selon ton projet)
    status: u.last_login ? "Active" : "Offline",
  }));

  const navigate = useNavigate();
  
  // Pagination (optionnel, tu peux enlever si inutile)
  const [page, setPage] = useState(1);
  const pageSize = rowsLimit || users.length;
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  // Fonction pour naviguer vers la page d'édition
  const handleEditUser = (userId: number) => {
    navigate(`/utilisateurs/edit/${userId}`);
  };

  return (
    <div className="relative overflow-x-auto shadow-md rounded-xl bg-white p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Utilisateurs</h2>
        {showSeeMore && (
          <a
            href={seeMoreHref}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir plus &rarr;
          </a>
        )}
      </div>
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
          {paginatedUsers.map((user) => (
            <tr key={user.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 last:border-0">
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
                    onClick={() => handleEditUser(user.id)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-[#155250] hover:bg-[#174D4D] focus:ring-4 focus:ring-[#E9FADF]"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit user
                  </button>
                  <button
                    onClick={() => onDeleteUser && onDeleteUser(user.id)}
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
      {/* Pagination simple */}
      {rowsLimit && users.length > pageSize && (
        <div className="flex justify-end mt-3 space-x-2">
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Précédent
          </button>
          <span>
            Page {page} / {Math.ceil(users.length / pageSize)}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(users.length / pageSize)))}
            disabled={page === Math.ceil(users.length / pageSize)}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
