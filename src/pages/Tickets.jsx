import { useEffect, useState } from "react"
import { getTickets, updateTicket } from "../api/tickets"
import { FiSearch, FiChevronDown, FiEdit3, FiX } from "react-icons/fi"

const statusStyle = {
  open: "text-[#0ea5e9] bg-[#0ea5e9]/10 border border-[#0ea5e9]/30",
  in_progress: "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  resolved: "text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/30",
  closed: "text-gray-400 bg-gray-400/10 border border-gray-400/30",
}

const priorityStyle = {
  high: "text-red-400 bg-red-400/10 border border-red-400/30",
  medium: "text-orange-400 bg-orange-400/10 border border-orange-400/30",
  low: "text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/30",
}

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("All")
  const [error, setError] = useState("")

  useEffect(() => {
    getTickets()
      .then((res) => {
        setTickets(res.data.data)
        setSummary(res.data.summary)
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load tickets"))
      .finally(() => setLoading(false))
  }, [])

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [updateStatus, setUpdateStatus] = useState("")
  const [adminReply, setAdminReply] = useState("")
  const [updating, setUpdating] = useState(false)

  const openModal = (ticket) => {
    setSelectedTicket(ticket)
    setUpdateStatus(ticket.status)
    setAdminReply(ticket.adminReply || "")
  }

  const handleUpdate = async () => {
    if (!updateStatus) return
    setUpdating(true)
    try {
      const payload = { status: updateStatus }
      if (adminReply.trim()) payload.adminReply = adminReply.trim()
      await updateTicket(selectedTicket._id, payload)
      setSelectedTicket(null)
      const res = await getTickets()
      setTickets(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket")
    } finally {
      setUpdating(false)
    }
  }

  const filtered = statusFilter === "All"
    ? tickets
    : tickets.filter((t) => t.status === statusFilter)

  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-white mb-1.5 tracking-tight">Support Tickets</h1>
        <p className="text-[13px] text-gray-300 leading-relaxed">
          Manage and respond to user support requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ["Total", summary.total, "from-[#8b5cf6] to-[#6366f1]"],
          ["Open", summary.open, "from-[#0ea5e9] to-[#06b6d4]"],
          ["In Progress", summary.inProgress, "from-[#f59e0b] to-[#eab308]"],
          ["Resolved", summary.resolved, "from-[#00e396] to-[#10b981]"],
        ].map(([label, count, gradient]) => (
          <div key={label} className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-0.75 bg-linear-to-b ${gradient}`}></div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2 pl-1">{label}</p>
            <p className="text-[26px] font-extrabold text-white tracking-tight pl-1">{count ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or user..."
            className="w-full pl-11 pr-4 py-3.5 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none px-4 py-3.5 pr-9 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[12px] font-semibold text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-[13px] font-semibold text-red-400">{error}</p>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-300 cursor-pointer">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ticket Cards */}
      {loading && (
        <p className="text-center text-gray-400 py-10">Loading...</p>
      )}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-10">No tickets found</p>
      )}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((ticket) => (
            <div key={ticket._id} className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 space-y-4 hover:border-gray-600 transition-colors">

              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-gray-500 uppercase">{ticket.ticketId}</p>
                  <h3 className="text-[15px] font-bold text-white mt-1 truncate">{ticket.subject}</h3>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${priorityStyle[ticket.priority] || ""}`}>
                  {ticket.priority}
                </span>
              </div>

                <p className="text-[12px] text-gray-400 line-clamp-2 leading-relaxed">{ticket.message}</p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${statusStyle[ticket.status] || ""}`}>
                  {ticket.status.replace("_", " ")}
                </span>
                <span className="px-2.5 py-1 rounded text-[10px] font-bold text-gray-400 bg-[#1e293b]/50 border border-[#1e293b]">
                  {ticket.category}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2d3a4f]">
                <div>
                  <p className="text-[12px] font-semibold text-gray-200">{ticket.userId?.name}</p>
                  <p className="text-[10px] text-gray-400">{ticket.userId?.email}</p>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                </p>
              </div>

              {/* Admin Reply */}
              {ticket.adminReply && (
                <div className="bg-[#00e396]/5 border border-[#00e396]/20 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-[#00e396] uppercase tracking-wider mb-1">Admin Reply</p>
                  <p className="text-[12px] text-gray-300">{ticket.adminReply}</p>
                </div>
              )}

              {/* Update Button */}
              <button
                onClick={() => openModal(ticket)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 rounded-lg text-[11px] font-bold text-[#0ea5e9] hover:bg-[#0ea5e9]/20 transition-colors cursor-pointer"
              >
                <FiEdit3 className="w-3.5 h-3.5" /> Update Ticket
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-none" onClick={() => setSelectedTicket(null)} aria-label="Close modal"></button>
          <div className="relative bg-[#0f1522] border border-[#1e293b] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-white">Update {selectedTicket.ticketId}</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="Satatus" className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Status</label>
              <div className="relative">
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="appearance-none w-full px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 focus:outline-none focus:border-gray-600 cursor-pointer"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Admin Reply */}
            <div className="space-y-2">
              <label htmlFor="Admin Reply" className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Admin Reply (optional)</label>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                maxLength={5000}
                rows={4}
                placeholder="Write a reply to the user..."
                className="w-full px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 px-4 py-3 bg-[#00e396] hover:bg-[#00c983] rounded-xl text-[13px] font-bold text-[#0a0f1e] transition-colors cursor-pointer shadow-[0_0_16px_rgba(0,227,150,0.2)] disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tickets
