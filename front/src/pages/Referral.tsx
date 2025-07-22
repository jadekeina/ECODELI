import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Parrainage = () => {
  const { user } = useContext(UserContext);
  const code = user?.referral_code || "ECODELI-123ABC";

  const copy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copié !");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Parrainage</h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full">
        <p>
          Partagez votre code à vos amis – vous gagnez chacun 10 € après leur
          première livraison !
        </p>
        <div className="flex gap-3 items-center">
          <code className="px-3 py-2 bg-gray-100 rounded font-mono">
            {code}
          </code>
          <button
            onClick={copy}
            className="px-3 py-1 bg-[#155250] text-white rounded text-sm"
          >
            Copier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parrainage;
