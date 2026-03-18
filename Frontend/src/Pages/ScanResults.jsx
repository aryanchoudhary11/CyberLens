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

  const severityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "text-red-500 border-red-500 bg-red-900/20";
      case "high":
        return "text-orange-400 border-orange-400 bg-orange-900/20";
      case "medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-900/20";
      case "low":
        return "text-blue-400 border-blue-400 bg-blue-900/20";
      default:
        return "text-gray-400 border-gray-600 bg-gray-800/20";
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
      <h1 className="text-2xl font-semibold mb-2">Scan Results</h1>

      {/* Scan Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex gap-6 text-sm">
        <p>
          <span className="text-gray-400">Target: </span>
          {scan.target}
        </p>
        <p>
          <span className="text-gray-400">Tool: </span>
          <span className="capitalize">{scan.scanTool}</span>
        </p>
        <p>
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
        </p>
        <p>
          <span className="text-gray-400">Started: </span>
          {new Date(scan.createdAt).toLocaleString()}
        </p>
      </div>

      {/* NMAP RESULTS */}
      {scan.scanTool === "nmap" && scan.status === "completed" && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Open Ports</h2>

          {scan.openPorts?.length === 0 ? (
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

      {/* NUCLEI RESULTS */}
      {scan.scanTool === "nuclei" && scan.status === "completed" && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">
            Vulnerabilities
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({scan.vulnerabilities?.length || 0} found)
            </span>
          </h2>

          {scan.vulnerabilities?.length === 0 ? (
            <p className="text-gray-400">No vulnerabilities detected.</p>
          ) : (
            <div className="space-y-3">
              {scan.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${severityColor(vuln.severity)}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-white">{vuln.name}</p>
                    <span
                      className={`text-xs font-bold uppercase px-2 py-1 rounded border ${severityColor(vuln.severity)}`}
                    >
                      {vuln.severity}
                    </span>
                  </div>

                  {vuln.description && (
                    <p className="text-sm text-gray-300 mb-2">
                      {vuln.description}
                    </p>
                  )}

                  {vuln.templateId && (
                    <p className="text-xs text-gray-400">
                      Template: {vuln.templateId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RUNNING STATE */}
      {scan.status === "running" && (
        <div className="bg-gray-900 border border-yellow-700 rounded-xl p-6 text-yellow-400 text-center">
          ⏳ Scan is still running... This page refreshes every 3 seconds.
        </div>
      )}
    </div>
  );
}
