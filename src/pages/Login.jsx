import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { loginApi } from "../api/authApi"

import lgshadow from "../assets/page/lgshadow.png"
import logoIcon from "../assets/icons/sidebar/logo.svg"

const Login = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data } = await loginApi(userId, password)

      const role = data?.data?.role || data?.role || data?.user?.role
      if (role === "user") {
        setError("Access denied. Only admins can login.")
        setLoading(false)
        return
      }

      const token = data?.data?.token || data?.token
      if (token) localStorage.setItem("token", token)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("user", JSON.stringify(data?.data || data?.user || data))

      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page min-h-screen w-full relative overflow-hidden bg-[#0a0e12]">
      <img src={lgshadow} alt="" className="absolute bottom-[-130%] left-[-50%] w-full h-auto pointer-events-none" />
      <img src={lgshadow} alt="" className="absolute top-[-130%] left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none" />

      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <img src={logoIcon} alt="NeoFi" className="w-9 h-9" />
        <div>
          <div className="text-white text-[13px] font-bold leading-tight">NEOFI ACADAMY</div>
          <div className="text-[#25c3a3] text-[9px] tracking-[0.18em] uppercase mt-0.5 font-medium">Network Admin</div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-[90%] max-w-125 rounded-2xl px-6 py-8 sm:px-10 sm:py-10 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] backdrop-blur-xl shadow-[0_0_80px_rgba(45,212,168,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <h2 className="text-white text-[28px] font-bold text-center mb-2">
            Welcome back!
          </h2>
          <p className="text-[#8a9a9a] text-[14px] text-center mb-8">
            Enter your credentials to access your dashboard.
          </p>

          {error && (
            <div className="text-red-400 text-[13px] text-center mb-4 bg-[rgba(255,0,0,0.08)] border border-red-400/20 rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label htmlFor="User ID" className="text-white text-[13px] font-medium block mb-2">
              User ID
            </label>
            <input
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-[14px] text-white bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] outline-none mb-5 focus:border-[rgba(45,212,168,0.4)] transition"
            />

            <label htmlFor="Password" className="text-white text-[13px] font-medium block mb-2">
              Password
            </label>
            <div className="relative mb-5">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl px-4 pr-12 text-[14px] text-white bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] outline-none focus:border-[rgba(45,212,168,0.4)] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a6a6a] hover:text-[#2dd4a8] transition cursor-pointer bg-transparent border-none p-0 flex"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between mb-7">
              <label htmlFor="Remember Me" className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className="w-4.5 h-4.5 rounded-sm flex items-center justify-center shrink-0 border-none p-0 cursor-pointer"
                  style={{
                    background: remember
                      ? "linear-gradient(135deg, #0d9b7a, #2dd4a8)"
                      : "rgba(255,255,255,0.04)",
                    border: remember
                      ? "none"
                      : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {remember && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path
                        d="M1 4L4 7L10 1"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-white text-[13px]">Remember Me</span>
              </label>
              <button
                type="button"
                className="text-[#2dd4a8] text-[13px] no-underline hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl border-none text-[15px] font-semibold cursor-pointer text-[#021a12] bg-linear-to-r from-[#0a8c6a] to-[#2dd4a8] shadow-[0_4px_24px_rgba(45,212,168,0.25)] mb-6 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-[#6a7a7a] text-[12px] text-center m-0">
            By continuing, you agree to NeoFi{" "}
            <button type="button" className="text-white font-semibold underline bg-transparent border-none p-0 cursor-pointer">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-white font-semibold underline bg-transparent border-none p-0 cursor-pointer">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
