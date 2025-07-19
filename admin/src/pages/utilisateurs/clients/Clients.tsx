import { useEffect, useState } from "react";
import UsersTable from "../../../components/Graph/UsersTable";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Clients() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
      .then(res => {
        // Filtre seulement les clients
        const clients = res.data.users.filter((user: any) => user.role === 'client');
        setUsers(clients);
      })
      .catch(err => console.error("Erreur chargement clients:", err));
  }, []);

  // Suppression
  const handleDeleteUser = (userId: number) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    axios.delete(`${API_URL}/api/users/${userId}`)
      .then(() => setUsers(users.filter(u => u.id !== userId)))
      .catch(() => alert("Erreur lors de la suppression"));
  };

  // Edition
  const handleEditUser = async (userId: number, newData?: any) => {
    // Affiche une modale ou un prompt pour éditer
    // Ici exemple simple avec prompt
    const newFirstname = window.prompt("Nouveau prénom ?");
    const newLastname = window.prompt("Nouveau nom ?");
    if (!newFirstname && !newLastname) return;

    try {
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        firstname: newFirstname,
        lastname: newLastname,
        ...newData,
      });
      // Refresh
      const res = await axios.get(`${API_URL}/api/users/`);
      const clients = res.data.users.filter((user: any) => user.role === 'client');
      setUsers(clients);
    } catch (e) {
      alert("Erreur lors de la modification");
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
        <p className="text-gray-600 mt-2">Consultez et gérez tous les clients de la plateforme</p>
      </div>
      <UsersTable
        usersApi={users}
        showEmail={true}
        showRole={true}
        showActions={true}
        rowsLimit={null}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
      />
    </div>
  );
}
