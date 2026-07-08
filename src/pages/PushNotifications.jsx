import { useState, useEffect } from "react"
import { IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5"
import { FiUploadCloud, FiTrash2 } from "react-icons/fi"
import { getNotifications, uploadNotification, deleteNotification, toggleNotification, getBanners, createBanner, deleteBanner } from "../api/notificationApi"

const PushNotifications = () => {
  const [enabled, setEnabled] = useState(true)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications()
      console.log("Notification response:", res.data)
      const data = res.data?.data?.[0] || null
      if (data) {
        setNotification(data)
        setEnabled(data.isEnabled ?? true)
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleImageSelect = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
    e.target.value = ""
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      await uploadNotification(formData)
      setFile(null)
      setPreview(null)
      await fetchNotifications()
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!notification?._id) return
    setLoading(true)
    try {
      await deleteNotification(notification._id)
      setNotification(null)
    } catch (err) {
      console.error("Delete failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    if (!notification?._id) return
    const newState = !enabled
    setEnabled(newState)
    try {
      await toggleNotification(notification._id, newState)
    } catch (err) {
      setEnabled(!newState)
      console.error("Toggle failed", err)
    }
  }

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
  }

  const rawUrl = notification?.image || notification?.imageUrl || null
  const imageUrl = rawUrl?.startsWith("http") ? rawUrl : rawUrl ? `http://192.168.29.36:5001${rawUrl}` : null

  // ── Banner state ──────────────────────────────────────────────
  const [banners, setBanners] = useState([])
  const [activeBanner, setActiveBanner] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerLoading, setBannerLoading] = useState(false)
  const [editFile, setEditFile] = useState(null)
  const [editPreview, setEditPreview] = useState(null)

  const resolveUrl = (url) =>
    !url ? null : url.startsWith("http") ? url : `http://192.168.29.36:5001${url}`

  const fetchBanners = async () => {
    try {
      const res = await getBanners()
      const list = res.data?.data || res.data || []
      setBanners(list)
      setActiveBanner(list[0] || null)
    } catch (err) {
      console.error("Failed to fetch banners", err)
    }
  }

  useEffect(() => { fetchBanners() }, [])

  const handleBannerFileSelect = (e) => {
    const f = e.target.files[0]
    if (f) { setBannerFile(f); setBannerPreview(URL.createObjectURL(f)) }
    e.target.value = ""
  }

  const handleBannerUpload = async () => {
    if (!bannerFile) return
    setBannerLoading(true)
    try {
      const fd = new FormData()
      fd.append("imageUrl", bannerFile)
      await createBanner(fd)
      setBannerFile(null); setBannerPreview(null)
      await fetchBanners()
    } catch (err) { console.error("Banner upload failed", err) }
    finally { setBannerLoading(false) }
  }

  const handleBannerDelete = async (id) => {
    try {
      await deleteBanner(id)
      setActiveBanner(null)
      await fetchBanners()
    }
    catch (err) { console.error("Banner delete failed", err) }
  }

  return (
    <div className="p-6 w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-bold text-white">Push Notifications</h1>
          <p className="text-[12px] text-gray-400 mt-1">Manage system-wide broadcast notifications and alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full border border-[#2d3a4f] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors cursor-pointer">
            <IoSettingsOutline className="w-4.5 h-4.5" />
          </button>
          <button className="w-9 h-9 rounded-full border border-[#2d3a4f] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors cursor-pointer">
            <IoNotificationsOutline className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-5">
        {/* Left - Upload Area */}
        <div className="flex-1 bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-6">
          {imageUrl && !preview ? (
            /* Show existing notification image */
            <div className="relative rounded-lg overflow-hidden border border-[#2d3a4f]">
              <img src={imageUrl} alt="notification" crossOrigin="anonymous" className="w-full h-70 object-cover" />
              <button
                onClick={handleDelete}
                disabled={loading}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-red-500/90 flex items-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          ) : preview ? (
            /* Show selected image preview before upload */
            <>
              <div className="relative rounded-lg overflow-hidden border border-[#2d3a4f]">
                <img src={preview} alt="preview" className="w-full h-70 object-cover" />
              </div>
              <div className="flex items-center justify-end gap-4 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-10 py-3 rounded-lg text-[13px] font-bold bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-10 py-3 rounded-lg text-[13px] font-bold border border-[#2d3a4f] text-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            /* Show upload area */
            <>
              <label className="text-[11px] font-bold text-[#25c3a3] tracking-wide mb-3 block">Media Attachment</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#2d3a4f] rounded-lg py-28 cursor-pointer hover:border-[#25c3a3]/40 transition-colors">
                <FiUploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-[12px] font-semibold text-gray-400">Upload Banner or Thumbnail</span>
                <span className="text-[10px] text-gray-500 mt-1">Recommended: 1200x600px</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            </>
          )}
        </div>

        {/* Right - Settings Panel */}
        <div className="w-87.5 flex flex-col gap-4">
          {/* Push Notifications Toggle */}
          <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-300">Push Notifications</span>
            <button
              onClick={handleToggle}
              className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${enabled ? "bg-[#25c3a3]" : "bg-[#2d3a4f]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Info */}
          <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-4">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25c3a3] mt-1 shrink-0" />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Images will be optimized for fast loading on all device types automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Landing Page Banner Section */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-[18px] font-bold text-white">Landing Page Banner</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Upload and manage banners displayed on the landing page.</p>
        </div>

        {/* Upload new banner */}
        <div className="flex gap-5 mb-5">
          <div className="flex-1 bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-6">
            <label className="text-[11px] font-bold text-[#25c3a3] tracking-wide mb-3 block">Add New Banner</label>
            {activeBanner && !bannerPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-[#2d3a4f]">
                <img src={resolveUrl(activeBanner.imageUrl || activeBanner.image)} alt="banner" crossOrigin="anonymous" className="w-full h-70 object-cover" />
                <button
                  onClick={() => handleBannerDelete(activeBanner._id)}
                  disabled={bannerLoading}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-red-500/90 flex items-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            ) : bannerPreview ? (
              <>
                <div className="relative rounded-lg overflow-hidden border border-[#2d3a4f]">
                  <img src={bannerPreview} alt="preview" className="w-full h-70 object-cover" />
                </div>
                <div className="flex items-center justify-end gap-4 mt-6">
                  <button
                    onClick={handleBannerUpload}
                    disabled={bannerLoading}
                    className="px-10 py-3 rounded-lg text-[13px] font-bold bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {bannerLoading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    onClick={() => { setBannerFile(null); setBannerPreview(null) }}
                    className="px-10 py-3 rounded-lg text-[13px] font-bold border border-[#2d3a4f] text-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#2d3a4f] rounded-lg py-28 cursor-pointer hover:border-[#25c3a3]/40 transition-colors">
                <FiUploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-[12px] font-semibold text-gray-400">Upload Landing Page Banner</span>
                <span className="text-[10px] text-gray-500 mt-1">Recommended: 1200x400px</span>
                <input type="file" accept="image/*" onChange={handleBannerFileSelect} className="hidden" />
              </label>
            )}
          </div>

          {/* Right panel */}
          <div className="w-87.5 flex flex-col gap-4">
            <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-4">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25c3a3] mt-1 shrink-0" />
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Banner images are displayed on the landing page. Upload high-quality images for best results.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PushNotifications
