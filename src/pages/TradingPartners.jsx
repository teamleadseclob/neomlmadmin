import { useState, useEffect } from "react";
import { getMarketInterests } from "../api/tradingpartners";

const TradingPartners = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (p) => {
    setLoading(true);
    try {
      const res = await getMarketInterests(p, 20);
      setData(res.data?.data?.entries || []);
      setTotalPages(res.data?.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch market interests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">
      <div>
        <h1 className="text-[26px] font-bold text-white mb-1.5 tracking-tight">Trading Partners</h1>
        <p className="text-[13px] text-gray-400">Market interests and trading partner data</p>
      </div>

      <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] overflow-hidden shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#25c3a3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">#</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">User ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Market Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr key={item._id} className="border-b border-[#1e293b]/50 hover:bg-[#1a2435] transition-colors">
                      <td className="px-6 py-4 text-[13px] text-gray-300">{(page - 1) * 20 + idx + 1}</td>
                      <td className="px-6 py-4 text-[13px] text-[#25c3a3]">{item.userId?.userId || "-"}</td>
                      <td className="px-6 py-4 text-[13px] text-white">{item.userId?.name || "-"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-300">{item.userId?.email || "-"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-300">{item.userId?.phoneNumber || "-"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-300">{item.marketTitle || "-"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-[13px] text-gray-500">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#1e293b]">
            <span className="text-[12px] text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-[#0a0f1e] border border-[#1e293b] text-gray-300 hover:bg-[#1a2435] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-[#0a0f1e] border border-[#1e293b] text-gray-300 hover:bg-[#1a2435] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPartners;
