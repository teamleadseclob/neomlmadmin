import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Desktop users", value: 15624, color: "#25c3a3" },
  { name: "Phone app users", value: 5546, color: "#3b82f6" },
  { name: "Laptop users", value: 2478, color: "#0e7a65" },
]

const UsersByDevice = () => (
  <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-4 sm:p-6 flex flex-col">
    {/* Gauge Donut */}
    <div className="relative w-full flex justify-center">
      <div className="relative w-[220px] sm:w-[280px] h-[135px] sm:h-[170px] overflow-hidden">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={220}
              endAngle={-40}
              innerRadius={75}
              outerRadius={105}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-[28px] sm:text-[38px] font-bold text-white leading-none">23,648</span>
          <span className="text-[11px] sm:text-[13px] text-[#64748b] mt-1">Users by device</span>
        </div>
      </div>
    </div>

    {/* Legend */}
    <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 px-2">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[12px] sm:text-[13px] text-[#94a3b8]">{item.name}</span>
          </div>
          <span className="text-[12px] sm:text-[13px] font-semibold text-white">{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </div>
)

export default UsersByDevice
