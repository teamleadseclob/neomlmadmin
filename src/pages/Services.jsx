import React, { useState, useRef } from 'react';
import {
  FiSettings, FiBell, FiUploadCloud, 
  FiChevronDown, FiAward, FiBook, FiTool
} from 'react-icons/fi';
import { createEvent, uploadFile } from '../api/services';

const Services = () => {
  const [activeTab, setActiveTab] = useState('Contest');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const imageUrlsRef = useRef([]);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  // Contest multiple PDFs
  const [contestPdfFiles, setContestPdfFiles] = useState([]);
  const [contestPdfUrls, setContestPdfUrls] = useState([]);
  const contestPdfUrlsRef = useRef([]);
  const [contestPdfUploading, setContestPdfUploading] = useState(false);
  const contestPdfInputRef = useRef(null);

  // Learning multiple PDFs
  const [learningPdfFiles, setLearningPdfFiles] = useState([]);
  const [learningPdfUrls, setLearningPdfUrls] = useState([]);
  const learningPdfUrlsRef = useRef([]);
  const [learningPdfUploading, setLearningPdfUploading] = useState(false);
  const learningPdfInputRef = useRef(null);

  // Tools multiple PDFs
  const [toolsPdfFiles, setToolsPdfFiles] = useState([]);
  const [toolsPdfUrls, setToolsPdfUrls] = useState([]);
  const toolsPdfUrlsRef = useRef([]);
  const [toolsPdfUploading, setToolsPdfUploading] = useState(false);
  const toolsPdfInputRef = useRef(null);

  // Contest form state
  const [contestForm, setContestForm] = useState({
    campaignTitle: 'Quantum Observatory Cup',
    subTitle: 'Quantum Observatory Cup',
    description: '',
    mediaUrl: '',
    googleMeetLink: '',
    startDate: '',
    endDate: '',
  });

  // Learning Packages form state
  const [learningForm, setLearningForm] = useState({
    packageName: '',
    category: 'cryptocurrency_basics',
    description: '',
    mediaUrl: '',
    googleMeetLink: '',
    price: '',
    duration: '',
    accessLevel: 'all_members',
    status: 'active',
  });

  // Tools form state
  const [toolsForm, setToolsForm] = useState({
    toolName: '',
    toolType: 'analytics',
    description: '',
    mediaUrl: '',
    googleMeetLink: '',
    accessLevel: 'all_members',
    status: 'active',
  });

  const handleContestChange = (field, value) => {
    setContestForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLearningChange = (field, value) => {
    setLearningForm(prev => ({ ...prev, [field]: value }));
  };

  const handleToolsChange = (field, value) => {
    setToolsForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    await uploadImages(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImages = async (files) => {
    setImageUploading(true);
    try {
      const res = await uploadFile(files);
      const urls = res.data?.urls ?? res.data?.data?.urls ?? [];
      setUploadedFiles(prev => [...prev, ...files]);
      setImageUrls(prev => [...prev, ...urls]);
      imageUrlsRef.current = [...imageUrlsRef.current, ...urls];
    } catch (err) {
      alert(err.response?.data?.message || 'Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    await uploadImages(files);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    const updated = imageUrlsRef.current.filter((_, i) => i !== index);
    imageUrlsRef.current = updated;
    setImageUrls(updated);
  };

  const handleContestPdfSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setContestPdfUploading(true);
    try {
      const res = await uploadFile(files);
      const urls = res.data?.urls ?? res.data?.data?.urls ?? [];
      setContestPdfFiles(prev => [...prev, ...files]);
      setContestPdfUrls(prev => [...prev, ...urls]);
      contestPdfUrlsRef.current = [...contestPdfUrlsRef.current, ...urls];
    } catch (err) {
      alert(err.response?.data?.message || 'PDF upload failed');
    } finally {
      setContestPdfUploading(false);
      e.target.value = '';
    }
  };

  const removeContestPdf = (index) => {
    setContestPdfFiles(prev => prev.filter((_, i) => i !== index));
    const updated = contestPdfUrlsRef.current.filter((_, i) => i !== index);
    contestPdfUrlsRef.current = updated;
    setContestPdfUrls(updated);
  };

  const handleLearningPdfSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setLearningPdfUploading(true);
    try {
      const res = await uploadFile(files);
      const urls = res.data?.urls ?? res.data?.data?.urls ?? [];
      setLearningPdfFiles(prev => [...prev, ...files]);
      setLearningPdfUrls(prev => [...prev, ...urls]);
      learningPdfUrlsRef.current = [...learningPdfUrlsRef.current, ...urls];
    } catch (err) {
      alert(err.response?.data?.message || 'PDF upload failed');
    } finally {
      setLearningPdfUploading(false);
      e.target.value = '';
    }
  };

  const removeLearningPdf = (index) => {
    setLearningPdfFiles(prev => prev.filter((_, i) => i !== index));
    const updated = learningPdfUrlsRef.current.filter((_, i) => i !== index);
    learningPdfUrlsRef.current = updated;
    setLearningPdfUrls(updated);
  };

  const handleToolsPdfSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setToolsPdfUploading(true);
    try {
      const res = await uploadFile(files);
      const urls = res.data?.urls ?? res.data?.data?.urls ?? [];
      setToolsPdfFiles(prev => [...prev, ...files]);
      setToolsPdfUrls(prev => [...prev, ...urls]);
      toolsPdfUrlsRef.current = [...toolsPdfUrlsRef.current, ...urls];
    } catch (err) {
      alert(err.response?.data?.message || 'PDF upload failed');
    } finally {
      setToolsPdfUploading(false);
      e.target.value = '';
    }
  };

  const removeToolsPdf = (index) => {
    setToolsPdfFiles(prev => prev.filter((_, i) => i !== index));
    const updated = toolsPdfUrlsRef.current.filter((_, i) => i !== index);
    toolsPdfUrlsRef.current = updated;
    setToolsPdfUrls(updated);
  };

  const resetImages = () => {
    setUploadedFiles([]); setImageUrls([]); imageUrlsRef.current = [];
  };

  const tabs = [
    { name: 'Contest', icon: FiAward },
    { name: 'Learning Packages', icon: FiBook },
    { name: 'Tools', icon: FiTool },
  ];

  return (
    <div className="flex flex-col space-y-6 w-full max-w-350 mx-auto pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-3xl">
          <h1 className="text-[26px] font-bold text-white mb-1.5 tracking-tight">Promotion & Ad Manager</h1>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <button className="p-2.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer">
            <FiSettings className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-gray-700/50 text-gray-300 transition-all cursor-pointer relative">
            <FiBell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-0 rounded-xl overflow-hidden border border-[#1e293b]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center justify-center gap-2.5 py-3.5 text-[13px] font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === tab.name
                ? 'bg-[#25c3a3] text-white shadow-[0_0_20px_rgba(37,195,163,0.15)]'
                : 'bg-[#0f1522] text-gray-400 hover:text-gray-200 hover:bg-[#151c2b]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Contest' && (
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 md:p-8 shadow-md">
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center">
              <FiAward className="w-4 h-4 text-[#25c3a3]" />
            </div>
            <h2 className="text-[16px] font-bold text-white tracking-tight">Featured Championship Builder</h2>
          </div>

          {/* Campaign Title */}
          <div className="mb-6">
            <label htmlFor='Campaign Title' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Campaign Title*
            </label>
            <input
              type="text"
              value={contestForm.campaignTitle}
              onChange={(e) => handleContestChange('campaignTitle', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="Enter campaign title"
            />
          </div>

          {/* Sub Title */}
          <div className="mb-6">
            <label htmlFor='Sub Title' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Sub Title
            </label>
            <input
              type="text"
              value={contestForm.subTitle}
              onChange={(e) => handleContestChange('subTitle', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="Enter sub title"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor='Description' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Description
            </label>
            <textarea
              value={contestForm.description}
              onChange={(e) => handleContestChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors resize-none"
              placeholder="Enter the description"
            />
          </div>



          {/* Media URL */}
          <div className="mb-6">
            <label htmlFor='Media URL' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Media URL
            </label>
            <input
              type="text"
              value={contestForm.mediaUrl}
              onChange={(e) => handleContestChange('mediaUrl', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="e.g. https://youtube.com/watch?v=abc"
            />
          </div>

          {/* Image + PDF Upload — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">Background Images</label>
              <button
                type="button"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleBrowseClick}
                className={`w-full py-8 bg-[#0a0f1e] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                  dragOver ? 'border-[#25c3a3] bg-[#25c3a3]/5' : 'border-[#1e293b] hover:border-gray-600'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png,image/jpeg,image/webp" multiple className="hidden" />
                <FiUploadCloud className="w-7 h-7 text-gray-500 mb-2" />
                {imageUploading ? (
                  <p className="text-[12px] text-gray-400">Uploading...</p>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-400">Drop or <span className="text-[#25c3a3] font-semibold">browse</span> (multiple)</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">PNG / JPG / WEBP</p>
                  </>
                )}
              </button>
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-[#25c3a3]">
                      {f.name}
                      <button type="button" onClick={() => removeImage(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">PDF Upload (multiple)</label>
              <button
                type="button"
                onClick={() => contestPdfInputRef.current?.click()}
                className="w-full py-8 bg-[#0a0f1e] border-2 border-dashed border-[#1e293b] hover:border-gray-600 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer"
              >
                <input type="file" ref={contestPdfInputRef} onChange={handleContestPdfSelect} accept="application/pdf" multiple className="hidden" />
                <FiUploadCloud className="w-7 h-7 text-gray-500 mb-2" />
                {contestPdfUploading ? (
                  <p className="text-[12px] text-gray-400">Uploading...</p>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-400">Drop or <span className="text-[#25c3a3] font-semibold">browse</span> (multiple)</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">PDF only</p>
                  </>
                )}
              </button>
              {contestPdfFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {contestPdfFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-[#25c3a3]">
                      {f.name}
                      <button type="button" onClick={() => removeContestPdf(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Google Meet Link */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Google Meet Link
            </label>
            <input
              type="text"
              value={contestForm.googleMeetLink}
              onChange={(e) => handleContestChange('googleMeetLink', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="e.g. https://meet.google.com/..."
            />
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor='Start Date' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={contestForm.startDate}
                  onChange={(e) => handleContestChange('startDate', e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors scheme-dark"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
            <div>
              <label htmlFor='End Date' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={contestForm.endDate}
                  onChange={(e) => handleContestChange('endDate', e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors scheme-dark"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button className="px-6 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
              Save Draft
            </button>
            <button
              onClick={async () => {
                const payload = {
                  type: 'contest',
                  title: contestForm.campaignTitle,
                  subTitle: contestForm.subTitle,
                  description: contestForm.description,
                  imageUrls: imageUrlsRef.current,
                  mediaUrl: contestForm.mediaUrl,
                  googleMeetLink: contestForm.googleMeetLink,
                  startDate: contestForm.startDate ? new Date(contestForm.startDate).toISOString() : '',
                  endDate: contestForm.endDate ? new Date(contestForm.endDate).toISOString() : '',
                  pdfUrls: contestPdfUrlsRef.current,
                };
                try {
                  await createEvent(payload);
                  alert('Campaign deployed successfully!');
                  setContestForm({ campaignTitle: '', subTitle: '', description: '', mediaUrl: '', googleMeetLink: '', startDate: '', endDate: '' });
                  resetImages();
                  setContestPdfFiles([]); setContestPdfUrls([]); contestPdfUrlsRef.current = [];
                } catch (err) {
                  const msg = err.response?.data?.message || 'Failed to deploy campaign';
                  alert(msg);
                }
              }}
              className="px-6 py-3 bg-[#ef4444] hover:bg-[#dc2626] rounded-lg text-[13px] font-bold text-white transition-colors cursor-pointer shadow-[0_0_16px_rgba(239,68,68,0.2)]"
            >
              Deploy Campaign
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Learning Packages' && (
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 md:p-8 shadow-md">
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center">
              <FiBook className="w-4 h-4 text-[#25c3a3]" />
            </div>
            <h2 className="text-[16px] font-bold text-white tracking-tight">Learning Package Builder</h2>
          </div>

          {/* Package Name */}
          <div className="mb-6">
            <label htmlFor='Package Name' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Package Name*
            </label>
            <input
              type="text"
              value={learningForm.packageName}
              onChange={(e) => handleLearningChange('packageName', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="Enter package name"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor='Category' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Category
            </label>
            <div className="relative">
              <select
                value={learningForm.category}
                onChange={(e) => handleLearningChange('category', e.target.value)}
                className="appearance-none w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#25c3a3]/50 transition-colors cursor-pointer"
              >
                <option value="cryptocurrency_basics">Cryptocurrency Basics</option>
                <option value="advanced_trading">Advanced Trading</option>
                <option value="network_marketing">Network Marketing</option>
                <option value="financial_literacy">Financial Literacy</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor='Description' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Description
            </label>
            <textarea
              value={learningForm.description}
              onChange={(e) => handleLearningChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors resize-none"
              placeholder="Enter the description"
            />
          </div>

          {/* Media URL */}
          <div className="mb-6">
            <label htmlFor='Media URL' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Media URL
            </label>
            <input
              type="text"
              value={learningForm.mediaUrl}
              onChange={(e) => handleLearningChange('mediaUrl', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="e.g. https://youtube.com/watch?v=abc"
            />
          </div>

          {/* Image + PDF Upload — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">Background Images</label>
              <button
                type="button"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleBrowseClick}
                className={`w-full py-8 bg-[#0a0f1e] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                  dragOver ? 'border-[#25c3a3] bg-[#25c3a3]/5' : 'border-[#1e293b] hover:border-gray-600'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png,image/jpeg,image/webp" multiple className="hidden" />
                <FiUploadCloud className="w-7 h-7 text-gray-500 mb-2" />
                {imageUploading ? (
                  <p className="text-[12px] text-gray-400">Uploading...</p>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-400">Drop or <span className="text-[#25c3a3] font-semibold">browse</span> (multiple)</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">PNG / JPG / WEBP</p>
                  </>
                )}
              </button>
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-[#25c3a3]">
                      {f.name}
                      <button type="button" onClick={() => removeImage(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">PDF Upload (multiple)</label>
              <button
                type="button"
                onClick={() => learningPdfInputRef.current?.click()}
                className="w-full py-8 bg-[#0a0f1e] border-2 border-dashed border-[#1e293b] hover:border-gray-600 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer"
              >
                <input type="file" ref={learningPdfInputRef} onChange={handleLearningPdfSelect} accept="application/pdf" multiple className="hidden" />
                <FiUploadCloud className="w-7 h-7 text-gray-500 mb-2" />
                {learningPdfUploading ? (
                  <p className="text-[12px] text-gray-400">Uploading...</p>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-400">Drop or <span className="text-[#25c3a3] font-semibold">browse</span> (multiple)</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">PDF only</p>
                  </>
                )}
              </button>
              {learningPdfFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {learningPdfFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-[#25c3a3]">
                      {f.name}
                      <button type="button" onClick={() => removeLearningPdf(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Google Meet Link */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Google Meet Link
            </label>
            <input
              type="text"
              value={learningForm.googleMeetLink}
              onChange={(e) => handleLearningChange('googleMeetLink', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="e.g. https://meet.google.com/..."
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor='Price' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Price (USD)
              </label>
              <input
                type="text"
                value={learningForm.price}
                onChange={(e) => handleLearningChange('price', e.target.value)}
                className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label htmlFor='Duration' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Duration
              </label>
              <input
                type="text"
                value={learningForm.duration}
                onChange={(e) => handleLearningChange('duration', e.target.value)}
                className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
                placeholder="e.g. 30 days"
              />
            </div>
          </div>

          {/* Access Level & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor='AccessLevel' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Access Level
              </label>
              <div className="relative">
                <select
                  id='AccessLevel'
                  value={learningForm.accessLevel}
                  onChange={(e) => handleLearningChange('accessLevel', e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#25c3a3]/50 transition-colors cursor-pointer"
                >
                  <option value="all_members">All Members</option>
                  <option value="vip_members_only">VIP Members Only</option>
                  <option value="premium_members">Premium Members</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor='Status' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={learningForm.status}
                  onChange={(e) => handleLearningChange('status', e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#25c3a3]/50 transition-colors cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button className="px-6 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
              Save Draft
            </button>
            <button
              onClick={async () => {
                const payload = {
                  type: 'learning_package',
                  packageName: learningForm.packageName,
                  category: learningForm.category,
                  description: learningForm.description,
                  imageUrls: imageUrlsRef.current,
                  mediaUrl: learningForm.mediaUrl,
                  googleMeetLink: learningForm.googleMeetLink,
                  price: Number(learningForm.price) || 0,
                  duration: learningForm.duration,
                  accessLevel: learningForm.accessLevel,
                  status: learningForm.status,
                  pdfUrls: learningPdfUrlsRef.current,
                };
                try {
                  await createEvent(payload);
                  alert('Package published successfully!');
                  setLearningForm({ packageName: '', category: 'cryptocurrency_basics', description: '', mediaUrl: '', googleMeetLink: '', price: '', duration: '', accessLevel: 'all_members', status: 'active' });
                  resetImages();
                  setLearningPdfFiles([]); setLearningPdfUrls([]); learningPdfUrlsRef.current = [];
                } catch (err) {
                  const msg = err.response?.data?.message || 'Failed to publish package';
                  alert(msg);
                }
              }}
              className="px-6 py-3 bg-[#25c3a3] hover:bg-[#1fae91] rounded-lg text-[13px] font-bold text-white transition-colors cursor-pointer shadow-[0_0_16px_rgba(37,195,163,0.2)]"
            >
              Publish Package
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Tools' && (
        <div className="bg-[#0f1522] border border-[#1e293b] rounded-[14px] p-6 md:p-8 shadow-md">
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#25c3a3]/10 border border-[#25c3a3]/20 flex items-center justify-center">
              <FiTool className="w-4 h-4 text-[#25c3a3]" />
            </div>
            <h2 className="text-[16px] font-bold text-white tracking-tight">Tools Configuration</h2>
          </div>

          {/* Tool Name */}
          <div className="mb-6">
            <label htmlFor='Tool Name' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Tool Name*
            </label>
            <input
              type="text"
              id='Tool Name'
              value={toolsForm.toolName}
              onChange={(e) => handleToolsChange('toolName', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="Enter tool name"
            />
          </div>

          {/* Tool Type */}
          <div className="mb-6">
            <label htmlFor='Tool Type' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Tool Type
            </label>
            <div className="relative">
              <select
                value={toolsForm.toolType}
                onChange={(e) => handleToolsChange('toolType', e.target.value)}
                className="appearance-none w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#25c3a3]/50 transition-colors cursor-pointer"
              >
                <option value="calculator">Calculator</option>
                <option value="analytics">Analytics Widget</option>
                <option value="report_generator">Report Generator</option>
                <option value="data_exporter">Data Exporter</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor='Description' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Description
            </label>
            <textarea
              value={toolsForm.description}
              onChange={(e) => handleToolsChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors resize-none"
              placeholder="Enter the description"
            />
          </div>

          {/* Media URL */}
          <div className="mb-6">
            <label htmlFor='Tool Media URL' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Media URL
            </label>
            <input
              type="text"
              value={toolsForm.mediaUrl}
              onChange={(e) => handleToolsChange('mediaUrl', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="e.g. https://youtube.com/watch?v=abc"
            />
          </div>

          {/* Image + PDF Upload — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">Background Images</label>
              <button
                type="button"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleBrowseClick}
                className={`w-full py-8 bg-[#0a0f1e] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                  dragOver ? 'border-[#25c3a3] bg-[#25c3a3]/5' : 'border-[#1e293b] hover:border-gray-600'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png,image/jpeg,image/webp" multiple className="hidden" />
                <FiUploadCloud className="w-7 h-7 text-gray-500 mb-2" />
                {imageUploading ? (
                  <p className="text-[12px] text-gray-400">Uploading...</p>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-400">Drop or <span className="text-[#25c3a3] font-semibold">browse</span> (multiple)</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">PNG / JPG / WEBP</p>
                  </>
                )}
              </button>
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-[#25c3a3]">
                      {f.name}
                      <button type="button" onClick={() => removeImage(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">PDF Upload (multiple)</label>
              <button
                type="button"
                onClick={() => toolsPdfInputRef.current?.click()}
                className="w-full py-8 bg-[#0a0f1e] border-2 border-dashed border-[#1e293b] hover:border-gray-600 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer"
              >
                <input type="file" ref={toolsPdfInputRef} onChange={handleToolsPdfSelect} accept="application/pdf" multiple className="hidden" />
                <FiUploadCloud className="w-7 h-7 text-gray-500 mb-2" />
                {toolsPdfUploading ? (
                  <p className="text-[12px] text-gray-400">Uploading...</p>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-400">Drop or <span className="text-[#25c3a3] font-semibold">browse</span> (multiple)</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">PDF only</p>
                  </>
                )}
              </button>
              {toolsPdfFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {toolsPdfFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-[#25c3a3]">
                      {f.name}
                      <button type="button" onClick={() => removeToolsPdf(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Google Meet Link */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Google Meet Link
            </label>
            <input
              type="text"
              value={toolsForm.googleMeetLink}
              onChange={(e) => handleToolsChange('googleMeetLink', e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#25c3a3]/50 transition-colors"
              placeholder="e.g. https://meet.google.com/..."
            />
          </div>

          {/* Access Level & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor='AccessLevel'  className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Access Level
              </label>
              <div className="relative">
                <select
                  value={toolsForm.accessLevel}
                  onChange={(e) => handleToolsChange('accessLevel', e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#25c3a3]/50 transition-colors cursor-pointer"
                >
                  <option value="all_members">All Members</option>
                  <option value="vip_members_only">VIP Members Only</option>
                  <option value="premium_members">Premium Members</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor='Status' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={toolsForm.status}
                  onChange={(e) => handleToolsChange('status', e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#25c3a3]/50 transition-colors cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button className="px-6 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-[13px] font-semibold text-gray-300 hover:bg-[#151c2b] hover:border-gray-600 transition-all cursor-pointer">
              Save Draft
            </button>
            <button
              onClick={async () => {
                const payload = {
                  type: 'tools',
                  toolName: toolsForm.toolName,
                  toolType: toolsForm.toolType,
                  description: toolsForm.description,
                  imageUrls: imageUrlsRef.current,
                  mediaUrl: toolsForm.mediaUrl,
                  googleMeetLink: toolsForm.googleMeetLink,
                  accessLevel: toolsForm.accessLevel,
                  status: toolsForm.status,
                  pdfUrls: toolsPdfUrlsRef.current,
                };
                try {
                  await createEvent(payload);
                  alert('Tool deployed successfully!');
                  setToolsForm({ toolName: '', toolType: 'analytics', description: '', mediaUrl: '', googleMeetLink: '', accessLevel: 'all_members', status: 'active' });
                  resetImages();
                  setToolsPdfFiles([]); setToolsPdfUrls([]); toolsPdfUrlsRef.current = [];
                } catch (err) {
                  const msg = err.response?.data?.message || 'Failed to deploy tool';
                  alert(msg);
                }
              }}
              className="px-6 py-3 bg-[#25c3a3] hover:bg-[#1fae91] rounded-lg text-[13px] font-bold text-white transition-colors cursor-pointer shadow-[0_0_16px_rgba(37,195,163,0.2)]"
            >
              Deploy Tool
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
