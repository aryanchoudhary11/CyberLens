export default function DashboardHeader() {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="text-gray-400">
          Welcome back, {localStorage.getItem("username") || "Admin"}!
        </p>
      </div>
      <div className="flex gap-3 mt-4 sm:mt-0">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add Target
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Start Scan
        </button>
        <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg">
          View Reports
        </button>
      </div>
    </div>
  );
}
