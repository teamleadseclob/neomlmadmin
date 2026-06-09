import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactionsPdf, getTransactionsExcel, getRankRewardsPdf, getRankRewardsExcel, getSwpPackagesPdf, getSwpPackagesExcel, getMultilevelRewardsPdf, getMultilevelRewardsExcel, getApprovedWithdrawalsPdf, getApprovedWithdrawalsExcel, getTradingCapitalProfitPdf, getTradingCapitalProfitExcel, getLayeredRewardsPdf, getLayeredRewardsExcel, getRoyaltyRewardsPdf, getRoyaltyRewardsExcel, getSpecialRewardsPdf, getSpecialRewardsExcel, getPoolRewardsPdf, getPoolRewardsExcel, getManagementFundPdf, getManagementFundExcel, getOperationFundPdf, getOperationFundExcel, getAllMembersPdf, getAllMembersExcel } from '../api/report';
import { 
  FiSettings, FiBell, FiCalendar, FiArrowUpRight, 
  FiFileText, FiLayers, FiAward, FiShare2, 
  FiStar, FiGift, FiDroplet, FiBriefcase, 
  FiCreditCard, FiCheckCircle, FiUsers, FiActivity 
} from 'react-icons/fi';
import { BsFiletypePdf, BsFiletypeXlsx } from 'react-icons/bs';
import { TbDiamond } from 'react-icons/tb';

const reportModules = [
  {
    id: 1,
    title: 'Recent Transactions',
    description: 'Live transaction stream with blockchain verification IDs.',
    icon: FiFileText,
    tag: 'REAL-TIME',
    tagColor: 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/20',
    reportKey: 'transactions',
  },
  {
    id: 2,
    title: 'Strategic Wealth Package',
    description: 'High-yield asset reports for tiered VIP wealth management...',
    icon: TbDiamond,
    tag: 'PREMIUM',
    tagColor: 'text-gray-300 bg-gray-500/10 border border-gray-500/20',
    reportKey: 'swp-packages',
  },
  {
    id: 3,
    title: 'Trading Capital Profit',
    description: 'Net profit/loss statements from global market trading...',
    icon: FiActivity,
    tag: 'CRITICAL',
    tagColor: 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/20',
    reportKey: 'trading-capital-profit',
  },
  {
    id: 4,
    title: 'Layered Rewards',
    description: 'Multifaceted reward stacking analysis across operational...',
    icon: FiLayers,
    tag: null,
    reportKey: 'layered-rewards',
  },
  {
    id: 5,
    title: 'Rank Rewards',
    description: 'Recognition-based incentive distribution and rank...',
    icon: FiAward,
    tag: null,
    reportKey: 'rank-rewards',
  },
  {
    id: 6,
    title: 'Multilevel Rewards',
    description: 'Network-wide distribution data for organizational incentive...',
    icon: FiShare2,
    tag: null,
    reportKey: 'multilevel-rewards',
  },
  {
    id: 7,
    title: 'Royalty Rewards',
    description: 'Perpetual royalty share reports for top-tier legacy participants.',
    icon: FiStar,
    tag: null,
    reportKey: 'royalty-rewards',
  },
  {
    id: 8,
    title: 'Special Rewards',
    description: 'Ad-hoc bonus distributions and seasonal promotional incentiv...',
    icon: FiGift,
    tag: null,
    reportKey: 'special-rewards',
  },
  {
    id: 9,
    title: 'Pool Fund',
    description: 'Global liquidity pool health and stakeholder equity reporting.',
    icon: FiDroplet,
    tag: 'LIQUIDITY',
    tagColor: 'text-[#0ea5e9] bg-[#0ea5e9]/10 border border-[#0ea5e9]/20',
    reportKey: 'pool-rewards',
  },
  {
    id: 10,
    title: 'Management Fund',
    description: 'Administrative budget allocation and management overhead...',
    icon: FiBriefcase,
    tag: null,
    reportKey: 'management-fund',
  },
  {
    id: 11,
    title: 'Operations Wallet',
    description: 'Internal treasury wallet movements and operational co...',
    icon: FiCreditCard,
    tag: null,
    reportKey: 'operation-fund',
  },
  {
    id: 12,
    title: 'Approved Withdrawals',
    description: 'Consolidated list of all verified and processed member fund...',
    icon: FiCheckCircle,
    tag: 'VERIFIED',
    tagColor: 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/20',
    reportKey: 'approved-withdrawals',
  },
];

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

