import { useState, useEffect } from "react"

import { HiOutlineUserAdd } from "react-icons/hi"
import { BsClipboardData, BsGrid } from "react-icons/bs"
import { TbChartBar, TbArrowsExchange } from "react-icons/tb"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { FiAward } from "react-icons/fi"
import { IoDownloadOutline, IoSettingsOutline, IoNotificationsOutline, IoWalletOutline } from "react-icons/io5"
import { MdOutlinePendingActions, MdOutlinePaid } from "react-icons/md"
import { GiTwoCoins } from "react-icons/gi"
import { getDashboardDataApi } from "../../api/dashboardApi"

// eslint-disable-next-line react/prop-types
const StatCard = ({ icon, label, value, todayLabel = "TODAY", todayValue }) => (
  <div className="rounded-2xl border border-[#737c7a]/50 bg-[#0a1018] p-6 sm:p-7 flex flex-col justify-between min-h-40 sm:min-h-43.75 shadow-[0_0_30px_rgba(109,119,116,0.35)] transition-all duration-300 hover:bg-linear-to-br hover:from-[#0f2a1f] hover:to-[#0a1a14] hover:border-[#14CA74]/60 cursor-pointer">
    <div className="flex items-start justify-between">
      <div className="w-14 h-14 rounded-xl bg-[#0f1a24] border border-[#1a2a3a] flex items-center justify-center text-[#14CA74] text-2xl">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold tracking-[0.15em]  uppercase">{todayLabel}</p>
        <p className="text-[18px] sm:text-[20px] font-bold text-[#14CA74] mt-1">{todayValue}</p>
      </div>
    </div>
    <div className="mt-5">
      <p className="text-[12px] font-semibold sm:text-[14px] text-[#6b7f8e] mb-1.5">{label}</p>
      <p className="text-[26px] sm:text-[32px] font-extrabold text-white leading-none tracking-tight">{value}</p>
    </div>
  </div>
)


const cardConfig = [
  { key: "totalUsers", icon: <HiOutlineUserAdd />, label: "Total Users", hasToday: true },
  { key: "totalSwpPurchased", icon: <BsClipboardData />, label: "Total SWP Purchased", prefix: "$", hasToday: true },
  { key: "totalInvested", icon: <BsGrid />, label: "Total Invested", prefix: "$", hasToday: true },
  { key: "totalLevelIncome", icon: <TbChartBar />, label: "Total Level Income", prefix: "$", hasToday: true },
  { key: "totalRoiDistributed", icon: <RiMoneyDollarCircleLine />, label: "Total ROI Distributed", prefix: "$", hasToday: true },
  { key: "totalMultiLevelReward", icon: <TbArrowsExchange />, label: "Total Multi Level Reward", prefix: "$", hasToday: true },
  { key: "totalRankIncome", icon: <FiAward />, label: "Total Rank Income", prefix: "$", hasToday: true },
  { key: "totalPendingWithdrawal", icon: <MdOutlinePendingActions />, label: "Total Pending Withdrawal", prefix: "$" },
  { key: "totalPaidWithdrawal", icon: <MdOutlinePaid />, label: "Total Paid Withdrawal", prefix: "$" },
  { key: "poolFund", icon: <GiTwoCoins />, label: "Pool Fund", prefix: "$" },
  { key: "managementFund", icon: <IoWalletOutline />, label: "Management Fund", prefix: "$" },
  { key: "operationWalletFund", icon: <IoSettingsOutline />, label: "Operation Wallet Fund", prefix: "$" },
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
        {cardConfig.map(({ key, icon, label, prefix, hasToday }) => {
          const rawValue = hasToday ? data?.[key]?.total : data?.[key]
          return (
            <StatCard
              key={key}
              icon={icon}
              label={label}
              value={data ? fmt(rawValue, prefix) : "--"}
              todayValue={data && hasToday ? fmt(data[key]?.today, prefix) : "--"}
            />
          )
        })}
      </div>


    </div>
  )
}

export default DashboardContent
