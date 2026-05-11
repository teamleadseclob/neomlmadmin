import { useState, useEffect } from "react"
import { IoSettingsOutline, IoNotificationsOutline, IoDownloadOutline } from "react-icons/io5"
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiChevronDown } from "react-icons/fi"
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from "react-icons/hi2"
import { GoShieldCheck } from "react-icons/go"
import { getTransactions } from "../api/membersApi"

const txTypeLabels = {
  roi: "ROI",
  level_commission: "Commission",
  swp_purchase: "SWP Purchase",
  withdrawal: "Withdrawal",
}

const txTypeBadge = {
  roi: "bg-[#25c3a3]/15 text-[#25c3a3] border-[#25c3a3]/20",
  level_commission: "bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/20",
  swp_purchase: "bg-[#0ea5e9]/15 text-[#0ea5e9] border-[#0ea5e9]/20",
  withdrawal: "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/20",
}

const txTypeDot = {
  roi: "bg-[#25c3a3]",
  level_commission: "bg-[#a855f7]",
  swp_purchase: "bg-[#0ea5e9]",
  withdrawal: "bg-[#ef4444]",
}

const typeFilterOptions = [
  { label: "All Types", value: "" },
  { label: "ROI", value: "roi" },
  { label: "Level Commission", value: "level_commission" },
  { label: "SWP Purchase", value: "swp_purchase" },
  { label: "Withdrawal", value: "withdrawal" },
]

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalDocs: 0, limit: 10 })
  const [typeFilter, setTypeFilter] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [search, setSearch] = useState("")

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (typeFilter) params.type = typeFilter
      if (search) params.search = search
      const res = await getTransactions(params)
      setTransactions(res.data.data || [])
      setPagination(res.data.pagination || { page: 1, totalPages: 1, totalDocs: 0, limit: 10 })
    } catch (err) {
      console.error("Failed to fetch transactions", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page, typeFilter])

  const handleTypeChange = (value) => {
    setTypeFilter(value)
    setPage(1)
    setShowTypeDropdown(false)
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  }

  const getPageNumbers = () => {
    const { totalPages } = pagination
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push("dots-start")
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push("dots-end")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-white leading-tight">Transactions</h1>
          <p className="text-[11px] sm:text-[13px] text-[#94a3b8] mt-1">
            Manage and audit your core membership base with high-precision data.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoSettingsOutline className="text-[16px] sm:text-[18px]" />
          </button>
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
            <IoNotificationsOutline className="text-[16px] sm:text-[18px]" />
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] bg-[#0d1321]">
          <FiSearch className="text-[#64748b] text-lg shrink-0" />
          <input
            type="text"
            placeholder="Search by user ID, name, or email..."
            className="bg-transparent text-[13px] text-white placeholder-[#475569] outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTransactions()}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-[#1e293b] text-[12px] sm:text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer whitespace-nowrap">
            Export data <IoDownloadOutline className="text-base" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-5 sm:p-6">
          <p className="text-[10px] sm:text-[11px] text-[#94a3b8] mb-2">Total Transactions</p>
          <span className="text-[26px] sm:text-[30px] font-bold text-white leading-none">{pagination.totalDocs}</span>
          <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#64748b] uppercase mt-2">All Records</p>
        </div>
        <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] text-[#94a3b8] mb-2">Current Page</p>
              <span className="text-[26px] sm:text-[30px] font-bold text-[#25c3a3] leading-none">{pagination.page}</span>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#64748b] uppercase mt-2">of {pagination.totalPages} pages</p>
            </div>
            <HiOutlineArrowTrendingUp className="text-[24px] text-[#25c3a3] mt-1" />
          </div>
        </div>
        <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] text-[#94a3b8] mb-2">Filter Active</p>
              <span className="text-[26px] sm:text-[30px] font-bold text-white leading-none">{typeFilter ? txTypeLabels[typeFilter] : "None"}</span>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#64748b] uppercase mt-2">Type Filter</p>
            </div>
            <HiOutlineArrowTrendingDown className="text-[24px] text-[#ef4444]/60 mt-1" />
          </div>
        </div>
        <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] text-[#94a3b8] mb-2">Per Page</p>
              <span className="text-[26px] sm:text-[30px] font-bold text-white leading-none">{limit}</span>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#64748b] uppercase mt-2">Records</p>
            </div>
            <GoShieldCheck className="text-[24px] text-[#25c3a3] mt-1" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Type Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-[#1e293b] bg-[#0a0f1e] text-[12px] sm:text-[13px] text-[#94a3b8] cursor-pointer hover:bg-[#111827] transition-colors"
            >
              {typeFilter ? txTypeLabels[typeFilter] : "All Types"} <FiChevronDown className="text-sm text-[#475569]" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-[#0d1321] border border-[#1e293b] rounded-xl overflow-hidden min-w-40">
                {typeFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleTypeChange(opt.value)}
                    className={`w-full text-left px-4 py-2.5 text-[12px] hover:bg-[#111827] transition-colors cursor-pointer ${
                      typeFilter === opt.value ? "text-[#25c3a3]" : "text-[#94a3b8]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-3 px-6 py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] text-[#94a3b8] uppercase border-t border-b border-[#2d3a4f] bg-[#080d1a]/60 min-w-212.5">
            <span>Date/Time</span>
            <span>User</span>
            <span>Transaction ID</span>
            <span>Type</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Details</span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <span className="text-[13px] text-[#64748b]">Loading...</span>
            </div>
          )}
          {!loading && transactions.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <span className="text-[13px] text-[#64748b]">No transactions found</span>
            </div>
          )}
          {!loading && transactions.length > 0 &&
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-3 px-6 py-4 sm:py-5 items-center border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors min-w-212.5"
              >
                <span className="text-[11px] sm:text-[12px] text-[#94a3b8] whitespace-nowrap">
                  {formatDate(tx.txDate)}
                </span>

                <div className="flex flex-col">
                  <span className="text-[12px] text-white font-medium">{tx.userId?.name || "-"}</span>
                  <span className="text-[10px] text-[#94a3b8]">{tx.userId?.userId || ""}</span>
                </div>

                <span className="text-[11px] sm:text-[12px] text-[#b0bec5] font-mono truncate">
                  {tx._id.slice(0, 12)}...
                </span>

                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide border ${txTypeBadge[tx.txType] || "bg-[#64748b]/15 text-[#64748b] border-[#64748b]/20"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${txTypeDot[tx.txType] || "bg-[#64748b]"}`} />
                    {txTypeLabels[tx.txType] || tx.txType}
                  </span>
                </div>

                <span className="text-[12px] sm:text-[13px] text-white font-semibold text-right tabular-nums">
                  {tx.txAmount?.toLocaleString()}
                </span>

                <div className="flex justify-center">
                  {tx.txType === "level_commission" && tx.fromUserId && (
                    <span className="text-[10px] text-[#94a3b8]">From: {tx.fromUserId.name}</span>
                  )}
                  {tx.txType === "roi" && (
                    <span className="text-[10px] text-[#94a3b8]">{tx.roiPercentage}% / {tx.daysCalculated}d</span>
                  )}
                  {tx.txType === "swp_purchase" && (
                    <span className="text-[10px] text-[#94a3b8]">{tx.purchaseType}</span>
                  )}
                </div>
              </div>
            ))
          }
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 border-t border-[#2d3a4f]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] sm:text-[11px] text-[#94a3b8]">
              Showing <span className="text-white">{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalDocs)}</span> of <span className="text-white">{pagination.totalDocs}</span> entries
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"
            >
              <FiChevronsLeft className="text-sm" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            {getPageNumbers().map((n) =>
              typeof n === "string" ? (
                <span key={n} className="text-[#475569] text-[12px] px-1">...</span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center cursor-pointer transition-colors ${
                    n === page ? "bg-[#25c3a3] text-white" : "border border-[#1e293b] text-[#64748b] hover:bg-[#111827]"
                  }`}
                >
                  {n}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"
            >
              <FiChevronRight className="text-sm" />
            </button>
            <button
              onClick={() => setPage(pagination.totalPages)}
              disabled={page === pagination.totalPages}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"
            >
              <FiChevronsRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions
