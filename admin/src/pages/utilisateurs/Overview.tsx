import { useState } from "react";
import UsersTable from "../../components/Graph/UsersTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

export default function UsersOverview() {
  // Données d'exemple pour les utilisateurs
  const allUsers: User[] = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      role: "Client",
      status: "Active",
      avatar: "/default-avatar.jpg"
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie.martin@example.com",
      role: "Commerçant",
      status: "Active",
      avatar: "/default-avatar.jpg"
    },
    {
      id: 3,
      name: "Pierre Durand",
      email: "pierre.durand@example.com",
      role: "Livreur",
      status: "Inactive",
      avatar: "/default-avatar.jpg"
    },
    {
      id: 4,
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      role: "Prestataire",
      status: "Active",
      avatar: "/default-avatar.jpg"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="text-gray-600 mt-2">Consultez et gérez tous les utilisateurs de la plateforme</p>
      </div>
      
      <UsersTable 
        users={allUsers} 
        showEmail={true} 
        showRole={true} 
        showActions={true} 
      />
    </div>
  );
}
