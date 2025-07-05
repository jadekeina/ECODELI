import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UserContext } from "./contexts/UserContext";

import ProtectedRoute from "./components/ProtectedRoute";
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

// Pages clients
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import History from "./pages/History";
import MesTrajets from "./pages/Trips";
import CreateAnnonce from "./components/CreateAnnonce";
import DeposerContenu from "./pages/DeposerContenu";

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

                {/* 🌐 Public pages */}
                <Route
                    path="/"
                    element={
                        user ? (
                            <Navigate to="/app" replace />
                        ) : (
                            <>
                                <HeaderPublic />
                                <Home />
                                <Footer />
                            </>
                        )
                    }
                />
                <Route path="/prix" element={<><HeaderPublic /><Prix /><Footer /></>} />
                <Route path="/NosEngagements" element={<><HeaderPublic /><NosEngagements /><Footer /></>} />
                <Route path="/Comment-ca-marche" element={<><HeaderPublic /><CommentCaMarche /><Footer /></>} />
                <Route path="/expedier-ou-recevoir" element={<><HeaderPublic /><ExpedierOuRecevoir /><Footer /></>} />
                <Route path="/contact" element={<><HeaderPublic /><Contact /><Footer /></>} />
                <Route path="/connexion" element={<><HeaderPublic /><Login /><Footer /></>} />
                <Route path="/inscription" element={<><HeaderPublic /><Register /><Footer /></>} />

                {/* 🔐 Private pages (role-based layout) */}
                <Route path="/app" element={<ProtectedRoute>{renderWithLayout(<AppHome />)}</ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute>{renderWithLayout(<Dashboard />)}</ProtectedRoute>} />
                <Route path="/mon-compte" element={<ProtectedRoute>{renderWithLayout(<Account />)}</ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute>{renderWithLayout(<History />)}</ProtectedRoute>} />
                <Route path="/mes-trajets" element={<ProtectedRoute>{renderWithLayout(<MesTrajets />)}</ProtectedRoute>} />
                <Route path="/mes-prestations" element={<ProtectedRoute>{renderWithLayout(<MesPrestations />)}</ProtectedRoute>} />
                <Route path="/deposer-annonce" element={<ProtectedRoute>{renderWithLayout(<CreateAnnonce />)}</ProtectedRoute>} />
                <Route path="/deposer-contenu" element={<ProtectedRoute>{renderWithLayout(<DeposerContenu />)}</ProtectedRoute>} />
                <Route path="/inscription-pro" element={<ProtectedRoute>{renderWithLayout(<RegisterPro />)}</ProtectedRoute>} />
                <Route path="/annonces" element={<ProtectedRoute>{renderWithLayout(<Requests />)}</ProtectedRoute>} />
                <Route path="/requests/:id" element={<ProtectedRoute>{renderWithLayout(<RequestDetails />)}</ProtectedRoute>} />

            </Routes>
        </Elements>
    );
}

export default App;
