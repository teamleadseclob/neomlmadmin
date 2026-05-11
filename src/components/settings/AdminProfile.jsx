import { useState } from "react"
import { IoSettingsOutline, IoNotificationsOutline, IoSearchOutline } from "react-icons/io5"
import { HiOutlineUser } from "react-icons/hi"

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "Alexander Thorne",
    adminRole: "Super Admin",
    email: "alexander.t@financeflow.ledger",
  })

  return (
    <div>
      {/* Search Bar + Actions */}
      <div className="flex items-center gap-3 mb-6 rounded-xl border border-[#1e293b] bg-[#0d1321] p-3">
        <div className="flex items-center gap-2 flex-1 bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2.5">
          <IoSearchOutline className="text-[#475569] text-lg" />
          <input
            type="text"
            placeholder="Global search for members, IDs, or transactions..."
            className="bg-transparent text-[13px] text-[#94a3b8] placeholder-[#475569] outline-none w-full"
          />
        </div>
        <button className="px-5 py-2.5 rounded-lg border border-[#1e293b] text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer">
          Discord
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-[#25c3a3] text-[13px] text-white font-medium hover:bg-[#1fa88c] transition-colors cursor-pointer">
          Save Changes
        </button>
      </div>

      {/* Administrative Profile Card */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[#25c3a3] text-lg">🏛</span>
          <h2 className="text-white text-[16px] font-semibold">Administrative Profile</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#1a2332] border-2 border-[#1e293b] flex items-center justify-center overflow-hidden">
              <HiOutlineUser className="text-3xl text-[#475569]" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#25c3a3] border-2 border-[#0d1321] flex items-center justify-center">
              <span className="text-white text-[10px]">✓</span>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none focus:border-[#25c3a3]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Admin Role</label>
                <input
                  type="text"
                  value={profile.adminRole}
                  readOnly
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none focus:border-[#25c3a3]/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
