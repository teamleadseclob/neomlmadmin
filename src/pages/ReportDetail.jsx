import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiCalendar } from 'react-icons/fi';
import { BsFiletypePdf, BsFiletypeXlsx } from 'react-icons/bs';
import { getReportData } from '../api/report';
import {
  getTransactionsPdf, getTransactionsExcel,
  getSwpPackagesPdf, getSwpPackagesExcel,
  getTradingCapitalProfitPdf, getTradingCapitalProfitExcel,
  getLayeredRewardsPdf, getLayeredRewardsExcel,
  getRankRewardsPdf, getRankRewardsExcel,
  getMultilevelRewardsPdf, getMultilevelRewardsExcel,
  getRoyaltyRewardsPdf, getRoyaltyRewardsExcel,
  getSpecialRewardsPdf, getSpecialRewardsExcel,
  getPoolRewardsPdf, getPoolRewardsExcel,
  getManagementFundPdf, getManagementFundExcel,
  getOperationFundPdf, getOperationFundExcel,
  getApprovedWithdrawalsPdf, getApprovedWithdrawalsExcel,
  getAllMembersPdf, getAllMembersExcel,
} from '../api/report';

// extra filters per report beyond fromDate/toDate
const EXTRA_FILTERS = {
  'transactions':          [{ key: 'userId', label: 'User ID', type: 'text' }, { key: 'type', label: 'Type', type: 'select', options: ['roi', 'level_commission', 'swp_purchase', 'withdrawal'] }],
  'layered-rewards':       [{ key: 'userId', label: 'User ID', type: 'text' }, { key: 'level', label: 'Level', type: 'number' }],
  'rank-rewards':          [{ key: 'userId', label: 'User ID', type: 'text' }],
  'swp-packages':          [{ key: 'userId', label: 'User ID', type: 'text' }, { key: 'purchaseType', label: 'Purchase Type', type: 'text' }],
  'trading-capital-profit':[{ key: 'userId', label: 'User ID', type: 'text' }],
  'multilevel-rewards':    [{ key: 'userId', label: 'User ID', type: 'text' }, { key: 'level', label: 'Level', type: 'number' }],
  'royalty-rewards':       [{ key: 'userId', label: 'User ID', type: 'text' }],
  'special-rewards':       [{ key: 'userId', label: 'User ID', type: 'text' }],
  'pool-rewards':          [{ key: 'userId', label: 'User ID', type: 'text' }],
  'management-fund':       [{ key: 'userId', label: 'User ID', type: 'text' }],
  'operation-fund':        [{ key: 'userId', label: 'User ID', type: 'text' }],
  'approved-withdrawals':  [{ key: 'userId', label: 'User ID', type: 'text' }],
  'all-members':           [{ key: 'search', label: 'Search', type: 'text' }, { key: 'isBlocked', label: 'Status', type: 'select', options: ['', 'true', 'false'], optionLabels: ['All', 'Blocked', 'Active'] }],
};

