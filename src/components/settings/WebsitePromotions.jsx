import { IoAddCircleOutline } from "react-icons/io5"
import { HiOutlineSparkles, HiOutlinePencil } from "react-icons/hi"
import { MdOutlineDelete, MdOutlinePlayArrow } from "react-icons/md"
import { FiCopy } from "react-icons/fi"

const campaigns = [
  {
    name: "HODL Summer Rewards",
    status: "Active",
    statusColor: "text-[#25c3a3]",
    detail: "Ends in 12 days",
    icon: "🔥",
    iconBg: "bg-gradient-to-br from-[#f59e0b]/20 to-[#ef4444]/20",
  },
  {
    name: "VIP Ledger Tier Upgrade",
    status: "Paused",
    statusColor: "text-[#64748b]",
    detail: "Draft Mode",
    icon: "💎",
    iconBg: "bg-gradient-to-br from-[#8b5cf6]/20 to-[#6366f1]/20",
    showActivate: true,
  },
]

const WebsitePromotions = () => (
  <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <HiOutlineSparkles className="text-[#25c3a3] text-lg" />
        <h2 className="text-white text-[16px] font-semibold">Website Promotions</h2>
      </div>
      <button className="w-8 h-8 rounded-full bg-[#25c3a3] flex items-center justify-center hover:bg-[#1fa88c] transition-colors cursor-pointer">
        <IoAddCircleOutline className="text-white text-lg" />
      </button>
    </div>
    <p className="text-[12px] text-[#64748b] mb-5">
      Manage high-visibility announcements and banner campaigns across the Finance flow ecosystem.
    </p>

    <div className="space-y-3">
      {campaigns.map((c) => (
        <div key={c.name} className="flex items-center gap-4 rounded-xl border border-[#1e293b] bg-[#111827] p-4">
          <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center text-lg shrink-0`}>
            {c.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white font-medium">{c.name}</p>
            <p className="text-[11px] text-[#64748b]">
              <span className={c.statusColor}>{c.status}</span> • {c.detail}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                <HiOutlinePencil className="text-xs" /> EDIT
              </button>
              {c.showActivate ? (
                <button className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                  <MdOutlinePlayArrow className="text-xs" /> ACTIVATE
                </button>
              ) : (
                <button className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                  <FiCopy className="text-xs" /> UPDATE
                </button>
              )}
              <button className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-red-400 transition-colors cursor-pointer">
                <MdOutlineDelete className="text-xs" /> DELETE
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add new campaign */}
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#1e293b] bg-[#0a0e1a] p-4">
        <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-center text-[#475569] shrink-0">
          <FiCopy className="text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#64748b]">Add new campaign...</p>
          <p className="text-[10px] text-[#475569]">Custom banner sizes supported</p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-[#25c3a3]/30 text-[12px] text-[#25c3a3] hover:bg-[#25c3a3]/10 transition-colors cursor-pointer">
          Create
        </button>
      </div>
    </div>

    {/* Create New Promotion Button */}
    <button className="w-full mt-5 py-3 rounded-xl bg-linear-to-r from-[#10b981] to-[#34d399] text-[#021a12] text-[13px] font-bold hover:from-[#34d399] hover:to-[#6ee7b7] transition-all cursor-pointer shadow-lg shadow-[#10b981]/25 flex items-center justify-center gap-2">
      <HiOutlineSparkles /> Create New Promotion
    </button>
  </div>
)

export default WebsitePromotions
