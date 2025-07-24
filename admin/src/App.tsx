import { BrowserRouter, Routes, Route, useLocation, Navigate  } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useState } from "react";

// Pages normales
import DashboardOverview from "./pages/dashboard/Overview";
import Alertes from "./pages/dashboard/Alertes";
import Livreurs from "./pages/utilisateurs/livreurs/Livreurs";
import UsersOverview from "./pages/utilisateurs/Overview";
import UserEditPage from "./pages/utilisateurs/UserEditPage";
import Admins from "./pages/utilisateurs/admins/Admins";
import Clients from "./pages/utilisateurs/clients/Clients";
import Commercants from "./pages/utilisateurs/commercants/Commercants";
import Prestataires from "./pages/utilisateurs/prestataires/Prestataires";
import DocumentsOverview from "./pages/documents/Overview";
import DocumentsExports from "./pages/documents/Export";
import DocumentsContrats from "./pages/documents/Contrats";
import DocumentsValidations from "./pages/documents/Validation";
import ServicesOverview from "./pages/services/Overview";
import Annonces from "./pages/services/Annonces";
import Prestations from "./pages/services/Prestations";

// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Layout wrapper pour utiliser useLocation dans un composant fonctionnel
function AppWrapper() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const isAdminLoginPage = location.pathname === "/admin-login";

    return (
        <>
            {!isAdminLoginPage && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
            <div className={`transition-all duration-300 ${!isAdminLoginPage && sidebarOpen ? "ml-64" : "ml-0"}`}>
                {!isAdminLoginPage && <Header />}
                <main>
                    <Routes>
                        {/* Page de connexion admin */}
                        <Route path="/admin-login" element={<AdminLogin />} />

                        {/* Route par défaut - redirige vers dashboard si connecté, sinon vers login */}
                        <Route path="/" element={<AdminProtectedRoute><Navigate to="/dashboard/overview" replace /></AdminProtectedRoute>} />

                        {/* Routes protégées */}
                        <Route path="/dashboard/overview" element={<AdminProtectedRoute><DashboardOverview /></AdminProtectedRoute>} />
                        <Route path="/dashboard/alertes" element={<AdminProtectedRoute><Alertes /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/livreurs" element={<AdminProtectedRoute><Livreurs /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/overview" element={<AdminProtectedRoute><UsersOverview /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/edit/:id" element={<AdminProtectedRoute><UserEditPage /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/admins" element={<AdminProtectedRoute><Admins /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/clients" element={<AdminProtectedRoute><Clients /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/commercants" element={<AdminProtectedRoute><Commercants /></AdminProtectedRoute>} />
                        <Route path="/utilisateurs/prestataires" element={<AdminProtectedRoute><Prestataires /></AdminProtectedRoute>} />
                        <Route path="/documents/overview" element={<AdminProtectedRoute><DocumentsOverview /></AdminProtectedRoute>} />
                        <Route path="/documents/export" element={<AdminProtectedRoute><DocumentsExports exportsList={[]} /></AdminProtectedRoute>} />
                        <Route path="/documents/contrats" element={<AdminProtectedRoute><DocumentsContrats contrats={[]} /></AdminProtectedRoute>} />
                        <Route path="/documents/validations" element={<AdminProtectedRoute><DocumentsValidations documents={[]} /></AdminProtectedRoute>} />
                        <Route path="/services/overview" element={<AdminProtectedRoute><ServicesOverview /></AdminProtectedRoute>} />
                        <Route path="/services/annonces" element={<AdminProtectedRoute><Annonces /></AdminProtectedRoute>} />
                        <Route path="/services/prestations" element={<AdminProtectedRoute><Prestations /></AdminProtectedRoute>} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

// Composant principal
function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}

export default App;
