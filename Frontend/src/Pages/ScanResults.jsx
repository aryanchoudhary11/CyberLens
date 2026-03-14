import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../api/api";

export default function ScanResults() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);

  useEffect(() => {
    fetchScan();
    const interval = setInterval(fetchScan, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchScan = async () => {
    try {
      const res = await api.get(`/scan/${id}`);
      setScan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!scan) {
    return (
      <div className="p-10 text-white bg-[#0f172a] min-h-screen">
        Loading scan...
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#0f172a] min-h-screen text-white">
      <h1 className="text-2xl font-semibold mb-6">Scan Results</h1>

      <div className="mb-4">
        <span className="text-gray-400">Status: </span>
        <span
          className={`font-semibold ${
            scan.status === "completed"
              ? "text-green-400"
              : scan.status === "running"
                ? "text-yellow-400"
                : "text-red-400"
          }`}
        >
          {scan.status}
        </span>
      </div>

      {scan.status === "completed" && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Open Ports</h2>

          {scan.openPorts.length === 0 ? (
            <p className="text-gray-400">No open ports found.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="pb-2">Port</th>
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Version</th>
                </tr>
              </thead>
              <tbody>
                {scan.openPorts.map((port, index) => (
                  <tr key={index} className="border-t border-gray-800">
                    <td className="py-2">{port.port}</td>
                    <td>{port.service}</td>
                    <td>{port.version || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
