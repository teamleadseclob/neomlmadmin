import React, { useState, useEffect } from 'react';
import {
  FiSettings, FiBell, FiSearch, FiDownload, FiCalendar,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiArrowUpRight,
  FiFilter, FiPrinter, FiCheck, FiX
} from 'react-icons/fi';
import { BsFiletypePdf } from 'react-icons/bs';
import { getWithdrawals, approveWithdrawal, rejectWithdrawal, bulkApproveWithdrawals } from '../api/withdrawals';

const Withdrawals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [walletFilter, setWalletFilter] = useState('All Wallets');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [pagination, setPagination] = useState({ totalDocs: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchWithdrawals = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter !== 'All Statuses') params.status = statusFilter.toLowerCase();
      const res = await getWithdrawals(params);
      setWithdrawalData(res.data.data || []);
      setPagination(res.data.pagination || { totalDocs: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(currentPage);
  }, [currentPage, statusFilter]);

  const handleApprove = async (id) => {
    if (!globalThis.confirm('Are you sure you want to approve this withdrawal?')) return;
    try {
      await approveWithdrawal(id);
      fetchWithdrawals(currentPage);
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (id) => {
    const reason = globalThis.prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await rejectWithdrawal(id, reason);
      fetchWithdrawals(currentPage);
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const pendingIds = withdrawalData.filter(r => r.status === 'pending').map(r => r._id);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (pendingIds.every(id => selectedIds.includes(id))) {
      setSelectedIds(prev => prev.filter(id => !pendingIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pendingIds])]);
    }
  };

  const handleBulkApprove = async () => {
    setBulkLoading(true);
    try {
      await bulkApproveWithdrawals(selectedIds);
      setSelectedIds([]);
      setShowBulkModal(false);
      fetchWithdrawals(currentPage);
    } catch (err) {
      console.error('Bulk approve failed:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30';
      case 'failed': return 'text-orange-400 bg-orange-400/10 border border-orange-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/10 border border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border border-gray-400/30';
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1.5 tracking-tight">Withdrawal History</h1>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            Monitoring global asset outflows and security verification.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <button className="p-2.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer">
            <FiSettings className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer relative">
            <FiBell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Global search for members, IDs, or transactions..."
            className="w-full pl-11 pr-4 py-3.5 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-5 py-3 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] transition-colors cursor-pointer">
            Export data
            <FiDownload className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#00e396] hover:bg-[#00c983] rounded-xl text-[13px] font-bold text-[#0a0f1e] transition-colors cursor-pointer shadow-[0_0_16px_rgba(0,227,150,0.2)]">
            Create report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Lifetime Paid */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-linear-to-b from-[#00e396] to-[#0ea5e9]"></div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-3 pl-1">Lifetime Paid</p>
          <p className="text-[26px] font-extrabold text-white tracking-tight mb-2 pl-1">$14,290,551.42</p>
          <p className="flex items-center text-[11px] font-bold text-[#00e396] pl-1">
            <FiArrowUpRight className="mr-0.5 w-3.5 h-3.5" /> +12.5% this month
          </p>
        </div>

        {/* Cancelled Total */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-3">Cancelled Total</p>
          <p className="text-[26px] font-extrabold text-white tracking-tight mb-2">$248,310.00</p>
          <p className="text-[11px] text-gray-500 font-medium">1.7% of total volume</p>
        </div>

        {/* Historical Success Rate */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 border-t-2 border-t-[#00e396]">
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-3">Historical Success Rate</p>
          <p className="text-[26px] font-extrabold text-white tracking-tight mb-3">98.42%</p>
          {/* Progress bar */}
          <div className="w-full h-0.75 bg-[#1e293b] rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-[#0ea5e9] to-[#00e396] rounded-full" style={{ width: '98.42%' }}></div>
          </div>
        </div>

        {/* Avg. Processing Time */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-3">Avg. Processing Time</p>
          <p className="text-[26px] font-extrabold text-white tracking-tight mb-2">14.2 Min</p>
          <p className="text-[11px] text-[#00e396] font-medium">Optimized: -2.4m today</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase">Date Range</p>
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[12px] font-semibold text-gray-300 hover:border-gray-600 transition-colors cursor-pointer">
            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
            Oct 01, 2023 - Oct 31, 2023
          </button>
        </div>

        {/* Wallet Source */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase">Wallet Source</p>
          <div className="relative">
            <select
              value={walletFilter}
              onChange={e => setWalletFilter(e.target.value)}
              className="appearance-none w-full px-4 py-2.5 pr-9 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[12px] font-semibold text-gray-300 hover:border-gray-600 transition-colors cursor-pointer focus:outline-none"
            >
              <option>All Wallets</option>
              <option>Main</option>
              <option>Reward</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase">Status</p>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none w-full px-4 py-2.5 pr-9 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[12px] font-semibold text-gray-300 hover:border-gray-600 transition-colors cursor-pointer focus:outline-none"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Failed</option>
              <option>Rejected</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex items-end gap-3 self-end md:self-auto mt-2 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
            <BsFiletypePdf className="w-3.5 h-3.5 text-gray-400" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
            <FiFilter className="w-3.5 h-3.5 text-gray-400" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Bulk Approve Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowBulkModal(true)}
          disabled={selectedIds.length === 0}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold transition-colors cursor-pointer ${
            selectedIds.length > 0
              ? 'bg-[#00e396] hover:bg-[#00c983] text-[#0a0f1e] shadow-[0_0_16px_rgba(0,227,150,0.2)]'
              : 'bg-[#1e293b] text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiCheck className="w-4 h-4" />
          Bulk Approve {selectedIds.length > 0 && `(${selectedIds.length})`}
        </button>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setSelectedIds([])}
            className="px-4 py-3 bg-[#0f1522] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] transition-colors cursor-pointer"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-205">
            <thead>
              <tr className="border-b border-[#2d3a4f] bg-[#0a0f1e]/60">
                <th className="text-left px-4 py-5 w-10">
                  {pendingIds.length > 0 && (
                    <input
                      type="checkbox"
                      checked={pendingIds.length > 0 && pendingIds.every(id => selectedIds.includes(id))}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-600 bg-[#0a0f1e] accent-[#00e396] cursor-pointer"
                    />
                  )}
                </th>
                <th className="text-left px-6 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase w-15">S. No</th>
                <th className="text-left px-4 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">User Identity</th>
                <th className="text-left px-4 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">Amount (USDT)</th>
                <th className="text-left px-4 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">Wallet Address</th>
                <th className="text-left px-4 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">Date & Time</th>
                <th className="text-left px-4 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">Status</th>
                <th className="text-right px-6 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="8" className="text-center py-10 text-gray-400">Loading...</td></tr>
              )}
              {!loading && withdrawalData.length === 0 && (
                <tr><td colSpan="8" className="text-center py-10 text-gray-400">No withdrawals found</td></tr>
              )}
              {!loading && withdrawalData.length > 0 &&
                withdrawalData.map((row, idx) => (
                  <tr
                    key={row._id}
                    className="border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors group"
                  >
                    <td className="px-4 py-5">
                      {row.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row._id)}
                          onChange={() => toggleSelect(row._id)}
                          className="w-4 h-4 rounded border-gray-600 bg-[#0a0f1e] accent-[#00e396] cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="px-6 py-5 text-[13px] font-semibold text-gray-300">
                      {String((currentPage - 1) * 10 + idx + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-[13px] font-bold text-white">{row.userId?.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">ID: {row.userId?.userId}</p>
                    </td>
                    <td className="px-4 py-5 text-[14px] font-bold text-white tracking-tight">
                      {row.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-[11px] font-medium text-gray-200">
                        {row.walletAddress ? `${row.walletAddress.slice(0, 6)}...${row.walletAddress.slice(-4)}` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-[12px] font-semibold text-gray-200">
                        {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {new Date(row.createdAt).toLocaleTimeString('en-US', { hour12: false })} UTC
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {row.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(row._id)}
                            className="p-1.5 rounded-md bg-[#00e396]/10 text-[#00e396] hover:bg-[#00e396]/20 transition-colors cursor-pointer"
                            title="Approve"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(row._id)}
                            className="p-1.5 rounded-md bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors cursor-pointer"
                            title="Reject"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
                          <FiPrinter className="w-4.5 h-4.5 inline-block" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#2d3a4f]">
          <p className="text-[12px] text-gray-400 font-medium mb-3 sm:mb-0">
            Showing {withdrawalData.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to {(currentPage - 1) * 10 + withdrawalData.length} of {pagination.totalDocs} transactions
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50 transition-colors cursor-pointer disabled:opacity-30"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(pagination.totalPages, 3) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#00e396] text-[#0a0f1e] shadow-[0_0_10px_rgba(0,227,150,0.3)]'
                    : 'text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

            {pagination.totalPages > 3 && (
              <>
                <span className="text-gray-500 text-xs px-1">...</span>
                <button
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  className={`w-8 h-8 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                    currentPage === pagination.totalPages
                      ? 'bg-[#00e396] text-[#0a0f1e] shadow-[0_0_10px_rgba(0,227,150,0.3)]'
                      : 'text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200'
                  }`}
                >
                  {pagination.totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50 transition-colors cursor-pointer disabled:opacity-30"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Approve Confirmation Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkModal(false)}></div>
          <div className="relative bg-[#0f1522] border border-[#1e293b] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-[#00e396]/10">
              <FiCheck className="w-7 h-7 text-[#00e396]" />
            </div>
            <h3 className="text-[18px] font-bold text-white text-center mb-2">Confirm Bulk Approve</h3>
            <p className="text-[13px] text-gray-400 text-center mb-6">
              You are about to approve <span className="text-white font-bold">{selectedIds.length}</span> pending withdrawal{selectedIds.length > 1 ? 's' : ''}. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                disabled={bulkLoading}
                className="flex-1 px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkApprove}
                disabled={bulkLoading}
                className="flex-1 px-4 py-3 bg-[#00e396] hover:bg-[#00c983] rounded-xl text-[13px] font-bold text-[#0a0f1e] transition-colors cursor-pointer shadow-[0_0_16px_rgba(0,227,150,0.2)] disabled:opacity-50"
              >
                {bulkLoading ? 'Approving...' : 'Yes, Approve All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawals;
