import React, { useState } from 'react';
import {
  FiSettings, FiBell, FiCalendar,
  FiChevronLeft, FiChevronRight,
  FiFilter, FiEdit3, FiX
} from 'react-icons/fi';
import { BsFiletypePdf } from 'react-icons/bs';
import { getDistributionData , updateRoiDistributionData, distributeRoi} from '../api/distributionApi';


const Distribution = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [roiDistributionData, setRoiDistributionData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const response = await getDistributionData();
        setRoiDistributionData(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load distribution data');
      }
    };

    fetchDistributionData();
  }, []);

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
      await distributeRoi();
      setShowConfirmModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to distribute ROI');
    } finally {
      setDistributing(false);
    }
  };

  const totalPages = 190;
  const totalDocs = 1341;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/30';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30';
      case 'FAILED':
        return 'text-red-400 bg-red-400/10 border border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border border-gray-400/30';
    }
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

      {/* ROI Distribution Card */}
      <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-1">ROI Distribution</p>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-20 px-2 py-1 bg-[#0a0f1e] border border-[#1e293b] rounded text-white text-[16px] font-bold outline-none focus:border-[#25c3a3]"
                />
                <span className="text-white font-bold">%</span>
              </div>
            ) : (
              <p className="text-[20px] font-extrabold text-white tracking-tight">{roiDistributionData?.dailyRoiPercentage}%</p>
            )}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleUpdateROI}
                className="px-3 py-2 rounded-lg text-[12px] font-bold cursor-pointer bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 rounded-lg text-[12px] font-bold cursor-pointer border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditROI}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold cursor-pointer border border-[#25c3a3]/50 text-[#25c3a3] hover:border-[#25c3a3] transition-colors"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              Edit ROI
            </button>
          )}
        </div>
        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-5 py-2.5 rounded-lg text-[13px] font-bold cursor-pointer bg-[#00e396] text-[#0a0f1e] hover:bg-[#00e396]/80 transition-colors"
        >
          Distribute ROI
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

      {/* ROI Distribution Table */}
      <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150">
            <thead>
              <tr className="border-b border-[#2d3a4f] bg-[#0a0f1e]/60">
                <th className="text-left px-6 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase w-25">
                  SL. NO
                </th>
                <th className="text-left px-6 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">
                  Date & Time
                </th>
                <th className="text-left px-6 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">
                  Total ROI
                </th>
                <th className="text-right px-6 py-5 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, date: 'Oct 24, 2023', time: '09:45:22 AM', total: '2,450.00', status: 'COMPLETED' },
                { id: 2, date: 'Oct 24, 2023', time: '09:45:22 AM', total: '2,450.00', status: 'COMPLETED' },
                { id: 3, date: 'Oct 24, 2023', time: '10:23:55 AM', total: '2,450.00', status: 'COMPLETED' },
                { id: 4, date: 'Oct 24, 2023', time: '10:23:55 AM', total: '2,450.00', status: 'COMPLETED' },
              ].map((row, idx) => (
                <tr
                  key={row.id}
                  className="border-b border-[#2d3a4f]/60 hover:bg-[#1a2435] transition-colors group"
                >
                  <td className="px-6 py-5 text-[13px] font-semibold text-gray-300">
                    {String((currentPage - 1) * 10 + idx + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[13px] font-bold text-white">{row.date}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{row.time}</p>
                  </td>
                  <td className="px-6 py-5 text-[14px] font-bold text-white tracking-tight">
                    {row.total}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#2d3a4f]">
          <p className="text-[12px] text-gray-400 font-medium mb-3 sm:mb-0">
            Showing 1 to 4 of {totalDocs.toLocaleString()} transactions
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50 transition-colors cursor-pointer disabled:opacity-30"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3].map(page => (
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

            <span className="text-gray-500 text-xs px-1">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`w-8 h-8 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                currentPage === totalPages
                  ? 'bg-[#00e396] text-[#0a0f1e] shadow-[0_0_10px_rgba(0,227,150,0.3)]'
                  : 'text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200'
              }`}
            >
              {totalPages}
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-[#1e293b]/50 transition-colors cursor-pointer disabled:opacity-30"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* ROI Distribution Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 w-full max-w-sm mx-4">
            <h3 className="text-[18px] font-bold text-white mb-2">Confirm ROI Distribution</h3>
            <p className="text-[13px] text-gray-400 mb-6">
              Are you sure you want to distribute ROI to all eligible users? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-[12px] font-bold cursor-pointer border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDistributeROI}
                disabled={distributing}
                className="px-4 py-2 rounded-lg text-[12px] font-bold cursor-pointer bg-[#00e396] text-[#0a0f1e] hover:bg-[#00e396]/80 transition-colors disabled:opacity-50"
              >
                {distributing ? 'Distributing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distribution;
