import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./pages/dashboard/Overview";
import Livreurs from "./pages/utilisateurs/livreurs/livreurs";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="ml-64">
      <Header />
      </div>
      <Routes>
        <Route path="/dashboard/overview" element={<DashboardOverview />} />
        <Route path="/utilisateurs/livreurs" element={<Livreurs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;