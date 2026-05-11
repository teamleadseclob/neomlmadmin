import { useState } from "react"
import { IoLockClosedOutline } from "react-icons/io5"

const SecurityCredentials = () => {
  const [passwords, setPasswords] = useState({
    current: "••••••••••",
    newPassword: "",
    confirmPassword: "",
  })

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-6">
      <div className="flex items-center gap-2 mb-6">
        <IoLockClosedOutline className="text-[#25c3a3] text-lg" />
        <h2 className="text-white text-[16px] font-semibold">Security Credentials</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Current Password</label>
          <input
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none focus:border-[#25c3a3]/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">New Password</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            placeholder="Enter new password"
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3]/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Confirm New Password</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            placeholder="Repeat new password"
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3]/50 transition-colors"
          />
        </div>
      </div>

      <button className="mt-5 text-[13px] text-[#25c3a3] hover:text-[#34d399] transition-colors cursor-pointer">
        Force logout all other sessions?
      </button>
    </div>
  )
}

export default SecurityCredentials
