import { useState } from "react"
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import { changePasswordApi } from "../../api/authApi"
import toast from "react-hot-toast"

const SecurityCredentials = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState({ current: false, newPassword: false, confirmPassword: false })

  const toggleShow = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }))

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ text: "New passwords do not match", error: true })
      return
    }
    setLoading(true)
    try {
      const res = await changePasswordApi(passwords.current, passwords.newPassword, passwords.confirmPassword)
      toast.success(res.data?.message || "Password changed successfully")
      setPasswords({ current: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0d1321] p-6">
      <div className="flex items-center gap-2 mb-6">
        <IoLockClosedOutline className="text-[#25c3a3] text-lg" />
        <h2 className="text-white text-[16px] font-semibold">Security Credentials</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="current" className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Current Password</label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 pr-10 text-[13px] text-white outline-none focus:border-[#25c3a3]/50 transition-colors"
            />
            <button type="button" onClick={() => toggleShow("current")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#25c3a3]">
              {show.current ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="newPassword" className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">New Password</label>
          <div className="relative">
            <input
              type={show.newPassword ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="Enter new password"
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 pr-10 text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3]/50 transition-colors"
            />
            <button type="button" onClick={() => toggleShow("newPassword")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#25c3a3]">
              {show.newPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Confirm New Password</label>
          <div className="relative">
            <input
              type={show.confirmPassword ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="Repeat new password"
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 pr-10 text-[13px] text-white placeholder-[#475569] outline-none focus:border-[#25c3a3]/50 transition-colors"
            />
            <button type="button" onClick={() => toggleShow("confirmPassword")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#25c3a3]">
              {show.confirmPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button className="text-[13px] text-[#25c3a3] hover:text-[#34d399] transition-colors cursor-pointer">
          Force logout all other sessions?
        </button>
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="px-5 py-2 bg-[#25c3a3] hover:bg-[#1ea88c] disabled:opacity-50 text-black text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  )
}

export default SecurityCredentials
