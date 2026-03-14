import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await api.get("/scan/history");
      setScans(res.data);
    } catch (error) {
      console.error("Error fetching scan history:", error);
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Scan History</h1>

        <div className="space-y-4">
          {scans.map((scan) => (
            <div
              key={scan._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">{scan.target}</h3>

                <p className="text-gray-400 text-sm">{scan.scanType} scan</p>

                <p className="text-gray-500 text-xs mt-1">
                  {new Date(scan.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    scan.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : scan.status === "running"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {scan.status}
                </span>

                <button
                  onClick={() => navigate(`/scan/${scan._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
