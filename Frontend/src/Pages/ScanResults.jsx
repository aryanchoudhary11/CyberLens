import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { generateScanPDF } from "../../utils/generatePDF";

export default function ScanResults() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchScan();
    intervalRef.current = setInterval(() => {
      fetchScan();
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [id]);

  const fetchScan = async () => {
    try {
      const res = await api.get(`/scan/${id}`);
      setScan(res.data);
      if (res.data.status === "completed" || res.data.status === "failed") {
        clearInterval(intervalRef.current);
      }
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

  const severityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-400 border border-red-500";
      case "high":
        return "bg-orange-500/20 text-orange-400 border border-orange-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-400";
      case "low":
        return "bg-blue-500/20 text-blue-400 border border-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-600";
    }
  };

  const sslGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "text-green-400";
      case "B":
        return "text-yellow-400";
      case "C":
        return "text-orange-400";
      default:
        return "text-gray-400";
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
      {/* Title + Download Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Scan Results</h1>
        {scan.status === "completed" && (
          <button
            onClick={() => generateScanPDF(scan)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            ⬇️ Download PDF
          </button>
        )}
      </div>

      {/* Scan Info Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-6 text-sm">
        <p>
          <span className="text-gray-400">Target: </span>
          {scan.target}
        </p>
        <p>
          <span className="text-gray-400">Tool: </span>
          <span className="capitalize font-medium text-cyan-400">
            {scan.scanTool}
          </span>
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
        {scan.status === "completed" && (
          <p>
            <span className="text-gray-400">Finished: </span>
            {new Date(scan.updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* RUNNING */}
      {scan.status === "running" && (
        <div className="bg-gray-900 border border-yellow-700 rounded-xl p-6 text-yellow-400 text-center mb-6">
          ⏳ Scan is still running... Auto-refreshing every 3 seconds.
        </div>
      )}

      {/* FAILED */}
      {scan.status === "failed" && (
        <div className="bg-gray-900 border border-red-700 rounded-xl p-6 text-red-400 text-center mb-6">
          ❌ Scan failed. Please try again.
        </div>
      )}

      {/* COMPLETED */}
      {scan.status === "completed" && (
        <>
          {/* ---- NMAP ---- */}
          {scan.scanTool === "nmap" && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Open Ports
                <span className="ml-2 text-sm text-gray-400">
                  ({scan.openPorts?.length || 0} found)
                </span>
              </h2>
              {scan.openPorts?.length === 0 ? (
                <p className="text-gray-400">No open ports found.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="pb-3">Port</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scan.openPorts.map((port, index) => (
                      <tr key={index} className="border-t border-gray-800">
                        <td className="py-2 text-cyan-400 font-mono">
                          {port.port}
                        </td>
                        <td className="py-2 text-green-400">{port.service}</td>
                        <td className="py-2 text-gray-400">
                          {port.version || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ---- NUCLEI ---- */}
          {scan.scanTool === "nuclei" && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Vulnerabilities
                <span className="ml-2 text-sm text-gray-400">
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
                      {/* Title + Badges */}
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-white flex-1 mr-2">
                          {vuln.name}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {vuln.cvssScore && (
                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded font-mono">
                              CVSS {vuln.cvssScore}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded uppercase font-bold ${severityBadge(vuln.severity)}`}
                          >
                            {vuln.severity}
                          </span>
                        </div>
                      </div>

                      {/* CVE Badge */}
                      {vuln.cveId && (
                        <span className="inline-block text-xs bg-red-900/40 text-red-300 border border-red-700/60 px-2 py-0.5 rounded mb-2 font-mono">
                          🔴 {vuln.cveId}
                        </span>
                      )}

                      {/* Description */}
                      {vuln.description && (
                        <p className="text-sm text-gray-300 mb-2">
                          {vuln.description}
                        </p>
                      )}

                      {/* URL */}
                      {vuln.url && (
                        <p className="text-xs text-cyan-400 mb-1">
                          🔗 {vuln.url}
                        </p>
                      )}

                      {/* Template ID */}
                      {vuln.templateId && (
                        <p className="text-xs text-gray-500 mb-1">
                          Template: {vuln.templateId}
                        </p>
                      )}

                      {/* References */}
                      {vuln.reference?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {vuln.reference.slice(0, 3).map((ref, i) => (
                            <a
                              key={i}
                              href={ref}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-400 hover:underline"
                            >
                              📖 Ref {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- NIKTO ---- */}
          {scan.scanTool === "nikto" && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Nikto Findings
                <span className="ml-2 text-sm text-gray-400">
                  ({scan.vulnerabilities?.length || 0} found)
                </span>
              </h2>
              {scan.vulnerabilities?.length === 0 ? (
                <p className="text-gray-400">No findings detected.</p>
              ) : (
                <div className="space-y-3">
                  {scan.vulnerabilities.map((vuln, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${severityColor(vuln.severity)}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-white flex-1 mr-2">
                          {vuln.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded uppercase font-bold shrink-0 ${severityBadge(vuln.severity)}`}
                        >
                          {vuln.severity}
                        </span>
                      </div>
                      {vuln.url && (
                        <p className="text-xs text-cyan-400 mb-1">
                          🔗 {vuln.url}
                        </p>
                      )}
                      {vuln.reference?.length > 0 && (
                        <a
                          href={vuln.reference[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          📖 Reference
                        </a>
                      )}
                      {vuln.templateId && (
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {vuln.templateId}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- WHATWEB ---- */}
          {scan.scanTool === "whatweb" && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Detected Technologies
                <span className="ml-2 text-sm text-gray-400">
                  ({scan.technologies?.length || 0} found)
                </span>
              </h2>
              {!scan.technologies || scan.technologies.length === 0 ? (
                <p className="text-gray-400">No technologies detected.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {scan.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                    >
                      <p className="font-medium text-cyan-400">{tech.name}</p>
                      {tech.version && (
                        <p className="text-xs text-green-400 mt-1">
                          v{tech.version}
                        </p>
                      )}
                      {tech.category && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {tech.category}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- SUBFINDER ---- */}
          {scan.scanTool === "subfinder" && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Subdomains Discovered
                <span className="ml-2 text-sm text-gray-400">
                  ({scan.subdomains?.length || 0} found)
                </span>
              </h2>
              {!scan.subdomains || scan.subdomains.length === 0 ? (
                <p className="text-gray-400">No subdomains found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
                  {scan.subdomains.map((subdomain, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2"
                    >
                      <span className="text-green-400 text-xs">●</span>
                      <p className="text-sm font-mono text-gray-300 truncate">
                        {subdomain}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- SSLYZE ---- */}
          {scan.scanTool === "sslyze" && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">SSL/TLS Analysis</h2>
              {!scan.sslInfo ||
              !scan.sslInfo.grade ||
              scan.sslInfo.grade === "N/A" ? (
                <p className="text-gray-400">
                  No SSL/TLS detected — target may be HTTP only.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-6xl font-bold ${sslGradeColor(scan.sslInfo.grade)}`}
                    >
                      {scan.sslInfo.grade}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">SSL Grade</p>
                      <p className="text-white">
                        {scan.sslInfo.protocol || "TLS"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400">Issuer</p>
                      <p className="text-white mt-1 break-all">
                        {scan.sslInfo.issuer || "Unknown"}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400">Expiry</p>
                      <p className="text-white mt-1">
                        {scan.sslInfo.expiry
                          ? new Date(scan.sslInfo.expiry).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  {scan.sslInfo.issues?.length > 0 ? (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">
                        Issues Found:
                      </p>
                      <div className="space-y-2">
                        {scan.sslInfo.issues.map((issue, index) => (
                          <div
                            key={index}
                            className="bg-red-900/20 border border-red-700 rounded-lg px-3 py-2 text-red-400 text-sm"
                          >
                            ⚠️ {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-green-400 text-sm">
                      ✅ No SSL/TLS issues found.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
