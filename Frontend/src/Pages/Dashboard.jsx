import Sidebar from "../Components/Sidebar";
import DashboardHeader from "../Components/Dashboardheader";
import VulnerabilityChart from "../Components/VulnerabilityChart";
import TargetBarChart from "../Components/TargetBarChart";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <DashboardHeader />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h4 className="text-sm text-gray-400">Total Targets</h4>
            <p className="text-2xl font-semibold text-white">1,234</p>
            <p className="text-green-500 text-sm">+5%</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h4 className="text-sm text-gray-400">Verified Assets</h4>
            <p className="text-2xl font-semibold text-white">1,120</p>
            <p className="text-green-500 text-sm">+3%</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h4 className="text-sm text-gray-400">Last Scan Date</h4>
            <p className="text-2xl font-semibold text-white">2023-10-27</p>
            <p className="text-gray-500 text-sm">Just now</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
            <h4 className="text-sm text-gray-400">Critical Vulnerabilities</h4>
            <p className="text-2xl font-semibold text-red-500">87</p>
            <p className="text-red-500 text-sm">+12%</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <VulnerabilityChart />
          <TargetBarChart />
        </div>
      </div>
    </div>
  );
}