// fixed column definitions per report: { key, label, render(row) }
const REPORT_COLUMNS = {
  'transactions': [
    { key: 'txDate',        label: 'Date',       render: (r) => r.txDate ? new Date(r.txDate).toLocaleDateString() : '—' },
    { key: 'userName',      label: 'User',       render: (r) => r.userId?.name || '—' },
    { key: 'userIdCode',    label: 'User ID',    render: (r) => r.userId?.userId || '—' },
    { key: 'txAmount',      label: 'Amount',     render: (r) => r.txAmount?.toLocaleString() ?? '—' },
    { key: 'txType',        label: 'Type',       render: (r) => r.txType || '—' },
    { key: 'walletBefore',  label: 'SWP Before', render: (r) => r.walletBefore?.toLocaleString() ?? '—' },
    { key: 'walletAfter',   label: 'SWP After',  render: (r) => r.walletAfter?.toLocaleString() ?? '—' },
  ],
  'layered-rewards': [
    { key: 'createdAt',     label: 'Date',       render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
    { key: 'earnerName',    label: 'User',       render: (r) => r.earnerId?.name || '—' },
    { key: 'earnerUserId',  label: 'User ID',    render: (r) => r.earnerId?.userId || '—' },
    { key: 'level',         label: 'Level',      render: (r) => r.level ?? '—' },
    { key: 'fromUser',      label: 'From User',  render: (r) => r.fromUserId?.userId || '—' },
    { key: 'grossAmount',   label: 'Gross',      render: (r) => r.grossAmount != null ? `$${r.grossAmount}` : '—' },
    { key: 'cutoffAmount',  label: 'Cutoff',     render: (r) => r.cutoffAmount != null ? `$${r.cutoffAmount}` : '—' },
    { key: 'netAmount',     label: 'Net',        render: (r) => r.netAmount != null ? `$${r.netAmount}` : '—' },
  ],
  'swp-packages': [
    { key: 'createdAt',    label: 'Date',       render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
    { key: 'userName',     label: 'User',       render: (r) => r.userId?.name || '—' },
    { key: 'userIdCode',   label: 'User ID',    render: (r) => r.userId?.userId || '—' },
    { key: 'amount',       label: 'Amount',     render: (r) => r.amount != null ? `$${r.amount}` : '—' },
    { key: 'purchaseType', label: 'Type',       render: (r) => r.purchaseType || '—' },
    { key: 'swpBefore',    label: 'SWP Before', render: (r) => r.swpBefore ?? '—' },
    { key: 'swpAfter',     label: 'SWP After',  render: (r) => r.swpAfter ?? '—' },
  ],
  'trading-capital-profit': [
    { key: 'createdAt',           label: 'Date',       render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
    { key: 'userName',            label: 'User',       render: (r) => r.userId?.name || '—' },
    { key: 'userIdCode',          label: 'User ID',    render: (r) => r.userId?.userId || '—' },
    { key: 'totalInvestedAmount', label: 'Invested',   render: (r) => r.totalInvestedAmount != null ? `$${r.totalInvestedAmount}` : '—' },
    { key: 'roiPercentage',       label: 'ROI %',      render: (r) => r.roiPercentage != null ? `${r.roiPercentage}%` : '—' },
    { key: 'daysCalculated',      label: 'Days',       render: (r) => r.daysCalculated ?? '—' },
    { key: 'roiEarned',           label: 'ROI Earned', render: (r) => r.roiEarned != null ? `$${r.roiEarned}` : '—' },
    { key: 'roiCapped',           label: 'Capped',     render: (r) => r.roiCapped != null ? (r.roiCapped ? 'Yes' : 'No') : '—' },
  ],
  'multilevel-rewards': [
    { key: 'createdAt',    label: 'Date',       render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
    { key: 'earnerName',   label: 'Earner',     render: (r) => r.earnerId?.name || '—' },
    { key: 'earnerId',     label: 'Earner ID',  render: (r) => r.earnerId?.userId || '—' },
    { key: 'fromUser',     label: 'From User',  render: (r) => r.fromUserId?.userId || '—' },
    { key: 'level',        label: 'Level',      render: (r) => r.level ?? '—' },
    { key: 'roiAmount',    label: 'ROI Amt',    render: (r) => r.roiAmount != null ? `$${r.roiAmount}` : '—' },
    { key: 'grossAmount',  label: 'Gross',      render: (r) => r.grossAmount != null ? `$${r.grossAmount}` : '—' },
    { key: 'cutoffAmount', label: 'Cutoff',     render: (r) => r.cutoffAmount != null ? `$${r.cutoffAmount}` : '—' },
    { key: 'netAmount',    label: 'Net',        render: (r) => r.netAmount != null ? `$${r.netAmount}` : '—' },
  ],
};

const REPORT_META = {
  'transactions':           { title: 'Recent Transactions',      pdfFn: getTransactionsPdf,        excelFn: getTransactionsExcel,        pdfFile: 'transactions_report.pdf',           excelFile: 'transactions_report.xlsx' },
  'swp-packages':           { title: 'Strategic Wealth Package', pdfFn: getSwpPackagesPdf,          excelFn: getSwpPackagesExcel,          pdfFile: 'swp_packages_report.pdf',           excelFile: 'swp_packages_report.xlsx' },
  'trading-capital-profit': { title: 'Trading Capital Profit',   pdfFn: getTradingCapitalProfitPdf, excelFn: getTradingCapitalProfitExcel, pdfFile: 'trading_capital_profit_report.pdf', excelFile: 'trading_capital_profit_report.xlsx' },
  'layered-rewards':        { title: 'Layered Rewards',          pdfFn: getLayeredRewardsPdf,       excelFn: getLayeredRewardsExcel,       pdfFile: 'layered_rewards_report.pdf',        excelFile: 'layered_rewards_report.xlsx' },
  'rank-rewards':           { title: 'Rank Rewards',             pdfFn: getRankRewardsPdf,          excelFn: getRankRewardsExcel,          pdfFile: 'rank_rewards_report.pdf',           excelFile: 'rank_rewards_report.xlsx' },
  'multilevel-rewards':     { title: 'Multilevel Rewards',       pdfFn: getMultilevelRewardsPdf,    excelFn: getMultilevelRewardsExcel,    pdfFile: 'multilevel_rewards_report.pdf',     excelFile: 'multilevel_rewards_report.xlsx' },
  'royalty-rewards':        { title: 'Royalty Rewards',          pdfFn: getRoyaltyRewardsPdf,       excelFn: getRoyaltyRewardsExcel,       pdfFile: 'royalty_rewards_report.pdf',        excelFile: 'royalty_rewards_report.xlsx' },
  'special-rewards':        { title: 'Special Rewards',          pdfFn: getSpecialRewardsPdf,       excelFn: getSpecialRewardsExcel,       pdfFile: 'special_rewards_report.pdf',        excelFile: 'special_rewards_report.xlsx' },
  'pool-rewards':           { title: 'Pool Fund',                pdfFn: getPoolRewardsPdf,          excelFn: getPoolRewardsExcel,          pdfFile: 'pool_rewards_report.pdf',           excelFile: 'pool_rewards_report.xlsx' },
  'management-fund':        { title: 'Management Fund',         pdfFn: getManagementFundPdf,       excelFn: getManagementFundExcel,       pdfFile: 'management_fund_report.pdf',        excelFile: 'management_fund_report.xlsx' },
  'operation-fund':         { title: 'Operations Wallet',        pdfFn: getOperationFundPdf,        excelFn: getOperationFundExcel,        pdfFile: 'operation_fund_report.pdf',         excelFile: 'operation_fund_report.xlsx' },
  'approved-withdrawals':   { title: 'Approved Withdrawals',     pdfFn: getApprovedWithdrawalsPdf,  excelFn: getApprovedWithdrawalsExcel,  pdfFile: 'approved_withdrawals_report.pdf',   excelFile: 'approved_withdrawals_report.xlsx' },
  'all-members':            { title: 'Direct Members',           pdfFn: getAllMembersPdf,           excelFn: getAllMembersExcel,           pdfFile: 'all_members_report.pdf',            excelFile: 'all_members_report.xlsx' },
};

const PDF_TYPE = 'application/pdf';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const LIMIT = 10;

const downloadFile = async (apiFn, filename, mimeType) => {
  try {
    const res = await apiFn();
    const url = globalThis.URL.createObjectURL(new Blob([res.data], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    globalThis.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(`Failed to download ${filename}:`, err);
  }
};

const inputClass = 'bg-[#080d1a] border border-[#2d3a4f] rounded-lg px-3 py-2 text-[13px] text-white outline-none w-full placeholder-[#475569] focus:border-[#00e396]/40 transition-colors [color-scheme:dark]';

const ReportDetail = () => {
  const { reportKey } = useParams();
  const navigate = useNavigate();
  const meta = REPORT_META[reportKey] || { title: reportKey };
  const extraFilters = EXTRA_FILTERS[reportKey] || [];
  const fixedCols = REPORT_COLUMNS[reportKey] || null;

  const initExtra = () => Object.fromEntries(extraFilters.map((f) => [f.key, '']));

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [extra, setExtra] = useState(initExtra);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalDocs: 0 });

  const buildParams = (currentPage, from, to, extraVals) => {
    const params = { page: currentPage, limit: LIMIT };
    if (from) params.fromDate = from;
    if (to) params.toDate = to;
    Object.entries(extraVals).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) params[k] = v; });
    return params;
  };

  const fetchData = async (currentPage = 1, from = fromDate, to = toDate, extraVals = extra) => {
    setLoading(true);
    try {
      const res = await getReportData(reportKey, buildParams(currentPage, from, to, extraVals));
      const body = res.data;
      const rows = body.data || body.records || body.results || (Array.isArray(body) ? body : []);
      setData(rows);
      setPagination(body.pagination || { page: currentPage, totalPages: Math.ceil((body.total || rows.length) / LIMIT), totalDocs: body.total || rows.length });
      if (rows.length > 0) {
        const rawCols = Object.keys(rows[0]).filter((c) => c !== '_id');
        // if userId is a populated object, expand it into userId + userName columns
        const cols = [];
        rawCols.forEach((c) => {
          if (c === 'userId' && typeof rows[0][c] === 'object' && rows[0][c] !== null) {
            cols.push('__userName');
            cols.push('__userId');
          } else {
            cols.push(c);
          }
        });
        setColumns(cols);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const reset = initExtra();
    setPage(1); setFromDate(''); setToDate(''); setExtra(reset);
    fetchData(1, '', '', reset);
  }, [reportKey]);

  const handleApply = () => { setPage(1); fetchData(1, fromDate, toDate, extra); };

  const hasFilters = fromDate || toDate || Object.values(extra).some((v) => v !== '');
  const handleClear = () => {
    const reset = initExtra();
    setFromDate(''); setToDate(''); setExtra(reset); setPage(1);
    fetchData(1, '', '', reset);
  };

  const handlePage = (p) => { setPage(p); fetchData(p, fromDate, toDate, extra); };

  const formatCell = (col, row) => {
    if (col === '__userName') return row.userId?.name || '—';
    if (col === '__userId') return row.userId?.userId || '—';
    const val = row[col];
    if (val === null || val === undefined) return '—';
    if (typeof val === 'object' && !Array.isArray(val)) {
      if (val.name && val.userId) return `${val.name} (${val.userId})`;
      if (val.name) return val.name;
      if (val.userId) return val.userId;
      return JSON.stringify(val);
    }
    return String(val);
  };

  const getColHeader = (col) => {
    if (col === '__userName') return 'User';
    if (col === '__userId') return 'User ID';
    return col.replace(/_/g, ' ');
  };

  const getPageNumbers = () => {
    const { totalPages } = pagination;
    const pages = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (page > 3) pages.push('dots-start');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('dots-end');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/reports')} className="p-2 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-white tracking-tight">{meta.title}</h1>
            <p className="text-[13px] text-gray-400 mt-0.5">Detailed records for {meta.title}</p>
          </div>
        </div>
        {meta.pdfFn && (
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => downloadFile(meta.excelFn, meta.excelFile, EXCEL_TYPE)} className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer">
              <BsFiletypeXlsx className="w-3.5 h-3.5" /> EXCEL
            </button>
            <button onClick={() => downloadFile(meta.pdfFn, meta.pdfFile, PDF_TYPE)} className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer">
              <BsFiletypePdf className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 bg-[#0d1321] border border-[#1e293b] rounded-xl px-5 py-4">
        {/* From Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">From Date</label>
          <div className="flex items-center gap-2 bg-[#080d1a] border border-[#2d3a4f] rounded-lg px-3 py-2">
            <FiCalendar className="text-[#64748b] text-sm shrink-0" />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-transparent text-[13px] text-white outline-none cursor-pointer [color-scheme:dark]" />
          </div>
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">To Date</label>
          <div className="flex items-center gap-2 bg-[#080d1a] border border-[#2d3a4f] rounded-lg px-3 py-2">
            <FiCalendar className="text-[#64748b] text-sm shrink-0" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-transparent text-[13px] text-white outline-none cursor-pointer [color-scheme:dark]" />
          </div>
        </div>

        {/* Extra Filters */}
        {extraFilters.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">{f.label}</label>
            {f.type === 'select' ? (
              <select
                value={extra[f.key]}
                onChange={(e) => setExtra((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className={inputClass + ' cursor-pointer min-w-[120px]'}
              >
                {f.options.map((opt, i) => (
                  <option key={opt} value={opt}>{f.optionLabels ? f.optionLabels[i] : opt || 'All'}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type}
                value={extra[f.key]}
                onChange={(e) => setExtra((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.label}
                className={inputClass + ' min-w-[130px]'}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              />
            )}
          </div>
        ))}

        <button onClick={handleApply} className="px-5 py-2.5 bg-[#00e396]/10 border border-[#00e396]/20 rounded-lg text-[11px] font-bold text-[#00e396] hover:bg-[#00e396]/20 transition-all cursor-pointer">
          Apply
        </button>
        {hasFilters && (
          <button onClick={handleClear} className="px-5 py-2.5 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-400 hover:text-white hover:bg-[#1e293b]/60 transition-all cursor-pointer">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#2d3a4f] bg-[#0d1321] shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="overflow-x-auto">
          {loading && <div className="flex items-center justify-center py-16"><span className="text-[13px] text-[#64748b]">Loading...</span></div>}
          {!loading && data.length === 0 && <div className="flex items-center justify-center py-16"><span className="text-[13px] text-[#64748b]">No records found</span></div>}
          {!loading && data.length > 0 && (
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-[#2d3a4f] bg-[#080d1a]/60">
                  <th className="px-5 py-3 text-left text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">#</th>
                  {fixedCols
                    ? fixedCols.map((col) => (
                        <th key={col.key} className="px-5 py-3 text-left text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase whitespace-nowrap">{col.label}</th>
                      ))
                    : columns.map((col) => (
                        <th key={col} className="px-5 py-3 text-left text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase whitespace-nowrap">{getColHeader(col)}</th>
                      ))
                  }
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors">
                    <td className="px-5 py-4 text-[12px] text-[#64748b]">{(pagination.page - 1) * LIMIT + idx + 1}</td>
                    {fixedCols
                      ? fixedCols.map((col) => (
                          <td key={col.key} className="px-5 py-4 text-[12px] text-gray-300 whitespace-nowrap max-w-[200px] truncate">{col.render(row)}</td>
                        ))
                      : columns.map((col) => (
                          <td key={col} className="px-5 py-4 text-[12px] text-gray-300 whitespace-nowrap max-w-[200px] truncate">{formatCell(col, row)}</td>
                        ))
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-3 border-t border-[#2d3a4f]">
            <span className="text-[11px] text-[#94a3b8]">
              Showing <span className="text-white">{(pagination.page - 1) * LIMIT + 1}–{Math.min(pagination.page * LIMIT, pagination.totalDocs)}</span> of <span className="text-white">{pagination.totalDocs}</span> entries
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePage(1)} disabled={page === 1} className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"><FiChevronsLeft className="text-sm" /></button>
              <button onClick={() => handlePage(page - 1)} disabled={page === 1} className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"><FiChevronLeft className="text-sm" /></button>
              {getPageNumbers().map((n) =>
                typeof n === 'string' ? (
                  <span key={n} className="text-[#475569] text-[12px] px-1">...</span>
                ) : (
                  <button key={n} onClick={() => handlePage(n)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center cursor-pointer transition-colors ${n === page ? 'bg-[#00e396] text-white' : 'border border-[#1e293b] text-[#64748b] hover:bg-[#111827]'}`}>
                    {n}
                  </button>
                )
              )}
              <button onClick={() => handlePage(page + 1)} disabled={page === pagination.totalPages} className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"><FiChevronRight className="text-sm" /></button>
              <button onClick={() => handlePage(pagination.totalPages)} disabled={page === pagination.totalPages} className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:bg-[#111827] cursor-pointer transition-colors disabled:opacity-30"><FiChevronsRight className="text-sm" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
