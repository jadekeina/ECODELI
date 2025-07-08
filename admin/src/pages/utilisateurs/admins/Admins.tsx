import UsersTable from "../../../components/Graph/UsersTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

function Admins() {
  // Données d'exemple pour les utilisateurs
  const allUsers: User[] = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      role: "Admin",
      status: "Active",
      avatar: "/default-avatar.jpg"
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie.martin@example.com",
      role: "Admin",
      status: "Active",
      avatar: "/default-avatar.jpg"
    }
  ];

  // Soit tu filtres depuis tous les users :
  const admins = allUsers.filter((user: User) => user.role === "Admin");
  // Soit tu récupères déjà que les admins depuis ton API

  return (
    <div className=" bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Liste des administrateurs</h1>
      <UsersTable users={admins} showEmail={true} showRole={true} showActions={true} />
    </div>
  );
}

export default Admins;
