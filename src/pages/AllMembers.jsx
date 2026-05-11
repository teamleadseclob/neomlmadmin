import { useState, useEffect } from "react"
import { IoDownloadOutline, IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5"
import { FiSearch, FiRefreshCw } from "react-icons/fi"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import {userlist, blockUser, unblockUser } from "../api/membersApi"

const AllMembers = () => {
  const [members, setMembers] = useState([])

  useEffect(() => {
    userlist()
      .then((res) => setMembers(res.data?.data || []))
      .catch(console.error)
  }, [])

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
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] text-[12px] sm:text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer whitespace-nowrap">
            Export data <IoDownloadOutline className="text-base" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Filters & Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2d3a4f] gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-[#2d3a4f] text-[12px] sm:text-[13px] text-[#b0bec5] hover:bg-[#111827] transition-colors cursor-pointer">
              <HiOutlineAdjustmentsHorizontal className="text-base" /> Filter by Status <span className="text-[#64748b]">▾</span>
            </button>
          </div>
          <span className="text-[12px] sm:text-[13px] text-[#94a3b8]">
            Total: <span className="text-white font-semibold">{members.length}</span> members
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
                onChange={async (e) => {
                  const shouldBlock = e.target.value === "blocked";
                  try {
                    await (shouldBlock ? blockUser(m._id) : unblockUser(m._id));
                    setMembers((prev) =>
                      prev.map((u) => u._id === m._id ? { ...u, isBlocked: shouldBlock } : u)
                    );
                  } catch (err) {
                    console.error(err);
                  }
                }}
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

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-[#2d3a4f]/60">
          <p className="text-[11px] sm:text-[12px] text-[#25c3a3] italic">Data updated in real-time.</p>
          <button className="p-2 rounded-lg text-[#64748b] hover:text-white hover:bg-[#111827] transition-colors cursor-pointer">
            <FiRefreshCw className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllMembers
