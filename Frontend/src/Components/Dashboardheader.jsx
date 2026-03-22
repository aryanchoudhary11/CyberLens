export default function DashboardHeader() {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="text-gray-400">
          Welcome back, {localStorage.getItem("username") || "Admin"}!
        </p>
      </div>
    </div>
  );
}
