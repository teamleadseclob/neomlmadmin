import { useState, useEffect } from "react"
import { IoDownloadOutline, IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5"
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {userlist, blockUser, unblockUser } from "../api/membersApi"

const AllMembers = () => {
  const [members, setMembers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilter, setShowFilter] = useState(false)
  const limit = 10

  const handleStatusChange = async (memberId, newStatus) => {
    const shouldBlock = newStatus === "blocked"
    try {
      await (shouldBlock ? blockUser(memberId) : unblockUser(memberId))
      setMembers((prev) =>
        prev.map((u) => u._id === memberId ? { ...u, isBlocked: shouldBlock } : u)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMembers = () => {
    const params = { page, limit }
    if (search) params.search = search
    if (statusFilter === "active") params.isBlocked = false
    if (statusFilter === "blocked") params.isBlocked = true
    userlist(params)
      .then((res) => {
        setMembers(res.data?.data || [])
        const pg = res.data?.pagination
        if (pg) {
          setTotalPages(pg.totalPages)
          setTotalDocs(pg.totalDocs)
        }
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchMembers()
  }, [page, search, statusFilter])

  const handleExportPDF = async () => {
    try {
      const params = { page: 1, limit: totalDocs || 10000 }
      if (search) params.search = search
      if (statusFilter === "active") params.isBlocked = false
      if (statusFilter === "blocked") params.isBlocked = true
      const res = await userlist(params)
      const allData = res.data?.data || []
      const doc = new jsPDF("landscape")
      doc.setFontSize(16)
      doc.text("All Members", 14, 20)
      autoTable(doc, {
        startY: 30,
        head: [["#", "User ID", "Name", "Email", "Sponsor ID", "Total Invested", "Gross Earnings", "Withdrawn", "Status"]],
        body: allData.map((m, idx) => [
          idx + 1,
          m.userId || "-",
          m.name || "-",
          m.email || "-",
          m.sponsorId || "-",
          `$${m.totalInvested?.toLocaleString() || "0"}`,
          `$${m.totalGrossEarnings?.toLocaleString() || "0"}`,
          `$${m.withdrawnAmount?.toLocaleString() || "0"}`,
          m.isBlocked ? "Blocked" : "Active",
        ]),
        columnStyles: {
          0: { halign: "center", cellWidth: 12 },
        },
      })
      doc.save("all-members.pdf")
    } catch (err) {
      console.error("Export PDF failed:", err)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-white">All Members</h1>
          <p className="text-[12px] sm:text-[13px] text-[#94a3b8] mt-0.5">Manage and audit your core membership base with high-precision data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoSettingsOutline className="text-lg" />
          </button>
          <button className="p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoNotificationsOutline className="text-lg" />
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] bg-[#0d1321]">
          <FiSearch className="text-[#64748b] text-lg shrink-0" />
          <input
            type="text"
            placeholder="Search members by ID, name or email..."
            className="bg-transparent text-[13px] text-white placeholder-[#475569] outline-none w-full"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] text-[12px] sm:text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer whitespace-nowrap"
          >
            Export data <IoDownloadOutline className="text-base" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2d3a4f] gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-[#2d3a4f] text-[12px] sm:text-[13px] text-[#b0bec5] hover:bg-[#111827] transition-colors cursor-pointer"
            >
              <HiOutlineAdjustmentsHorizontal className="text-base" /> Filter by Status <span className="text-[#64748b]">▾</span>
            </button>
            {showFilter && (
              <div className="absolute top-full left-0 mt-1 z-10 w-40 rounded-lg border border-[#2d3a4f] bg-[#0d1321] shadow-lg overflow-hidden">
                {["all", "active", "blocked"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setPage(1); setShowFilter(false) }}
                    className={`w-full text-left px-4 py-2.5 text-[12px] sm:text-[13px] cursor-pointer transition-colors ${
                      statusFilter === s
                        ? "bg-[#25c3a3]/15 text-[#25c3a3] font-semibold"
                        : "text-[#b0bec5] hover:bg-[#111827]"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-[12px] sm:text-[13px] text-[#94a3b8]">
            Total: <span className="text-white font-semibold">{totalDocs}</span> members
          </span>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_0.8fr_1fr] gap-4 px-6 py-4 text-[12px] font-bold tracking-wider text-[#b0bec5] uppercase border-b border-[#2d3a4f] bg-[#080d1a]/60 min-w-225">
            <span>User ID</span>
            <span>Gross Earnings</span>
            <span>Identity</span>
            <span>Total Invested</span>
            <span>Sponsor ID</span>
            <span>Status</span>
            <span>Withdrawn</span>
          </div>

          {/* Table Rows */}
          {members.map((m) => (
            <div
              key={m._id}
              className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_0.8fr_1fr] gap-4 px-6 py-5 items-center border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors min-w-225"
            >
              <p className="text-[13px] font-bold text-[#25c3a3]">{m.userId}</p>
              <p className="text-[13px] font-semibold text-white">${m.totalGrossEarnings?.toLocaleString()}</p>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{m.name}</p>
                <p className="text-[11px] text-[#94a3b8] truncate">{m.email}</p>
              </div>
              <p className="text-[13px] font-semibold text-white">${m.totalInvested?.toLocaleString()}</p>
              <p className="text-[13px] text-[#b0bec5]">{m.sponsorId || "—"}</p>
              <select
                value={m.isBlocked ? "blocked" : "active"}
                onChange={(e) => handleStatusChange(m._id, e.target.value)}
                className={`text-[11px] font-bold tracking-wider px-3 py-1.5 rounded cursor-pointer outline-none border-none ${
                  m.isBlocked
                    ? "bg-[#ef4444]/15 text-[#ef4444]"
                    : "bg-[#25c3a3]/15 text-[#25c3a3]"
                }`}
              >
                <option value="active" className="bg-[#0d1321] text-[#25c3a3]">ACTIVE</option>
                <option value="blocked" className="bg-[#0d1321] text-[#ef4444]">BLOCKED</option>
              </select>
              <p className="text-[13px] font-semibold text-white">${m.withdrawnAmount?.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 border-t border-[#2d3a4f]/60">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#94a3b8] uppercase">
            Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, totalDocs)} of {totalDocs.toLocaleString()} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#64748b] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-40"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center cursor-pointer transition-colors ${
                  n === page
                    ? "bg-[#25c3a3] text-white"
                    : "border border-[#1e293b] text-[#64748b] hover:bg-[#111827]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#64748b] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-40"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllMembers
