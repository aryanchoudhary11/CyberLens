import { useState, useEffect } from "react";
import { Pencil, Trash2, Play, Plus, ShieldCheck } from "lucide-react";
import api from "../api/api";
import Sidebar from "../Components/Sidebar";

export default function Targets() {
  const [targets, setTargets] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [editData, setEditData] = useState({ name: "", ip: "", type: "" });
  const [verifyingId, setVerifyingId] = useState(null);

  const [newTarget, setNewTarget] = useState({
    name: "",
    ip: "",
    type: "web",
  });

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
      (statusFilter === "All" || t.status === statusFilter)
  );

  const indexOfLastTarget = currentPage * targetsPerPage;
  const indexOfFirstTarget = indexOfLastTarget - targetsPerPage;
  const currentTargets = filteredTargets.slice(
    indexOfFirstTarget,
    indexOfLastTarget
  );

  const totalPages = Math.ceil(filteredTargets.length / targetsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
    setEditData({
      name: target.name,
      ip: target.ip,
      type: target.type,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/targets/${editingTarget._id}`, editData);
      setTargets(
        targets.map((t) => (t._id === editingTarget._id ? res.data : t))
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
      // update the target locally using response
      setTargets((prev) =>
        prev.map((t) => (t._id === id ? res.data.target || res.data : t))
      );
      // optionally show message
      console.log("Verify result:", res.data);
    } catch (err) {
      console.error("Verification failed:", err?.response?.data || err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleStartScan = (id) => {
    console.log("Start Scan for:", id);
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Manage Assets</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Add New Asset
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            <select
              className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All</option>
              <option>web</option>
              <option>server</option>
              <option>api</option>
              <option>other</option>
            </select>

            <select
              className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All</option>
              <option>verified</option>
              <option>unverified</option>
              <option>vulnerable</option>
              <option>safe</option>
            </select>
          </div>

          {filteredTargets.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No assets found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-gray-400 text-sm uppercase">
                      <th className="p-4">Asset Name</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTargets.map((t) => (
                      <tr
                        key={t._id}
                        className="border-t border-gray-800 hover:bg-gray-800/60 transition"
                      >
                        <td className="p-4 font-medium">{t.name}</td>
                        <td className="p-4 text-gray-400">{t.ip}</td>
                        <td className="p-4 text-gray-400">{t.type}</td>
                        <td className="p-4 capitalize">
                          {t.status === "verified" && (
                            <span className="text-green-400">● Verified</span>
                          )}
                          {t.status === "unverified" && (
                            <span className="text-red-400">● Unverified</span>
                          )}
                          {t.status === "vulnerable" && (
                            <span className="text-yellow-400">
                              ● Vulnerable
                            </span>
                          )}
                          {t.status === "safe" && (
                            <span className="text-blue-400">● Safe</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-3">
                            {t.status === "unverified" ? (
                              <button
                                className="px-3 py-1 rounded-lg flex items-center gap-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white"
                                onClick={() => handleVerify(t._id)}
                                disabled={verifyingId === t._id}
                              >
                                {verifyingId === t._id ? (
                                  "Verifying..."
                                ) : (
                                  <>
                                    <ShieldCheck size={14} /> Verify Now
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1 rounded-lg flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleStartScan(t._id)}
                              >
                                <Play size={14} /> Start Scan
                              </button>
                            )}

                            <button
                              className="text-yellow-400 hover:text-yellow-300"
                              onClick={() => handleEdit(t)}
                            >
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
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2 text-gray-400">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-full ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-96 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Add New Asset</h3>
            <form onSubmit={handleAddTarget} className="space-y-4">
              <input
                type="text"
                placeholder="Asset Name"
                value={newTarget.name}
                onChange={(e) =>
                  setNewTarget({ ...newTarget, name: e.target.value })
                }
                className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-700 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="IP Address"
                value={newTarget.ip}
                onChange={(e) =>
                  setNewTarget({ ...newTarget, ip: e.target.value })
                }
                className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-700 focus:outline-none"
                required
              />
              <select
                value={newTarget.type}
                onChange={(e) =>
                  setNewTarget({ ...newTarget, type: e.target.value })
                }
                className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-700 focus:outline-none"
              >
                <option value="web">Web</option>
                <option value="server">Server</option>
                <option value="api">API</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-96 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Edit Asset</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <input
                type="text"
                placeholder="Asset Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-700 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="IP Address"
                value={editData.ip}
                onChange={(e) =>
                  setEditData({ ...editData, ip: e.target.value })
                }
                className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-700 focus:outline-none"
                required
              />
              <select
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
                className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-700 focus:outline-none"
              >
                <option value="web">Web</option>
                <option value="server">Server</option>
                <option value="api">API</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTarget(null)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
