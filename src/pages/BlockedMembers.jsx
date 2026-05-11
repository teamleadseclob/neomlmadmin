import { useState, useEffect } from "react"
import { IoSettingsOutline, IoNotificationsOutline, IoDownloadOutline } from "react-icons/io5"
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { RiShieldKeyholeLine } from "react-icons/ri"
import { HiOutlineUser } from "react-icons/hi"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { userlist, unblockUser } from "../api/membersApi"

/* ── mini sparkline data ── */
const sparkData = [
  { v: 20 }, { v: 35 }, { v: 55 }, { v: 45 }, { v: 70 },
  { v: 90 }, { v: 60 }, { v: 75 }, { v: 50 }, { v: 40 },
  { v: 30 }, { v: 25 },
]

const BlockedMembers = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [blockedMembers, setBlockedMembers] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const fetchBlocked = () => {
    const params = { isBlocked: true, page, limit }
    if (search) params.search = search
    userlist(params)
      .then((res) => {
        setBlockedMembers(res.data?.data || [])
        setTotalPages(res.data?.totalPages || 1)
        setTotal(res.data?.total || 0)
      })
      .catch(console.error)
  }

  useEffect(() => { fetchBlocked() }, [page, search])

  const handleUnblock = async (id) => {
    try {
      await unblockUser(id)
      fetchBlocked()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      {/* ═══════════ Header ═══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <RiShieldKeyholeLine className="text-[#ef4444] text-[15px]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#ef4444]/80 uppercase">
              Security Protocol
            </span>
          </div>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-white leading-tight">
            Blocked Members
          </h1>
          <p className="text-[11px] sm:text-[13px] text-[#94a3b8] mt-1.5 max-w-[520px] leading-relaxed">
            Restricted access repository. Managed accounts within this directory are currently suspended from
            system interaction due to policy violations or executive overrides.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoSettingsOutline className="text-[16px] sm:text-[18px]" />
          </button>
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoNotificationsOutline className="text-[16px] sm:text-[18px]" />
          </button>
        </div>
      </div>

      {/* ═══════════ Search & Export ═══════════ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] bg-[#0d1321]">
          <FiSearch className="text-[#64748b] text-lg flex-shrink-0" />
          <input
            type="text"
            placeholder="Global search for members, IDs, or transactions..."
            className="bg-transparent text-[13px] text-white placeholder-[#475569] outline-none w-full"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] text-[12px] sm:text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer whitespace-nowrap">
          Export data <IoDownloadOutline className="text-base" />
        </button>
      </div>

      {/* ═══════════ Stat Cards ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {/* Currently Restricted */}
        <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-5 sm:p-6 flex items-center justify-between overflow-hidden">
          <div className="flex-shrink-0 z-10">
            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#64748b] uppercase mb-2">
              Currently Restricted
            </p>
            <p className="text-[36px] sm:text-[44px] font-bold text-white leading-none">{total.toLocaleString()}</p>
            <p className="text-[11px] sm:text-[12px] text-[#25c3a3] mt-2 font-semibold">
              +12% <span className="text-[#475569] font-normal">vs Previous Month</span>
            </p>
          </div>
          <div className="w-[130px] sm:w-[160px] h-[80px] sm:h-[100px] flex-shrink-0 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id="restrictedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#restrictedGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Common Reason */}
        <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-5 sm:p-6">
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#64748b] uppercase mb-2">
            Most Common Reason
          </p>
          <p className="text-[22px] sm:text-[26px] font-bold text-[#25c3a3] leading-tight">API Abuse</p>
          <div className="mt-4 sm:mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-[12px] text-[#64748b]">Policy Violation</span>
              <span className="text-[11px] sm:text-[12px] text-white font-semibold">42%</span>
            </div>
            <div className="w-full h-[6px] rounded-full bg-[#1e293b] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#25c3a3] to-[#10b981]"
                style={{ width: "42%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ Table Section ═══════════ */}
      <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
          {[
            { key: "all", label: "All Status" },
            { key: "7d", label: "7 Days" },
            { key: "30d", label: "30 Days" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-[12px] font-semibold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#25c3a3] text-white"
                  : "text-[#64748b] hover:text-white hover:bg-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[0.8fr_1.1fr_1fr_1.2fr_0.8fr] gap-4 px-6 py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] text-[#94a3b8] uppercase border-t border-b border-[#2d3a4f] bg-[#080d1a]/60 min-w-[700px]">
            <span>User ID</span>
            <span>Member Entity</span>
            <span>Email</span>
            <span>Sponsor ID</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Rows */}
          {blockedMembers.map((member) => (
            <div
              key={member._id}
              className="grid grid-cols-[0.8fr_1.1fr_1fr_1.2fr_0.8fr] gap-4 px-6 py-4 sm:py-5 items-center border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors min-w-[700px]"
            >
              <span className="text-[12px] sm:text-[13px] text-[#b0bec5] font-medium">
                {member.userId}
              </span>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#111d2e] border border-[#1e293b] flex items-center justify-center text-[#25c3a3] flex-shrink-0">
                  <HiOutlineUser className="text-[14px] sm:text-[16px]" />
                </div>
                <span className="text-[12px] sm:text-[13px] font-semibold text-white">{member.name}</span>
              </div>

              <span className="text-[12px] sm:text-[13px] text-[#94a3b8] truncate">{member.email}</span>

              <span className="text-[12px] sm:text-[13px] text-[#b0bec5]">{member.sponsorId || "—"}</span>

              <div className="flex justify-center">
                <button
                  onClick={() => handleUnblock(member._id)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#25c3a3]/15 border border-[#25c3a3]/25 text-[10px] sm:text-[11px] font-bold tracking-wider text-[#25c3a3] uppercase hover:bg-[#25c3a3]/25 transition-colors cursor-pointer"
                >
                  Reactivate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 border-t border-[#2d3a4f]/60">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] text-[#94a3b8] uppercase">
            Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total.toLocaleString()} entries
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

export default BlockedMembers
