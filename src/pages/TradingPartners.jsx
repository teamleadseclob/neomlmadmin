import { useState, useEffect } from "react";
import { getMarketInterests, acceptMarketInterest } from "../api/tradingpartners";

const TradingPartners = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(null);
  const [modal, setModal] = useState({ open: false, id: null });
  const [url, setUrl] = useState("");

  const openModal = (id) => setModal({ open: true, id });
  const closeModal = () => { setModal({ open: false, id: null }); setUrl(""); };

  const handleAccept = async () => {
    setAccepting(modal.id);
    try {
      await acceptMarketInterest(modal.id, { url });
      closeModal();
      fetchData(page);
    } catch (err) {
      console.error("Failed to accept:", err);
    } finally {
      setAccepting(null);
    }
  };

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
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Action</th>
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
                      <td className="px-6 py-4">
                        {item.status === "accepted" ? (
                          <span className="px-3 py-1.5 text-[11px] font-semibold rounded-lg    text-green-400">
                            Accepted
                          </span>
                        ) : (
                          <button
                            onClick={() => openModal(item._id)}
                            disabled={accepting === item._id}
                            className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/30 text-[#25c3a3] hover:bg-[#25c3a3]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            {accepting === item._id ? "..." : "Accept"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-[13px] text-gray-500">No data found</td>
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
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 w-full max-w-md shadow-xl">
            <h2 className="text-[16px] font-bold text-white mb-1">Accept Trading Partner</h2>
            <p className="text-[12px] text-gray-400 mb-5">Enter the URL to complete the acceptance.</p>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0f1e] border border-[#1e293b] text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-[#25c3a3] transition-colors"
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-[#0a0f1e] border border-[#1e293b] text-gray-300 hover:bg-[#1a2435] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!url.trim() || accepting === modal.id}
                className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/30 text-[#25c3a3] hover:bg-[#25c3a3]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {accepting === modal.id ? "Accepting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingPartners;
