import { useState } from "react"
import { IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5"
import { FiUploadCloud } from "react-icons/fi"

const PushNotifications = () => {
  const [enabled, setEnabled] = useState(true)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [image, setImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) setImage(file)
  }

  const handleUpload = () => {
    // Handle notification submission
    console.log({ title, message, image, enabled })
  }

  const handleCancel = () => {
    setTitle("")
    setMessage("")
    setImage(null)
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
        {/* Left - Form */}
        <div className="flex-1 bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-6">
          {/* Notification Title */}
          <label className="text-[11px] font-bold text-[#25c3a3] tracking-wide mb-2 block">Notification Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an attention-grabbing headline..."
            className="w-full bg-[#0a0f1e] border border-[#2d3a4f] rounded-lg px-4 py-3 text-[13px] text-white placeholder-gray-500 outline-none focus:border-[#25c3a3]/50 transition-colors mb-5"
          />

          {/* Message Content */}
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-[#25c3a3] tracking-wide">Message Content</label>
            <span className="text-[10px] text-gray-500">Markdown Supported</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your notification message here. Be concise and actionable..."
            rows={8}
            className="w-full bg-[#0a0f1e] border border-[#2d3a4f] rounded-lg px-4 py-3 text-[13px] text-white placeholder-gray-500 outline-none resize-none focus:border-[#25c3a3]/50 transition-colors mb-6"
          />

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={handleUpload}
              className="px-10 py-3 rounded-lg text-[13px] font-bold bg-[#25c3a3] text-[#0a0f1e] hover:bg-[#25c3a3]/80 transition-colors cursor-pointer"
            >
              Upload
            </button>
            <button
              onClick={handleCancel}
              className="px-10 py-3 rounded-lg text-[13px] font-bold border border-[#2d3a4f] text-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right - Settings Panel */}
        <div className="w-[350px] flex flex-col gap-4">
          {/* Push Notifications Toggle */}
          <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-300">Push Notifications</span>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${enabled ? "bg-[#25c3a3]" : "bg-[#2d3a4f]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Media Attachment */}
          <div className="bg-[#0f1522] border border-[#2d3a4f] rounded-[14px] p-4">
            <label className="text-[11px] font-bold text-[#25c3a3] tracking-wide mb-3 block">Media Attachment</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#2d3a4f] rounded-lg py-16 cursor-pointer hover:border-[#25c3a3]/40 transition-colors">
              <FiUploadCloud className="w-6 h-6 text-gray-500 mb-2" />
              <span className="text-[11px] font-semibold text-gray-400">Upload Banner or Thumbnail</span>
              <span className="text-[9px] text-gray-500 mt-1">Recommended: 1200x600px</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {image && <p className="text-[10px] text-[#25c3a3] mt-2 truncate">{image.name}</p>}
            <div className="flex items-start gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-[#25c3a3] mt-1 shrink-0" />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Images will be optimized for fast loading on all device types automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PushNotifications
