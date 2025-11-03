import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../Components/Sidebar";
import DashboardHeader from "../Components/Dashboardheader";
import VulnerabilityChart from "../Components/VulnerabilityChart";
import TargetBarChart from "../Components/TargetBarChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <DashboardHeader />

        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Total Targets</h3>
            <p className="text-3xl font-bold">{stats.totalTargets}</p>
            <p className="text-green-400 text-xs mt-1">+5%</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Verified Assets</h3>
            <p className="text-3xl font-bold">{stats.verifiedAssets}</p>
            <p className="text-green-400 text-xs mt-1">+3%</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Last Scan Date</h3>
            <p className="text-lg font-semibold mt-1">
              {new Date(stats.lastScanDate).toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs">Just now</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Critical Vulnerabilities</h3>
            <p className="text-3xl font-bold text-red-500">
              {stats.criticalVulns}
            </p>
            <p className="text-red-400 text-xs mt-1">+12%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <VulnerabilityChart />
          <TargetBarChart />
        </div>
      </div>
    </div>
  );
}
