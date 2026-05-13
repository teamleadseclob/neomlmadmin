import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { IoTrendingUp } from "react-icons/io5"

const data = [
  { time: "12 AM", value: 50 },
  { time: "2 AM", value: 30 },
  { time: "4 AM", value: 80 },
  { time: "6 AM", value: 20 },
  { time: "8 AM", value: 120 },
  { time: "10 AM", value: 60 },
  { time: "12 PM", value: 100 },
  { time: "2 PM", value: 40 },
  { time: "4 PM", value: 300 },
  { time: "6 PM", value: 80 },
  { time: "8 PM", value: 150 },
  { time: "10 PM", value: 60 },
  { time: "11 PM", value: 100 },
]

const TotalSessionsChart = () => (
  <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-4 sm:p-5 flex flex-col h-full">
    <div>
      <div className="flex items-center gap-2 text-[#64748b] text-[12px] mb-1">
        <span className="w-2 h-2 rounded-full bg-[#64748b]" /> Total sessions
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[20px] sm:text-[24px] font-bold text-white">400</span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#25c3a3]/15 text-[#25c3a3] flex items-center gap-0.5">
          16.8% <IoTrendingUp className="text-[9px]" />
        </span>
      </div>
    </div>
    <div className="flex-1 mt-3 min-h-30">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal vertical={false} />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#475569", fontSize: 9 }}
            ticks={["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "11 PM"]}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#475569", fontSize: 9 }}
            ticks={[0, 250, 500]}
            domain={[0, 500]}
          />
          <Line type="linear" dataKey="value" stroke="#25c3a3" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
      <div className="flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25c3a3] animate-pulse" />
          <span className="text-[#25c3a3]">Live</span>
        </span>
        <span className="text-[#64748b]">10k visitors</span>
      </div>
      <span className="text-[11px] text-[#25c3a3] cursor-pointer hover:underline">View report</span>
    </div>
  </div>
)

export default TotalSessionsChart
