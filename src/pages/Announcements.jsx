import { IoSettingsOutline, IoNotificationsOutline, IoTimeOutline } from "react-icons/io5"
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri"
import { BsImage } from "react-icons/bs"
import { FiChevronDown } from "react-icons/fi"
import { TbEdit } from "react-icons/tb"
import { HiOutlineEye } from "react-icons/hi"

const announcements = [
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    badge: "SCROLLING BANNER",
    badgeColor: "bg-[#25c3a3]",
    title: "Q3 Fiscal Year Projections - Internal Review",
    description: "Finalizing the data points for the upcoming board meeting. Please ensure all regional leads have updated their emerald metrics befor...",
    meta: (
      <div className="flex items-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] text-[#475569] mt-3 flex-wrap">
        <span className="flex items-center gap-1.5"><IoTimeOutline className="text-xs" /> ENDS IN 4 DAYS</span>
        <span className="flex items-center gap-1.5"><HiOutlineEye className="text-xs" /> 4.2K VIEWS</span>
      </div>
    ),
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop",
    badge: "BLINKING NOTIFICATION",
    badgeColor: "bg-[#ef4444]",
    title: "Scheduled Network Upgrade: Zone 4",
    description: "System maintenance scheduled for the main frame in Zone 4. Expect intermittent latency between 02:00 and 04:00 UTC. Backu...",
    meta: (
      <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] mt-3 flex-wrap">
        <span className="text-[#ef4444] font-bold">! URGENT PRIORITY</span>
        <span className="flex items-center gap-1.5 text-[#475569]">◉ LIVE NOW</span>
      </div>
    ),
  },
]

const Announcements = () => (
  <div>
    {/* Header */}
    <div className="flex items-center justify-between mb-6 sm:mb-7">
      <div>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-white leading-tight">Announcements</h1>
        <p className="text-[12px] sm:text-[13px] text-[#4b5563] mt-1">Global Broadcast Management</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
          <IoSettingsOutline className="text-[15px] sm:text-[17px]" />
        </button>
        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
          <IoNotificationsOutline className="text-[15px] sm:text-[17px]" />
        </button>
      </div>
    </div>

    {/* Compose New Broadcast */}
    <div className="rounded-2xl border border-[#1e293b] bg-[#0b1120] p-5 sm:p-7 mb-8 sm:mb-10">
      {/* Section Title */}
      <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
        <TbEdit className="text-[#25c3a3] text-[18px] sm:text-[20px]" />
        <h2 className="text-[14px] sm:text-[15px] font-semibold text-[#25c3a3]">Compose New Broadcast</h2>
      </div>

      {/* Upload Banner */}
      <label htmlFor="Upload Banner" className="text-[10px] font-bold tracking-[0.15em] text-[#64748b] uppercase block mb-2.5">Upload Banner/Poster</label>
      <div className="border border-[#1a2332] rounded-xl bg-[#080d1a] flex flex-col items-center justify-center py-8 sm:py-12 mb-5 sm:mb-7 cursor-pointer hover:border-[#25c3a3]/30 transition-colors">
        <BsImage className="text-[20px] sm:text-[22px] text-[#334155] mb-3" />
        <p className="text-[12px] sm:text-[13px] text-[#4b5563]">Drag or click to upload assets</p>
        <p className="text-[10px] sm:text-[11px] text-[#2d3748] mt-0.5">Recommended: 1920×400px</p>
      </div>

      {/* Announcement Text */}
      <label htmlFor="Announcement Text" className="text-[10px] font-bold tracking-[0.15em] text-[#64748b] uppercase block mb-2.5">Announcement Text</label>
      <textarea
        placeholder="Type your message for the executive board..."
        className="w-full bg-[#080d1a] border border-[#1a2332] rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[13px] text-white placeholder-[#3b4557] outline-none resize-none h-25 sm:h-27.5 mb-5 sm:mb-7 focus:border-[#25c3a3]/30 transition-colors"
      />

      {/* Duration & Style Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5 sm:mb-7">
        <div>
          <label htmlFor="Set Duration" className="text-[10px] font-bold tracking-[0.15em] text-[#64748b] uppercase block mb-2.5">Set Duration</label>
          <div className="flex items-center gap-2.5 px-4 py-3 bg-[#080d1a] border border-[#1a2332] rounded-xl text-[13px] text-[#7a8599] cursor-pointer">
            📅 <span>All Packages</span>
          </div>
        </div>
        <div>
          <label htmlFor="Display Style" className="text-[10px] font-bold tracking-[0.15em] text-[#64748b] uppercase block mb-2.5">Display Style</label>
          <div className="flex items-center justify-between px-4 py-3 bg-[#080d1a] border border-[#1a2332] rounded-xl text-[13px] text-[#7a8599] cursor-pointer">
            <span>Scrolling Banner</span>
            <FiChevronDown className="text-[#475569] text-sm" />
          </div>
        </div>
      </div>

      {/* Publish Button */}
      <button className="w-full py-3 sm:py-3.5 rounded-xl bg-[#25c3a3] text-[13px] sm:text-[14px] text-white font-bold hover:bg-[#1fa88c] transition-colors cursor-pointer tracking-wide">
        Publish Announcement
      </button>
    </div>

    {/* Current Announcements */}
    <h2 className="text-[16px] sm:text-[18px] font-bold text-white mb-5">Current Announcements</h2>

    <div className="flex flex-col gap-4">
      {announcements.map((a, i) => (
        <div key={i} className="rounded-2xl border border-[#1e293b] bg-[#0b1120] p-4 sm:p-5 flex gap-3 sm:gap-4">
          {/* Thumbnail */}
          <img src={a.image} alt="" className="w-12.5 h-12.5 sm:w-15 sm:h-15 rounded-lg object-cover shrink-0 mt-1" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[8px] sm:text-[9px] font-bold tracking-wider text-white px-2 sm:px-2.5 py-0.76 rounded ${a.badgeColor} mb-2`}>
              {a.badge}
            </span>
            <h3 className="text-[13px] sm:text-[14px] font-bold text-white leading-snug">{a.title}</h3>
            <p className="text-[11px] sm:text-[12px] text-[#4b5563] leading-relaxed mt-1 line-clamp-2">{a.description}</p>
            {a.meta}
          </div>

          {/* Actions */}
          <div className="flex items-start gap-1 sm:gap-1.5 shrink-0 pt-1">
            <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:text-white hover:bg-[#111827] transition-colors cursor-pointer">
              <RiEditLine className="text-[14px] sm:text-[15px]" />
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer">
              <RiDeleteBin6Line className="text-[14px] sm:text-[15px]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default Announcements
