import { useState, useEffect } from "react"
import { HiOutlineUserAdd } from "react-icons/hi"
import { BsClipboardData, BsGrid } from "react-icons/bs"
import { TbChartBar, TbArrowsExchange } from "react-icons/tb"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { FiAward } from "react-icons/fi"
import { IoDownloadOutline, IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5"
import { getDashboardDataApi } from "../../api/dashboardApi"

const StatCard = ({ icon, label, value, todayLabel = "TODAY", todayValue }) => (
  <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[150px]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[#25c3a3] text-base">{icon}</span>
        <span className="text-[11px] sm:text-[12px] font-bold tracking-wider text-[#b0bec5] uppercase">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded bg-[#25c3a3] text-black">{todayLabel}: {todayValue}</span>
      </div>
    </div>
    <div>
      <p className="text-[20px] sm:text-[26px] font-bold text-white mt-3">{value}</p>
    </div>
  </div>
)


const cardConfig = [
  { key: "totalUsers", icon: <HiOutlineUserAdd />, label: "Total Users" },
  { key: "totalSwpPurchased", icon: <BsClipboardData />, label: "Total SWP Purchased", prefix: "$" },
  { key: "totalInvested", icon: <BsGrid />, label: "Total Invested", prefix: "$" },
  { key: "totalLevelIncome", icon: <TbChartBar />, label: "Total Level Income", prefix: "$" },
  { key: "totalRoiDistributed", icon: <RiMoneyDollarCircleLine />, label: "Total ROI Distributed", prefix: "$" },
  { key: "totalMultiLevelReward", icon: <TbArrowsExchange />, label: "Total Multi Level Reward", prefix: "$" },
  { key: "totalRankIncome", icon: <FiAward />, label: "Total Rank Income", prefix: "$" },
]

const fmt = (val, prefix = "") => `${prefix}${Number(val).toLocaleString()}`

const DashboardContent = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    getDashboardDataApi()
      .then((res) => setData(res.data?.data))
      .catch(console.error)
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-white">Welcome back, John</h1>
          <p className="text-[12px] sm:text-[13px] text-[#94a3b8] mt-0.5">Measure your advertising ROI and report website traffic.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-[#1e293b] text-[12px] sm:text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer">
            Export data <IoDownloadOutline className="text-base" />
          </button>
          <button className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#25c3a3] text-[12px] sm:text-[13px] text-white font-medium hover:bg-[#1fa88c] transition-colors cursor-pointer">
            Create report
          </button>
          <button className="p-2 sm:p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoSettingsOutline className="text-lg" />
          </button>
          <button className="p-2 sm:p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoNotificationsOutline className="text-lg" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
        {cardConfig.map(({ key, icon, label, prefix }) => (
          <StatCard
            key={key}
            icon={icon}
            label={label}
            value={data ? fmt(data[key]?.total, prefix) : "--"}
            todayValue={data ? fmt(data[key]?.today, prefix) : "--"}
          />
        ))}
      </div>


    </div>
  )
}

export default DashboardContent
