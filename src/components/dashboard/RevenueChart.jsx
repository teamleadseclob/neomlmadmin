import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { IoTrendingUp } from "react-icons/io5"
import { getRevenueChartApi } from "../../api/dashboardApi"

const CustomTooltip = (props) => {
  const { active, payload, label } = props
  if (active && payload?.length) {
    return (
      <div className="bg-[#0d1321] border border-[#1e293b] rounded-lg px-3 py-2">
        <p className="text-white text-[14px] font-bold">${(payload[0].value / 1000).toFixed(1)}k</p>
        <p className="text-[#64748b] text-[10px]">{label}</p>
      </div>
    )
  }
  return null
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
}

const formatTotal = (val) => {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
  return `$${val}`
}

const RevenueChart = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [chartData, setChartData] = useState([])
  const [totals, setTotals] = useState({ totalEarnings: 0, totalExpense: 0 })

  useEffect(() => {
    getRevenueChartApi(year)
      .then((res) => {
        const d = res.data?.data
        if (d) {
          setChartData(d.monthlyData.map((m) => ({ month: m.monthName, revenue: m.earnings, expenses: m.expense })))
          setTotals(d.totals)
        }
      })
      .catch(console.error)
  }, [year])

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-4 sm:p-5 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-1 gap-3 sm:gap-0">
        <div>
          <p className="text-[12px] sm:text-[13px] text-[#64748b]">Total revenue</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[22px] sm:text-[28px] font-bold text-white">{formatTotal(totals.totalEarnings)}</span>
            {totals.totalEarnings > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#25c3a3]/15 text-[#25c3a3] flex items-center gap-1">
                <IoTrendingUp />
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] text-[#64748b] flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#25c3a3]" />Revenue</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" />Expenses</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-2 py-1 rounded bg-[#111d2e] border border-[#1e293b] text-[#94a3b8] text-[11px] outline-none cursor-pointer"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>📅 Jan {y} - Dec {y}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 min-h-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#25c3a3" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#25c3a3" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2} fill="url(#expenseGrad)" dot={false} />
            <Area type="monotone" dataKey="revenue" stroke="#25c3a3" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueChart
