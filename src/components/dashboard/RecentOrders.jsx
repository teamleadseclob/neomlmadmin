const orders = [
  { id: "#1532", date: "Dec 30, 10:06 AM", status: "Paid", total: "$ 329.40", checked: true },
  { id: "#1531", date: "Dec 29, 2:59 AM", status: "Pending", total: "$ 117.24", checked: false },
  { id: "#1530", date: "Dec 29, 12:54 AM", status: "Pending", total: "$ 52.16", checked: false },
  { id: "#1529", date: "Dec 28, 2:32 PM", status: "Paid", total: "$ 350.52", checked: true },
  { id: "#1528", date: "Dec 27, 2:20 PM", status: "Pending", total: "$ 246.78", checked: false },
  { id: "#1527", date: "Dec 26, 9:48 AM", status: "Paid", total: "$ 64.00", checked: true },
]

const RecentOrders = () => (
  <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-[15px] sm:text-[16px] font-semibold text-white">Recent orders</h3>
      <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#111d2e] border border-[#2d3a4f] text-[11px] sm:text-[12px] text-[#b0bec5] cursor-pointer">
        📅 Jan 2024 <span className="text-[#64748b]">▾</span>
      </span>
    </div>

    {/* Table - Scrollable on small screens */}
    <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="text-[10px] sm:text-[11px] text-[#94a3b8] uppercase tracking-wider">
            <th className="text-left pb-3 font-medium"><span className="flex items-center gap-2">☑ Order</span></th>
            <th className="text-left pb-3 font-medium"><span className="flex items-center gap-1.5">📅 Date</span></th>
            <th className="text-left pb-3 font-medium"><span className="flex items-center gap-1.5">☑ Status</span></th>
            <th className="text-right pb-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-[#2d3a4f]">
              <td className="py-3 sm:py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4.5 h-4.5 rounded flex items-center justify-center text-[10px] ${order.checked ? "bg-[#25c3a3] text-black" : "border border-[#4b5563]"}`}>
                    {order.checked && "✓"}
                  </div>
                  <span className="text-[12px] sm:text-[13px] text-white">{order.id}</span>
                </div>
              </td>
              <td className="py-3 sm:py-3.5 text-[11px] sm:text-[12px] text-[#94a3b8] whitespace-nowrap">{order.date}</td>
              <td className="py-3 sm:py-3.5">
                <span className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-1 rounded ${
                  order.status === "Paid"
                    ? "bg-[#25c3a3]/15 text-[#25c3a3]"
                    : "bg-[#f59e0b]/15 text-[#f59e0b]"
                }`}>
                  • {order.status}
                </span>
              </td>
              <td className="py-3 sm:py-3.5 text-[12px] sm:text-[13px] text-white text-right whitespace-nowrap">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default RecentOrders
