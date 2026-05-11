import { useState, useEffect } from "react"
import { swplist, swpUpdate, mlrlist, mlrUpdate } from "../api/package"
import { FiEdit2, FiCheck, FiX } from "react-icons/fi"

const Packages = () => {
  const [swpData, setSwpData] = useState([])
  const [mlrData, setMlrData] = useState([])
  const [swpEditing, setSwpEditing] = useState(null)
  const [swpForm, setSwpForm] = useState({ percentage: "" })
  const [mlrEditing, setMlrEditing] = useState(null)
  const [mlrForm, setMlrForm] = useState({ percentage: "", requiredRankOrder: "" })

  const fetchData = () => {
    swplist().then((res) => setSwpData(res.data?.data || [])).catch(console.error)
    mlrlist().then((res) => setMlrData(res.data?.data || [])).catch(console.error)
  }

  useEffect(() => { fetchData() }, [])

  // SWP edit handlers
  const startSwpEdit = (item) => {
    setSwpEditing(item.level)
    setSwpForm({ percentage: item.percentage })
  }
  const cancelSwpEdit = () => setSwpEditing(null)
  const saveSwpEdit = async (level) => {
    try {
      await swpUpdate(level, { percentage: Number(swpForm.percentage) })
      setSwpEditing(null)
      fetchData()
    } catch (err) { console.error(err) }
  }

  // MLR edit handlers
  const startMlrEdit = (item) => {
    setMlrEditing(item.level)
    setMlrForm({ percentage: item.percentage, requiredRankOrder: item.requiredRankOrder })
  }
  const cancelMlrEdit = () => setMlrEditing(null)
  const saveMlrEdit = async (level) => {
    try {
      await mlrUpdate(level, {
        percentage: Number(mlrForm.percentage),
        requiredRankOrder: Number(mlrForm.requiredRankOrder),
      })
      setMlrEditing(null)
      fetchData()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="mb-8 sm:mb-10">
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-white tracking-tight">Packages</h1>
        <p className="text-[13px] sm:text-[14px] text-[#64748b] mt-1">View SWP level commissions and MLR reward configurations.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ═══════════ SWP Table ═══════════ */}
        <div className="rounded-2xl border border-[#1e293b] bg-[#0b1120] shadow-[0_0_40px_rgba(37,195,163,0.04)] overflow-hidden">
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-[#1e293b] bg-gradient-to-r from-[#0d1321] to-[#0f1729]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25c3a3]/15 flex items-center justify-center">
                <span className="text-[18px] font-black text-[#25c3a3]">S</span>
              </div>
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-extrabold text-white tracking-tight">SWP — Level Commissions</h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  <span className="text-white font-bold">{swpData.length}</span> active levels configured
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1fr_0.5fr] gap-4 px-6 sm:px-8 py-4 text-[11px] sm:text-[12px] font-extrabold tracking-[0.15em] text-[#64748b] uppercase border-b border-[#1e293b] bg-[#080d1a]">
            <span>Level</span>
            <span>Percentage</span>
            <span className="text-center">Action</span>
          </div>

          {swpData.map((item, i) => (
            <div
              key={item._id}
              className={`grid grid-cols-[1fr_1fr_0.5fr] gap-4 px-6 sm:px-8 py-4 sm:py-5 items-center border-b border-[#1e293b]/40 hover:bg-[#25c3a3]/5 transition-all duration-200 ${i % 2 === 0 ? "bg-[#0b1120]" : "bg-[#0d1424]"}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center text-[14px] font-black text-[#25c3a3]">
                  {item.level}
                </span>
                <span className="text-[13px] text-[#94a3b8] font-medium">Level {item.level}</span>
              </div>

              {swpEditing === item.level ? (
                <input
                  type="number"
                  value={swpForm.percentage}
                  onChange={(e) => setSwpForm({ percentage: e.target.value })}
                  className="w-20 px-3 py-1.5 rounded-lg bg-[#0a0f1e] border border-[#25c3a3]/40 text-[14px] font-bold text-white outline-none focus:border-[#25c3a3]"
                />
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 text-[14px] sm:text-[15px] font-extrabold text-[#25c3a3] w-fit">
                  {item.percentage}%
                </span>
              )}

              <div className="flex items-center justify-center gap-2">
                {swpEditing === item.level ? (
                  <>
                    <button onClick={() => saveSwpEdit(item.level)} className="w-8 h-8 rounded-lg bg-[#25c3a3]/15 border border-[#25c3a3]/30 flex items-center justify-center text-[#25c3a3] hover:bg-[#25c3a3]/25 transition-colors cursor-pointer">
                      <FiCheck className="text-[16px]" />
                    </button>
                    <button onClick={cancelSwpEdit} className="w-8 h-8 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444]/25 transition-colors cursor-pointer">
                      <FiX className="text-[16px]" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => startSwpEdit(item)} className="w-8 h-8 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center text-[#25c3a3] hover:bg-[#25c3a3]/20 transition-colors cursor-pointer">
                    <FiEdit2 className="text-[14px]" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="px-6 sm:px-8 py-4 bg-[#080d1a]">
            <p className="text-[11px] text-[#25c3a3]/60 italic font-medium">Data synced from server</p>
          </div>
        </div>

        {/* ═══════════ MLR Table ═══════════ */}
        <div className="rounded-2xl border border-[#1e293b] bg-[#0b1120] shadow-[0_0_40px_rgba(14,165,233,0.04)] overflow-hidden">
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-[#1e293b] bg-gradient-to-r from-[#0d1321] to-[#0f1729]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/15 flex items-center justify-center">
                <span className="text-[18px] font-black text-[#0ea5e9]">M</span>
              </div>
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-extrabold text-white tracking-tight">MLR — Multi-Level Rewards</h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  <span className="text-white font-bold">{mlrData.length}</span> active levels configured
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1fr_1fr_0.5fr] gap-4 px-6 sm:px-8 py-4 text-[11px] sm:text-[12px] font-extrabold tracking-[0.15em] text-[#64748b] uppercase border-b border-[#1e293b] bg-[#080d1a]">
            <span>Level</span>
            <span>Percentage</span>
            <span>Required Rank</span>
            <span className="text-center">Action</span>
          </div>

          {mlrData.map((item, i) => (
            <div
              key={item._id}
              className={`grid grid-cols-[1fr_1fr_1fr_0.5fr] gap-4 px-6 sm:px-8 py-4 sm:py-5 items-center border-b border-[#1e293b]/40 hover:bg-[#0ea5e9]/5 transition-all duration-200 ${i % 2 === 0 ? "bg-[#0b1120]" : "bg-[#0d1424]"}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-[14px] font-black text-[#0ea5e9]">
                  {item.level}
                </span>
                <span className="text-[13px] text-[#94a3b8] font-medium">Level {item.level}</span>
              </div>

              {mlrEditing === item.level ? (
                <input
                  type="number"
                  value={mlrForm.percentage}
                  onChange={(e) => setMlrForm({ ...mlrForm, percentage: e.target.value })}
                  className="w-20 px-3 py-1.5 rounded-lg bg-[#0a0f1e] border border-[#0ea5e9]/40 text-[14px] font-bold text-white outline-none focus:border-[#0ea5e9]"
                />
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[14px] sm:text-[15px] font-extrabold text-[#0ea5e9] w-fit">
                  {item.percentage}%
                </span>
              )}

              {mlrEditing === item.level ? (
                <input
                  type="number"
                  value={mlrForm.requiredRankOrder}
                  onChange={(e) => setMlrForm({ ...mlrForm, requiredRankOrder: e.target.value })}
                  className="w-20 px-3 py-1.5 rounded-lg bg-[#0a0f1e] border border-[#f59e0b]/40 text-[14px] font-bold text-white outline-none focus:border-[#f59e0b]"
                />
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[13px] sm:text-[14px] font-bold text-[#f59e0b] w-fit">
                  Rank {item.requiredRankOrder}
                </span>
              )}

              <div className="flex items-center justify-center gap-2">
                {mlrEditing === item.level ? (
                  <>
                    <button onClick={() => saveMlrEdit(item.level)} className="w-8 h-8 rounded-lg bg-[#25c3a3]/15 border border-[#25c3a3]/30 flex items-center justify-center text-[#25c3a3] hover:bg-[#25c3a3]/25 transition-colors cursor-pointer">
                      <FiCheck className="text-[16px]" />
                    </button>
                    <button onClick={cancelMlrEdit} className="w-8 h-8 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444]/25 transition-colors cursor-pointer">
                      <FiX className="text-[16px]" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => startMlrEdit(item)} className="w-8 h-8 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] hover:bg-[#0ea5e9]/20 transition-colors cursor-pointer">
                    <FiEdit2 className="text-[14px]" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="px-6 sm:px-8 py-4 bg-[#080d1a]">
            <p className="text-[11px] text-[#0ea5e9]/60 italic font-medium">Data synced from server</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Packages
