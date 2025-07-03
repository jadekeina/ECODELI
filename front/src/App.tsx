import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

console.log("🌐 API_URL = ", import.meta.env.VITE_API_URL);


   const stripePromise = loadStripe("pk_test_51RgCcfCSsQb1TgL54ywb1mfMDkdW7cHbFpqW02CZxIVBWN4UXMmmqc02RQqPFUwf0KKfJbf4qPX3jKml2ODXRug700BoaMX9CN"); // ta clé publique test ici



// Components
import ProtectedRoute from "./components/ProtectedRoute";
import HeaderPublic from "./components/header";
import HeaderConnected from "./components/HeaderConnected";
import Footer from "./components/Footer";

// Pages publiques
import Home from "./pages/Home";
import Prix from "./pages/Prix";
import NosEngagements from "./pages/NosEngagements";
import CommentCaMarche from "./pages/CommentCaMarche";
import ExpedierOuRecevoir from "./pages/ExpedierOuRecevoir";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Pages privées
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
import RegisterPro from "./pages/RegisterPro";
import Account from "./pages/Account";
import MesPrestations from "./pages/ServicesList";
import MesTrajets from "./pages/Trips";
import History from "./pages/History";
import CreateAnnonce from "./components/CreateAnnonce";
import DeposerContenu from "./pages/DeposerContenu";
import Requests from "./pages/pro/RequestsPublic"
import RequestDetails from "@/pages/pro/RequestDetails";




function App() {

    const { user, loading } = useContext(UserContext);

    // 🔄 On attend que le UserContext ait fini de charger
    if (loading) return <div>Chargement...</div>;

    return (

        <Elements stripe={stripePromise}>
        <Routes>

            {/* 🔓 Pages PUBLIQUES */}
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

            {/* 🔐 Pages PRIVEES */}
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <AppHome />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <Dashboard />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inscription-pro"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <RegisterPro />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/mon-compte"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <Account />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/mes-prestations"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <MesPrestations />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <History />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mes-trajets"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <MesTrajets />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />


            <Route
                path="/deposer-annonce"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <CreateAnnonce />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />


            <Route
                path="/deposer-annonce"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <DeposerContenu />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/annonces"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <Requests />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/requests/:id"
                element={
                    <ProtectedRoute>
                        <>
                            <HeaderConnected />
                            <RequestDetails />
                            <Footer />
                        </>
                    </ProtectedRoute>
                }
            />


        </Routes>
        </Elements>
    );

}

export default App;
