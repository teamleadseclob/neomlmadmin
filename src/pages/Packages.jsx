import { useState, useEffect } from "react"
import { swplist, swpUpdate, mlrlist, mlrUpdate, swpPackages } from "../api/package"
import { FiEdit2, FiCheck, FiX } from "react-icons/fi"

const Packages = () => {
  const [activeTab, setActiveTab] = useState("SWP")
  const [swpData, setSwpData] = useState([])
  const [mlrData, setMlrData] = useState([])
  const [swpPkgData, setSwpPkgData] = useState([])
  const [swpEditing, setSwpEditing] = useState(null)
  const [swpForm, setSwpForm] = useState({ percentage: "" })
  const [mlrEditing, setMlrEditing] = useState(null)
  const [mlrForm, setMlrForm] = useState({ percentage: "", requiredRankOrder: "" })

  const fetchData = () => {
    swplist().then((res) => setSwpData(res.data?.data || [])).catch(console.error)
    mlrlist().then((res) => setMlrData(res.data?.data || [])).catch(console.error)
    swpPackages().then((res) => setSwpPkgData(res.data?.data?.packages || [])).catch(console.error)
  }

  useEffect(() => { fetchData() }, [])

  const startSwpEdit = (item) => { setSwpEditing(item.level); setSwpForm({ percentage: item.percentage }) }
  const cancelSwpEdit = () => setSwpEditing(null)
  const saveSwpEdit = async (level) => {
    try { await swpUpdate(level, { percentage: Number(swpForm.percentage) }); setSwpEditing(null); fetchData() } catch (err) { console.error(err) }
  }

  const startMlrEdit = (item) => { setMlrEditing(item.level); setMlrForm({ percentage: item.percentage, requiredRankOrder: item.requiredRankOrder }) }
  const cancelMlrEdit = () => setMlrEditing(null)
  const saveMlrEdit = async (level) => {
    try { await mlrUpdate(level, { percentage: Number(mlrForm.percentage), requiredRankOrder: Number(mlrForm.requiredRankOrder) }); setMlrEditing(null); fetchData() } catch (err) { console.error(err) }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-white tracking-tight">Packages</h1>
        <p className="text-[13px] sm:text-[14px] text-[#64748b] mt-1">View SWP level commissions and MLR reward configurations.</p>
      </div>

      {/* Tab Selector + Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="inline-flex items-center p-1 rounded-xl bg-[#0b1120] border border-[#1e293b]">
          <button
            onClick={() => setActiveTab("SWP")}
            className={`px-5 py-2.5 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "SWP"
                ? "bg-[#25c3a3]/15 text-[#25c3a3] shadow-[0_0_12px_rgba(37,195,163,0.15)]"
                : "text-[#64748b] hover:text-white"
            }`}
          >
            SWP — Level Commissions
          </button>
          <button
            onClick={() => setActiveTab("MLR")}
            className={`px-5 py-2.5 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "MLR"
                ? "bg-[#0ea5e9]/15 text-[#0ea5e9] shadow-[0_0_12px_rgba(14,165,233,0.15)]"
                : "text-[#64748b] hover:text-white"
            }`}
          >
            MLR — Multi-Level Rewards
          </button>
          <button
            onClick={() => setActiveTab("SWP_PKG")}
            className={`px-5 py-2.5 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "SWP_PKG"
                ? "bg-[#25c3a3]/15 text-[#25c3a3] shadow-[0_0_12px_rgba(37,195,163,0.15)]"
                : "text-[#64748b] hover:text-white"
            }`}
          >
            SWP Package
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === "SWP" ? "bg-[#25c3a3]/10 border border-[#25c3a3]/20" : "bg-[#0ea5e9]/10 border border-[#0ea5e9]/20"}`}>
            <span className={`text-[15px] font-black ${activeTab === "SWP" ? "text-[#25c3a3]" : "text-[#0ea5e9]"}`}>
              {activeTab === "SWP" ? "S" : "M"}
            </span>
          </div>
          <p className="text-[13px] text-[#94a3b8]">
            <span className="text-white font-bold">{activeTab === "SWP" ? swpData.length : activeTab === "MLR" ? mlrData.length : swpPkgData.length}</span> active levels configured
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {activeTab === "SWP" &&
          swpData.map((item) => (
            <div
              key={item._id}
              className="group rounded-2xl border border-[#1e293b] bg-linear-to-b from-[#0d1424] to-[#0b1120] p-5 hover:border-[#25c3a3]/30 hover:shadow-[0_0_24px_rgba(37,195,163,0.06)] transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center text-[16px] font-black text-[#25c3a3]">
                    {item.level}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-white">Level {item.level}</p>
                    <p className="text-[11px] text-[#64748b]">Commission</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {swpEditing === item.level ? (
                    <>
                      <button onClick={() => saveSwpEdit(item.level)} className="w-8 h-8 rounded-lg bg-[#25c3a3]/15 border border-[#25c3a3]/30 flex items-center justify-center text-[#25c3a3] hover:bg-[#25c3a3]/25 cursor-pointer transition-colors">
                        <FiCheck className="text-[15px]" />
                      </button>
                      <button onClick={cancelSwpEdit} className="w-8 h-8 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444]/25 cursor-pointer transition-colors">
                        <FiX className="text-[15px]" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startSwpEdit(item)} className="w-8 h-8 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center text-[#25c3a3] hover:bg-[#25c3a3]/20 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                      <FiEdit2 className="text-[13px]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-4 border-t border-[#1e293b]/60">
                <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-2">Percentage</p>
                {swpEditing === item.level ? (
                  <input
                    type="number"
                    value={swpForm.percentage}
                    onChange={(e) => setSwpForm({ percentage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#25c3a3]/40 text-[20px] font-extrabold text-white outline-none focus:border-[#25c3a3] transition-colors"
                  />
                ) : (
                  <p className="text-[28px] font-extrabold text-[#25c3a3] leading-none">{item.percentage}<span className="text-[18px] ml-0.5">%</span></p>
                )}
              </div>
            </div>
          ))}

        {activeTab === "SWP_PKG" &&
          swpPkgData.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-[#1e293b] bg-linear-to-b from-[#0d1424] to-[#0b1120] p-5 hover:border-[#25c3a3]/30 hover:shadow-[0_0_24px_rgba(37,195,163,0.06)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center text-[16px] font-black text-[#25c3a3]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-white">Package {idx + 1}</p>
                    <p className="text-[11px] text-[#64748b]">SWP</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#1e293b]/60 space-y-4">
                <div>
                  <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-2">Amount</p>
                  <p className="text-[28px] font-extrabold text-[#25c3a3] leading-none"><span className="text-[18px] mr-0.5">$</span>{item.amount}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-2">Investment Limit</p>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[14px] font-bold text-[#f59e0b]">
                    ${item.investmentLimit}
                  </span>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "MLR" &&
          mlrData.map((item) => (
            <div
              key={item._id}
              className="group rounded-2xl border border-[#1e293b] bg-linear-to-b from-[#0d1424] to-[#0b1120] p-5 hover:border-[#0ea5e9]/30 hover:shadow-[0_0_24px_rgba(14,165,233,0.06)] transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-[16px] font-black text-[#0ea5e9]">
                    {item.level}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-white">Level {item.level}</p>
                    <p className="text-[11px] text-[#64748b]">Reward</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {mlrEditing === item.level ? (
                    <>
                      <button onClick={() => saveMlrEdit(item.level)} className="w-8 h-8 rounded-lg bg-[#25c3a3]/15 border border-[#25c3a3]/30 flex items-center justify-center text-[#25c3a3] hover:bg-[#25c3a3]/25 cursor-pointer transition-colors">
                        <FiCheck className="text-[15px]" />
                      </button>
                      <button onClick={cancelMlrEdit} className="w-8 h-8 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444]/25 cursor-pointer transition-colors">
                        <FiX className="text-[15px]" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startMlrEdit(item)} className="w-8 h-8 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] hover:bg-[#0ea5e9]/20 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                      <FiEdit2 className="text-[13px]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-4 border-t border-[#1e293b]/60 space-y-4">
                <div>
                  <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-2">Percentage</p>
                  {mlrEditing === item.level ? (
                    <input
                      type="number"
                      value={mlrForm.percentage}
                      onChange={(e) => setMlrForm({ ...mlrForm, percentage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#0ea5e9]/40 text-[20px] font-extrabold text-white outline-none focus:border-[#0ea5e9] transition-colors"
                    />
                  ) : (
                    <p className="text-[28px] font-extrabold text-[#0ea5e9] leading-none">{item.percentage}<span className="text-[18px] ml-0.5">%</span></p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-2">Required Rank</p>
                  {mlrEditing === item.level ? (
                    <input
                      type="number"
                      value={mlrForm.requiredRankOrder}
                      onChange={(e) => setMlrForm({ ...mlrForm, requiredRankOrder: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#f59e0b]/40 text-[16px] font-bold text-white outline-none focus:border-[#f59e0b] transition-colors"
                    />
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[14px] font-bold text-[#f59e0b]">
                      Rank {item.requiredRankOrder}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Packages
