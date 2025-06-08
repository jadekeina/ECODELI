import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Prix from "./pages/Prix";
import NosEngagements from "./pages/NosEngagements";
import CommentCaMarche from "./pages/CommentCaMarche";
import ExpedierOuRecevoir from "./pages/ExpedierOuRecevoir";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Header />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/prix" element={<Prix />} />
        <Route path="/NosEngagements" element={<NosEngagements />} />
        <Route path="/Comment-ca-marche" element={<CommentCaMarche />} />
        <Route path="/expedier-ou-recevoir" element={<ExpedierOuRecevoir />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
