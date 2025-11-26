import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/Dashboard";
import Targets from "./Pages/Targets";
import EditProfile from "./pages/EditProfile";
import ContactSupport from "./pages/ContactSupport";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/targets" element={<Targets />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/contact-support" element={<ContactSupport />} />
    </Routes>
  );
}

export default App;
