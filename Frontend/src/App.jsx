import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/Dashboard";
import Targets from "./Pages/Targets";
import ScanResults from "./Pages/ScanResults";
import ScanHistoryPage from "./Pages/ScanHistory";
import AIChatbot from "./Components/AIChatbot";
import ContactSupport from "./Pages/ContactPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/targets" element={<Targets />} />
        <Route path="/scan/:id" element={<ScanResults />} />
        <Route path="/scans" element={<ScanHistoryPage />} />
        <Route path="/contact" element={<ContactSupport />} />
      </Routes>
      <AIChatbot />
    </>
  );
}

export default App;
