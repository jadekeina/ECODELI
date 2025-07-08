import UsersTable from "../../../components/Graph/UsersTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

function Commercants() {
  const allUsers: User[] = [
    {
      id: 1,
      name: "Marie Martin",
      email: "marie.martin@example.com",
      role: "Commerçant",
      status: "Active",
      avatar: "/default-avatar.jpg"
    }
  ];

  const commercants = allUsers.filter((user: User) => user.role === "Commerçant");

  return (
    <div className=" bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 ">Liste des commerçants</h1>
      <UsersTable users={commercants} showEmail={true} showRole={true} showActions={true} />
    </div>
  );
}

export default Commercants;
