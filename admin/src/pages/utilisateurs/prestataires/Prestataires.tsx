import UsersTable from "../../../components/Graph/UsersTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

function Prestataires() {
  const allUsers: User[] = [
    {
      id: 1,
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      role: "Prestataire",
      status: "Active",
      avatar: "/default-avatar.jpg"
    }
  ];

  const prestataires = allUsers.filter((user: User) => user.role === "Prestataire");

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 ">Liste des prestataires</h1>
      <UsersTable users={prestataires} showEmail={true} showRole={true} showActions={true} />
    </div>
  );
}

export default Prestataires;
