import {JSX, useContext} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UserContext } from "./contexts/UserContext";
import 'leaflet/dist/leaflet.css';


import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import HeaderPublic from "./components/header";
import Footer from "./components/Footer";

// Layouts
import LayoutClient from "./components/layout/LayoutClient";
import LayoutDeliveryDriver from "./components/layout/LayoutDeliveryDriver";
import LayoutShopOwner from "./components/layout/LayoutShopOwner";
import LayoutProvider from "./components/layout/LayoutProvider";

// Pages publiques
import Home from "./pages/Home";
import Prix from "./pages/Prix";
import NosEngagements from "./pages/NosEngagements";
import CommentCaMarche from "./pages/CommentCaMarche";
import ExpedierOuRecevoir from "./pages/ExpedierOuRecevoir";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ResendEmail from "./pages/auth/ResendEmail";
import EmailConfirmed from "./pages/auth/EmailConfirmed";

//Gestion erreur
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";


// Pages privées
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import History from "./pages/History";
import MesTrajets from "./pages/Trips";
import CreateAnnonce from "./components/CreateAnnonce";
import DeposerContenu from "./pages/DeposerContenu";
import Trajet from "./pages/client/Trajet";
import ConfirmationTrajet from "./pages/client/ConfirmationTrajet";

// Pages pros
import RegisterPro from "./pages/RegisterPro";
import MesPrestations from "./pages/ServicesList";
import Requests from "./pages/pro/RequestsPublic";
import RequestDetails from "@/pages/pro/RequestDetails";

const stripePromise = loadStripe("pk_test_51RgCcfCSsQb1TgL54ywb1mfMDkdW7cHbFpqW02CZxIVBWN4UXMmmqc02RQqPFUwf0KKfJbf4qPX3jKml2ODXRug700BoaMX9CN");

function App() {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Chargement...</div>;

    const renderWithLayout = (component: JSX.Element) => {
        if (!user) return <Navigate to="/" replace />;

        switch (user.role) {
            case "client":
                return <LayoutClient>{component}</LayoutClient>;
            case "delivery_driver":
                return <LayoutDeliveryDriver>{component}</LayoutDeliveryDriver>;
            case "provider":
                return <LayoutProvider>{component}</LayoutProvider>;
            case "shop_owner":
                return <LayoutShopOwner>{component}</LayoutShopOwner>;
            default:
                return <Navigate to="/" replace />;
        }
    };

    return (
        <Elements stripe={stripePromise}>
            <Routes>
                {/* Public Pages */}
                <Route path="/" element={user ? <Navigate to="/app" replace /> : <><HeaderPublic /><Home /><Footer /></>} />
                <Route path="/prix" element={<><HeaderPublic /><Prix /><Footer /></>} />
                <Route path="/NosEngagements" element={<><HeaderPublic /><NosEngagements /><Footer /></>} />
                <Route path="/Comment-ca-marche" element={<><HeaderPublic /><CommentCaMarche /><Footer /></>} />
                <Route path="/expedier-ou-recevoir" element={<><HeaderPublic /><ExpedierOuRecevoir /><Footer /></>} />
                <Route path="/contact" element={<><HeaderPublic /><Contact /><Footer /></>} />
                <Route path="/connexion" element={<><HeaderPublic /><Login /><Footer /></>} />
                <Route path="/inscription" element={<><HeaderPublic /><Register /><Footer /></>} />
                <Route path="/forgot-password" element={<><HeaderPublic /><ForgotPassword /><Footer /></>} />
                <Route path="/reset-password/:token" element={<><HeaderPublic /><ResetPassword /><Footer /></>} />
                <Route path="/resend-email" element={<><HeaderPublic /><ResendEmail /><Footer /></>} />
                <Route path="/email-confirmed" element={<><HeaderPublic /><EmailConfirmed /><Footer /></>} />


                {/* Gestion d'erreur */}
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />


                {/* Private Pages (Role-based Layouts) */}
                <Route path="/app" element={<ProtectedRoute>{renderWithLayout(<AppHome />)}</ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute>{renderWithLayout(<Dashboard />)}</ProtectedRoute>} />
                <Route path="/mon-compte" element={<ProtectedRoute>{renderWithLayout(<Account />)}</ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute>{renderWithLayout(<History />)}</ProtectedRoute>} />

                {/* Client*/}
                <Route path="/mes-trajets" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<MesTrajets />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/trajet" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<Trajet />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/confirmation-trajet" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<ConfirmationTrajet />)}</RoleRoute></ProtectedRoute>} />

                <Route path="/mes-prestations" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<MesPrestations />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/annonces" element={<ProtectedRoute><RoleRoute allowedRoles={["provider", "delivery_driver", "shop_owner"]}>{renderWithLayout(<Requests />)}</RoleRoute></ProtectedRoute>} />

                <Route path="/deposer-annonce" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<CreateAnnonce />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/deposer-contenu" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<DeposerContenu />)}</RoleRoute></ProtectedRoute>} />

                <Route path="/inscription-pro" element={<ProtectedRoute>{renderWithLayout(<RegisterPro />)}</ProtectedRoute>} />
                <Route path="/requests/:id" element={<ProtectedRoute>{renderWithLayout(<RequestDetails />)}</ProtectedRoute>} />
            </Routes>
        </Elements>
    );
}

export default App;