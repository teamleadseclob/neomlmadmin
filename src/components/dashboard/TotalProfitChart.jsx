import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { TbChartBar } from "react-icons/tb"
import { getusercharts } from "../../api/dashboardApi"

const TotalProfitChart = () => {
  const [chartData, setChartData] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [monthLabel, setMonthLabel] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getusercharts(30)
        const { totalJoined, dailyData } = res.data.data
        setChartData(dailyData.map((item, i) => ({ label: i + 1, value: item.count })))
        setTotalUsers(totalJoined)
        const months = [...new Set(dailyData.map((item) => new Date(item.date).toLocaleString("default", { month: "short" })))]
        setMonthLabel(months.join(" - "))
      } catch (err) {
        console.error("Failed to fetch user chart data:", err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-4 sm:p-5 flex flex-col h-full">
      <div>
        <div className="flex items-center gap-2 text-[#64748b] text-[12px] mb-1">
          <TbChartBar className="text-[#25c3a3]" /> Total User
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[20px] sm:text-[24px] font-bold text-white">{totalUsers}</span>
        </div>
      </div>
      <div className="flex-1 mt-3 min-h-30">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={6}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 9 }} />
            <Bar dataKey="value" fill="#25c3a3" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
        <span className="text-[11px] text-[#64748b]">{monthLabel || "Last 30 days"}</span>
        <span className="text-[11px] text-[#25c3a3] cursor-pointer hover:underline">View report</span>
      </div>
    </div>
  )
}

export default TotalProfitChart
