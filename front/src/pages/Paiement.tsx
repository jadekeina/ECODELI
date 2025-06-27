const Paiement = () => {
    return (
      <div className="max-w-2xl flex flex-col items-center mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Paiement</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6 w-[60em]">
            <div>
              <h3 className="text-lg font-semibold mb-4">Méthodes de paiement</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-5 bg-[#155250]  rounded"></div>
                    <span>•••• •••• •••• 1234</span>
                  </div>
                  <span className="text-sm text-gray-500">Carte principale</span>
                </div>
                <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  + Ajouter une nouvelle carte
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Abonnements</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">Aucun abonnement actif</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Historique des paiements</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">Aucun paiement récent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Paiement;