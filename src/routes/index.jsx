import { createBrowserRouter, Navigate } from "react-router-dom"
import Layout from "../components/layout/Layout"
import Dashboard from "../pages/Dashboard"
import AllMembers from "../pages/AllMembers"
import Announcements from "../pages/Announcements"
import BlockedMembers from "../pages/BlockedMembers"
import Packages from "../pages/Packages"
import Transactions from "../pages/Transactions"
import Reports from "../pages/Reports"
import ReportDetail from "../pages/ReportDetail"
import Withdrawals from "../pages/Withdrawals"
import Distribution from "../pages/Distribution"
import Services from "../pages/Services"
import Closings from "../pages/Closings"
import Tickets from "../pages/Tickets"
import Subscribers from "../pages/Subscribers"
import Settings from "../pages/Settings"
import PushNotifications from "../pages/PushNotifications"
import KYC from "../pages/KYC"
import TradingPartners from "../pages/TradingPartners"
import Login from "../pages/Login"

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const token = localStorage.getItem("token")
  return isLoggedIn && token ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/members", element: <AllMembers /> },
      { path: "/members/announcements", element: <Announcements /> },
      { path: "/members/blocked", element: <BlockedMembers /> },
      { path: "/packages", element: <Packages /> },
      { path: "/packages/:userId", element: <Packages /> },
      { path: "/transactions", element: <Transactions /> },
      { path: "/reports", element: <Reports /> },
      { path: "/reports/:reportKey", element: <ReportDetail /> },
      { path: "/withdrawals", element: <Withdrawals /> },
      { path: "/distribution", element: <Distribution /> },
      { path: "/services", element: <Services /> },
      { path: "/closings", element: <Closings /> },
      { path: "/tickets", element: <Tickets /> },
      { path: "/subscribers", element: <Subscribers /> },
      { path: "/push-notifications", element: <PushNotifications /> },
      { path: "/kyc", element: <KYC /> },
      { path: "/trading-partners", element: <TradingPartners /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
])

export default router
