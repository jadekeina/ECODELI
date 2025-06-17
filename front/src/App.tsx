// ROUTEUR COMPLET AVEC PAGES PUBLIQUES & PRIVEES
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Headers
import HeaderPublic from "./components/header";
import HeaderConnected from "./components/HeaderConnected";

// FOOTER
import Footer from "./components/Footer";

// PAGES PUBLIQUES
import Home from "./pages/Home";
import Prix from "./pages/Prix";
import NosEngagements from "./pages/NosEngagements";
import CommentCaMarche from "./pages/CommentCaMarche";
import ExpedierOuRecevoir from "./pages/ExpedierOuRecevoir";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// PAGES PRIVEES
import AppHome from "./pages/AppHome"; // page d'accueil connectee
import Dashboard from "./pages/Dashboard"; // menu Mon compte

function App() {
    return (
        <Routes>

            {/* 🔓 Pages PUBLIQUES avec HeaderPublic + Footer */}
            <Route path="/" element={<><HeaderPublic /><Home /><Footer /></>} />
            <Route path="/prix" element={<><HeaderPublic /><Prix /><Footer /></>} />
            <Route path="/NosEngagements" element={<><HeaderPublic /><NosEngagements /><Footer /></>} />
            <Route path="/Comment-ca-marche" element={<><HeaderPublic /><CommentCaMarche /><Footer /></>} />
            <Route path="/expedier-ou-recevoir" element={<><HeaderPublic /><ExpedierOuRecevoir /><Footer /></>} />
            <Route path="/contact" element={<><HeaderPublic /><Contact /><Footer /></>} />
            <Route path="/connexion" element={<><HeaderPublic /><Login /><Footer /></>} />
            <Route path="/inscription" element={<><HeaderPublic /><Register /><Footer /></>} />

            {/* 🔐 Pages PRIVEES - accessibles uniquement avec token */}
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
        </Routes>
    );
}

export default App;
