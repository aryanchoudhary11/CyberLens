export default function TargetBarChart({ vulnsByTarget }) {
  const targets = vulnsByTarget || [];
  const maxCount = Math.max(...targets.map((t) => t.count), 1);

  return (
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl w-full lg:w-1/2">
      <h3 className="text-lg text-white mb-4">Vulnerabilities by Target</h3>
      {targets.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No vulnerability data yet.
        </p>
      ) : (
        <div className="space-y-4">
          {targets.map((t, index) => (
            <div key={index}>
              <div className="flex justify-between text-gray-300 text-sm mb-1">
                <span className="truncate max-w-[70%]">{t._id}</span>
                <span className="text-gray-400">{t.count} vulns</span>
              </div>
              <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(t.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
