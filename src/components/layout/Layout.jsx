import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import LogoutModal from "../logout/LogoutModal"
import { HiOutlineMenuAlt2 } from "react-icons/hi"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={() => setShowLogout(true)} />

      {/* Main Content */}
      <main className="lg:ml-[240px] flex-1 p-4 sm:p-6 lg:p-8 min-w-0 relative">
        {/* Mobile Header */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer"
        >
          <HiOutlineMenuAlt2 className="text-xl" />
        </button>
        <Outlet />

        {/* Logout Modal - renders over main content only */}
        <LogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} />
      </main>
    </div>
  )
}

export default Layout
