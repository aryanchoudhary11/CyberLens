import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Activity,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    { name: "Targets", icon: <Target size={18} /> },
    { name: "Scans", icon: <Activity size={18} /> },
    { name: "Reports", icon: <FileText size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 h-screen p-5 flex flex-col justify-between border-r border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-blue-500 mb-8">CyberLens</h1>
        <ul className="space-y-3">
          {menu.map((item, index) => (
            <li
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className="flex items-center gap-3 text-gray-300 hover:text-blue-400 cursor-pointer transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 cursor-pointer mb-4">
          <Settings size={18} />
          <span>Settings</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          <LogOut className="inline-block mr-2" size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
