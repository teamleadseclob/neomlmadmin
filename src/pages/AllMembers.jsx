import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoDownloadOutline, IoSettingsOutline, IoNotificationsOutline, IoEyeOutline, IoEyeOffOutline, IoCloseOutline } from "react-icons/io5"
import { FiSearch, FiChevronLeft, FiChevronRight, FiEdit2 } from "react-icons/fi"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {userlist, blockUser, unblockUser, changePassword, changeEmail, addUsdt, addFund, getUserById } from "../api/membersApi"

const AllMembers = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilter, setShowFilter] = useState(false)
  const [viewMember, setViewMember] = useState(null)
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [showTxnPass, setShowTxnPass] = useState(false)
  const [showEditEmail, setShowEditEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [newLoginPass, setNewLoginPass] = useState("")
  const [confirmLoginPass, setConfirmLoginPass] = useState("")
  const [showNewLoginPass, setShowNewLoginPass] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showAddFund, setShowAddFund] = useState(false)
  const [fundMember, setFundMember] = useState(null)
  const [fundAmount, setFundAmount] = useState("")
  const [fundLoading, setFundLoading] = useState(false)
  const [showAddFundNew, setShowAddFundNew] = useState(false)
  const [fundNewMember, setFundNewMember] = useState(null)
  const [fundNewField, setFundNewField] = useState("walletBalance")
  const [fundNewAmount, setFundNewAmount] = useState("")
  const [fundNewLoading, setFundNewLoading] = useState(false)
  const [viewLoading, setViewLoading] = useState(false)
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
        head: [["#", "User ID", "Name", "Email", "Sponsor ID", "Trading Capital", "Gross Earnings", "Withdrawn", "Status"]],
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
          <table className="w-full min-w-275">
            <thead>
              <tr className="border-b border-[#2d3a4f] bg-[#080d1a]/60">
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">User ID</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Gross Earnings</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Identity</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Activation Package - SWP</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Trading Capital</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Sponsor ID</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Status</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Withdrawn</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold tracking-wider text-[#b0bec5] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-bold text-[#25c3a3]">{m.userId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-semibold text-white">${m.totalGrossEarnings?.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-white truncate max-w-40">{m.name}</p>
                    <p className="text-[11px] text-[#94a3b8] truncate max-w-40">{m.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-semibold text-white">${m.swpBalance?.toLocaleString() || "0"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-semibold text-white">${m.totalInvested?.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] text-[#b0bec5]">{m.sponsorId || "—"}</span>
                  </td>
                  <td className="px-5 py-4">
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
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-semibold text-white">${m.withdrawnAmount?.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setFundMember(m); setShowAddFund(true); setFundAmount("") }} className="px-3 py-1.5 text-[10px] font-bold tracking-wider rounded bg-[#25c3a3]/15 text-[#25c3a3] hover:bg-[#25c3a3]/25 transition-colors cursor-pointer whitespace-nowrap">ADD USDT</button>
                      <button onClick={() => { setFundNewMember(m); setShowAddFundNew(true); setFundNewAmount(""); setFundNewField("walletBalance") }} className="px-3 py-1.5 text-[10px] font-bold tracking-wider rounded bg-[#a78bfa]/15 text-[#a78bfa] hover:bg-[#a78bfa]/25 transition-colors cursor-pointer whitespace-nowrap">ADD FUND</button>
                      <button onClick={() => navigate(`/packages/${m._id}`)} className="px-3 py-1.5 text-[10px] font-bold tracking-wider rounded bg-[#3b82f6]/15 text-[#3b82f6] hover:bg-[#3b82f6]/25 transition-colors cursor-pointer whitespace-nowrap">ZERO PIN</button>
                      <button
                        onClick={async () => {
                          setViewLoading(true)
                          try {
                            const res = await getUserById(m._id)
                            setViewMember(res.data?.data || res.data)
                          } catch {
                            setViewMember(m)
                          } finally {
                            setViewLoading(false)
                            setShowLoginPass(false)
                            setShowTxnPass(false)
                          }
                        }}
                        className="w-8 h-8 rounded-full border border-[#2d3a4f] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#94a3b8] transition-colors cursor-pointer"
                      >
                        <IoEyeOutline className="text-[16px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      {/* Member Details Modal */}
      {viewMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-180 max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111827] border border-[#2d3a4f] p-6 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[18px] font-bold text-white">Member Details</h2>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{viewMember.userId} • Account Overview</p>
              </div>
              <button onClick={() => setViewMember(null)} className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            {/* Core Identity & Auth */}
            <p className="text-[10px] font-bold tracking-widest text-[#25c3a3] uppercase mb-3">Core Identity & Auth</p>

            {/* Row 1: S.No, User ID, Username */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label htmlFor="sno" className="text-[10px] text-[#94a3b8] mb-1 block">S. No</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">1</div>
              </div>
              <div>
                <label htmlFor="userId" className="text-[10px] text-[#94a3b8] mb-1 block">User ID</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">{viewMember.userId}</div>
              </div>
              <div>
                <label htmlFor="username" className="text-[10px] text-[#94a3b8] mb-1 block">Username</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">{viewMember.name?.toLowerCase().replace(/\s/g, "_")}</div>
              </div>
            </div>

            {/* Row 2: Login Password, Email */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="loginPassword" className="text-[10px] text-[#94a3b8] mb-1 block">Login Password</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white flex items-center justify-between">
                  <span>{showLoginPass ? "password123" : "••••••••"}</span>
                  <button onClick={() => setShowLoginPass(!showLoginPass)} className="text-[#94a3b8] hover:text-white cursor-pointer">
                    {showLoginPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-[10px] text-[#94a3b8] mb-1 block">Email (Editable)</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white flex items-center justify-between">
                  <span className="truncate">{viewMember.email}</span>
                  <FiEdit2 onClick={() => setShowEditEmail(true)} className="text-[#25c3a3] shrink-0 cursor-pointer ml-2" />
                </div>
              </div>
            </div>

            {/* Row 3: Full Name, Mobile, User Type */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label htmlFor="fullName" className="text-[10px] text-[#94a3b8] mb-1 block">Full Name</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">{viewMember.name}</div>
              </div>
              <div>
                <label htmlFor="mobile" className="text-[10px] text-[#94a3b8] mb-1 block">Mobile</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">{viewMember.phoneNumber || "—"}</div>
              </div>
              <div>
                <label htmlFor="userType" className="text-[10px] text-[#94a3b8] mb-1 block">User Type</label>
                <div className={`px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] font-semibold ${viewMember.isBlocked ? "text-[#ef4444]" : "text-[#25c3a3]"}`}>● {viewMember.isBlocked ? "BLOCKED" : "ACTIVE"}</div>
              </div>
            </div>

            {/* Row 4: Sponsor ID, Sponsor Name, Trading Capital */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label htmlFor="sponsorId" className="text-[10px] text-[#94a3b8] mb-1 block">Sponsor ID</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">{viewMember.sponsorId || "—"}</div>
              </div>
              <div>
                <label htmlFor="sponsorName" className="text-[10px] text-[#94a3b8] mb-1 block">Sponsor Name</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">System Master</div>
              </div>
              <div>
                <label htmlFor="tradingCapital" className="text-[10px] text-[#94a3b8] mb-1 block">Trading Capital</label>
                <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white">${viewMember.maxInvestmentLimit?.toLocaleString() || "0"}.00</div>
              </div>
            </div>

            {/* Bottom Section: 2 columns */}
            <div className="grid grid-cols-[0.9fr_1.1fr] gap-5 mt-4">
              {/* Left Column: Dates + Country/Team */}
              <div className="flex flex-col justify-between gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="regDate" className="text-[10px] text-[#94a3b8] mb-1 block">Reg. Date</label>
                    <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[12px] text-white">{viewMember.createdAt?.split("T")[0] || "—"}</div>
                  </div>
                  <div>
                    <label htmlFor="activationDate" className="text-[10px] text-[#94a3b8] mb-1 block">Activation Date</label>
                    <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[12px] text-white">{viewMember.updatedAt?.split("T")[0] || "—"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="country" className="text-[10px] text-[#94a3b8] mb-1 block">Country</label>
                    <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[12px] text-white">{viewMember.country || "—"}</div>
                  </div>
                  <div>
                    <label htmlFor="totalTeam" className="text-[10px] text-[#94a3b8] mb-1 block">Total Team</label>
                    <div className="px-3 py-2.5 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[12px] text-white">— Members</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Login Status + Edit Password */}
              <div className="flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-[#0d1321] border border-[#2d3a4f]">
                  <div>
                    <p className="text-[13px] font-semibold text-white">Login Status</p>
                    <p className="text-[10px] text-[#94a3b8]">Toggle member system access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newStatus = viewMember.isBlocked ? "active" : "blocked"
                        handleStatusChange(viewMember._id, newStatus)
                        setViewMember({ ...viewMember, isBlocked: !viewMember.isBlocked })
                      }}
                      className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${
                        !viewMember.isBlocked ? "bg-[#25c3a3]" : "bg-[#374151]"
                      }`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white transition-all ${
                        !viewMember.isBlocked ? "right-0.75" : "left-0.75"
                      }`} />
                    </button>
                    <span className={`text-[11px] font-bold ${!viewMember.isBlocked ? "text-[#25c3a3]" : "text-[#ef4444]"}`}>
                      {viewMember.isBlocked ? "BLOCKED" : "ACTIVE"}
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowEditPassword(true)} className="w-full py-3.5 rounded-xl bg-[#0d1321] border border-[#2d3a4f] text-[12px] font-bold text-white flex items-center justify-center gap-2 hover:bg-[#1a2435] transition-colors cursor-pointer">
                  <FiEdit2 className="text-sm" /> EDIT PASSWORD
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-5 mt-6 pt-4">
              <button onClick={() => setViewMember(null)} className="text-[13px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {showEditPassword && viewMember && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-120 rounded-2xl bg-[#111827] border border-[#2d3a4f] p-6 relative">
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-[18px] font-bold text-white">Change Password</h2>
              <button onClick={() => { setShowEditPassword(false); setNewLoginPass(""); setConfirmLoginPass("") }} className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline className="text-xl" />
              </button>
            </div>
            <p className="text-[12px] text-[#94a3b8] mb-6">Updating security credentials for Member: <span className="text-[#25c3a3] font-semibold">{viewMember.userId}</span></p>

            {/* Login Security */}
            <p className="text-[10px] font-bold tracking-widest text-[#25c3a3] uppercase mb-4 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              Login Security
            </p>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 block">Current Login Password</label>
              <div className="px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-[#94a3b8] flex items-center justify-between">
                <span>••••••••••</span>
                <svg className="w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label htmlFor="New password" className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 block">New Login Password</label>
                <div className="relative">
                  <input
                    type={showNewLoginPass ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newLoginPass}
                    onChange={(e) => setNewLoginPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3] transition-colors pr-10"
                  />
                  <button onClick={() => setShowNewLoginPass(!showNewLoginPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#25c3a3] cursor-pointer">
                    {showNewLoginPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="Confirm new password" className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmLoginPass}
                  onChange={(e) => setConfirmLoginPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3] transition-colors"
                />
              </div>
            </div>

            {/* Password Strength */}
            <div className="mb-6 px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#94a3b8] uppercase">Password Strength</span>
                <span className={`text-[11px] font-bold ${newLoginPass.length >= 8 ? "text-[#25c3a3]" : "text-[#ef4444]"}`}>{newLoginPass.length === 0 ? "" : newLoginPass.length >= 8 ? "STRONG" : "WEAK"}</span>
              </div>
              <p className="text-[10px] text-[#64748b] flex items-center gap-1">
                <span>ⓘ</span> Must be at least 8 characters, include a number and special character.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button onClick={() => { setShowEditPassword(false); setNewLoginPass(""); setConfirmLoginPass("") }} className="text-[13px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button
                disabled={passwordLoading || !newLoginPass || newLoginPass !== confirmLoginPass}
                onClick={async () => {
                  setPasswordLoading(true)
                  try {
                    await changePassword(viewMember._id, newLoginPass)
                    alert("Password updated successfully")
                    setShowEditPassword(false)
                    setNewLoginPass("")
                    setConfirmLoginPass("")
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to update password")
                  } finally {
                    setPasswordLoading(false)
                  }
                }}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#25c3a3] to-[#1da88a] text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >{passwordLoading ? "Updating..." : "Update Password"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fund Modal */}
      {showAddFund && fundMember && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-100 rounded-2xl bg-[#111827] border border-[#2d3a4f] p-6 relative">
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-[18px] font-bold text-white">Add Fund</h2>
              <button onClick={() => setShowAddFund(false)} className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline className="text-xl" />
              </button>
            </div>
            <p className="text-[12px] text-[#94a3b8] mb-6">Adding fund to Member: <span className="text-[#25c3a3] font-semibold">{fundMember.userId}</span></p>

            <div className="mb-6">
              <label htmlFor="Amount"   className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 block">Amount ($)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3] transition-colors"
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button onClick={() => setShowAddFund(false)} className="text-[13px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button
                disabled={fundLoading || !fundAmount || Number(fundAmount) <= 0}
                onClick={async () => {
                  setFundLoading(true)
                  try {
                    await addUsdt(fundMember._id, Number(fundAmount))
                    alert("Fund added successfully")
                    setShowAddFund(false)
                    setFundAmount("")
                    fetchMembers()
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to add fund")
                  } finally {
                    setFundLoading(false)
                  }
                }}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#25c3a3] to-[#1da88a] text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >{fundLoading ? "Processing..." : "Add Fund"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fund (New) Modal */}
      {showAddFundNew && fundNewMember && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-100 rounded-2xl bg-[#111827] border border-[#2d3a4f] p-6 relative">
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-[18px] font-bold text-white">Add Fund</h2>
              <button onClick={() => setShowAddFundNew(false)} className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline className="text-xl" />
              </button>
            </div>
            <p className="text-[12px] text-[#94a3b8] mb-6">Adding fund to Member: <span className="text-[#a78bfa] font-semibold">{fundNewMember.userId}</span></p>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 block">Field</label>
              <select
                value={fundNewField}
                onChange={(e) => setFundNewField(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white outline-none focus:border-[#a78bfa] transition-colors cursor-pointer"
              >
                {["walletBalance", "totalMultiLevelEarned", "totalPoolFundEarned", "totalEarnings", "totalRoiEarned"].map((f) => (
                  <option key={f} value={f} className="bg-[#0d1321]">{f}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 block">Amount ($)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={fundNewAmount}
                onChange={(e) => setFundNewAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#a78bfa] transition-colors"
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button onClick={() => setShowAddFundNew(false)} className="text-[13px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button
                disabled={fundNewLoading || !fundNewAmount || Number(fundNewAmount) <= 0}
                onClick={async () => {
                  setFundNewLoading(true)
                  try {
                    await addFund(fundNewMember._id, fundNewField, Number(fundNewAmount))
                    alert("Fund added successfully")
                    setShowAddFundNew(false)
                    setFundNewAmount("")
                    fetchMembers()
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to add fund")
                  } finally {
                    setFundNewLoading(false)
                  }
                }}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#a78bfa] to-[#7c3aed] text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >{fundNewLoading ? "Processing..." : "Add Fund"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Email Modal */}
      {showEditEmail && viewMember && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-120 rounded-2xl bg-[#111827] border border-[#2d3a4f] p-6 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-[18px] font-bold text-white">Edit Email Address</h2>
              <button onClick={() => { setShowEditEmail(false); setNewEmail(""); setConfirmEmail("") }} className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                <IoCloseOutline className="text-xl" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#25c3a3]/20 text-[#25c3a3]">ID</span>
              <span className="text-[13px] text-[#25c3a3] font-semibold">{viewMember.userId}</span>
            </div>

            {/* Email Configuration */}
            <p className="text-[10px] font-bold tracking-widest text-[#25c3a3] uppercase mb-4 flex items-center gap-1.5">
              <span>@</span> Email Configuration
            </p>

            <div className="mb-4">
              <label htmlFor="current-email" className="text-[12px] font-semibold text-white mb-2 block">Current Email</label>
              <div className="px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-[#94a3b8] flex items-center justify-between">
                <span>{viewMember.email}</span>
                <svg className="w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="new-email" className="text-[12px] font-semibold text-white mb-2 block">New Email Address</label>
              <input
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3] transition-colors"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirm-email" className="text-[12px] font-semibold text-white mb-2 block">Confirm New Email Address</label>
              <input
                type="email"
                placeholder="Repeat new email address"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#2d3a4f] text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3] transition-colors"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button onClick={() => { setShowEditEmail(false); setNewEmail(""); setConfirmEmail("") }} className="text-[13px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button
                disabled={emailLoading || !newEmail || newEmail !== confirmEmail}
                onClick={async () => {
                  setEmailLoading(true)
                  try {
                    await changeEmail(viewMember._id, newEmail)
                    alert("Email updated successfully")
                    setViewMember({ ...viewMember, email: newEmail })
                    setShowEditEmail(false)
                    setNewEmail("")
                    setConfirmEmail("")
                    fetchMembers()
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to update email")
                  } finally {
                    setEmailLoading(false)
                  }
                }}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#25c3a3] to-[#1da88a] text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >{emailLoading ? "Updating..." : "Update Email Address"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllMembers
