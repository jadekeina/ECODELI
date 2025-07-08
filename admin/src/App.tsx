import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./pages/dashboard/Overview";
import Alertes from "./pages/dashboard/Alertes";
import Livreurs from "./pages/utilisateurs/livreurs/Livreurs";
import UsersOverview from "./pages/utilisateurs/Overview";
import Admins from "./pages/utilisateurs/admins/Admins";
import Clients from "./pages/utilisateurs/clients/Clients";
import Commercants from "./pages/utilisateurs/commercants/Commercants";
import Prestataires from "./pages/utilisateurs/prestataires/Prestataires";
import DocumentsOverview from "./pages/documents/Overview";
import DocumentsExports from "./pages/documents/Export";
import DocumentsContrats from "./pages/documents/Contrats";
import DocumentsValidations from "./pages/documents/Validation";
import Overview from "./pages/services/Overview";
import Annonces from "./pages/services/Annonces";
import Prestations from "./pages/services/Prestations";

import Header from "./components/Header";
import { useState } from "react";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <BrowserRouter>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <Header />
                <main>
                    <Routes>
                    <Route index element={<Navigate to="/dashboard/overview" replace />} />
                        <Route path="/dashboard/overview" element={<DashboardOverview />} />
                        <Route path="/dashboard/Alertes" element={<Alertes />} />
                        <Route path="/utilisateurs/livreurs" element={<Livreurs />} />
                        <Route path="/utilisateurs/Overview" element={<UsersOverview />} />
                        <Route path="/utilisateurs/admins" element={<Admins />} />
                        <Route path="/utilisateurs/clients" element={<Clients />} />
                        <Route path="/utilisateurs/commercants" element={<Commercants />} />
                        <Route path="/utilisateurs/prestataires" element={<Prestataires />} />
                        <Route path="/documents/overview" element={<DocumentsOverview />} />
                        <Route path="/documents/export" element={<DocumentsExports exportsList={[]} />} />
                        <Route path="/documents/contrats" element={<DocumentsContrats contrats={[]} />} />
                        <Route path="/documents/validations" element={<DocumentsValidations documents={[]} />} />
                        <Route path="/services/overview" element={<Overview />} />
                        <Route path="/services/annonces" element={<Annonces />} />
                        <Route path="/services/Prestations" element={<Prestations />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
