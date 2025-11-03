export default function TargetBarChart() {
  const targets = [
    { name: "WebApp-Prod", critical: 80, high: 50 },
    { name: "DB-Server-01", critical: 87, high: 60 },
    { name: "API-Gateway", critical: 45, high: 70 },
    { name: "Internal-Tool", critical: 35, high: 55 },
    { name: "Test-Server-03", critical: 20, high: 30 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl w-full sm:w-1/2">
      <h3 className="text-lg text-white mb-4">Vulnerabilities by Target</h3>
      <div className="space-y-4">
        {targets.map((t, index) => (
          <div key={index}>
            <div className="flex justify-between text-gray-300 text-sm mb-1">
              <span>{t.name}</span>
            </div>
            <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-2"
                style={{ width: `${t.critical}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
