import { useEffect, useState } from "react"
import { getKycRequests, reviewKyc } from "../api/kyc"
import { FiSearch, FiChevronDown, FiX, FiImage } from "react-icons/fi"

const statusStyle = {
  pending: "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  approved: "text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/30",
  rejected: "text-red-400 bg-red-400/10 border border-red-400/30",
}

const KYC = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [pagination, setPagination] = useState({})
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [imagePreview, setImagePreview] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)

  const fetchData = (page = 1, status = statusFilter) => {
    setLoading(true)
    const filterStatus = status === "All" ? "" : status
    getKycRequests(page, filterStatus)
      .then((res) => {
        setRequests(res.data.data.submissions)
        setPagination(res.data.data.pagination)
        setSummary(res.data.data.summary)
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load KYC requests"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [statusFilter])

  const handleAction = async (id, status) => {
    setUpdating(true)
    try {
      const payload = { status }
      if (status === "rejected" && rejectReason.trim()) payload.rejectionReason = rejectReason.trim()
      await updateKycStatus(id, payload)
      setSelectedRequest(null)
      setRejectReason("")
      fetchData(pagination.page, statusFilter)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update KYC status")
    } finally {
      setUpdating(false)
    }
  }

  const filtered = requests.filter((r) => {
    if (!search) return true
    return r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.userId?.toLowerCase().includes(search.toLowerCase())
  })



  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-white mb-1.5 tracking-tight">KYC Verification</h1>
        <p className="text-[13px] text-gray-300 leading-relaxed">
          Review and manage user KYC verification requests.
        </p>
      </div>



      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: summary.total, color: "text-white", border: "border-[#1e293b]" },
          { label: "Pending", value: summary.pending, color: "text-yellow-400", border: "border-yellow-400/30" },
          { label: "Approved", value: summary.approved, color: "text-[#00e396]", border: "border-[#00e396]/30" },
          { label: "Rejected", value: summary.rejected, color: "text-red-400", border: "border-red-400/30" },
        ].map((card) => (
          <div key={card.label} className={`bg-[#0f1522] border ${card.border} rounded-xl px-5 py-4`}>
            <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">{card.label}</p>
            <p className={`text-[22px] font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or user ID..."
            className="w-full pl-11 pr-4 py-3.5 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value) }}
            className="appearance-none px-4 py-3.5 pr-9 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[12px] font-semibold text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-[13px] font-semibold text-red-400">{error}</p>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-300 cursor-pointer">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KYC Table */}
      {loading && <p className="text-center text-gray-400 py-10">Loading...</p>}
      {!loading && filtered.length === 0 && <p className="text-center text-gray-400 py-10">No KYC requests found</p>}
      {!loading && filtered.length > 0 && (
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="px-5 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">User</th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Document</th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Number</th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Submitted</th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req._id} className="border-b border-[#1e293b]/50 hover:bg-[#1a2435] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-white">{req.userId?.name || "Unknown"}</p>
                      <p className="text-[11px] text-gray-400">{req.userId?.email}</p>
                      <p className="text-[10px] text-gray-500">{req.userId?.userId}</p>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-300 capitalize">{req.documentType}</td>
                    <td className="px-5 py-4 text-[12px] text-gray-300">{req.documentNumber}</td>
                    <td className="px-5 py-4">
                      <select
                        value={req.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value
                          if (newStatus === "rejected") {
                            setRejectModal(req._id)
                            return
                          }
                          try {
                            await reviewKyc(req._id, { status: newStatus })
                            fetchData(pagination.page, statusFilter)
                          } catch (err) {
                            setError(err.response?.data?.message || "Failed to update status")
                          }
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-transparent cursor-pointer focus:outline-none ${statusStyle[req.status] || ""}`}
                      >
                        {req.status === "pending" && <option value="pending">Pending</option>}
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setImagePreview(req.documentImage)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-lg text-[11px] font-bold text-[#8b5cf6] hover:bg-[#8b5cf6]/20 transition-colors cursor-pointer"
                      >
                        <FiImage className="w-3.5 h-3.5" /> View Document
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchData(page)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors ${
                page === pagination.page
                  ? "bg-[#25c3a3] text-white"
                  : "bg-[#0f1522] border border-[#1e293b] text-gray-400 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full h-full border-none" onClick={() => { setRejectModal(null); setRejectReason("") }} aria-label="Close"></button>
          <div className="relative bg-[#0f1522] border border-[#1e293b] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-[16px] font-bold text-white">Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Enter reason for rejection..."
              className="w-full px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason("") }}
                className="flex-1 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!rejectReason.trim()) { setError("Rejection reason is required"); return }
                  try {
                    await reviewKyc(rejectModal, { status: "rejected", rejectionReason: rejectReason.trim() })
                    fetchData(pagination.page, statusFilter)
                  } catch (err) {
                    setError(err.response?.data?.message || "Failed to reject")
                  } finally {
                    setRejectModal(null)
                    setRejectReason("")
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] font-bold text-red-400 hover:bg-red-500/20 cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full h-full border-none" onClick={() => setImagePreview(null)} aria-label="Close"></button>
          <div className="relative max-w-2xl w-full mx-4">
            <button onClick={() => setImagePreview(null)} className="absolute -top-10 right-0 text-gray-400 hover:text-white cursor-pointer">
              <FiX className="w-6 h-6" />
            </button>
            <img src={imagePreview} alt="Document" className="w-full rounded-xl border border-[#1e293b]" />
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-none" onClick={() => setSelectedRequest(null)} aria-label="Close modal"></button>
          <div className="relative bg-[#0f1522] border border-[#1e293b] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-white">KYC Review</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">User</p>
              <p className="text-[14px] font-semibold text-white">{selectedRequest.userId?.name}</p>
              <p className="text-[12px] text-gray-400">{selectedRequest.userId?.email}</p>
              <p className="text-[11px] text-gray-500">{selectedRequest.userId?.userId}</p>
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Document Type</p>
                <p className="text-[13px] text-gray-300 capitalize mt-1">{selectedRequest.documentType}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Document Number</p>
                <p className="text-[13px] text-gray-300 mt-1">{selectedRequest.documentNumber}</p>
              </div>
            </div>

            {/* Document Image */}
            {selectedRequest.documentImage && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Document Image</p>
                <img src={selectedRequest.documentImage} alt="Document" className="w-full rounded-lg border border-[#1e293b]" />
              </div>
            )}

            {/* Reject Reason Input */}
            {selectedRequest.status === "pending" && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Rejection Reason (optional)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Reason for rejection..."
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            {selectedRequest.status === "pending" && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(selectedRequest._id, "rejected")}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] font-bold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {updating ? "..." : "Reject"}
                </button>
                <button
                  onClick={() => handleAction(selectedRequest._id, "approved")}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-[#00e396] hover:bg-[#00c983] rounded-xl text-[13px] font-bold text-[#0a0f1e] transition-colors cursor-pointer shadow-[0_0_16px_rgba(0,227,150,0.2)] disabled:opacity-50"
                >
                  {updating ? "..." : "Approve"}
                </button>
              </div>
            )}

            {selectedRequest.status !== "pending" && (
              <div className="pt-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default KYC