const PDF_TYPE = 'application/pdf';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const exportHandlers = {
  1: {
    excel: () => downloadFile(getTransactionsExcel, 'transactions_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getTransactionsPdf, 'transactions_report.pdf', PDF_TYPE),
  },
  2: {
    excel: () => downloadFile(getSwpPackagesExcel, 'swp_packages_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getSwpPackagesPdf, 'swp_packages_report.pdf', PDF_TYPE),
  },
  3: {
    excel: () => downloadFile(getTradingCapitalProfitExcel, 'trading_capital_profit_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getTradingCapitalProfitPdf, 'trading_capital_profit_report.pdf', PDF_TYPE),
  },
  4: {
    excel: () => downloadFile(getLayeredRewardsExcel, 'layered_rewards_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getLayeredRewardsPdf, 'layered_rewards_report.pdf', PDF_TYPE),
  },
  5: {
    excel: () => downloadFile(getRankRewardsExcel, 'rank_rewards_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getRankRewardsPdf, 'rank_rewards_report.pdf', PDF_TYPE),
  },
  6: {
    excel: () => downloadFile(getMultilevelRewardsExcel, 'multilevel_rewards_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getMultilevelRewardsPdf, 'multilevel_rewards_report.pdf', PDF_TYPE),
  },
  7: {
    excel: () => downloadFile(getRoyaltyRewardsExcel, 'royalty_rewards_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getRoyaltyRewardsPdf, 'royalty_rewards_report.pdf', PDF_TYPE),
  },
  8: {
    excel: () => downloadFile(getSpecialRewardsExcel, 'special_rewards_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getSpecialRewardsPdf, 'special_rewards_report.pdf', PDF_TYPE),
  },
  9: {
    excel: () => downloadFile(getPoolRewardsExcel, 'pool_rewards_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getPoolRewardsPdf, 'pool_rewards_report.pdf', PDF_TYPE),
  },
  10: {
    excel: () => downloadFile(getManagementFundExcel, 'management_fund_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getManagementFundPdf, 'management_fund_report.pdf', PDF_TYPE),
  },
  11: {
    excel: () => downloadFile(getOperationFundExcel, 'operation_fund_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getOperationFundPdf, 'operation_fund_report.pdf', PDF_TYPE),
  },
  12: {
    excel: () => downloadFile(getApprovedWithdrawalsExcel, 'approved_withdrawals_report.xlsx', EXCEL_TYPE),
    pdf: () => downloadFile(getApprovedWithdrawalsPdf, 'approved_withdrawals_report.pdf', PDF_TYPE),
  },
};

const Reports = () => {
  const [activeFilter, setActiveFilter] = useState('Monthly');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-3xl">
          <h1 className="text-[28px] font-bold text-white mb-2 tracking-tight">Reports</h1>
          <p className="text-[14px] text-gray-300 leading-relaxed pr-4">
            Access specialized audit logs and financial distributions for the Obsidian Ledger. Precise datasets generated for strategic analysis and regulatory compliance.
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

      

      {/* Separator / Title */}
      <div className="bg-[#0f1522] border border-[#1e293b] rounded-[10px] px-5 py-3.5 flex items-center mt-2 shadow-sm w-full">
        <div className="w-2 h-2 rounded-full bg-[#00e396] mr-3 shadow-[0_0_8px_rgba(0,227,150,0.6)] shrink-0"></div>
        <h2 className="text-[15px] font-bold text-white tracking-wide">Financial Report Modules</h2>
      </div>

      {/* 12 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportModules.map((module) => (
          <div key={module.id} className="bg-[#0f1522] border border-[#737c7a]/40 hover:border-gray-600 transition-all rounded-[14px] p-5 flex flex-col h-57.5 shadow-[0_0_30px_rgba(109,119,116,0.35)] group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#1e293b]/30 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
                <module.icon className="w-5 h-5 shrink-0" />
              </div>
              {module.tag && (
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${module.tagColor} uppercase tracking-widest`}>
                  {module.tag}
                </span>
              )}
            </div>
            
            <div className="flex-1 mt-1">
              <h3 className="text-[14px] font-bold text-gray-100 mb-1.5 leading-snug">{module.title}</h3>
              <p className="text-[12px] text-gray-300/90 leading-[1.6] line-clamp-2">
                {module.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <button
                onClick={exportHandlers[module.id]?.excel}
                className="flex items-center justify-center gap-2 py-2 bg-black/40 border border-[#1e293b] rounded-lg text-[10px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer"
              >
                <BsFiletypeXlsx className="w-3.5 h-3.5 text-gray-400" />
                EXCEL
              </button>
              <button
                onClick={exportHandlers[module.id]?.pdf}
                className="flex items-center justify-center gap-2 py-2 bg-black/40 border border-[#1e293b] rounded-lg text-[10px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer"
              >
                <BsFiletypePdf className="w-3.5 h-3.5 text-gray-400" />
                PDF
              </button>
              <button
                onClick={() => navigate(`/reports/${module.reportKey}`)}
                className="flex items-center justify-center py-2 bg-[#00e396]/10 border border-[#00e396]/20 rounded-lg text-[10px] font-bold text-[#00e396] hover:bg-[#00e396]/20 transition-all cursor-pointer"
              >
                VIEW
              </button>
            </div>
          </div>
        ))}
        
        {/* Bottom Card - Direct Members spanning full width */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#0f1522] border border-[#737c7a]/40 hover:border-gray-600 transition-all rounded-[14px] p-6 flex flex-col shadow-[0_0_30px_rgba(109,119,116,0.35)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-[10px] bg-[#1e293b]/30 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
              <FiUsers className="w-5 h-5 shrink-0" />
            </div>
            <span className={`px-2 py-0.5 text-[9px] font-bold rounded text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/20 uppercase tracking-widest`}>
              CORE DATA
            </span>
          </div>
          
          <div className="flex-1 mb-6">
            <h3 className="text-[15px] font-bold text-gray-100 mb-1.5">Direct Members</h3>
            <p className="text-[13px] text-gray-300/90 leading-[1.6]">
              Individual contributor ledger with direct upline association...
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => downloadFile(getAllMembersExcel, 'all_members_report.xlsx', EXCEL_TYPE)}
              className="flex items-center justify-center gap-2 py-3 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer">
              <BsFiletypeXlsx className="w-3.5 h-3.5 text-gray-400" />
              EXCEL
            </button>
            <button
              onClick={() => downloadFile(getAllMembersPdf, 'all_members_report.pdf', PDF_TYPE)}
              className="flex items-center justify-center gap-2 py-3 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer">
              <BsFiletypePdf className="w-3.5 h-3.5 text-gray-400" />
              PDF
            </button>
            <button
              onClick={() => navigate('/reports/all-members')}
              className="flex items-center justify-center py-3 bg-[#00e396]/10 border border-[#00e396]/20 rounded-lg text-[11px] font-bold text-[#00e396] hover:bg-[#00e396]/20 transition-all cursor-pointer">
              VIEW
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
