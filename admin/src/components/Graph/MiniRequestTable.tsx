export default function MiniRequestTable({ requests }) {
    return (
      <div className="relative overflow-x-auto shadow-md rounded-lg bg-white p-4">
             <h3 className="text-base font-bold text-gray-900 mb-3">Presatations récents</h3>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-semibold">Prestation</th>
              <th className="px-6 py-3 font-semibold">Auteur</th>
              <th className="px-6 py-3 font-semibold">Jour</th>
              <th className="px-6 py-3 font-semibold">Montant</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr
                key={req.id || idx}
                className="bg-white border-b border-gray-200 hover:bg-gray-50 last:border-0"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {req.prestation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{req.auteur}</td>
                <td className="px-6 py-4 whitespace-nowrap">{req.jour}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {req.prix}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-2 pr-4">
          <a
            href="/services/livraisons"
            className="text-xs text-[#155250] hover:underline font-medium"
          >
            Voir tout
          </a>
        </div>
      </div>
    );
  }
  