import React, { useState } from 'react';
import { getTransactionsPdf, getTransactionsExcel, getRankRewardsPdf, getRankRewardsExcel, getSwpPackagesPdf, getSwpPackagesExcel, getMultilevelRewardsPdf, getMultilevelRewardsExcel, getApprovedWithdrawalsPdf, getApprovedWithdrawalsExcel, getTradingCapitalProfitPdf, getTradingCapitalProfitExcel } from '../api/report';
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
  },
  {
    id: 2,
    title: 'Strategic Wealth Package',
    description: 'High-yield asset reports for tiered VIP wealth management...',
    icon: TbDiamond,
    tag: 'PREMIUM',
    tagColor: 'text-gray-300 bg-gray-500/10 border border-gray-500/20',
  },
  {
    id: 3,
    title: 'Trading Capital Profit',
    description: 'Net profit/loss statements from global market trading...',
    icon: FiActivity,
    tag: 'CRITICAL',
    tagColor: 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/20',
  },
  {
    id: 4,
    title: 'Layered Rewards',
    description: 'Multifaceted reward stacking analysis across operational...',
    icon: FiLayers,
    tag: null,
  },
  {
    id: 5,
    title: 'Rank Rewards',
    description: 'Recognition-based incentive distribution and rank...',
    icon: FiAward,
    tag: null,
  },
  {
    id: 6,
    title: 'Multilevel Rewards',
    description: 'Network-wide distribution data for organizational incentive...',
    icon: FiShare2,
    tag: null,
  },
  {
    id: 7,
    title: 'Royalty Rewards',
    description: 'Perpetual royalty share reports for top-tier legacy participants.',
    icon: FiStar,
    tag: null,
  },
  {
    id: 8,
    title: 'Special Rewards',
    description: 'Ad-hoc bonus distributions and seasonal promotional incentiv...',
    icon: FiGift,
    tag: null,
  },
  {
    id: 9,
    title: 'Pool Fund',
    description: 'Global liquidity pool health and stakeholder equity reporting.',
    icon: FiDroplet,
    tag: 'LIQUIDITY',
    tagColor: 'text-[#0ea5e9] bg-[#0ea5e9]/10 border border-[#0ea5e9]/20',
  },
  {
    id: 10,
    title: 'Management Fund',
    description: 'Administrative budget allocation and management overhead...',
    icon: FiBriefcase,
    tag: null,
  },
  {
    id: 11,
    title: 'Operations Wallet',
    description: 'Internal treasury wallet movements and operational co...',
    icon: FiCreditCard,
    tag: null,
  },
  {
    id: 12,
    title: 'Approved Withdrawals',
    description: 'Consolidated list of all verified and processed member fund...',
    icon: FiCheckCircle,
    tag: 'VERIFIED',
    tagColor: 'text-[#00e396] bg-[#00e396]/10 border border-[#00e396]/20',
  },
];

