import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, scanId: null });
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

  const confirmDelete = (scanId) => {
    setDeleteModal({ open: true, scanId });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/scan/${deleteModal.scanId}`);
      setScans((prev) => prev.filter((s) => s._id !== deleteModal.scanId));
      setDeleteModal({ open: false, scanId: null });
    } catch (error) {
      console.error("Error deleting scan:", error);
    }
  };

  const toolColor = (tool) => {
    switch (tool?.toLowerCase()) {
      case "nmap":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/40";
      case "nuclei":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/40";
      case "nikto":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/40";
      case "whatweb":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40";
      case "subfinder":
        return "bg-green-500/20 text-green-400 border border-green-500/40";
      case "sslyze":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/40";
    }
  };

  const toolIcon = (tool) => {
    switch (tool?.toLowerCase()) {
      case "nmap":
        return "🔍";
      case "nuclei":
        return "⚡";
      case "nikto":
        return "🕷️";
      case "whatweb":
        return "🌐";
      case "subfinder":
        return "🗺️";
      case "sslyze":
        return "🔒";
      default:
        return "🛠️";
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white items-start">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Scan History</h1>
          <p className="text-gray-400 text-sm">{scans.length} scans total</p>
        </div>

        {scans.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-400">
            No scans found. Start a scan from the Assets page.
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center hover:border-gray-700 transition"
              >
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{toolIcon(scan.scanTool)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-medium">{scan.target}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${toolColor(scan.scanTool)}`}
                      >
                        {scan.scanTool}
                      </span>
                      {scan.scanMode && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300 capitalize">
                          {scan.scanMode}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">
                      {new Date(scan.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
                  >
                    View Report
                  </button>

                  <button
                    onClick={() => confirmDelete(scan._id)}
                    className="bg-red-600/20 hover:bg-red-600/40 border border-red-600/40 text-red-400 px-3 py-2 rounded-lg text-sm transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-4xl text-center mb-4">🗑️</div>
            <h2 className="text-lg font-semibold text-center mb-2">
              Delete Scan?
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              This will permanently delete the scan and all its findings. This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, scanId: null })}
                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
