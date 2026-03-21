import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../Components/Sidebar";
import DashboardHeader from "../Components/Dashboardheader";
import VulnerabilityChart from "../Components/VulnerabilityChart";
import TargetBarChart from "../Components/TargetBarChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      <div className="flex bg-[#0f172a] min-h-screen items-center justify-center text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  const toolColors = {
    nmap: "bg-blue-500/20 text-blue-400",
    nuclei: "bg-purple-500/20 text-purple-400",
    nikto: "bg-orange-500/20 text-orange-400",
    whatweb: "bg-cyan-500/20 text-cyan-400",
    subfinder: "bg-green-500/20 text-green-400",
    sslyze: "bg-yellow-500/20 text-yellow-400",
  };

  const toolIcons = {
    nmap: "🔍",
    nuclei: "⚡",
    nikto: "🕷️",
    whatweb: "🌐",
    subfinder: "🗺️",
    sslyze: "🔒",
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white items-start">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Total Targets</h3>
            <p className="text-3xl font-bold mt-1">{stats.totalTargets}</p>
            <p className="text-gray-500 text-xs mt-1">Assets in system</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Verified Assets</h3>
            <p className="text-3xl font-bold mt-1 text-green-400">
              {stats.verifiedAssets}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {stats.totalTargets > 0
                ? `${Math.round((stats.verifiedAssets / stats.totalTargets) * 100)}% verified`
                : "No targets yet"}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Total Scans</h3>
            <p className="text-3xl font-bold mt-1 text-blue-400">
              {stats.totalScans}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {stats.lastScanDate
                ? `Last: ${new Date(stats.lastScanDate).toLocaleDateString()}`
                : "No scans yet"}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-sm text-gray-400">Critical Vulnerabilities</h3>
            <p className="text-3xl font-bold mt-1 text-red-500">
              {stats.criticalVulns}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Requires immediate attention
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <VulnerabilityChart vulnerabilities={stats.vulnerabilities} />
          <TargetBarChart vulnsByTarget={stats.vulnsByTarget} />
        </div>

        {/* Scans by Tool + Recent Scans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scans by Tool */}
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-lg text-white mb-4">Scans by Tool</h3>
            {stats.scansByTool?.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No scans yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.scansByTool?.map((tool, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{toolIcons[tool._id] || "🛠️"}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded capitalize font-medium ${toolColors[tool._id] || "bg-gray-700 text-gray-300"}`}
                      >
                        {tool._id}
                      </span>
                    </div>
                    <span className="text-white font-semibold">
                      {tool.count} scans
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Scans */}
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h3 className="text-lg text-white mb-4">Recent Scans</h3>
            {stats.recentScans?.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No scans yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentScans?.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {scan.target}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(scan.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded capitalize ${toolColors[scan.scanTool] || "bg-gray-700 text-gray-300"}`}
                      >
                        {toolIcons[scan.scanTool]} {scan.scanTool}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          scan.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : scan.status === "running"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {scan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
