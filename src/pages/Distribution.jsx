import React, { useState } from 'react';
import {
  FiSettings, FiBell, FiCalendar,
  FiChevronLeft, FiChevronRight,
  FiFilter, FiEdit3, FiX, FiPlus
} from 'react-icons/fi';
import { BsFiletypePdf } from 'react-icons/bs';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getDistributionData , updateRoiDistributionData, distributeRoi , getDistributionHistory, distributePoolFund, distributeMultiReward, getRankBonusHistory, getPoolConfig, updatePoolConfig, getRankBonusAmountConfig, updateRankBonusAmountConfig, poolfundpreview} from '../api/distributionApi';
import { getDashboardDataApi } from '../api/dashboardApi';


const formatDistributeDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  return `${day}${suffix} ${month} ${year} ${time}`;
};

const Distribution = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [multiHistory, setMultiHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const limit = 10;

  const [roiDistributionData, setRoiDistributionData] = useState(null);
  const [poolFund, setPoolFund] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('roi');
  const [addModal, setAddModal] = useState({ open: false, type: '' });
  const [addValue, setAddValue] = useState('0.00');
  const [poolPercentage, setPoolPercentage] = useState(0);
  const [showPoolConfirmModal, setShowPoolConfirmModal] = useState(false);
  const [distributingPool, setDistributingPool] = useState(false);
  const [multiAmount, setMultiAmount] = useState(0);
  const [roiLastDistributed, setRoiLastDistributed] = useState(null);
  const [poolUpdatedAt, setPoolUpdatedAt] = useState(null);
  const [multiLastDistributed, setMultiLastDistributed] = useState(null);
  const [showMultiConfirmModal, setShowMultiConfirmModal] = useState(false);
  const [distributingMulti, setDistributingMulti] = useState(false);
  const [modalError, setModalError] = useState('');
  const [poolPreview, setPoolPreview] = useState(null);
  const [poolPreviewLoading, setPoolPreviewLoading] = useState(false);

  React.useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const response = await getDistributionData();
        setRoiDistributionData(response.data.data);
        setRoiLastDistributed(response.data.data?.lastDistributedAt || null);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load distribution data');
      }
    };

    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardDataApi();
        setPoolFund(res.data?.data?.poolFund || 0);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPoolConfig = async () => {
      try {
        const res = await getPoolConfig();
        setPoolPercentage(res.data?.data?.percentage || 0);
        setPoolUpdatedAt(res.data?.data?.updatedAt || null);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRankBonusAmountConfig = async () => {
      try {
        const res = await getRankBonusAmountConfig();
        setMultiAmount(res.data?.data?.amount || 0);
        setMultiLastDistributed(res.data?.data?.lastDistributedAt || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDistributionData();
    fetchDashboardData();
    fetchPoolConfig();
    fetchRankBonusAmountConfig();
  }, []);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getDistributionHistory({ page: currentPage, limit });
        setHistory(res.data?.data || []);
        const pg = res.data?.pagination;
        if (pg) {
          setTotalPages(pg.totalPages);
          setTotalDocs(pg.totalDocs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMultiHistory = async () => {
      try {
        const res = await getRankBonusHistory({ page: currentPage, limit });
        setMultiHistory(res.data?.data || []);
        const pg = res.data?.pagination;
        if (pg) {
          setTotalPages(pg.totalPages);
          setTotalDocs(pg.totalDocs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (activeTab === 'roi') fetchHistory();
    else fetchMultiHistory();
  }, [currentPage, activeTab]);

  const handleEditROI = () => {
    setEditValue(roiDistributionData?.dailyRoiPercentage || '');
    setIsEditing(true);
  };

  const handleUpdateROI = async () => {
    try {
      const response = await updateRoiDistributionData({ dailyRoiPercentage: Number(editValue) });
      setRoiDistributionData(response.data.data);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update ROI');
    }
  };

  const handleDistributeROI = async () => {
    try {
      setDistributing(true);
      const distributeRes = await distributeRoi();
      setRoiLastDistributed(distributeRes.data?.data?.distributedAt || new Date().toISOString());
      setShowConfirmModal(false);
      setModalError('');
      toast.success('ROI distributed successfully!');
    } catch (error) {
      setModalError(error.response?.data?.message || 'Failed to distribute ROI');
    } finally {
      setDistributing(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ROI Distribution Report', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${totalDocs}`, 14, 34);

    const tableData = history.map((row, idx) => [
      String((currentPage - 1) * limit + idx + 1).padStart(2, '0'),
      new Date(row.distributedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      row.totalUsersEarned,
      `$${row.totalRoiDistributed.toLocaleString()}`,
      `${row.roiPercentage}%`
    ]);

    autoTable(doc, {
      startY: 42,
      head: [['SL. No', 'Date', 'Users Earned', 'Total ROI Distributed', 'ROI %']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 21, 34], textColor: [0, 227, 150], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'center' }
      },
    });

    doc.save(`ROI_Distribution_Report_Page${currentPage}.pdf`);
  };


  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1.5 tracking-tight">Distribution</h1>
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

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-[13px] font-semibold text-red-400">{error}</p>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 cursor-pointer">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ROI Distribution Card */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2">ROI Distribution</p>
              <p className="text-[24px] font-extrabold text-white tracking-tight">{roiDistributionData?.dailyRoiPercentage ?? 0}%</p>
            </div>
            <button onClick={() => setShowConfirmModal(true)} className="px-4 py-2.5 rounded-lg text-[11px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors">
              DISTRIBUTE
            </button>
          </div>
          <button onClick={() => { setAddModal({ open: true, type: 'roi' }); setAddValue(roiDistributionData?.dailyRoiPercentage || '0.00'); }} className="mt-auto pt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold cursor-pointer border border-[#25c3a3] text-[#25c3a3] hover:bg-[#25c3a3]/10 transition-colors">
            <FiPlus className="w-3.5 h-3.5" />
            Add ROI
          </button>
          <p className="mt-2 text-[10px] text-yellow-400 italic">1st and 16th of every month.</p>
          {roiLastDistributed && (
            <div className="mt-3 pt-3 border-t border-[#1e293b] flex items-center justify-between">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Last Distributed</span>
              <span className="text-[11px] font-semibold text-white">{formatDistributeDate(roiLastDistributed)}</span>
            </div>
          )}
        </div>

        {/* Pool Distribution Card */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2">Pool Distribution</p>
              <p className="text-[24px] font-extrabold text-white tracking-tight">{poolPercentage}%</p>
            </div>
            <button onClick={() => setShowPoolConfirmModal(true)} className="px-4 py-2.5 rounded-lg text-[11px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors">
              DISTRIBUTE
            </button>
          </div>
          <button onClick={() => { setAddModal({ open: true, type: 'pool' }); setAddValue(''); }} className="mt-auto pt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold cursor-pointer border border-[#25c3a3] text-[#25c3a3] hover:bg-[#25c3a3]/10 transition-colors">
            <FiPlus className="w-3.5 h-3.5" />
            Add Pool Reward
          </button>
          <p className="mt-2 text-[10px] text-yellow-400 italic">1st of every month.</p>
          {poolUpdatedAt && (
            <div className="mt-3 pt-3 border-t border-[#1e293b] flex items-center justify-between">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Last Distributed</span>
              <span className="text-[11px] font-semibold text-white">{formatDistributeDate(poolUpdatedAt)}</span>
            </div>
          )}
        </div>

        {/* Multi Reward Distribution Card */}
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2">Royality Reward Distribution</p>
              <p className="text-[24px] font-extrabold text-white tracking-tight">{multiAmount}</p>
            </div>
            <button onClick={() => setShowMultiConfirmModal(true)} className="px-4 py-2.5 rounded-lg text-[11px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors">
              DISTRIBUTE
            </button>
          </div>
          <button onClick={() => { setAddModal({ open: true, type: 'multi' }); setAddValue(''); }} className="mt-auto pt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold cursor-pointer border border-[#25c3a3] text-[#25c3a3] hover:bg-[#25c3a3]/10 transition-colors">
            <FiPlus className="w-3.5 h-3.5" />
            Add Royality Reward
          </button>
          <p className="mt-2 text-[10px] text-yellow-400 italic">1st of every month.</p>
          {multiLastDistributed && (
            <div className="mt-3 pt-3 border-t border-[#1e293b] flex items-center justify-between">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Last Distributed</span>
              <span className="text-[11px] font-semibold text-white">{formatDistributeDate(multiLastDistributed)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex items-center justify-center gap-0">
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-6 py-2.5 rounded-lg text-[12px] font-bold cursor-pointer transition-colors ${activeTab === 'roi' ? 'bg-[#1e293b] text-white' : 'text-gray-400 hover:text-gray-200'}`}
        >
          ROI Distribution
        </button>
        <button
          onClick={() => setActiveTab('multi')}
          className={`px-6 py-2.5 rounded-lg text-[12px] font-bold cursor-pointer transition-colors ${activeTab === 'multi' ? 'bg-[#1e293b] text-white' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Multi Reward Distribution
        </button>
      </div>

      {/* Date Range & Filters Bar */}
      <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">Date Range</p>
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[12px] font-semibold text-gray-300 hover:border-gray-600 transition-colors cursor-pointer">
            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
            Oct 01, 2023 - Oct 31, 2023
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex items-end gap-3 self-end md:self-auto mt-2 md:mt-0">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
            <BsFiletypePdf className="w-3.5 h-3.5 text-gray-400" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
            <FiFilter className="w-3.5 h-3.5 text-gray-400" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Distribution History Table */}
      <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[0.8fr_2fr_1.5fr_1fr] gap-4 px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase border-b border-[#2d3a4f] bg-[#0a0f1e]/60">
            <span>SL. NO</span>
            <span>Date & Time</span>
            <span className="text-center">{activeTab === 'roi' ? 'Total ROI' : 'Total Reward'}</span>
            <span className="text-right">Status</span>
          </div>

          {(activeTab === 'roi' ? history : multiHistory).length === 0 ? (
            <div className="px-6 py-12 text-center text-[13px] text-gray-500">No distribution history found.</div>
          ) : (
            (activeTab === 'roi' ? history : multiHistory).map((row, idx) => (
              <div
                key={row._id}
                className="grid grid-cols-[0.8fr_2fr_1.5fr_1fr] gap-4 px-6 py-5 items-center border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors"
              >
                <span className="text-[13px] font-semibold text-gray-400">
                  {String((currentPage - 1) * limit + idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-white leading-tight">
                    {new Date(activeTab === 'roi' ? row.distributedAt : row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                    {new Date(activeTab === 'roi' ? row.distributedAt : row.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
                  </p>
                </div>
                <p className="text-[14px] font-bold text-white text-center">
                  {activeTab === 'roi'
                    ? row.totalRoiDistributed?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : (row.breakdown?.reduce((sum, b) => sum + (b.totalDistributed || 0), 0))?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }
                </p>
                <div className="text-right">
                  <span className="inline-block px-3 py-1.5 rounded text-[10px] font-bold tracking-wide text-[#00e396] bg-[#00e396]/15">
                    COMPLETED
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#2d3a4f]">
          <p className="text-[12px] text-gray-400 font-medium mb-3 sm:mb-0">
            Showing {totalDocs === 0 ? 0 : ((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalDocs)} of {totalDocs.toLocaleString()} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50 transition-colors cursor-pointer disabled:opacity-30"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#00e396] text-[#0a0f1e] shadow-[0_0_10px_rgba(0,227,150,0.3)]'
                    : 'border border-[#1e293b] text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

            {totalPages > 3 && (
              <>
                <span className="text-gray-500 text-xs px-1">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    currentPage === totalPages
                      ? 'bg-[#00e396] text-[#0a0f1e] shadow-[0_0_10px_rgba(0,227,150,0.3)]'
                      : 'border border-[#1e293b] text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50 transition-colors cursor-pointer disabled:opacity-30"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* ROI Distribute Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-bold text-white">Confirm ROI Distribution</h3>
              <button onClick={() => { setShowConfirmModal(false); setModalError(''); }} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[13px] text-gray-400 mb-4">Are you sure you want to distribute ROI at {roiDistributionData?.dailyRoiPercentage ?? 0}% to all eligible users?</p>
            {modalError && <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{modalError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirmModal(false); setModalError(''); }}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer border border-[#1e293b] text-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDistributeROI}
                disabled={distributing}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors disabled:opacity-50"
              >
                {distributing ? 'Distributing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi Reward Distribute Confirm Modal */}
      {showMultiConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-bold text-white">Confirm Royality Reward Distribution</h3>
              <button onClick={() => { setShowMultiConfirmModal(false); setModalError(''); }} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[13px] text-gray-400 mb-4">Are you sure you want to distribute Royality Reward of {multiAmount} to all eligible users?</p>
            {modalError && <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{modalError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowMultiConfirmModal(false); setModalError(''); }}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer border border-[#1e293b] text-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setDistributingMulti(true);
                    const multiRes = await distributeMultiReward();
                    setMultiLastDistributed(multiRes.data?.data?.distributedAt || new Date().toISOString());
                    setShowMultiConfirmModal(false);
                    setModalError('');
                    toast.success('Royality Reward distributed successfully!');
                  } catch (err) {
                    setModalError(err.response?.data?.message || 'Failed to distribute Royality Reward');
                  } finally {
                    setDistributingMulti(false);
                  }
                }}
                disabled={distributingMulti}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors disabled:opacity-50"
              >
                {distributingMulti ? 'Distributing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pool Distribute Confirm Modal */}
      {showPoolConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-bold text-white">Confirm Pool Distribution</h3>
              <button onClick={() => { setShowPoolConfirmModal(false); setModalError(''); }} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[13px] text-gray-400 mb-4">Are you sure you want to distribute Pool Reward at {poolPercentage}% to all eligible users?</p>
            {modalError && <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{modalError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowPoolConfirmModal(false); setModalError(''); }}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer border border-[#1e293b] text-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setDistributingPool(true);
                    const poolRes = await distributePoolFund();
                    setPoolUpdatedAt(poolRes.data?.data?.distributedAt || new Date().toISOString());
                    setShowPoolConfirmModal(false);
                    setModalError('');
                    toast.success('Pool Reward distributed successfully!');
                  } catch (err) {
                    setModalError(err.response?.data?.message || 'Failed to distribute Pool Reward');
                  } finally {
                    setDistributingPool(false);
                  }
                }}
                disabled={distributingPool}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors disabled:opacity-50"
              >
                {distributingPool ? 'Distributing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-bold text-white">
                {addModal.type === 'roi' && 'Add ROI'}
                {addModal.type === 'pool' && 'Add Pool Reward'}
                {addModal.type === 'multi' && 'Add Royality Reward'}
              </h3>
              <button onClick={() => { setAddModal({ open: false, type: '' }); setModalError(''); setPoolPreview(null); }} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            {modalError && <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{modalError}</p>}
            <p className="text-[13px] text-gray-400 mb-5">
              {addModal.type === 'multi'
                ? 'Enter the amount for the current Royality Reward cycle.'
                : `Enter the percentage distribution value for the current ${addModal.type === 'roi' ? 'ROI' : 'Pool Reward'} cycle.`}
            </p>
            <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2">
              {addModal.type === 'multi' ? 'Amount' : addModal.type === 'roi' ? 'ROI Percentage' : 'Pool Reward Percentage'}
            </p>
            <div className="flex items-center bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-3 mb-3">
              <input
                type="number"
                value={addValue}
                onChange={async (e) => {
                  const val = addModal.type === 'pool' ? Math.min(100, Number(e.target.value)) : e.target.value;
                  setAddValue(val);
                  if (addModal.type === 'pool' && val) {
                    setPoolPreviewLoading(true);
                    setPoolPreview(null);
                    try {
                      const res = await poolfundpreview(Number(val));
                      setPoolPreview(res.data?.data);
                    } catch (err) {
                      setPoolPreview(null);
                    } finally {
                      setPoolPreviewLoading(false);
                    }
                  } else {
                    setPoolPreview(null);
                  }
                }}
                min="0"
                max={addModal.type === 'pool' ? 100 : undefined}
                className="flex-1 bg-transparent text-white text-[16px] font-bold outline-none"
              />
              {addModal.type !== 'multi' && <span className="text-gray-400 font-bold text-[16px]">%</span>}
            </div>
            {addModal.type === 'pool' && poolPreview && (
              <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-3 mb-4 space-y-1.5">
                {Object.entries(poolPreview).filter(([key]) => key !== 'message').map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-[12px] text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-[12px] font-semibold text-white">
                      {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(value)}
                    </span>
                  </div>
                ))}
                {poolPreview.message && (
                  <p className="text-[12px]  pt-1.5 border-t border-[#1e293b]">{poolPreview.message}</p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setAddModal({ open: false, type: '' }); setModalError(''); setPoolPreview(null); }}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer border border-[#1e293b] text-gray-300 hover:border-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    if (addModal.type === 'roi') {
                      await updateRoiDistributionData({ dailyRoiPercentage: Number(addValue) });
                      const res = await getDistributionData();
                      setRoiDistributionData(res.data.data);
                    } else if (addModal.type === 'pool') {
                      await updatePoolConfig(Number(addValue));
                      const res = await getPoolConfig();
                      setPoolPercentage(res.data?.data?.percentage || 0);
                    } else if (addModal.type === 'multi') {
                      await updateRankBonusAmountConfig(parseFloat(addValue));
                      const res = await getRankBonusAmountConfig();
                      setMultiAmount(res.data?.data?.amount || 0);
                    }
                    setAddModal({ open: false, type: '' });
                  } catch (err) {
                    setModalError(err.response?.data?.message || 'Failed to submit');
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg text-[13px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distribution;
