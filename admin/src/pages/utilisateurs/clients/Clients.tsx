import UsersTable from "../../../components/Graph/UsersTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

function Clients() {
  const allUsers: User[] = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      role: "Client",
      status: "Active",
      avatar: "/default-avatar.jpg"
    }
  ];

  const clients = allUsers.filter((user: User) => user.role === "Client");

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6  ">Liste des clients</h1>
      <UsersTable users={clients} showEmail={true} showRole={true} showActions={true} />
    </div>
  );
}

export default Clients;
