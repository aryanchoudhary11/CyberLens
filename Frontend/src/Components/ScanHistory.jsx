import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getScanHistory } from "../api/api";

export default function ScanHistory({ targetId }) {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [targetId]);

  const fetchHistory = async () => {
    try {
      const res = await getScanHistory(targetId);
      setHistory(res.data);
    } catch (error) {
      console.error("Error loading scan history:", error);
    }
  };

  if (history.length === 0) {
    return <div className="text-gray-400 mt-4">No previous scans found.</div>;
  }

  return (
    <div className="mt-6 bg-gray-900 p-5 rounded-xl border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-white">Scan History</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-800">
            <th className="pb-2">Scan Type</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Date</th>
            <th className="pb-2"></th>
          </tr>
        </thead>

        <tbody>
          {history.map((scan) => (
            <tr key={scan._id} className="border-b border-gray-800">
              <td className="py-2 capitalize">{scan.scanType}</td>

              <td
                className={`py-2 ${
                  scan.status === "completed"
                    ? "text-green-400"
                    : scan.status === "running"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {scan.status}
              </td>

              <td className="py-2 text-gray-400">
                {new Date(scan.createdAt).toLocaleString()}
              </td>

              <td>
                <button
                  onClick={() => navigate(`/scan/${scan._id}`)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
