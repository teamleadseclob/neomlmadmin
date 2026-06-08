import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import router from "./routes"

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="top-right" toastOptions={{ style: { background: '#0f1522', color: '#fff', border: '1px solid #1e293b' } }} />
  </>
)

export default App
