import { useState } from "react"
import PropTypes from "prop-types"
import { NavLink, useLocation } from "react-router-dom"
import { IoChevronDown, IoCloseOutline } from "react-icons/io5"

import dashboardIcon from "../../assets/icons/sidebar/dashboard.png"
import membersIcon from "../../assets/icons/sidebar/members.png"
import packagesIcon from "../../assets/icons/sidebar/packages.png"
import transactionsIcon from "../../assets/icons/sidebar/transactions.png"
import withdrawalsIcon from "../../assets/icons/sidebar/widrawals.png"
import distributionIcon from "../../assets/icons/sidebar/generalreport.png"
import ticketsIcon from "../../assets/icons/sidebar/tickets.png"
import reports from "../../assets/icons/sidebar/reports.png"
// import subscribersIcon from "../../assets/icons/sidebar/subscribers.png"
import settingsIcon from "../../assets/icons/sidebar/settings.png"
import logoutIcon from "../../assets/icons/sidebar/logout.png"
import logoIcon from "../../assets/icons/sidebar/financeflow.png"

const menuItems = [
  { name: "Dashboard", path: "/", icon: dashboardIcon },
  {
    name: "Members",
    icon: membersIcon,
    children: [
      { name: "All Members", path: "/members" },
      // { name: "Announcements", path: "/members/announcements" },
      { name: "Blocked Members", path: "/members/blocked" },
    ],
  },
  { name: "Packages", path: "/packages", icon: packagesIcon },
  { name: "Transactions", path: "/transactions", icon: transactionsIcon },
  { name: "Withdrawals", path: "/withdrawals", icon: withdrawalsIcon },
  { name: "Services", path: "/services", icon: packagesIcon },
  { name: "Distribution", path: "/distribution", icon: distributionIcon },
  { name: "Tickets", path: "/tickets", icon: ticketsIcon },
  { name: "Reports", path: "/reports", icon: reports },
  { name: "Notifications", path: "/push-notifications", icon: ticketsIcon },
  // { name: "Subscribers", path: "/subscribers", icon: subscribersIcon },
  { name: "Settings", path: "/settings", icon: settingsIcon },
]

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const { pathname } = useLocation()
  const [membersOpen, setMembersOpen] = useState(pathname.startsWith("/members"))

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose?.()
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-60 bg-[#0b1120] border-r border-[#25c3a3]/25 shadow-[2px_0_20px_rgba(0,0,0,0.6)] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo + Close Button */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="FinanceFlow" className="w-9 h-9" />
          <div>
            <h1 className="text-white text-[13px] font-bold leading-tight">NEOFI ACADAMY</h1>
            <p className="text-[9px] text-[#25c3a3] uppercase tracking-[0.18em] mt-0.5 font-medium">Network Admin</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#111827] transition-colors cursor-pointer"
        >
          <IoCloseOutline className="text-xl" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-[#0a0f1e] border border-[#3d4f6f] rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search for..."
            className="bg-transparent text-[12px] text-[#e2e8f0] placeholder-[#64748b] outline-none w-full"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          if (item.children) {
            const isChildActive = pathname.startsWith("/members")
            return (
              <div key={item.name}>
                <button
                  onClick={() => setMembersOpen(!membersOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 cursor-pointer group ${
                    isChildActive
                      ? "bg-[#25c3a3] text-white font-semibold shadow-[0_0_12px_rgba(37,195,163,0.25)]"
                      : "text-[#e2e8f0] hover:bg-[#1a2435] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.icon} alt={item.name} className={`w-4 h-4 ${isChildActive ? "brightness-150" : "opacity-80 group-hover:opacity-100"}`} />
                    <span>{item.name}</span>
                  </div>
                  <IoChevronDown className={`text-xs transition-transform duration-200 ${membersOpen ? "rotate-0" : "-rotate-90"} ${isChildActive ? "text-white" : "text-[#94a3b8]"}`} />
                </button>

                {membersOpen && (
                    <div className="flex flex-col mt-1 ml-4 pl-4 border-l-2 border-[#25c3a3]/30">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `px-2 py-2 rounded-md text-[12px] transition-all duration-200 ${
                            isActive
                              ? "text-[#25c3a3] font-semibold bg-[#25c3a3]/10"
                              : "text-[#cbd5e1] hover:text-white hover:bg-[#1a2435]"
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 group ${
                  isActive
                    ? "bg-[#25c3a3] text-white font-semibold shadow-[0_0_12px_rgba(37,195,163,0.25)]"
                    : "text-[#e2e8f0] hover:bg-[#1a2435] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img src={item.icon} alt={item.name} className={`w-4 h-4 ${isActive ? "brightness-150" : "opacity-80 group-hover:opacity-100"}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          )
        })}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-[#ef5350] font-medium hover:bg-[#2d1a1a] text-left cursor-pointer transition-all duration-200 mt-2"
        >
          <img src={logoutIcon} alt="Logout" className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </nav>

  
    </aside>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default Sidebar
