import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Activity,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    { name: "Targets", icon: <Target size={18} />, path: "/targets" },
    { name: "Scans", icon: <Activity size={18} />, path: "/scans" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-gray-900 text-white flex items-center justify-between px-5 py-3 md:hidden fixed top-0 left-0 right-0 z-40 shadow-md">
        <h1 className="text-xl font-bold text-blue-500">CyberLens</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-blue-400 transition"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky md:top-0 md:h-screen
          top-0 left-0 h-full w-64
          bg-gray-900 border-r border-gray-800
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 ease-in-out
          z-50 flex flex-col justify-between
          p-5 pt-20 md:pt-5
          shrink-0
        `}
      >
        <div>
          {/* Logo */}
          <h1
            onClick={() => navigate("/")}
            className="hidden md:block text-2xl font-bold text-blue-500 mb-8 cursor-pointer hover:text-blue-400 transition"
          >
            CyberLens
          </h1>

          {/* Menu Items */}
          <ul className="space-y-2">
            {menu.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li
                  key={index}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                    ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                        : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                    }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3">
          {/* Settings — now navigates to /settings */}
          <div
            onClick={() => {
              navigate("/settings");
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
              location.pathname === "/settings"
                ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            }`}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
        />
      )}
    </>
  );
}
