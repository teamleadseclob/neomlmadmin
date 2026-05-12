import { useEffect, useState } from "react";
import { recentorders } from "../../api/dashboardApi";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    recentorders()
      .then((res) => setOrders(res.data?.data || []))
      .catch((err) => console.error("Failed to fetch recent orders:", err));
  }, []);

  return (
    <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-white">Recent orders</h3>
      
      </div>

      {/* Table - Scrollable on small screens */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-[10px] sm:text-[11px] text-[#94a3b8] uppercase tracking-wider">
              <th className="text-left pb-3 font-medium w-[30%]"><span className="flex items-center gap-2">☑ User</span></th>
              <th className="text-left pb-3 font-medium w-[30%]"><span className="flex items-center gap-1.5">📅 Date</span></th>
              <th className="text-center pb-3 font-medium w-[20%]"><span className="flex items-center justify-center gap-1.5">☑ Type</span></th>
              <th className="text-right pb-3 font-medium w-[20%]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-[#2d3a4f]">
                <td className="py-3 sm:py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4.5 h-4.5 rounded flex items-center justify-center text-[10px] bg-[#25c3a3] text-black">
                      ✓
                    </div>
                    <span className="text-[12px] sm:text-[13px] text-white">{order.userId?.name}</span>
                  </div>
                </td>
                <td className="py-3 sm:py-3.5 text-[11px] sm:text-[12px] text-[#94a3b8] whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
                  {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                </td>
                <td className="py-3 sm:py-3.5 text-center">
                  <span className="text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-1 rounded bg-[#25c3a3]/15 text-[#25c3a3]">
                    • {order.purchaseType}
                  </span>
                </td>
                <td className="py-3 sm:py-3.5 text-[12px] sm:text-[13px] text-white text-right whitespace-nowrap">$ {order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
