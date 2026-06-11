import DashboardContent from "../components/dashboard/DashboardContent"
import RevenueChart from "../components/dashboard/RevenueChart"
import TotalProfitChart from "../components/dashboard/TotalProfitChart"
import RecentOrders from "../components/dashboard/RecentOrders"
import { IoDownloadOutline } from "react-icons/io5"

const Dashboard = () => (
  <div>
    <DashboardContent />

    {/* Charts Section */}
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-5 mt-10 sm:mt-20">
      <div className="min-h-87.5 sm:min-h-115">
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
        
      </div>

      <RecentOrders />
    </div>
  </div>
)

export default Dashboard
