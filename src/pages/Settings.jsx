import { IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5"
import AdminProfile from "../components/settings/AdminProfile"
import SecurityCredentials from "../components/settings/SecurityCredentials"
// import WebsitePromotions from "../components/settings/WebsitePromotions"

const Settings = () => (
  <div>
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-bold text-white">Settings</h1>
        <p className="text-[12px] sm:text-[13px] text-[#64748b] mt-0.5">
          Configure your administrative profile and platform-wide promotions.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
          <IoSettingsOutline className="text-lg" />
        </button>
        <button className="p-2.5 rounded-lg border border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] transition-colors cursor-pointer">
          <IoNotificationsOutline className="text-lg" />
        </button>
      </div>
    </div>

    <div className="space-y-6">
      <AdminProfile />
      <SecurityCredentials />
      {/* <WebsitePromotions /> */}
    </div>
  </div>
)

export default Settings
