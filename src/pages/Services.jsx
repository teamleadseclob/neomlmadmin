import React, { useState, useRef } from 'react';
import {
  FiSettings, FiBell, FiUploadCloud, 
  FiChevronDown, FiAward, FiBook, FiTool
} from 'react-icons/fi';
import { createEvent } from '../api/services';

const Services = () => {
  const [activeTab, setActiveTab] = useState('Contest');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Contest form state
  const [contestForm, setContestForm] = useState({
    campaignTitle: 'Quantum Observatory Cup',
    subTitle: 'Quantum Observatory Cup',
    description: '',
    startDate: '',
    endDate: '',
  });

  // Learning Packages form state
  const [learningForm, setLearningForm] = useState({
    packageName: '',
    category: 'Cryptocurrency Basics',
    description: '',
    price: '',
    duration: '',
    accessLevel: 'All Members',
  });

  // Tools form state
  const [toolsForm, setToolsForm] = useState({
    toolName: '',
    toolType: 'Calculator',
    description: '',
    accessLevel: 'All Members',
    status: 'Active',
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
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



          {/* Background Image Upload */}
          <div className="mb-6">
            <label htmlFor='Background Image' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Background Image Upload
            </label>
            <button
              type="button"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`w-full py-10 bg-[#0a0f1e] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-[#25c3a3] bg-[#25c3a3]/5'
                  : 'border-[#1e293b] hover:border-gray-600'
              }`}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <FiUploadCloud className="w-8 h-8 text-gray-500 mb-3" />
              {uploadedFile ? (
                <p className="text-[13px] text-[#25c3a3] font-medium">{uploadedFile.name}</p>
              ) : (
                <>
                  <p className="text-[13px] text-gray-400">
                    Drag and drop assets here, or <span className="text-[#25c3a3] font-semibold hover:underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5 tracking-wide uppercase">
                    Recommended: 1920x800 PNG/WEBP
                  </p>
                </>
              )}
            </button>
          </div>

          {/* Start Date & End Date */}
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
                  title: contestForm.campaignTitle,
                  description: contestForm.description,
                  type: 'contest',
                  mediaUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : '',
                  expiryDays: contestForm.startDate && contestForm.endDate
                    ? Math.ceil((new Date(contestForm.endDate) - new Date(contestForm.startDate)) / 86400000)
                    : 30,
                };
                try {
                  await createEvent(payload);
                  alert('Campaign deployed successfully!');
                } catch (err) {
                  console.error('Deploy campaign failed:', err);
                  alert('Failed to deploy campaign');
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
                <option>Cryptocurrency Basics</option>
                <option>Advanced Trading</option>
                <option>Network Marketing</option>
                <option>Financial Literacy</option>
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

          {/* Background Image Upload */}
          <div className="mb-6">
            <label htmlFor='Background Image' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Background Image Upload
            </label>
            <button
              type="button"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`w-full py-10 bg-[#0a0f1e] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-[#25c3a3] bg-[#25c3a3]/5'
                  : 'border-[#1e293b] hover:border-gray-600'
              }`}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <FiUploadCloud className="w-8 h-8 text-gray-500 mb-3" />
              {uploadedFile ? (
                <p className="text-[13px] text-[#25c3a3] font-medium">{uploadedFile.name}</p>
              ) : (
                <>
                  <p className="text-[13px] text-gray-400">
                    Drag and drop assets here, or <span className="text-[#25c3a3] font-semibold hover:underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5 tracking-wide uppercase">
                    Recommended: 1920x800 PNG/WEBP
                  </p>
                </>
              )}
            </button>
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

          {/* Access Level */}
          <div className="mb-8">
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
                <option>All Members</option>
                <option>VIP Members Only</option>
                <option>Premium Tier</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
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
                  title: learningForm.packageName,
                  description: learningForm.description,
                  type: 'learning_package',
                  mediaUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : '',
                  expiryDays: Number.parseInt(learningForm.duration) || 30,
                  category: learningForm.category,
                  price: learningForm.price,
                  duration: learningForm.duration,
                  accessLevel: learningForm.accessLevel,
                };
                try {
                  await createEvent(payload);
                  alert('Package published successfully!');
                } catch (err) {
                  console.error('Publish package failed:', err);
                  alert('Failed to publish package');
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
                <option>Calculator</option>
                <option>Analytics Widget</option>
                <option>Report Generator</option>
                <option>Data Exporter</option>
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

          {/* Background Image Upload */}
          <div className="mb-6">
            <label htmlFor='Background Image' className="block text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-2.5">
              Background Image Upload
            </label>
            <button
              type="button"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`w-full py-10 bg-[#0a0f1e] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-[#25c3a3] bg-[#25c3a3]/5'
                  : 'border-[#1e293b] hover:border-gray-600'
              }`}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <FiUploadCloud className="w-8 h-8 text-gray-500 mb-3" />
              {uploadedFile ? (
                <p className="text-[13px] text-[#25c3a3] font-medium">{uploadedFile.name}</p>
              ) : (
                <>
                  <p className="text-[13px] text-gray-400">
                    Drag and drop assets here, or <span className="text-[#25c3a3] font-semibold hover:underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5 tracking-wide uppercase">
                    Recommended: 1920x800 PNG/WEBP
                  </p>
                </>
              )}
            </button>
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
                  <option>All Members</option>
                  <option>VIP Members Only</option>
                  <option>Admin Only</option>
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
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Maintenance</option>
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
                  title: toolsForm.toolName,
                  description: toolsForm.description,
                  type: 'tools',
                  mediaUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : '',
                  expiryDays: 30,
                  toolType: toolsForm.toolType,
                  accessLevel: toolsForm.accessLevel,
                  status: toolsForm.status,
                };
                try {
                  await createEvent(payload);
                  alert('Tool deployed successfully!');
                } catch (err) {
                  console.error('Failed to deploy tool:', err);
                  alert('Failed to deploy tool');
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
