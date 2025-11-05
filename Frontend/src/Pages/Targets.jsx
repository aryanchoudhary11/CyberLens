import { useState, useEffect } from "react";
import { Pencil, Trash2, Play } from "lucide-react";
import api from "../api/api";
import Sidebar from "../Components/Sidebar";
import DashboardHeader from "../Components/Dashboardheader";

export default function Targets() {
  const [targets, setTargets] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await api.get("/targets");
        setTargets(res.data);
      } catch (error) {
        console.error("Error fetching targets:", error);
      }
    };
    fetchTargets();
  }, []);

  const filteredTargets = targets.filter(
    (t) =>
      (typeFilter === "All" || t.type === typeFilter) &&
      (statusFilter === "All" || t.status === statusFilter)
  );

  const handleDelete = async (id) => {
    try {
      await api.delete(`/targets/${id}`);
      setTargets(targets.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting target:", error);
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <DashboardHeader />

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Manage Assets</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Add New Asset
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <select
              className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Application</option>
              <option>Domain</option>
              <option>IP</option>
            </select>

            <select
              className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Unverified</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-400 text-sm uppercase">
                  <th className="p-4">Asset Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t border-gray-800 hover:bg-gray-800/60 transition"
                  >
                    <td className="p-4 font-medium">{t.name}</td>
                    <td className="p-4 text-gray-400">{t.type}</td>
                    <td className="p-4">
                      {t.status === "Verified" && (
                        <span className="text-green-400">● Verified</span>
                      )}
                      {t.status === "Pending" && (
                        <span className="text-yellow-400">● Pending</span>
                      )}
                      {t.status === "Unverified" && (
                        <span className="text-red-400">● Unverified</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className={`px-3 py-1 rounded-lg flex items-center gap-1 text-sm ${
                            t.status === "Verified"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-700 cursor-not-allowed"
                          }`}
                          disabled={t.status !== "Verified"}
                        >
                          <Play size={14} /> Start Scan
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300">
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400"
                          onClick={() => handleDelete(t._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-2 text-gray-400">
                <button className="px-3 py-1 rounded-full bg-blue-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded-full hover:bg-gray-700">
                  2
                </button>
                <button className="px-3 py-1 rounded-full hover:bg-gray-700">
                  3
                </button>
                <span>...</span>
                <button className="px-3 py-1 rounded-full hover:bg-gray-700">
                  10
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
