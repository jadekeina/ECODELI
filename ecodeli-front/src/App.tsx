import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import BecomeCourier from "./pages/BecomeCourier";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/comment-ca-marche" element={<HowItWorks />} />
        <Route path="/devenir-livreur" element={<BecomeCourier />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
