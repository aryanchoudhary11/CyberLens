import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    { name: "Targets", icon: <Target size={18} />, path: "/targets" },
    { name: "Scans", icon: <Activity size={18} /> },
    { name: "Reports", icon: <FileText size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      <div className="bg-gray-900 text-white flex items-center justify-between px-5 py-3 md:hidden fixed top-0 left-0 right-0 z-40 shadow-md">
        <h1 className="text-xl font-bold text-blue-500">CyberLens</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-blue-400 transition"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col justify-between p-5 pt-20 md:pt-5`}
      >
        <div>
          <h1 className="hidden md:block text-2xl font-bold text-blue-500 mb-8">
            CyberLens
          </h1>

          <ul className="space-y-3">
            {menu.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 text-gray-300 hover:text-blue-400 cursor-pointer transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 md:mt-100">
          <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 cursor-pointer mb-4">
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
        ></div>
      )}
    </>
  );
}
