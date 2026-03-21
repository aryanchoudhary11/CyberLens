import { useState, useEffect } from "react";
import { Pencil, Trash2, Play, Plus } from "lucide-react";
import api from "../api/api";
import Sidebar from "../Components/Sidebar";
import ScanToolModal from "../Components/ScanToolModal";

export default function Targets() {
  const [targets, setTargets] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [editData, setEditData] = useState({ name: "", ip: "", type: "" });
  const [newTarget, setNewTarget] = useState({ name: "", ip: "", type: "web" });

  const targetsPerPage = 5;

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const res = await api.get("/targets");
      setTargets(res.data);
    } catch (error) {
      console.error("Error fetching targets:", error);
    }
  };

  const filteredTargets = targets.filter(
    (t) =>
      (typeFilter === "All" || t.type === typeFilter) &&
      (statusFilter === "All" || t.status === statusFilter),
  );

  const indexOfLastTarget = currentPage * targetsPerPage;
  const indexOfFirstTarget = indexOfLastTarget - targetsPerPage;
  const currentTargets = filteredTargets.slice(
    indexOfFirstTarget,
    indexOfLastTarget,
  );
  const totalPages = Math.ceil(filteredTargets.length / targetsPerPage);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/targets/${id}`);
      setTargets(targets.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting target:", error);
    }
  };

  const handleAddTarget = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/targets", newTarget);
      setTargets([...targets, res.data]);
      setShowModal(false);
      setNewTarget({ name: "", ip: "", type: "web" });
    } catch (error) {
      console.error("Error adding new target:", error);
    }
  };

  const handleEdit = (target) => {
    setEditingTarget(target);
    setEditData({ name: target.name, ip: target.ip, type: target.type });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/targets/${editingTarget._id}`, editData);
      setTargets(
        targets.map((t) => (t._id === editingTarget._id ? res.data : t)),
      );
      setEditingTarget(null);
    } catch (error) {
      console.error("Error updating target:", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      setVerifyingId(id);
      const res = await api.post(`/targets/${id}/verify`);
      setTargets((prev) =>
        prev.map((t) => (t._id === id ? res.data.target || res.data : t)),
      );
    } catch (err) {
      console.error("Verification failed:", err?.response?.data || err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleStartScan = (id) => {
    setSelectedTargetId(id);
    setShowScanModal(true);
  };

  const riskBadge = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-500/20 text-red-400 border border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
      case "low":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/40";
      default:
        return "bg-gray-700/40 text-gray-400 border border-gray-600";
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white items-start">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Manage Assets</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Asset
            </button>
          </div>

          {filteredTargets.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No assets found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-sm uppercase">
                    <th className="p-4">Asset Name</th>
                    <th className="p-4">IP / Domain</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Risk</th>
                    <th className="p-4">Last Scanned</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentTargets.map((t) => (
                    <tr
                      key={t._id}
                      className="border-t border-gray-800 hover:bg-gray-800/60"
                    >
                      <td className="p-4 font-medium">{t.name}</td>
                      <td className="p-4 text-gray-400 font-mono text-sm">
                        {t.ip}
                      </td>
                      <td className="p-4 text-gray-400 capitalize">{t.type}</td>

                      {/* Status */}
                      <td className="p-4 capitalize">
                        <span
                          className={`${
                            t.status === "verified"
                              ? "text-green-400"
                              : t.status === "unverified"
                                ? "text-red-400"
                                : "text-yellow-400"
                          }`}
                        >
                          ● {t.status}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded capitalize border ${riskBadge(t.riskLevel)}`}
                          >
                            {t.riskLevel || "none"}
                          </span>
                          {t.riskScore > 0 && (
                            <span className="text-xs text-gray-500">
                              ({t.riskScore})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Scanned */}
                      <td className="p-4 text-gray-500 text-xs">
                        {t.lastScanned
                          ? new Date(t.lastScanned).toLocaleDateString()
                          : "Never"}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-3">
                          {t.status === "unverified" ? (
                            <button
                              className="px-3 py-1 rounded-lg flex items-center gap-1 text-sm bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleVerify(t._id)}
                              disabled={verifyingId === t._id}
                            >
                              {verifyingId === t._id
                                ? "Verifying..."
                                : "Verify"}
                            </button>
                          ) : (
                            <button
                              className="px-3 py-1 rounded-lg flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStartScan(t._id)}
                            >
                              <Play size={14} />
                              Start Scan
                            </button>
                          )}
                          <button
                            className="text-yellow-400"
                            onClick={() => handleEdit(t)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="text-red-500"
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
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[400px] border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
            <form onSubmit={handleAddTarget} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Asset Name"
                value={newTarget.name}
                onChange={(e) =>
                  setNewTarget({ ...newTarget, name: e.target.value })
                }
                className="bg-gray-800 p-2 rounded text-white"
                required
              />
              <input
                type="text"
                placeholder="Domain or IP (example: scanme.nmap.org)"
                value={newTarget.ip}
                onChange={(e) =>
                  setNewTarget({ ...newTarget, ip: e.target.value })
                }
                className="bg-gray-800 p-2 rounded text-white"
                required
              />
              <select
                value={newTarget.type}
                onChange={(e) =>
                  setNewTarget({ ...newTarget, type: e.target.value })
                }
                className="bg-gray-800 p-2 rounded text-white"
              >
                <option value="web">Web</option>
                <option value="server">Server</option>
                <option value="network">Network</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {editingTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[400px] border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Asset Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="bg-gray-800 p-2 rounded text-white"
                required
              />
              <input
                type="text"
                placeholder="Domain or IP"
                value={editData.ip}
                onChange={(e) =>
                  setEditData({ ...editData, ip: e.target.value })
                }
                className="bg-gray-800 p-2 rounded text-white"
                required
              />
              <select
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
                className="bg-gray-800 p-2 rounded text-white"
              >
                <option value="web">Web</option>
                <option value="server">Server</option>
                <option value="network">Network</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTarget(null)}
                  className="px-3 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scan Tool Modal */}
      {showScanModal && (
        <ScanToolModal
          isOpen={showScanModal}
          onClose={() => setShowScanModal(false)}
          targetId={selectedTargetId}
        />
      )}
    </div>
  );
}
