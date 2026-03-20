import React, { useState } from "react";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const tools = [
  {
    id: "nmap",
    icon: "🔍",
    label: "Nmap",
    desc: "Network port scanner & service detection",
    color: "border-blue-500/40 bg-blue-500/5",
    activeColor: "border-blue-500 bg-blue-500/20",
  },
  {
    id: "nuclei",
    icon: "⚡",
    label: "Nuclei",
    desc: "Vulnerability scanner with 9000+ templates",
    color: "border-purple-500/40 bg-purple-500/5",
    activeColor: "border-purple-500 bg-purple-500/20",
  },
  {
    id: "nikto",
    icon: "🕷️",
    label: "Nikto",
    desc: "Web server vulnerability scanner",
    color: "border-orange-500/40 bg-orange-500/5",
    activeColor: "border-orange-500 bg-orange-500/20",
  },
  {
    id: "whatweb",
    icon: "🌐",
    label: "WhatWeb",
    desc: "Technology fingerprinting & stack detection",
    color: "border-cyan-500/40 bg-cyan-500/5",
    activeColor: "border-cyan-500 bg-cyan-500/20",
  },
  {
    id: "subfinder",
    icon: "🗺️",
    label: "Subfinder",
    desc: "Subdomain discovery & enumeration",
    color: "border-green-500/40 bg-green-500/5",
    activeColor: "border-green-500 bg-green-500/20",
  },
  {
    id: "sslyze",
    icon: "🔒",
    label: "SSLyze",
    desc: "SSL/TLS configuration analyzer",
    color: "border-yellow-500/40 bg-yellow-500/5",
    activeColor: "border-yellow-500 bg-yellow-500/20",
  },
];

const nmapModes = [
  {
    id: "fast",
    icon: "⚡",
    label: "Fast Scan",
    desc: "Quick scan of common ports",
  },
  {
    id: "service",
    icon: "🔬",
    label: "Service Detection",
    desc: "Detect services and versions",
  },
  {
    id: "full",
    icon: "🚀",
    label: "Full Scan",
    desc: "Complete scan of all ports",
  },
];

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}

      <div className="bg-[#0f172a] border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Select Scan Tool
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Choose a tool to scan your target
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-400 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`text-left p-3 rounded-xl border transition ${
                selectedTool === tool.id ? tool.activeColor : tool.color
              } hover:opacity-90`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{tool.icon}</span>
                <span className="font-medium text-white text-sm">
                  {tool.label}
                </span>
                {selectedTool === tool.id && (
                  <span className="ml-auto text-green-400 text-xs">✓</span>
                )}
              </div>
              <p className="text-xs text-gray-400">{tool.desc}</p>
            </button>
          ))}
        </div>

        {/* Nmap Mode Selection */}
        {selectedTool === "nmap" && (
          <div className="border border-gray-700 rounded-xl p-4 mb-4 bg-gray-900/50">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
              🔧 Nmap Scan Mode
            </h4>
            <div className="space-y-2">
              {nmapModes.map((mode) => (
                <label
                  key={mode.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition border ${
                    nmapMode === mode.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    value={mode.id}
                    checked={nmapMode === mode.id}
                    onChange={() => setNmapMode(mode.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-lg">{mode.icon}</span>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {mode.label}
                    </p>
                    <p className="text-xs text-gray-400">{mode.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* No tool selected warning */}
        {!selectedTool && (
          <p className="text-gray-500 text-xs text-center mb-4">
            👆 Select a tool above to continue
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleRunScan}
            disabled={loading || !selectedTool}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? "Starting..."
              : `Run ${selectedTool ? selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1) : "Scan"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanToolModal;
