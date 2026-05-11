import DashboardContent from "../components/dashboard/DashboardContent"
import RevenueChart from "../components/dashboard/RevenueChart"
import TotalProfitChart from "../components/dashboard/TotalProfitChart"
import TotalSessionsChart from "../components/dashboard/TotalSessionsChart"
import UsersByDevice from "../components/dashboard/UsersByDevice"
import RecentOrders from "../components/dashboard/RecentOrders"
import { IoDownloadOutline } from "react-icons/io5"

const Dashboard = () => (
  <div>
    <DashboardContent />

    {/* Charts Section */}
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-5 mt-10 sm:mt-20">
      <div className="min-h-[350px] sm:min-h-[460px]">
        <RevenueChart />
      </div>
      <div className="h-full">
        <TotalProfitChart />
      </div>
    </div>

    {/* Reports Overview Section */}
    <div className="mt-10 sm:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-white mb-3">Reports overview</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1e293b] text-[12px] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            📅 Select date <span className="text-[#475569]">▾</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-[#1e293b] text-[12px] sm:text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer">
            Export data <IoDownloadOutline className="text-base" />
          </button>
          <button className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#25c3a3] text-[12px] sm:text-[13px] text-white font-medium hover:bg-[#1fa88c] transition-colors cursor-pointer">
            Create report
          </button>
        </div>
      </div>

      <RecentOrders />
    </div>
  </div>
)

export default Dashboard