const Reports = () => {
  const [activeFilter, setActiveFilter] = useState('Monthly');

  const handleTransactionsPdf = async () => {
    try {
      const res = await getTransactionsPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleTransactionsExcel = async () => {
    try {
      const res = await getTransactionsExcel();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download Excel:', err);
    }
  };

  const handleRankRewardsPdf = async () => {
    try {
      const res = await getRankRewardsPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rank_rewards_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleRankRewardsExcel = async () => {
    try {
      const res = await getRankRewardsExcel();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rank_rewards_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download Excel:', err);
    }
  };

  const handleSwpPackagesPdf = async () => {
    try {
      const res = await getSwpPackagesPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'swp_packages_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleSwpPackagesExcel = async () => {
    try {
      const res = await getSwpPackagesExcel();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'swp_packages_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download Excel:', err);
    }
  };

  const handleMultilevelRewardsPdf = async () => {
    try {
      const res = await getMultilevelRewardsPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'multilevel_rewards_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleMultilevelRewardsExcel = async () => {
    try {
      const res = await getMultilevelRewardsExcel();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'multilevel_rewards_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download Excel:', err);
    }
  };

  const handleApprovedWithdrawalsPdf = async () => {
    try {
      const res = await getApprovedWithdrawalsPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'approved_withdrawals_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleApprovedWithdrawalsExcel = async () => {
    try {
      const res = await getApprovedWithdrawalsExcel();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'approved_withdrawals_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download Excel:', err);
    }
  };

  const handleTradingCapitalProfitPdf = async () => {
    try {
      const res = await getTradingCapitalProfitPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trading_capital_profit_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleTradingCapitalProfitExcel = async () => {
    try {
      const res = await getTradingCapitalProfitExcel();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trading_capital_profit_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download Excel:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-[1400px] mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-3xl">
          <h1 className="text-[28px] font-bold text-white mb-2 tracking-tight">Reports</h1>
          <p className="text-[14px] text-gray-300 leading-relaxed pr-4">
            Access specialized audit logs and financial distributions for the Obsidian Ledger. Precise datasets generated for strategic analysis and regulatory compliance.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
          <button className="p-2.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer">
            <FiSettings className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer relative">
            <FiBell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-2">
        <div className="flex bg-[#0f1522] border border-[#1e293b] rounded-lg p-1.5 shadow-sm">
          {['Monthly', 'Quarterly', 'Annual'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === filter 
                  ? 'bg-[#000000] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2.5 px-4 py-2 bg-[#0f1522] border border-[#1e293b] rounded-lg text-xs font-semibold text-[#00e396] hover:bg-[#151c2b] transition-colors cursor-pointer shadow-sm">
          <FiCalendar className="w-4 h-4" />
          <span>Oct 2023 - Nov 2023</span>
        </button>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Live Ledger Health */}
        <div className="bg-[#0f1522] border border-[#737c7a]/40 rounded-[14px] p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_0_30px_rgba(109,119,116,0.35)]">
          {/* Cyan/Green Left line indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#00e396] to-[#0ea5e9]"></div>
          
          <div className="pl-2">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-gray-400 mb-5 uppercase">Live Ledger Health</h3>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-[32px] font-extrabold text-white tracking-tight">$4,285,190.42</span>
              <span className="flex items-center text-sm font-bold text-[#00e396]">
                <FiArrowUpRight className="mr-0.5" /> +12.4%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 italic mb-7">Consolidated balance across all management pools</p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2d3a4f]/50 pl-2">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total Payouts</p>
              <p className="text-base font-bold text-white">$1.2M</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pending Reports</p>
              <p className="text-base font-bold text-[#00e396]">04</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Auditor Trust</p>
              <p className="text-base font-bold text-white">99.8%</p>
            </div>
          </div>
        </div>

        {/* Card 2: Batch Export */}
        <div className="bg-[#0f1522] border border-[#737c7a]/40 rounded-[14px] p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(109,119,116,0.35)]">
          <div className="w-14 h-14 bg-[#1e293b]/40 border border-[#1e293b] rounded-xl flex items-center justify-center mb-5 hover:bg-[#1e293b]/60 transition-colors cursor-pointer">
            <BsFiletypePdf className="w-6 h-6 text-[#00e396]" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 tracking-wide">Batch Export</h3>
          <p className="text-xs text-gray-300 max-w-[220px] leading-relaxed">Download all reports for the current period in PDF</p>
        </div>

        {/* Card 3: Activity Feed */}
        <div className="bg-[#0f1522] border border-[#737c7a]/40 rounded-[14px] p-6 shadow-[0_0_30px_rgba(109,119,116,0.35)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase">Activity Feed</h3>
            <button className="text-[11px] font-semibold text-[#00e396] hover:underline cursor-pointer">View All</button>
          </div>
          
          <div className="space-y-6 flex-1 relative">
            {/* Connecting line */}
            <div className="absolute left-[3px] top-[14px] bottom-6 w-[2px] bg-[#1e293b]"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-2 h-2 rounded-full bg-[#00e396] mt-1.5 shadow-[0_0_8px_rgba(0,227,150,0.4)] flex-shrink-0"></div>
              <div>
                <p className="text-[13px] font-semibold text-white mb-0.5">Royal Rewards Gen.</p>
                <p className="text-[11px] text-gray-500 font-medium">Completed • 2m ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.4)] flex-shrink-0"></div>
              <div>
                <p className="text-[13px] font-semibold text-gray-200 mb-0.5">Failed Export</p>
                <p className="text-[11px] text-gray-500 font-medium">System Timeout • 45m ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Separator / Title */}
      <div className="bg-[#0f1522] border border-[#1e293b] rounded-[10px] px-5 py-3.5 flex items-center mt-2 shadow-sm w-full">
        <div className="w-2 h-2 rounded-full bg-[#00e396] mr-3 shadow-[0_0_8px_rgba(0,227,150,0.6)] flex-shrink-0"></div>
        <h2 className="text-[15px] font-bold text-white tracking-wide">Financial Report Modules</h2>
      </div>

      {/* 12 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportModules.map((module) => (
          <div key={module.id} className="bg-[#0f1522] border border-[#737c7a]/40 hover:border-gray-600 transition-all rounded-[14px] p-5 flex flex-col h-[230px] shadow-[0_0_30px_rgba(109,119,116,0.35)] group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#1e293b]/30 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
                <module.icon className="w-5 h-5 flex-shrink-0" />
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

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={module.id === 1 ? handleTransactionsExcel : module.id === 5 ? handleRankRewardsExcel : module.id === 2 ? handleSwpPackagesExcel : module.id === 6 ? handleMultilevelRewardsExcel : module.id === 12 ? handleApprovedWithdrawalsExcel : module.id === 3 ? handleTradingCapitalProfitExcel : undefined}
                className="flex items-center justify-center gap-2 py-2 bg-black/40 border border-[#1e293b] rounded-lg text-[10px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer"
              >
                <BsFiletypeXlsx className="w-[14px] h-[14px] text-gray-400" />
                EXCEL
              </button>
              <button
                onClick={module.id === 1 ? handleTransactionsPdf : module.id === 5 ? handleRankRewardsPdf : module.id === 2 ? handleSwpPackagesPdf : module.id === 6 ? handleMultilevelRewardsPdf : module.id === 12 ? handleApprovedWithdrawalsPdf : module.id === 3 ? handleTradingCapitalProfitPdf : undefined}
                className="flex items-center justify-center gap-2 py-2 bg-black/40 border border-[#1e293b] rounded-lg text-[10px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer"
              >
                <BsFiletypePdf className="w-[14px] h-[14px] text-gray-400" />
                PDF
              </button>
            </div>
          </div>
        ))}
        
        {/* Bottom Card - Direct Members spanning full width */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#0f1522] border border-[#737c7a]/40 hover:border-gray-600 transition-all rounded-[14px] p-6 flex flex-col shadow-[0_0_30px_rgba(109,119,116,0.35)] group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-[10px] bg-[#1e293b]/30 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
              <FiUsers className="w-5 h-5 flex-shrink-0" />
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

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer">
              <BsFiletypeXlsx className="w-[15px] h-[15px] text-gray-400" />
              EXCEL
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-black/40 border border-[#1e293b] rounded-lg text-[11px] font-bold text-gray-300 hover:bg-[#1e293b]/60 hover:text-white transition-all cursor-pointer">
              <BsFiletypePdf className="w-[15px] h-[15px] text-gray-400" />
              PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
