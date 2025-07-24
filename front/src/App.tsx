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
import ProviderCourses from "./pages/provider/ProviderCourses";
import CourseDetail from "./pages/provider/CourseDetail";
import DashboardProvider from "./pages/provider/DashBoardProvider";
import SuiviCourse from "./pages/client/SuiviCourse";
import DashboardClient from "./pages/client/DashboardClient";
import NouvelleAnnonceShopOwner from "./pages/shop-owner/NouvelleAnnonceShopOwner";
import SuccessAnnonce from "./pages/shop-owner/SuccessAnnonce";
import PaymentsHistory from "./pages/provider/PaymentHistory";
import ShopOwnerOffers from "./pages/delivery-driver/ShopOwnerOffers";
import ShopOwnerRequestDetails from "./pages/delivery-driver/ShopOwnerRequestDetails";
import ProviderServicesList from "@/components/provider/ProviderServicesList";
import MesAnnonces from "@/pages/shop-owner/MesAnnonces";
import NouvellePrestationProvider from "./pages/provider/NouvellePrestationProvider";
import EditPrestation from "@/pages/provider/EditPrestation";
import AnnonceDetails   from "@/pages/shop-owner/AnnonceDetails";
import PrestationDetails from "@/pages/provider/PrestationDetails";
import ProviderServiceRequests  from "@/pages/provider/ProviderServiceRequests";
import ModifierAnnonceShopOwner from "@/pages/shop-owner/ModifierAnnonceShopOwner";
import GererStatusPrestations from "@/pages/provider/GererStatusPrestations";
import ProviderCalendar from "@/pages/provider/ProviderCalendar";
import ServiceRequestDetails from "@/pages/provider/ServiceRequestsDetails";
import DashboardShopOwner from "@/pages/shop-owner/DashboardShopOwner";
import MesBoutiques from "@/pages/shop-owner/MesBoutiques";
import AjouterBoutique from "@/pages/shop-owner/AjouterBoutique";
import ShopDetails from "@/pages/shop-owner/ShopDetails";
import DashBoardDeliveryDriver from "@/pages/delivery-driver/DashboardDeliveryDriver";
import DemandeClient from "@/pages/client/DemandeClient";
import DetailDemandeClient from "@/pages/client/DetailDemandeClient";
import EditShopDetails from "@/pages/shop-owner/EditShopDetails";
import NouvelleDemande from "@/pages/client/NouvelleDemande";


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
        if (!user) {
            console.warn("[App.tsx - renderWithLayout] Utilisateur non défini. Redirection vers la page d'accueil.");
            return <Navigate to="/" replace />;
        }
        // Correction ici : Si user.role n'est pas encore défini, on retourne un placeholder de chargement
        // pour satisfaire le type JSX.Element attendu par <Route element={...}>
        if (!user.role) {
            console.warn("[App.tsx - renderWithLayout] Rôle de l'utilisateur non défini. Affichage du chargement...");
            return <div>Chargement du profil...</div>; // Retourne un élément JSX valide
        }

        switch (user.role) {
            case "client":
                return <LayoutClient>{component}</LayoutClient>;
            case "delivery-driver": // <-- CORRECTION ICI : 'delivery_driver' devient 'delivery-driver'
                return <LayoutDeliveryDriver>{component}</LayoutDeliveryDriver>;
            case "provider":
                return <LayoutProvider>{component}</LayoutProvider>;
            case "shop-owner":
                return <LayoutShopOwner>{component}</LayoutShopOwner>;
            default:
                console.warn(`[App.tsx - renderWithLayout] Rôle utilisateur inconnu: ${user.role}. Redirection vers la page d'accueil.`);
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
                <Route path="/email-confirmed/:token" element={<><HeaderPublic /><EmailConfirmed /><Footer /></>} />


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
                <Route path="/suivi-course/:rideId" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<SuiviCourse />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/dashboard-client" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<DashboardClient />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/client/demandes" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<DemandeClient />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/client/demande/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<DetailDemandeClient />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/client/nouvelle-demande" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<NouvelleDemande />)}</RoleRoute></ProtectedRoute>} />

                {/* Shop-owner */}
                <Route path="/annonces/nouvelle" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<NouvelleAnnonceShopOwner />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/annonces/success" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<SuccessAnnonce />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/mes-annonces" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<MesAnnonces />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/annonce/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<AnnonceDetails />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/annonces/edit/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<ModifierAnnonceShopOwner />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/dashboard/shop-owner" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<DashboardShopOwner />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/mes-boutiques" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<MesBoutiques />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/mes-boutiques/ajouter" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<AjouterBoutique />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/mes-boutiques/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<ShopDetails />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/mes-boutiques/edit/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["shop-owner"]}>{renderWithLayout(<EditShopDetails />)}</RoleRoute></ProtectedRoute>} />


                <Route path="/mes-prestations" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<MesPrestations />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/annonces" element={<ProtectedRoute><RoleRoute allowedRoles={["provider", "delivery_driver"]}>{renderWithLayout(<Requests />)}</RoleRoute></ProtectedRoute>} />

                <Route path="/deposer-annonce" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<CreateAnnonce />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/deposer-contenu" element={<ProtectedRoute><RoleRoute allowedRoles={["client"]}>{renderWithLayout(<DeposerContenu />)}</RoleRoute></ProtectedRoute>} />

                <Route path="/inscription-pro" element={<ProtectedRoute>{renderWithLayout(<RegisterPro />)}</ProtectedRoute>} />
                <Route path="/requests/:id" element={<ProtectedRoute>{renderWithLayout(<RequestDetails />)}</ProtectedRoute>} />

                {/* Delivery Driver */}
                <Route path="/livraisons/offres-commercants" element={<ProtectedRoute><RoleRoute allowedRoles={["delivery-driver"]}>{renderWithLayout(<ShopOwnerOffers />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/livraisons/offre/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["delivery-driver"]}>{renderWithLayout(<ShopOwnerRequestDetails />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/livraisons/shop-owner/en-attente" element={<ProtectedRoute><RoleRoute allowedRoles={["delivery-driver"]}>{renderWithLayout(<ShopOwnerOffers />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/livraisons/shop-owner/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["delivery-driver"]}>{renderWithLayout(<ShopOwnerRequestDetails />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/deliverydriver/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={["delivery-driver"]}>{renderWithLayout(<DashBoardDeliveryDriver />)}</RoleRoute></ProtectedRoute>} />

                {/* Provider */}
                <Route path="/provider/courses" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<ProviderCourses />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/courses/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<CourseDetail />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<DashboardProvider />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/payments-history" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}><LayoutProvider><PaymentsHistory /></LayoutProvider></RoleRoute></ProtectedRoute>} />
                <Route path="/provider/prestations" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<ProviderServicesList />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/prestations/nouvelle" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<NouvellePrestationProvider />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/prestations/:id/edit" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<EditPrestation />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/prestations/:id/" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<PrestationDetails />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/demandes" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<ProviderServiceRequests />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/prestations/demandes" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<GererStatusPrestations />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/calendar" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<ProviderCalendar />)}</RoleRoute></ProtectedRoute>} />
                <Route path="/provider/service-requests/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["provider"]}>{renderWithLayout(<ServiceRequestDetails />)}</RoleRoute></ProtectedRoute>} />

            </Routes>
        </Elements>
    );
}

export default App;
