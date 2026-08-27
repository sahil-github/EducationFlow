import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CircularProgress from "@mui/material/CircularProgress";

export default function AssignmentDetails() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadNotification, setDownloadNotification] = useState("");

  // Assignment metadata
  const assignment = {
    id: "build-a-rest-api",
    title: "Build a REST API",
    module: "Module 4 - Web Development",
    dueDate: "Oct 24, 2023",
    points: "100 pts",
    instructions: [
      "Welcome to your final milestone project for the Backend Development course. In this assignment, you will synthesize everything you've learned to build a robust, production-ready RESTful API.",
      "Your objective is to build a complete backend service for a hypothetical Task Management application. This service must securely handle user authentication, manage task entities, connect to a database, and provide a comprehensive set of endpoints.",
      "We will be looking for clean architecture, proper error handling, and solid security practices. Refer to the 'Resources' section for API specifications and boilerplate code to get started."
    ],
    requirements: [
      "Implement full CRUD operations for Users and Tasks entities.",
      "Integrate JWT-based authentication for securing endpoints.",
      "Connect to a PostgreSQL database using an ORM of your choice.",
      "Provide comprehensive error handling and consistent JSON response formats.",
      "Include basic unit tests for at least two core service logic files."
    ],
    resources: [
      { name: "API_Specs.pdf", size: "1.2 MB", icon: DescriptionOutlinedIcon },
      { name: "Boilerplate_Code.zip", size: "4.5 MB", icon: CodeOutlinedIcon }
    ]
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (resourceName) => {
    setDownloadNotification(`Downloading ${resourceName}...`);
    setTimeout(() => {
      setDownloadNotification("");
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select or drop a file before submitting.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/assignment-submitted");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-white font-[Manrope]">
      {/* Top Header / Breadcrumb Bar */}
      <div className="w-full border-b border-white/5 bg-[#111623]/60 backdrop-blur-md sticky top-[64px] z-30 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 font-medium overflow-x-auto py-1">
            <span className="cursor-pointer hover:text-white" onClick={() => navigate("/my-learning")}>
              My Courses
            </span>
            <span>/</span>
            <span className="cursor-pointer hover:text-white" onClick={() => navigate("/catalog")}>
              Catalog
            </span>
            <span>/</span>
            <span className="text-indigo-400 font-semibold truncate">
              {assignment.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Download notification banner */}
        {downloadNotification && (
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium flex items-center justify-between animate-fadeIn">
            <span>{downloadNotification}</span>
            <CloseIcon sx={{ fontSize: 16, cursor: "pointer" }} onClick={() => setDownloadNotification("")} />
          </div>
        )}

        {/* Title Header & Meta Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-[Poppins] tracking-tight mb-1 sm:mb-2">
              {assignment.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              {assignment.module}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0 self-start sm:self-center">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                DUE DATE
              </span>
              <span className="text-sm sm:text-base font-semibold text-indigo-300">
                {assignment.dueDate}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#161B26] border border-white/10 text-white font-bold text-xs sm:text-sm shadow-inner">
              {assignment.points}
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Instructions & Requirements */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 sm:gap-8">
            {/* Card 1: Instructions */}
            <div className="p-5 sm:p-7 rounded-2xl bg-[#161B26] border border-white/10 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white font-[Poppins] mb-4 border-b border-white/10 pb-3">
                Instructions
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                {assignment.instructions.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Card 2: Requirements */}
            <div className="p-5 sm:p-7 rounded-2xl bg-[#161B26] border border-white/10 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white font-[Poppins] mb-4 border-b border-white/10 pb-3">
                Requirements
              </h2>
              <ul className="space-y-3.5">
                {assignment.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#818CF8", mt: 0.2, shrink: 0 }} />
                    <span className="leading-snug">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Resources & Submission */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sm:gap-8">
            {/* Card 1: Resources */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#161B26] border border-white/10 shadow-xl">
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white font-[Poppins] mb-4 border-b border-white/10 pb-3">
                <FolderOutlinedIcon sx={{ fontSize: 20, color: "#818CF8" }} />
                <span>Resources</span>
              </div>

              <div className="space-y-3">
                {assignment.resources.map((res, index) => {
                  const Icon = res.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F131D] border border-white/5 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                          <Icon sx={{ fontSize: 18, color: "#818CF8" }} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-200 truncate group-hover:text-white transition-colors">
                          {res.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownload(res.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-white/5 transition-all cursor-pointer shrink-0"
                        title={`Download ${res.name}`}
                      >
                        <FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Your Submission */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#161B26] border border-white/10 shadow-xl">
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white font-[Poppins] mb-4 border-b border-white/10 pb-3">
                <FileUploadOutlinedIcon sx={{ fontSize: 20, color: "#818CF8" }} />
                <span>Your Submission</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* File Upload Box */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".zip,.tar.gz,.gz,.rar"
                  className="hidden"
                  id="assignment-file-input"
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 sm:p-8 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                      dragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/15 bg-[#0F131D] hover:border-indigo-500/40 hover:bg-[#121724]"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1">
                      <CloudUploadOutlinedIcon sx={{ fontSize: 28 }} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-200">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      ZIP or TAR.GZ (max. 50MB)
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#0F131D] border border-indigo-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: "#818CF8" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer shrink-0"
                      title="Remove file"
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                )}

                {/* Additional Comments (Optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="comments" className="text-xs font-semibold text-gray-300 block">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    id="comments"
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add any notes for the instructor..."
                    className="w-full bg-[#0F131D] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Assignment</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
