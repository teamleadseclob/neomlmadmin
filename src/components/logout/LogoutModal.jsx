import { useNavigate } from "react-router-dom"
import { TbLogout } from "react-icons/tb"

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleLogout = () => {
    localStorage.clear()
    onClose()
    navigate("/login")
  }

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[90%] max-w-[420px] rounded-2xl border border-[#1e293b] bg-[#0d1321] p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-full border border-[#25c3a3]/30 bg-[#25c3a3]/10 flex items-center justify-center">
          <TbLogout className="text-[#25c3a3] text-2xl" />
        </div>

        {/* Title */}
        <h2 className="text-white text-[18px] font-bold mb-3">
          Are you sure you want to log out?
        </h2>

        {/* Description */}
        <p className="text-[13px] text-[#64748b] leading-relaxed mb-7 max-w-[300px] mx-auto">
          Your current session will be ended securely. All unsaved ledger drafts may be lost.
        </p>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#34d399] text-[#021a12] text-[14px] font-bold hover:from-[#34d399] hover:to-[#6ee7b7] transition-all cursor-pointer shadow-lg shadow-[#10b981]/25 mb-3"
        >
          Log Out
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full py-2.5 text-[13px] text-[#25c3a3] hover:text-[#34d399] transition-colors cursor-pointer"
        >
          Cancel
        </button>

        {/* Footer */}
        <p className="text-[9px] tracking-[0.2em] text-[#2a3444] uppercase font-semibold mt-5">
          FinanceFlow Sovereign Ledger
        </p>
      </div>
    </div>
  )
}

export default LogoutModal
