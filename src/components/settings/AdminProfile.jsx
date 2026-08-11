import { useState, useEffect } from "react"
import { HiOutlineUser } from "react-icons/hi"
import { getAdminProfileApi, updateAdminProfileApi } from "../../api/authApi"

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    adminRole: "",
    email: "",
  })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const [originalName, setOriginalName] = useState("")

  useEffect(() => {
    getAdminProfileApi()
      .then(({ data }) => {
        const d = data.data ?? data
        const name = d.fullName ?? d.name ?? ""
        setProfile({
          fullName: name,
          adminRole: d.adminRole ?? d.role ?? "",
          email: d.email ?? "",
        })
        setOriginalName(name)
      })
      .catch(console.error)
  }, [])

  const handleEdit = () => {
    setOriginalName(profile.fullName)
    setEditing(true)
  }

  const handleDiscard = () => {
    setProfile((p) => ({ ...p, fullName: originalName }))
    setEditing(false)
    setMsg("")
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg("")
    try {
      await updateAdminProfileApi(profile.fullName)
      setMsg("Saved!")
      setEditing(false)
    } catch {
      setMsg("Failed to save.")
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(""), 3000)
    }
  }

  return (
    <div>
      {/* Search Bar + Actions */}
      <div className="flex items-center justify-end gap-3 mb-6 rounded-xl border border-[#1e293b] bg-[#0d1321] p-3">

        {msg && <span className={`text-[12px] ${msg === "Saved!" ? "text-[#25c3a3]" : "text-red-400"}`}>{msg}</span>}
        {!editing ? (
          <button
            onClick={handleEdit}
            className="px-5 py-2.5 rounded-lg bg-[#25c3a3] text-[13px] text-white font-medium hover:bg-[#1fa88c] transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleDiscard}
              className="px-5 py-2.5 rounded-lg border border-[#1e293b] text-[13px] text-white hover:bg-[#111827] transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-[#25c3a3] text-[13px] text-white font-medium hover:bg-[#1fa88c] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
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

          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="Full Name" className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  readOnly={!editing}
                  className={`w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none transition-colors ${editing ? "focus:border-[#25c3a3]/50" : "opacity-70 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label htmlFor="Admin Role"  className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Admin Role</label>
                <input
                  type="text"
                  value={profile.adminRole}
                  readOnly
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label htmlFor="Email Address" className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase mb-2 block">Email Address</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-[13px] text-white outline-none opacity-70 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
