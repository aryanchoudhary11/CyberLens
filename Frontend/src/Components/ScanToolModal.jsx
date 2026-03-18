import React, { useState } from "react";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const ScanToolModal = ({ isOpen, onClose, targetId }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [nmapMode, setNmapMode] = useState("fast");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const handleRunScan = async () => {
    if (!selectedTool) return;

    try {
      setLoading(true);

      const res = await api.post("/scan/start", {
        targetId,
        tool: selectedTool,
        options: selectedTool === "nmap" ? { mode: nmapMode } : {},
      });

      setToast("Scan started successfully 🚀");

      setTimeout(() => {
        navigate(`/scan/${res.data.scanId}`);
        onClose();
      }, 1200);
    } catch (error) {
      setToast("Failed to start scan ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Select Scan Tool
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tool Selection */}
        <div className="space-y-3">
          {/* Nmap */}
          <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
            <input
              type="radio"
              name="tool"
              value="nmap"
              checked={selectedTool === "nmap"}
              onChange={() => setSelectedTool("nmap")}
              className="accent-blue-600"
            />
            <span className="font-medium text-gray-700">🔎 Nmap</span>
          </label>

          {/* Nuclei */}
          <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
            <input
              type="radio"
              name="tool"
              value="nuclei"
              checked={selectedTool === "nuclei"}
              onChange={() => setSelectedTool("nuclei")}
              className="accent-blue-600"
            />
            <span className="font-medium text-gray-700">🌐 Nuclei</span>
          </label>

          {/* SSL Scan placeholder */}
          <label className="flex items-center space-x-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
            <input type="radio" disabled />
            <span>🔐 SSL Scan (Coming Soon)</span>
          </label>
        </div>

        {/* Nmap Mode Selection */}
        {selectedTool === "nmap" && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">
              Nmap Mode
            </h4>

            <div className="space-y-2">
              {[
                { id: "fast", label: "⚡ Fast Scan" },
                { id: "service", label: "🔍 Service Detection" },
                { id: "full", label: "🚀 Full Scan" },
              ].map((mode) => (
                <label
                  key={mode.id}
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    value={mode.id}
                    checked={nmapMode === mode.id}
                    onChange={() => setNmapMode(mode.id)}
                    className="accent-blue-600"
                  />

                  <span className="text-gray-700">{mode.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleRunScan}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Starting..." : "Run Scan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanToolModal;
