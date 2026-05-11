import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { IoTrendingUp } from "react-icons/io5"
import { TbChartBar } from "react-icons/tb"

const data = [
  { label: "12 AM", value: 60 }, { label: "", value: 85 }, { label: "", value: 45 }, { label: "", value: 70 },
  { label: "4 AM", value: 90 }, { label: "", value: 55 }, { label: "", value: 75 }, { label: "", value: 40 },
  { label: "8 AM", value: 95 }, { label: "", value: 60 }, { label: "", value: 80 }, { label: "", value: 50 },
  { label: "12 PM", value: 70 }, { label: "", value: 85 }, { label: "", value: 65 }, { label: "", value: 90 },
  { label: "4 PM", value: 45 }, { label: "", value: 75 }, { label: "", value: 55 }, { label: "", value: 80 },
  { label: "8 PM", value: 60 }, { label: "", value: 40 }, { label: "", value: 70 }, { label: "11 PM", value: 50 },
]

const TotalProfitChart = () => (
  <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-4 sm:p-5 flex flex-col h-full">
    <div>
      <div className="flex items-center gap-2 text-[#64748b] text-[12px] mb-1">
        <TbChartBar className="text-[#25c3a3]" /> Total User
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[20px] sm:text-[24px] font-bold text-white">$144.6K</span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#25c3a3]/15 text-[#25c3a3] flex items-center gap-0.5">
          28.5% <IoTrendingUp className="text-[9px]" />
        </span>
      </div>
    </div>
    <div className="flex-1 mt-3 min-h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={6}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 9 }} interval={3} />
          <Bar dataKey="value" fill="#25c3a3" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
      <span className="text-[11px] text-[#64748b]">Last 12 months</span>
      <span className="text-[11px] text-[#25c3a3] cursor-pointer hover:underline">View report</span>
    </div>
  </div>
)

export default TotalProfitChart
